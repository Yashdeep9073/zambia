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
import { integrationService } from "../../services/integrationService";
import { handleFirestoreError, OperationType } from "../utils/firestoreUtils";

// --- AUTHENTICATION SERVICE ---

export const registerUser = async (email: string, password: string, name: string, role: UserRole = UserRole.PROSPECTIVE_STUDENT) => {
  let user: User | null = null;
  try {
    // Ensure no user is signed in before registration to avoid admin-restricted-operation
    if (auth.currentUser) {
      await signOut(auth);
      console.log("Signed out existing user before registration");
    }

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

        // Trigger Welcome Email
        try {
            await integrationService.sendEmail({
                to_email: email,
                subject: "Welcome to Zambians In India (ZII)",
                template_id: "welcome_email",
                variables: {
                    name: name,
                    role: role,
                    source: "registration"
                }
            });
        } catch (emailError) {
            console.warn("Welcome email failed to send, but registration succeeded:", emailError);
        }
    } catch (firestoreError) {
        console.error("Firestore profile creation failed. Rolling back auth user.", firestoreError);
        
        // Log detailed error info
        try {
            handleFirestoreError(firestoreError, OperationType.CREATE, `users/${user.uid}`);
        } catch (e) {
            // handleFirestoreError throws, so we catch it to continue rollback
        }

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

      // Trigger Welcome Email for Google User
      if (user.email) {
          await integrationService.sendEmail({
              to_email: user.email,
              subject: "Welcome to Zambians In India (ZII)",
              template_id: "welcome_email",
              variables: {
                  name: user.displayName || "Student",
                  role: UserRole.PROSPECTIVE_STUDENT,
                  source: "google_login"
              }
          });
      }
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
