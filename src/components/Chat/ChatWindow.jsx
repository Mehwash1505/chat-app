import { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  // 👇 AUTO SCROLL ke liye ref
  const bottomRef = useRef(null);

  // 🔹 Realtime messages listener
  useEffect(() => {
    const messagesRef = ref(db, "messages");

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
        return;
      }

      const msgs = Object.entries(data).map(([id, msg]) => ({
        id,
        ...msg,
      }));

      setMessages(msgs);
    });

    // cleanup (good practice)
    return () => unsubscribe();
  }, []);

  // 🔹 Auto scroll jab bhi messages change ho
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="p-4 border-b bg-white font-semibold">
        Chat
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Say hi 👋
          </p>
        )}

        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={{
              text: msg.text,
              sender: msg.senderId === user.uid ? "me" : "other",
            }}
          />
        ))}

        {/* 👇 invisible div for auto scroll */ }
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
