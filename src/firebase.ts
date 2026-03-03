import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASMZyTsxXSTQohIr4PAyEY--c6dyg4Rbc",
  authDomain: "zambians-in-india-89560.firebaseapp.com",
  projectId: "zambians-in-india-89560",
  storageBucket: "zambians-in-india-89560.firebasestorage.app",
  messagingSenderId: "766695466567",
  appId: "1:766695466567:web:689ec2e1bf31855fde7362",
  measurementId: "G-96TRVQZ6LL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, storage, functions, googleProvider };
