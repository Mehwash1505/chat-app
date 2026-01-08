import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";


const users = [
  { id: "user1", name: "Ayesha" },
  { id: "user2", name: "Rahul" },
  { id: "user3", name: "Zoya" },
];

export default function UserList() {
  const [presence, setPresence] = useState({});

  useEffect(() => {
    const presenceRef = ref(db, "presence");

    onValue(presenceRef, (snapshot) => {
      setPresence(snapshot.val() || {});
    });
  }, []);

  return (
    <div className="w-64 bg-white border-r">
      <h2 className="p-4 font-semibold text-lg">Chats</h2>

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
            className="px-4 py-3 flex justify-between items-center hover:bg-gray-100"
          >
            <span>{user.name}</span>
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
