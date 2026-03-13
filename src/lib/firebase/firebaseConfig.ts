import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import firebaseConfigData from "../../../firebase-applet-config.json";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyASMZyTsxXSTQohIr4PAyEY--c6dyg4Rbc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zambians-in-india-89560.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zambians-in-india-89560",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zambians-in-india-89560.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "766695466567",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:766695466567:web:689ec2e1bf31855fde7362",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-96TRVQZ6LL"
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);

// Initialize Firestore with persistence settings at creation time
// This is more robust than enableIndexedDbPersistence and avoids "already started" errors
let db;
const databaseId = firebaseConfigData.firestoreDatabaseId || "(default)";

try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, databaseId);
  console.log("Firestore initialized with persistent cache");
} catch (error: any) {
  // If already initialized, get the existing instance
  db = getFirestore(app, databaseId);
  console.warn("Firestore already initialized, using existing instance");
}

const storage = getStorage(app);
const functions = getFunctions(app);

export { app, analytics, auth, db, storage, functions };
