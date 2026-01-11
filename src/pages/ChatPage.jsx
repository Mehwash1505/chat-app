import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserList from "../components/Sidebar/UserList";
import ChatWindow from "../components/Chat/ChatWindow";

export default function ChatPage() {
  const { user } = useAuth();
  const [activeUser, setActiveUser] = useState(null);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2>Please login to continue</h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <UserList
       activeUser={activeUser}
       setActiveUser={setActiveUser} 
      />
      <ChatWindow activeUser={activeUser} />
    </div>
  );
} 
