import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        className="border px-3 py-2 rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border px-3 py-2 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-500 text-white py-2 rounded">
        Signup
      </button>
    </form>
  );
}
