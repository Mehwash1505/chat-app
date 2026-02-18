// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { ref, set, onDisconnect, serverTimestamp } from "firebase/database";
import { db } from "../firebase/firebase";
import { onValue } from "firebase/database";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userRef = ref(db, `presence/${currentUser.uid}`);

        // 🔹 ONLINE
        set(userRef, {
          online: true,
          lastSeen: serverTimestamp(),
        });

        // 🔹 AUTO OFFLINE (CRITICAL)
        onDisconnect(userRef).set({
          online: false,
          lastSeen: serverTimestamp(),
        });
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
 
