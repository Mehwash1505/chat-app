import { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Message({ message, chatId }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const isMe = message.sender === "me";

  // ❌ delete for me (UI hide only)
  if (message.deletedFor?.[user.uid]) return null;

  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // ✅ DELETE FOR ME
  const deleteForMe = async () => {
    await update(
      ref(db, `chats/${chatId}/messages/${message.id}/deletedFor`),
      {
        [user.uid]: true,
      }
    );
    setShowMenu(false);
  };

  // ✅ DELETE FOR EVERYONE
  const deleteForEveryone = async () => {
    await update(
      ref(db, `chats/${chatId}/messages/${message.id}`),
      {
        isDeleted: true,
        deletedAt: Date.now(),
      }
    );
    setShowMenu(false);
  };

  return (
    <div
      className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
    >
      <div
        className={`relative px-4 py-2 rounded-2xl max-w-xs ${
          isMe
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-200 text-black rounded-bl-sm"
        }`}
      >
        {/* 🗑 deleted for everyone */}
        {message.isDeleted ? (
          <p className="italic text-sm opacity-70">
            This message was deleted
          </p>
        ) : (
          <p className="text-sm">{message.text}</p>
        )}

        <p className="text-[10px] text-right opacity-70 mt-1">
          {time}
        </p>

        {/* ✔✔ ticks */}
        {isMe && !message.isDeleted && (
          <span className="text-xs flex justify-end mt-1">
            {message.status === "sent" && "✔"}
            {message.status === "delivered" && "✔✔"}
            {message.status === "seen" && (
              <span className="text-blue-600">✔✔</span>
            )}
          </span>
        )}

        {/* MENU */}
        {showMenu && !message.isDeleted && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">

            {/* Delete for me */}
            <button
              onClick={deleteForMe}
              className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Delete for me
            </button>

            {/* Delete for everyone (only sender) */}
            {isMe && (
              <button
                onClick={deleteForEveryone}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete for everyone
              </button>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-200" />
          
            {/* Cancel */}
            <button
              onClick={() => setShowMenu(false)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
