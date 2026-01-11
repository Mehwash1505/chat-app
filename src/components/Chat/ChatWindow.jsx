import { useEffect, useState, useRef } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Avatar from "../Avatar";

export default function ChatWindow({ activeUser }) {
  // 🔒 ALL HOOKS AT TOP
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const { user } = useAuth();
  const bottomRef = useRef(null);

  // 🔑 chatId calculation (NO hooks here)
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
          "delivered"
        );
      }
    });
  }, [messages, chatId, user]);

  // 🔹 SEEN STATUS
  useEffect(() => {
    if (!chatId || !user) return;

    messages.forEach((msg) => {
      if (
        msg.receiverId === user.uid &&
        msg.status !== "seen"
      ) {
        set(
          ref(db, `chats/${chatId}/messages/${msg.id}/status`),
          "seen"
        );
      }
    });
  }, [chatId, user, messages]);

  // 🔹 TYPING INDICATOR
  useEffect(() => {
    if (!chatId) return;

    const typingRef = ref(db, `typing/${chatId}`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      setTyping(Boolean(snapshot.val()));
    });

    return () => unsubscribe();
  }, [chatId]);

  // 🔹 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ CONDITIONAL RENDER (AFTER ALL HOOKS)
  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={activeUser.name} />
          <div>
            <p className="font-semibold text-black dark:text-white">{activeUser.name}</p>
            <p className="text-xs text-green-500">online</p>
          </div>
        </div>

        <div className="flex gap-3 text-gray-400 cursor-pointer">
          <span>🔍</span>
          <span>⋮</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 ">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10 ">
            No messages yet. Say hi 👋
          </p>
        )}

        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={{
              ...msg,
              sender: msg.senderId === user.uid ? "me" : "other",
            }}
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
