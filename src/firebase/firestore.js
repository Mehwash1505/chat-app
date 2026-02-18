// src/firebase/firestore.js
import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";

export const db = getFirestore(app);
 
