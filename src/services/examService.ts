import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  updateDoc, 
  doc 
} from "firebase/firestore";
import { db } from "../firebase";

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
      await updateDoc(doc(db, "users", userId), {
        scholarshipStatus: "Passed",
        scholarshipPercentage: score >= 90 ? 100 : score >= 75 ? 75 : 50
      });
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
