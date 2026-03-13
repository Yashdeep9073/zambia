// src/lib/firebase/universityAuth.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const registerUniversityAuth = async (email: string, password: string) => {
  try {
    // Ensure we are signed out before creating a new university account
    await signOut(auth);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("University Auth Registration Error:", error);
    throw error;
  }
};

export const loginUniversity = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("University Login Error:", error);
    throw error;
  }
};

export const getUniversityProfile = async (uid: string) => {
  try {
    const docRef = doc(db, "universities", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching university profile:", error);
    throw error;
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
