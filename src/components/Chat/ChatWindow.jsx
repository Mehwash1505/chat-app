import { useEffect, useState, useRef } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Avatar from "../Avatar";

export default function ChatWindow({ activeUser, onBack }) {
  const { user } = useAuth();

  // ALL HOOKS AT TOP
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [wallpaper, setWallpaper] = useState(null);

  const bottomRef = useRef(null);

  // chatId calculation (NO hooks here)
  const chatId =
    user && activeUser
      ? [user.uid, activeUser.id].sort().join("_")
      : null;

  // 🔹 REALTIME MESSAGES LISTENER
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const messagesRef = ref(db, `chats/${chatId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
        return;
      }

      const msgs = Object.entries(data).map(([id, msg]) => ({
        id,
        ...msg,
      }));

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  //  RESET UNREAD WHEN CHAT OPEN
  useEffect(() => {
    if (!chatId || !user) return;
    set(ref(db, `chats/${chatId}/unread/${user.uid}`), 0);
  }, [chatId, user]);

  // 🔹 DELIVERED STATUS
  useEffect(() => {
    if (!chatId || !user) return;

    messages.forEach((msg) => {
      if (
        msg.receiverId === user.uid &&
        msg.status === "sent"
      ) {
        set(
          ref(db, `chats/${chatId}/messages/${msg.id}/status`),
          "seen"
        );
        set(
          ref(db, `chats/${chatId}/messages/${msg.id}/seenAt`),
          Date.now()
        );
      }
    });
  }, [messages, chatId, user]);

  // 🔹 SEEN STATUS
  // useEffect(() => {
  //   if (!chatId || !user) return;

  //   messages.forEach((msg) => {
  //     if (
  //       msg.receiverId === user.uid &&
  //       msg.status !== "seen"
  //     ) {
  //       set(
  //       ref(db, `chats/${chatId}/messages/${msg.id}/status`),
  //       "seen"
  //     );

  //     set(
  //       ref(db, `chats/${chatId}/messages/${msg.id}/seenAt`),
  //       Date.now()
  //     );
  //     }
  //   });
  // }, [messages, chatId, user ]);

  // 🔹 TYPING INDICATOR
  useEffect(() => {
    if (!chatId || !user) return;

    const typingRef = ref(db, `typing/${chatId}`);

    const unsub = onValue(typingRef, (snap) => {
      const data = snap.val() || {};
      const otherTyping = Object.entries(data).some(
        ([uid, isTyping]) => uid !== user.uid && isTyping === true
      );
      setTyping(otherTyping);
    });

    return () => unsub();
  }, [chatId, user]);

  // wallpaper
  useEffect(() => {
    if (!chatId) return;

    const wpRef = ref(db, `chatSettings/${chatId}/wallpaper`);
    return onValue(wpRef, (snap) => {
      setWallpaper(snap.val() || null);
    });
  }, [chatId]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // CONDITIONAL RENDER (AFTER ALL HOOKS)
  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden text-gray-400 mr-2"
          >
            ←
          </button>
          <Avatar name={activeUser.name} />
          <div>
            <p className="font-semibold text-black dark:text-white">{activeUser.name}</p>
            <p className="text-xs text-green-500">
              {typing ? "typing..." : "online"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 text-gray-400 cursor-pointer">
          <span>🔍</span>
          <span>⋮</span>
          <button
            onClick={() => setShowWallpaper(true)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Change Wallpaper
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{
          backgroundImage: wallpaper ? `url(${wallpaper})` : "none",
          backgroundSize: "cover",
        }}
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet. Say hi 👋
          </div>
        )}

        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={{
              ...msg,
              sender: msg.senderId === user.uid ? "me" : "other",
            }}
            // chatId={chatId}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      {typing && (
        <p className="text-xs text-gray-400 italic px-4 ">
          typing...
        </p>
      )}

      {/* Input */}
      <MessageInput
       chatId={chatId} 
       receiverId={activeUser.id}
      />
    </div>
  );
}
