export default function Message({ message }) {
  const isMe = message.sender === "me";

  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
       
  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isMe
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white dark:bg-gray-900 border rounded-bl-none"
        }`}
      >
        <p>{message.text}</p>
        <p className="text-[10px] text-right opacity-70 mt-1">
          {time}
        </p>
        {isMe && (
          <span className={`text-xs ml-2 ${
            message.status === "seen" ? "text-blue-500" : "text-gray-400"
          }`}>
            {message.status === "sent" && "✔"}
            {message.status === "delivered" && "✔✔"}
            {message.status === "seen" && "✔✔"}
          </span>
        )}
      </div>
    </div>
  );
}
