// import { useEffect, useState, useRef } from "react";
// import { ref, onValue, set } from "firebase/database";
// import { db } from "../../firebase/firebase";
// import { useAuth } from "../../context/AuthContext";
// import Message from "./Message";
// import MessageInput from "./MessageInput";
// import Avatar from "../Avatar";

// export default function ChatWindow({ activeUser, onBack }) {
//   const { user } = useAuth();

//   // ALL HOOKS AT TOP
//   const [messages, setMessages] = useState([]);
//   const [typing, setTyping] = useState(false);
//   const [wallpaper, setWallpaper, showWallpaper, setShowWallpaper] = useState(null);

//   const bottomRef = useRef(null);

//   // chatId calculation (NO hooks here)
//   const chatId =
//     user && activeUser
//       ? [user.uid, activeUser.id].sort().join("_")
//       : null;

//   // 🔹 REALTIME MESSAGES LISTENER
//   useEffect(() => {
//     if (!chatId) {
//       setMessages([]);
//       return;
//     }

//     const messagesRef = ref(db, `chats/${chatId}/messages`);

//     const unsubscribe = onValue(messagesRef, (snapshot) => {
//       const data = snapshot.val();
//       if (!data) {
//         setMessages([]);
//         return;
//       }

//       const msgs = Object.entries(data).map(([id, msg]) => ({
//         id,
//         ...msg,
//       }));

//       setMessages(msgs);
//     });

//     return () => unsubscribe();
//   }, [chatId]);

//   //  RESET UNREAD WHEN CHAT OPEN
//   useEffect(() => {
//     if (!chatId || !user) return;
//     set(ref(db, `chats/${chatId}/unread/${user.uid}`), 0);
//   }, [chatId, user]);

//   // 🔹 DELIVERED STATUS
//   useEffect(() => {
//     if (!chatId || !user) return;

//     messages.forEach((msg) => {
//       if (
//         msg.receiverId === user.uid &&
//         msg.status === "sent"
//       ) {
//         set(
//           ref(db, `chats/${chatId}/messages/${msg.id}/status`),
//           "seen"
//         );
//         set(
//           ref(db, `chats/${chatId}/messages/${msg.id}/seenAt`),
//           Date.now()
//         );
//       }
//     });
//   }, [messages, chatId, user]);

//   // 🔹 TYPING INDICATOR
//   useEffect(() => {
//     if (!chatId || !user) return;

//     const typingRef = ref(db, `typing/${chatId}`);

//     const unsub = onValue(typingRef, (snap) => {
//       const data = snap.val() || {};
//       const otherTyping = Object.entries(data).some(
//         ([uid, isTyping]) => uid !== user.uid && isTyping === true
//       );
//       setTyping(otherTyping);
//     });

//     return () => unsub();
//   }, [chatId, user]);

//   // wallpaper
//   useEffect(() => {
//     if (!chatId) return;

//     const wpRef = ref(db, `chatSettings/${chatId}/wallpaper/${user.uid}`);
//     return onValue(wpRef, (snap) => {
//       setWallpaper(snap.val() || null);
//     });
//   }, [chatId]);

//   // AUTO SCROLL
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);


//   // CONDITIONAL RENDER (AFTER ALL HOOKS)
//   if (!activeUser) {
//     return (
//       <div className="flex-1 flex items-center justify-center text-gray-400">
//         Select a chat
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="p-4 border-b bg-white dark:bg-gray-900 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={onBack}
//             className="md:hidden text-gray-400 mr-2"
//           >
//             ←
//           </button>
//           <Avatar name={activeUser.name} />
//           <div>
//             <p className="font-semibold text-black dark:text-white">{activeUser.name}</p>
//             <p className="text-xs text-green-500">
//               {typing ? "typing..." : "online"}
//             </p>
//           </div>
//         </div>
//         <div className="flex gap-3 text-gray-400 cursor-pointer">
//           <span>🔍</span>
//           <span>⋮</span>
//           <button
//             onClick={() => setShowWallpaper(true)}
//             className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
//           >
//             Change Wallpaper
//           </button>
//         </div>
//       </div>
//       {showWallpaper && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-900 rounded-lg p-4 w-64">
//             <h3 className="font-semibold mb-3">Select Wallpaper</h3>

