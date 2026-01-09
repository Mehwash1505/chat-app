import ChatWindow from "../components/Chat/ChatWindow";
import UserList from "../components/Sidebar/UserList";
import { useState } from "react";

const [activeUser, setActiveUser] = useState(null);


export default function ChatPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <UserList setActiveUser={setActiveUser} />
      <ChatWindow activeUser={activeUser} />

    </div>
  );
} 
