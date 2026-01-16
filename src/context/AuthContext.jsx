import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { ref, set, onDisconnect, serverTimestamp } from "firebase/database";
import { db } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) return;

      const userStatusRef = ref(db, `presence/${currentUser.uid}`);

      // User online
      set(userStatusRef, {
        online: true,
        lastSeen: serverTimestamp(),
      });

      // Auto offline on disconnect
      onDisconnect(userStatusRef).set({
        online: false,
        lastSeen: serverTimestamp(),
      });
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
