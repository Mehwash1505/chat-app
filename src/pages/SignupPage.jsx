import Signup from "../components/Auth/Signup";

export default function SignupPage({ switchToLogin }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-80 shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Signup</h2>

        <Signup />

        <p
          className="text-sm text-blue-500 mt-4 cursor-pointer text-center"
          onClick={switchToLogin}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

