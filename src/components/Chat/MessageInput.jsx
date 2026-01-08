import { useState } from "react";
import { ref, set, push, serverTimestamp } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { user } = useAuth();

  const sendMessage = async () => {
    if (!user) {
      alert("Please login to send messages");
      return;
    }

    if (!text.trim()) return;

    const messagesRef = ref(db, "messages");

    await push(messagesRef, {
      text,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });
    
    await set(ref(db, `typing/${user.uid}`), false);

    setText("");
  };

  return (
    <div className="p-4 border-t bg-white dark:bg-gray-900 flex gap-2 items-center">
      <span className="text-gray-400 cursor-pointer">😊</span>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (user) {
            set(ref(db, `typing/${user.uid}`), true);
          }
        }}
        className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 focus:outline-none"
        placeholder="Type a message"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white rounded-full px-4 py-2"
        disabled={!user}
      >
        ➤
      </button>
    </div>
  );

}

