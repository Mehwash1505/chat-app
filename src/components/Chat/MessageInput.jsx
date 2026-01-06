// export default function MessageInput() {
//   return (
//     <div className="p-4 border-t bg-white flex gap-2">
//       <input
//         type="text"
//         placeholder="Type a message..."
//         className="flex-1 border rounded px-3 py-2"
//       />
//       <button className="bg-blue-500 text-white px-4 rounded">
//         Send
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import { ref, push, serverTimestamp } from "firebase/database";
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

    setText("");
  };

  return (
    <div className="p-4 border-t bg-white flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 rounded"
        disabled={!user}
      >
        Send
      </button>
    </div>
  );
}

