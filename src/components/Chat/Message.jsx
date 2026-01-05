export default function Message({ message }) {
  const isMe = message.sender === "me";

  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isMe
            ? "bg-blue-500 text-white"
            : "bg-white border"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
