import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB8MK8w-Bk_btkjE6eAlb2njSI65rhqnvw",
  authDomain: "realtime-chat-app-2815.firebaseapp.com",
  projectId: "realtime-chat-app-2815",
  storageBucket: "realtime-chat-app-2815.firebasestorage.app",
  messagingSenderId: "867021206258",
  appId: "1:867021206258:web:626cae689f22b8a799166b",
  measurementId: "G-6ZE95M1S6B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);