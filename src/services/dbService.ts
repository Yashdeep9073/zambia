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
import { integrationService } from "../../services/integrationService";
import { handleFirestoreError, OperationType } from "../utils/firestoreUtils";
import { logAnalyticsEvent, AnalyticsEventType } from "./analyticsService";

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
      lifecycle_status: "draft",
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
    
    // Log Analytics
    await logAnalyticsEvent(userId, AnalyticsEventType.REGISTRATION_COMPLETED, { appId });

    // Trigger Email Notification
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.email) {
            await integrationService.sendEmail({
                to_email: userData.email,
                subject: "Application Started - Zambians In India",
                template_id: "application_started",
                student_id: userId,
                variables: {
                    name: userData.displayName || "Student",
                    appId: appId,
                    source: "application_create"
                }
            });
        }
        if (userData.phone) {
            await integrationService.sendSMS({
                to_phone_e164: userData.phone,
                message_body: `Hi ${userData.displayName || 'Student'}, you have successfully started your application on Zambians In India. Your App ID is ${appId}.`,
                student_id: userId
            });
        }
    }

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

        // Log Analytics
        await logAnalyticsEvent(userId, AnalyticsEventType.FORM_SUBMITTED, { appId });

        // Trigger Email Notification
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.email) {
                await integrationService.sendEmail({
                    to_email: userData.email,
                    subject: "Application Submitted Successfully",
                    template_id: "application_submitted",
                    student_id: userId,
                    variables: {
                        name: userData.displayName || "Student",
                        appId: appId
                    }
                });
            }
            if (userData.phone) {
                await integrationService.sendSMS({
                    to_phone_e164: userData.phone,
                    message_body: `Congratulations ${userData.displayName || 'Student'}! Your application ${appId} has been submitted successfully.`,
                    student_id: userId
                });
                await integrationService.sendWhatsApp({
                    to_whatsapp: userData.phone,
                    conversation_type: 'notification',
                    student_id: userId,
                    template_name: 'application_submitted_wa',
                    template_variables: { name: userData.displayName || 'Student', appId }
                });
            }
        }

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

      // Log Analytics
      await logAnalyticsEvent(userId, AnalyticsEventType.WAITING_ROOM_ENTERED);

      // Trigger Email Notification
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists() && userDoc.data().email) {
          await integrationService.sendEmail({
              to_email: userDoc.data().email,
              subject: "Welcome to the Waiting Room - ZII",
              template_id: "waiting_room_entry",
              variables: {
                  name: userDoc.data().displayName || "Student",
                  source: "waiting_room_init"
              }
          });
      }
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

            // Trigger Email Notification (Attempt Recorded)
            // Note: This is inside a transaction, but sendEmail is async and external.
            // We should ideally trigger it after transaction success.
        });

        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists() && userDoc.data().email) {
            await integrationService.sendEmail({
                to_email: userDoc.data().email,
                subject: "Exam Attempt Recorded",
                template_id: "exam_attempt_recorded",
                variables: {
                    name: userDoc.data().displayName || "Student",
                    score: score.toString(),
                    examId: examId,
                    source: "exam_record"
                }
            });
        }
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

        // Trigger Email Notification
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.email) {
                await integrationService.sendEmail({
                    to_email: userData.email,
                    subject: "Payment Initiated - ZII",
                    template_id: "payment_initiated",
                    student_id: userId,
                    variables: {
                        name: userData.displayName || "Student",
                        amount: amount.toString(),
                        service: serviceType,
                        transactionId: paymentRef.id,
                        source: "payment_init"
                    }
                });
            }
            if (userData.phone) {
                await integrationService.sendSMS({
                    to_phone_e164: userData.phone,
                    message_body: `ZII: Payment of ${amount} ZMW for ${serviceType} initiated. Ref: ${paymentRef.id}.`,
                    student_id: userId
                });
            }
        }

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

