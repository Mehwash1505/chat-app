import Login from "../components/Auth/Login";

export default function LoginPage({ switchToSignup }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-80 shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <Login />

        <p
          className="text-sm text-blue-500 mt-4 cursor-pointer text-center"
          onClick={switchToSignup}
        > 
          Don't have an account? Signup
        </p>
      </div>
    </div>
  );
}

