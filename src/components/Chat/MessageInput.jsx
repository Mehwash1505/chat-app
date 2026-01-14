import { useState } from "react";
import { ref, set, push, get } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

export default function MessageInput({ chatId, receiverId }) {
  const [text, setText] = useState("");
  const { user } = useAuth();

  const sendMessage = async () => {
    if (!user || !chatId || !receiverId || !text.trim()) return;

    // 🔹 Message reference
    const msgRef = push(ref(db, `chats/${chatId}/messages`));

    const messageData = {
      text,
      senderId: user.uid,
      receiverId,
      timestamp: Date.now(),
      status: "sent",
    };

    // 1️⃣ Save message
    await set(msgRef, messageData);

    // 2️⃣ Update lastMessage
    await set(ref(db, `chats/${chatId}/lastMessage`), {
      text,
      senderId: user.uid,
      timestamp: Date.now(),
    });

    // 3️⃣ Increment unread (Realtime DB safe)
    const unreadRef = ref(db, `chats/${chatId}/unread/${receiverId}`);
    const snap = await get(unreadRef);
    const current = snap.val() || 0;
    await set(unreadRef, current + 1);

    // 4️⃣ Typing OFF (chat-level)
    await set(ref(db, `typing/${chatId}/${user.uid}`), false);

    setText("");
  };

  return (
    <div className="p-4 border-t bg-white dark:bg-gray-900 flex gap-2 items-center">
      <span className="text-gray-400 cursor-pointer">😊</span>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);

          // 🔹 Typing ON (chat-level)
          if (user && chatId) {
            set(ref(db, `typing/${chatId}/${user.uid}`), true);
          }
        }}
        className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-full px-4 py-2 focus:outline-none"
        placeholder="Type a message"
      />

      <button
        onClick={sendMessage}
        disabled={!chatId}
        className="bg-blue-500 text-white rounded-full px-4 py-2"
      >
        ➤
      </button>
    </div>
  );
}
