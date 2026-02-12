// UserList.jsx
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Avatar from "../Avatar";

const users = [
  { 
    id: "5FW4xfEprtWlSLZ4V3nNSnbgH9V2",
    name: "Ayesha",
  },
  {
    id: "iweuFomlsDYDb3gjkw9qJdicOAv1",
    name: "Rahul",
  },
  {
    id: "2bdjTZ0eXqdMl2ZbrdGXo8eCWxz1",
    name: "Zoya",
  },
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

  // 🔹 unread + last message
  useEffect(() => {
    if (!auth.currentUser) return;

    const chatsRef = ref(db, "chats");

    const unsub = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const counts = {};
      const last = {};

      Object.entries(data).forEach(([chatId, chat]) => {
        counts[chatId] = chat.unread?.[auth.currentUser.uid] || 0;
        last[chatId] = chat.lastMessage || null;
      });

      setUnread(counts);
      setLastMessages(last);
    });

    return () => unsub();
  }, []);

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r flex flex-col">
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
        {users
          .filter((u) => u.id !== auth.currentUser?.uid)
          .map((user) => {
            const chatId =
              auth.currentUser &&
              [auth.currentUser.uid, user.id].sort().join("_");

            const unreadCount = unread[chatId] || 0;
            const isOnline = presence[user.id]?.online;

            return (
              <div
                key={user.id}
                onClick={() => setActiveUser(user)}
                className={`px-4 py-3 cursor-pointer flex justify-between items-center transition
                  ${
                    activeUser?.id === user.id
                      ? "bg-blue-100 dark:bg-gray-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {/* Left */}
                <div className="flex gap-3 items-center">
                  <Avatar name={user.name} />
                  <div className="min-w-0">
                    <p className="font-medium text-black dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">
                      {lastMessages[chatId]?.text || "No messages yet"}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />

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
