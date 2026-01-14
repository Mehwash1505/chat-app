import { useState, useRef } from "react";
import { ref, set, push, get } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput({ chatId, receiverId }) {
  const [text, setText] = useState("");
  const { user } = useAuth();
  const [showEmoji, setShowEmoji] = useState(false);

  // ⏱️ typing debounce timer
  const typingTimeout = useRef(null);

  const sendMessage = async () => {
    if (!user || !chatId || !receiverId || !text.trim()) return;

    const msgRef = push(ref(db, `chats/${chatId}/messages`));

    const messageData = {
      text,
      senderId: user.uid,
      receiverId,
      timestamp: Date.now(),
      status: "sent",
    };

    // 1️⃣ save message
    await set(msgRef, messageData);

    // 2️⃣ update lastMessage
    await set(ref(db, `chats/${chatId}/lastMessage`), {
      text,
      senderId: user.uid,
      timestamp: Date.now(),
    });

    // 3️⃣ increment unread count (safe way)
    const unreadRef = ref(db, `chats/${chatId}/unread/${receiverId}`);
    const snap = await get(unreadRef);
    const current = snap.val() || 0;
    await set(unreadRef, current + 1);

    // 4️⃣ typing OFF (important)
    await set(ref(db, `typing/${chatId}/${user.uid}`), false);

    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (!user || !chatId) return;

    // 🔹 typing ON
    set(ref(db, `typing/${chatId}/${user.uid}`), true);

    // 🔁 clear old timer
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // ⏱️ typing OFF after 1.5s inactivity
    typingTimeout.current = setTimeout(() => {
      set(ref(db, `typing/${chatId}/${user.uid}`), false);
    }, 1500);
  };

  const handleBlur = () => {
    if (user && chatId) {
      set(ref(db, `typing/${chatId}/${user.uid}`), false);
    }
  };

  return (
    <div className="p-4 border-t bg-white dark:bg-gray-900 flex gap-2 items-center">
      <span
       className="text-gray-400 cursor-pointer"
       onClick={() => setShowEmoji(!showEmoji)}
      >
        😊
      </span>

      {showEmoji && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onEmojiClick={(emoji) =>
              setText((prev) => prev + emoji.emoji)
            }
            theme="dark"
          />
        </div>
      )}

      <input
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
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
