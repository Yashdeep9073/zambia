import { GoogleAuthProvider } from "firebase/auth";
import { 
  app, 
  analytics, 
  auth, 
  db, 
  storage, 
  functions 
} from "./lib/firebase/firebaseConfig";

const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, storage, functions, googleProvider };
