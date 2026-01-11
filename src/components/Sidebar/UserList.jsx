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

export default function UserList( { setActiveUser } ) {
  const [presence, setPresence] = useState({});

  <div
    onClick={() => setActiveUser(user)}
    className="px-4 py-3 cursor-pointer hover:bg-gray-100"
  ></div>

  useEffect(() => {
    const presenceRef = ref(db, "presence");

    onValue(presenceRef, (snapshot) => {
      setPresence(snapshot.val() || {});
    });
  }, []);

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r">
      <h2 className="p-4 font-semibold text-lg text-black dark:text-white">Chats</h2>

      <button
       onClick={() => signOut(auth)}
        className="text-sm text-red-500 hover:underline"
      >
        Logout
      </button>


      {users.map((user) => {
        const isOnline = presence[user.id]?.online;

        return (
          <div
            key={user.id}
            onClick={() => setActiveUser(user)}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex justify-between items-center cursor-pointer text-black dark:text-white"
          >
            {/* Left side: name + last message */}
            <div className="flex gap-3 items-center">
              <Avatar name={user.name} />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">last message...</p>
              </div>
            </div>
        
            {/* Right side: online status */}
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
