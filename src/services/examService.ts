import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  updateDoc, 
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { integrationService } from "../../services/integrationService";

// --- SCHOLARSHIP EXAM SERVICE ---

export const recordExamAttempt = async (userId: string, examId: string, score: number, passed: boolean) => {
  try {
    const attemptsQuery = query(
      collection(db, "scholarship_exams"), 
      where("userId", "==", userId), 
      where("examId", "==", examId)
    );
    const attemptsSnapshot = await getDocs(attemptsQuery);
    const attemptCount = attemptsSnapshot.size;

    if (attemptCount >= 3) {
      throw new Error("Maximum attempts reached.");
    }

    await addDoc(collection(db, "scholarship_exams"), {
      userId,
      examId,
      attemptNumber: attemptCount + 1,
      score,
      passed,
      timestamp: serverTimestamp()
    });

    if (passed) {
      const percentage = score >= 90 ? 100 : score >= 75 ? 75 : 50;
      await updateDoc(doc(db, "users", userId), {
        scholarshipStatus: "Passed",
        scholarshipPercentage: percentage
      });

      // Trigger Email Notification
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.email) {
          await integrationService.sendEmail({
            to_email: userData.email,
            subject: "Scholarship Exam Passed - Zambians In India",
            template_id: "scholarship_passed",
            student_id: userId,
            variables: {
              name: userData.displayName || "Student",
              score: score.toString(),
              percentage: percentage.toString()
            }
          });
        }
        if (userData.phone) {
          await integrationService.sendSMS({
            to_phone_e164: userData.phone,
            message_body: `Congratulations ${userData.displayName || 'Student'}! You passed the scholarship exam with ${score}%. You qualify for a ${percentage}% scholarship.`,
            student_id: userId
          });
          await integrationService.sendWhatsApp({
            to_whatsapp: userData.phone,
            conversation_type: 'notification',
            student_id: userId,
            template_name: 'scholarship_passed_wa',
            template_variables: { 
              name: userData.displayName || 'Student', 
              score: score.toString(),
              percentage: percentage.toString()
            }
          });
        }
      }
    }

    return { success: true, attemptsLeft: 2 - attemptCount };
  } catch (error) {
    console.error("Error recording exam attempt:", error);
    throw error;
  }
};

export const getExamHistory = async (userId: string) => {
  try {
    const q = query(collection(db, "scholarship_exams"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching exam history:", error);
    throw error;
  }
};
