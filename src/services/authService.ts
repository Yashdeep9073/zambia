import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { UserRole } from "../../types";

// --- AUTHENTICATION SERVICE ---

export const registerUser = async (email: string, password: string, name: string, role: UserRole = UserRole.PROSPECTIVE_STUDENT) => {
  let user: User | null = null;
  try {
    console.log("Starting registration for:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user = userCredential.user;
    console.log("Auth user created:", user.uid);

    // Update Profile
    await updateProfile(user, { displayName: name });

    // Send Verification Email
    try {
        await sendEmailVerification(user);
        console.log("Verification email sent");
    } catch (emailError) {
        console.warn("Failed to send verification email:", emailError);
        // Continue, don't block registration
    }

    // Create User Document in Firestore
    const userDocRef = doc(db, "users", user.uid);
    try {
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: name,
            role: role,
            emailVerified: false,
            phoneVerified: false,
            ziiNumber: null, // Will be generated later
            profileCompletion: 0,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
        console.log("Firestore profile created for:", user.uid);
    } catch (firestoreError) {
        console.error("Firestore profile creation failed. Rolling back auth user.", firestoreError);
        // Rollback: Delete the auth user if firestore write fails
        if (user) {
            await deleteUser(user);
        }
        throw new Error("Failed to create user profile. Please try again.");
    }

    return user;
  } catch (error: any) {
    console.error("Registration Error:", error.code, error.message);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Attempting login for:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Auth login successful:", user.uid);
    
    // Self-Healing: Check if user document exists
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        console.warn("Firestore Profile Missing – Reparing...", user.uid);
        // Auto-repair: Create missing document
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "User",
            role: UserRole.PROSPECTIVE_STUDENT, // Default fallback
            emailVerified: user.emailVerified,
            phoneVerified: false,
            ziiNumber: null,
            profileCompletion: 0,
            createdAt: serverTimestamp(), // Technically not true creation time, but profile creation time
            lastLogin: serverTimestamp()
        });
        console.log("Firestore Profile Repaired");
    } else {
        // Update Last Login
        await updateDoc(userDocRef, {
            lastLogin: serverTimestamp()
        });
        console.log("Last login updated");
    }

    return user;
  } catch (error: any) {
    console.error("Login Error Code:", error.code);
    console.error("Login Error Message:", error.message);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Google login successful:", user.uid);
    
    // Check if user exists, if not create
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("Creating new profile for Google user");
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: UserRole.PROSPECTIVE_STUDENT,
        emailVerified: user.emailVerified,
        phoneVerified: false,
        ziiNumber: null,
        profileCompletion: 0,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      console.log("Firestore Profile Created");
    } else {
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
    }
    
    return user;
  } catch (error: any) {
    console.error("Google Login Error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
