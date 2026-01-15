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

      if (currentUser) {
        const userStatusRef = ref(db, `presence/${currentUser.uid}`);

        // User online
        set(userStatusRef, {
          online: true,
          lastSeen: serverTimestamp(),
        });

        // Auto offline when tab closes
        onDisconnect(userStatusRef).set({
          online: false,
          lastSeen: serverTimestamp(),
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userPresenceRef = ref(db, `presence/${user.uid}`);

    // online
    set(userPresenceRef, { online: true });

    // offline when tab closes / logout / crash
    onDisconnect(userPresenceRef).set({ online: false });

  }, [user]);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// YEH LINE MOST IMPORTANT HAI
export const useAuth = () => useContext(AuthContext);
