const users = [
  { id: 1, name: "Ayesha", online: true },
  { id: 2, name: "Rahul", online: false },
  { id: 3, name: "Zoya", online: true },
];

export default function UserList() {
  return (
    <div className="w-64 bg-white border-r">
      <h2 className="p-4 font-semibold text-lg">Chats</h2>

      {users.map((user) => (
        <div
          key={user.id}
          className="px-4 py-3 flex justify-between hover:bg-gray-100 cursor-pointer"
        >
          <span>{user.name}</span>
          <span
            className={`h-2 w-2 rounded-full ${
              user.online ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
