import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserList from "../components/Sidebar/UserList";
import ChatWindow from "../components/Chat/ChatWindow";

export default function ChatPage() {
  const { user } = useAuth();
  const [activeUser, setActiveUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2>Please login to continue</h2>
      </div>
    );
  }
 
  return (
    <div className="flex h-screen overfliw-hidden">
      {/* Sidebar */}
      <div className={`${ showSidebar ? "block" : "hidden"} md:block`}>
        <UserList
          activeUser={activeUser}
          setActiveUser={(user) => {
            setActiveUser(user);
            setShowSidebar(false); // mobile pe hide
          }}
        />
      </div>
        
      {/* Chat */}
      <div className="flex-1">
        <ChatWindow
          activeUser={activeUser}
          onBack={() => setShowSidebar(true)} // mobile back
        />
      </div>
    </div>
  );
} 
