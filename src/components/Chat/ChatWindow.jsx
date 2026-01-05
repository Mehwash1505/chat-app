import Message from "./Message";
import MessageInput from "./MessageInput";

const messages = [
  { id: 1, text: "Hey! Kaise ho?", sender: "other" },
  { id: 2, text: "Main theek hoon 😄", sender: "me" },
  { id: 3, text: "Project kaisa chal raha?", sender: "other" },
];

export default function ChatWindow() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="p-4 border-b bg-white font-semibold">
        Ayesha
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
