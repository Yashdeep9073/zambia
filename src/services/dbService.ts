import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  runTransaction,
  increment,
  onSnapshot,
  addDoc,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase";
import { UserRole, AppPhase } from "../../types";
import { trackSessionStart, trackSessionEnd, logIp } from "./trackingService";
import { saveDraft, snapshotApplication } from "./persistenceService";
import { DbApplication, DbScholarshipExam, DbExamAttempt, DbPayment, DbWaitingRoom } from "../types/db";

// --- DATABASE SERVICE ---

// --- ZII NUMBER GENERATION ---
export const generateZiiNumber = async (userId: string) => {
  const year = new Date().getFullYear();
  const counterRef = doc(db, "counters", `zii_${year}`);

  try {
    const newZiiNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let count = 1;
      if (counterDoc.exists()) {
        count = counterDoc.data().count + 1;
      }

      transaction.set(counterRef, { count }, { merge: true });
      
      const formattedCount = count.toString().padStart(4, '0');
      const ziiNumber = `ZII-${year}-${formattedCount}`;
      
      // Update User Profile
      transaction.update(doc(db, "users", userId), { ziiNumber });
      
      return ziiNumber;
    });

    return newZiiNumber;
  } catch (error) {
    console.error("ZII Number Generation Failed:", error);
    throw error;
  }
};

// --- APPLICATION MANAGEMENT ---

export const createApplication = async (userId: string, initialData: any) => {
  try {
    const appRef = doc(collection(db, "applications"));
    const appId = appRef.id;

    const applicationData: DbApplication = {
      userId,
      stage: AppPhase.APPLICATION_ENTRY.toString(),
      progressPercentage: 0,
      status: "Draft",
      personalSection: initialData,
      guardianSection: {},
      academicSection: {},
      documentsSection: {},
      additionalInfo: {},
      formErrorsCount: 0,
      firstSubmissionTimestamp: serverTimestamp(),
      lastUpdateTimestamp: serverTimestamp(),
      submissionAttempts: 0,
      isLocked: false,
      ipAddressAtSubmission: "pending", // To be updated on submission
      deviceAtSubmission: navigator.userAgent
    };

    await setDoc(appRef, applicationData);
    
    // Track creation
    await logIp(userId, "unknown"); // Placeholder for IP logging

    return appId;
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

export const updateApplication = async (appId: string, data: any, userId: string) => {
  try {
    const appRef = doc(db, "applications", appId);
    
    // Autosave Draft Logic
    await saveDraft(userId, data, "unknown_field");

    await updateDoc(appRef, {
      ...data,
      lastUpdateTimestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

export const submitApplication = async (appId: string, userId: string) => {
    try {
        const appRef = doc(db, "applications", appId);
        const appDoc = await getDoc(appRef);

        if (!appDoc.exists()) throw new Error("Application not found");

        // Snapshot before submission
        await snapshotApplication(userId, appDoc.data());

        await updateDoc(appRef, {
            status: "Submitted",
            submissionAttempts: increment(1),
            lastUpdateTimestamp: serverTimestamp(),
            isLocked: true,
            lockedReason: "Submitted for Review"
        });

        // Trigger Notification (Placeholder)
        // await sendNotification(userId, "Application Submitted Successfully");

    } catch (error) {
        console.error("Error submitting application:", error);
        throw error;
    }
}

export const getApplication = async (userId: string) => {
  try {
    const q = query(collection(db, "applications"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
};

// --- WAITING ROOM ---

export const initWaitingRoom = async (userId: string) => {
  try {
    const wrRef = doc(db, "waiting_room", userId);
    const wrDoc = await getDoc(wrRef);

    if (!wrDoc.exists()) {
      const waitingRoomData: DbWaitingRoom = {
        tasksCompleted: [],
        examStatus: "Pending",
        videoChallengeStatus: "Pending",
        photoChallengeStatus: "Pending",
        offerLetterLocked: true,
        progressScore: 0,
        motivationScore: 0,
        engagementLevel: "New"
      };
      await setDoc(wrRef, {
        ...waitingRoomData,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error initializing waiting room:", error);
  }
};

export const updateWaitingRoomStatus = async (userId: string, field: string, status: string) => {
  try {
    const wrRef = doc(db, "waiting_room", userId);
    await setDoc(wrRef, {
      [field]: status,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating waiting room:", error);
  }
};

// --- SCHOLARSHIP EXAM ---

export const recordExamAttempt = async (userId: string, examId: string, score: number, details: any) => {
    try {
        await runTransaction(db, async (transaction) => {
            const examRef = doc(db, "scholarship_exams", examId);
            const userExamRef = doc(db, "users", userId); // Or a subcollection

            // Create Attempt Record
            const attemptRef = doc(collection(db, "exam_attempts"));
            const attemptData: DbExamAttempt = {
                userId,
                examId,
                attemptNumber: 1, // Logic to increment needed
                score,
                correctAnswers: details.correct,
                wrongAnswers: details.wrong,
                timeTaken: details.timeTaken,
                startedAt: details.startedAt,
                completedAt: serverTimestamp(),
                suspiciousActivityFlag: false
            };
            
            transaction.set(attemptRef, attemptData);

            // Update User Stats
            // transaction.update(userExamRef, { ... });
        });
    } catch (error) {
        console.error("Error recording exam attempt:", error);
        throw error;
    }
}

// --- PAYMENTS ---

export const initiatePayment = async (userId: string, amount: number, serviceType: string) => {
    try {
        const paymentRef = doc(collection(db, "payments"));
        const paymentData: DbPayment = {
            userId,
            serviceType,
            amount,
            currency: "ZMW",
            paymentStatus: "Pending",
            paymentMethod: "Zynle", // Default
            transactionId: paymentRef.id, // Placeholder
            initiatedAt: serverTimestamp(),
            retryCount: 0
        };
        await setDoc(paymentRef, paymentData);
        return paymentRef.id;
    } catch (error) {
        console.error("Error initiating payment:", error);
        throw error;
    }
}

// --- DASHBOARD REAL-TIME LISTENER ---

export const subscribeToDashboard = (userId: string, callback: (data: any) => void) => {
  const userRef = doc(db, "users", userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export const subscribeToApplication = (userId: string, callback: (data: any) => void) => {
  const q = query(collection(db, "applications"), where("userId", "==", userId));
  
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback(snapshot.docs[0].data());
    } else {
      callback(null);
    }
  });
};

export { initializeFirestoreArchitecture } from "./firestoreInit";