//             {["default", "dark", "blue", "image"].map((wp) => (
//               <button
//                 key={wp}
//                 onClick={() => {
//                   set(ref(db, `chatSettings/${chatId}/wallpaper/${user.uid}`), wp);
//                   setShowWallpaper(false);
//                 }}
//                 className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 {wp}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Messages */}
//       <div
//         className="flex-1 overflow-y-auto px-4 py-6"
//         style={{
//           backgroundImage: wallpaper ? `url(${wallpaper})` : "none",
//           backgroundSize: "cover",
//         }}
//       >
//         {messages.length === 0 && (
//           <div className="h-full flex items-center justify-center text-gray-400">
//             No messages yet. Say hi 👋
//           </div>
//         )}

//         {messages.map((msg) => (
//           <Message
//             key={msg.id}
//             message={{
//               ...msg,
//               sender: msg.senderId === user.uid ? "me" : "other",
//             }}
//             // chatId={chatId}
//           />
//         ))}

//         <div ref={bottomRef} />
//       </div>

//       {/* Typing indicator */}
//       {typing && (
//         <p className="text-xs text-gray-400 italic px-4 ">
//           typing...
//         </p>
//       )}

//       {/* Input */}
//       <MessageInput
//        chatId={chatId} 
//        receiverId={activeUser.id}
//       />
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Avatar from "../Avatar";

export default function ChatWindow({ activeUser, onBack }) {
  const { user } = useAuth();

  // ✅ ALL STATES AT TOP
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [wallpaper, setWallpaper] = useState(null);
  const [showWallpaper, setShowWallpaper] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const bottomRef = useRef(null);

  // ✅ chatId (safe)
  const chatId =
    user && activeUser
      ? [user.uid, activeUser.id].sort().join("_")
      : null;

  // 🔹 MESSAGES
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const messagesRef = ref(db, `chats/${chatId}/messages`);
    return onValue(messagesRef, (snapshot) => {
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
  }, [chatId]);

  // 🔹 RESET UNREAD
  useEffect(() => {
    if (!chatId || !user) return;
    set(ref(db, `chats/${chatId}/unread/${user.uid}`), 0);
  }, [chatId, user]);

  // 🔹 SEEN STATUS
  useEffect(() => {
    if (!chatId || !user) return;

    messages.forEach((msg) => {
      if (msg.receiverId === user.uid && msg.status !== "seen") {
        set(ref(db, `chats/${chatId}/messages/${msg.id}/status`), "seen");
        set(ref(db, `chats/${chatId}/messages/${msg.id}/seenAt`), Date.now());
      }
    });
  }, [messages, chatId, user]);

  // 🔹 TYPING
  useEffect(() => {
    if (!chatId || !user) return;

    const typingRef = ref(db, `typing/${chatId}`);
    return onValue(typingRef, (snap) => {
      const data = snap.val() || {};
      const otherTyping = Object.entries(data).some(
        ([uid, val]) => uid !== user.uid && val === true
      );
      setTyping(otherTyping);
    });
  }, [chatId, user]);

  // 🔹 WALLPAPER
  useEffect(() => {
    if (!chatId || !user) return;

    const wpRef = ref(db, `chatSettings/${chatId}/wallpaper/${user.uid}`);
    return onValue(wpRef, (snap) => {
      setWallpaper(snap.val() || null);
    });
  }, [chatId, user]);

  // 🔹 PRESENCE (⬅️ MOVED UP, VERY IMPORTANT)
  useEffect(() => {
    if (!activeUser) {
      setIsOnline(false);
      return;
    }

    const presenceRef = ref(db, `presence/${activeUser.id}`);
    const unsub = onValue(presenceRef, (snap) => {
      setIsOnline(snap.val()?.online === true);
    });

    return () => unsub();
  }, [activeUser]);

  // 🔹 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ SAFE CONDITIONAL RENDER (NO HOOKS AFTER THIS)
  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b bg-white dark:bg-gray-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden text-gray-400">
            ←
          </button>
          <Avatar name={activeUser.name} />
          <div>
            <p className="font-semibold text-black dark:text-white">
              {activeUser.name}
            </p>
            <p
              className={`text-xs ${
                isOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              {typing ? "typing..." : isOnline ? "online" : "offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowWallpaper(true)}
          className="text-sm text-gray-500"
        >
          Change Wallpaper
        </button>
      </div>

      {/* MESSAGES */}
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
            chatId={chatId}
            message={{
              ...msg,
              sender: msg.senderId === user.uid ? "me" : "other",
            }}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <MessageInput chatId={chatId} receiverId={activeUser.id} />
    </div>
  );
}