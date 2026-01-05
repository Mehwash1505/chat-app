export default function MessageInput() {
  return (
    <div className="p-4 border-t bg-white flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button className="bg-blue-500 text-white px-4 rounded">
        Send
      </button>
    </div>
  );
}
