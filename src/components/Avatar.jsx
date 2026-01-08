export default function Avatar({ name }) {
  return (
    <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
      {name[0]}
    </div>
  );
}
