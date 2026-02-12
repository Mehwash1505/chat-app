// Message.jsx
import { useState } from "react";
import { ref, set, remove } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Message({ message, chatId }) {
  const { user } = useAuth();
  const isMe = message.sender === "me";
  const [menuPos, setMenuPos] = useState(null);

  if (message.deletedFor?.[user.uid]) return null;

  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // DELETE FOR ME
  const deleteForMe = async () => {
    await set(
      ref(
        db,
        `chats/${chatId}/messages/${message.id}/deletedFor/${user.uid}`
      ),
      true
    ); 
  };

  // ✅ DELETE FOR EVERYONE
  const deleteForEveryone = async () => {
    await set(
      ref(db, `chats/${chatId}/messages/${message.id}`),
      {
        ...message,
        originalText: message.text,
        text: "This message was deleted",
        deleted: true,
         deletedAt: Date.now(),
      }
    );
  };

  // 🔹 UNDO DELETE (5 sec)
  const undoDelete = async () => {
    await set(
      ref(db, `chats/${chatId}/messages/${message.id}`),
      {
        ...message,
        text: message.originalText,
        deleted: false,
        deletedAt: null,
      }
    );
  };

  const showUndo =
    isMe &&
    message.deleted &&
    message.deletedAt &&
    Date.now() - message.deletedAt < 5000;

  return (
    <>
      {/* MESSAGE BUBBLE */}
      <div
        className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
      >
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuPos({ x: e.clientX, y: e.clientY });
          }}
          onClick={() => setMenuPos(null)}
          className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm cursor-pointer transition-all duration-300 ease-out
            ${message.deleted ? "opacity-60 scale-95" : "opacity-100 scale-100"}
            ${isMe
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-gray-200 text-black rounded-bl-sm"
          }`}
        >
          {/* Message text */}
          <p className="text-sm leading-snug">
            {message.deleted ? (
              <span className="italic opacity-70">
                This message was deleted
              </span>
            ) : (
              message.text
            )}
          </p>

          {/* time */}
          <p className="text-[10px] text-right opacity-70 mt-1">
            {time}
          </p>

          {/* ticks */}
          {isMe && !message.deleted && (
            <div className="text-xs text-right mt-1">
              {message.status === "sent" && (
                <span className="text-gray-400">✔</span>
              )}

              {message.status === "delivered" && (
                <span className="text-gray-400">✔✔</span>
              )}

              {message.status === "seen" && (
                <span className="text-blue-500">✔✔</span>
              )}
            </div>
          )}

          {/* UNDO BUTTON (INSIDE BUBBLE) */}
          {showUndo && (
            <button
              onClick={undoDelete}
              className="text-xs mt-1 underline opacity-90"
            >
              Undo
            </button>
          )}
        </div>
      </div>

      {/* FIXED DELETE MENU (PORTAL STYLE) */}
      {menuPos && (
        <div
          className="fixed z-[9999] bg-white rounded-lg shadow-xl w-48"
          style={{
            top: menuPos.y,
            left: Math.min(menuPos.x, window.innerWidth - 200),
          }}
        >
          {!message.deleted && (
            <button
              onClick={() => {
                deleteForMe();
                setMenuPos(null);
              }}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
            >
              Delete for me
            </button>
          )}

          {isMe && !message.deleted && (
            <button
              onClick={() => {
                deleteForEveryone();
                setMenuPos(null);
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Delete for everyone
            </button>
          )}

          <button
            onClick={() => setMenuPos(null)}
            className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
