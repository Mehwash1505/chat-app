import ChatWindow from "../components/Chat/ChatWindow";
import UserList from "../components/Sidebar/UserList";

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <UserList />
      <ChatWindow />
    </div>
  );
}
