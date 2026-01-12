import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Avatar from "../Avatar";

const users = [
  { id: "user1", name: "Ayesha" },
  { id: "user2", name: "Rahul" },
  { id: "user3", name: "Zoya" },
];

export default function UserList({ activeUser, setActiveUser }) {
  const [presence, setPresence] = useState({});
  const [unread, setUnread] = useState({});
  const [lastMessages, setLastMessages] = useState({});


  // 🔹 presence (online / offline)
  useEffect(() => {
    const presenceRef = ref(db, "presence");

    const unsub = onValue(presenceRef, (snapshot) => {
      setPresence(snapshot.val() || {});
    });

    return () => unsub();
  }, []);

  // 🔹 unread messages count
  useEffect(() => {
    if (!auth.currentUser) return;

    const chatsRef = ref(db, "chats");

    const unsub = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const counts = {};

      Object.entries(data).forEach(([chatId, chat]) => {
        if (!chat.messages) return;

        let count = 0;

        Object.values(chat.messages).forEach((msg) => {
          if (
            msg.receiverId === auth.currentUser.uid &&
            msg.status !== "seen"
          ) {
            count++;
          }
        });

        counts[chatId] = count;
      });

      setUnread(counts);
    });

    return () => unsub();
  }, []);

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-black dark:text-white">
          Chats
        </h2>

        <button
          onClick={() => signOut(auth)}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => {
          const isOnline = presence[user.id]?.online;
          const chatId =
            auth.currentUser &&
            [auth.currentUser.uid, user.id].sort().join("_");

          const unreadCount = unread[chatId] || 0;

          return (
            <div
              key={user.id}
              onClick={() => setActiveUser(user)}
              className={`px-4 py-3 cursor-pointer transition flex justify-between items-center
                ${
                  activeUser?.id === user.id
                    ? "bg-blue-100 dark:bg-gray-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              {/* Left side */}
              <div className="flex gap-3 items-center">
                <Avatar name={user.name} />

                <div>
                  <p className="font-medium text-black dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    last message...
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-1">
                {/* online dot */}
                <span
                  className={`h-2 w-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />

                {/* unread badge */}
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
