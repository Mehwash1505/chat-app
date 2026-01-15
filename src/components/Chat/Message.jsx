import { ref, set } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Message({ message }) {
  const { user } = useAuth();

  const isMe = message.sender === "me";

  const time = message.seenAt || message.timestamp
    ? new Date(message.seenAt || message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (message.deletedFor?.[user.uid]) return null;

  const deleteForMe = async () => {
    await set(
      ref(db, `chats/${chatId}/messages/${message.id}/deletedFor/${user.uid}`),
      true
    );
  };
       
  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm ${
          isMe
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-200 dark:bg-gray-900 text-black dark:text-white rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-snug">{message.text}</p>
        <p className="text-[10px] text-right opacity-70 mt-1">
          {time}
        </p>
        {isMe && (
          <span className={`text-xs ml-2 ${
            message.status === "seen" ? "text-blue-500" : "text-gray-400"
          }`}>
            {message.status === "sent" && "✔"}
            {message.status === "delivered" && "✔✔"}
            {message.status === "seen" && "✔✔"}
          </span>
        )}
      </div>
    </div>
  );
}
