// src/App.jsx
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import { useState } from "react";

function App() {
  const { user } = useAuth();
  const [isSignup, setIsSignup] = useState(false);

  if (!user) {
    return isSignup ? (
      <SignupPage switchToLogin={() => setIsSignup(false)} />
    ) : (
      <LoginPage switchToSignup={() => setIsSignup(true)} />
    );
  } 

  return <ChatPage />;
}
export default App;
