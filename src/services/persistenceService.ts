import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { DbApplicationDraft } from "../types/db";

const DRAFT_COLLECTION = "application_drafts";

export const saveDraft = async (userId: string, draftData: any, lastSavedField: string) => {
  try {
    const draftRef = doc(db, DRAFT_COLLECTION, userId);
    const draftDoc = await getDoc(draftRef);

    const draftPayload: DbApplicationDraft = {
      userId,
      draftData,
      lastSavedField,
      lastSavedTimestamp: serverTimestamp(),
      saveCount: (draftDoc.exists() ? draftDoc.data().saveCount : 0) + 1,
      incompleteFields: [], // Logic to calculate this could be added
      timeSpentOnForm: 0, // Logic to track time could be added
      abandonmentDetected: false
    };

    await setDoc(draftRef, draftPayload, { merge: true });
    console.log("Draft saved successfully");
  } catch (error) {
    console.error("Error saving draft:", error);
    // Implement retry logic or local storage fallback here
    localStorage.setItem(`zii_draft_${userId}`, JSON.stringify(draftData));
  }
};

export const loadDraft = async (userId: string) => {
  try {
    const draftRef = doc(db, DRAFT_COLLECTION, userId);
    const draftDoc = await getDoc(draftRef);

    if (draftDoc.exists()) {
      return draftDoc.data() as DbApplicationDraft;
    } else {
      // Check local storage fallback
      const localDraft = localStorage.getItem(`zii_draft_${userId}`);
      if (localDraft) {
        return { draftData: JSON.parse(localDraft) } as DbApplicationDraft;
      }
      return null;
    }
  } catch (error) {
    console.error("Error loading draft:", error);
    return null;
  }
};

export const snapshotApplication = async (userId: string, applicationData: any) => {
  try {
    // Store a snapshot before final submission for safety
    await addDoc(collection(db, "application_snapshots"), {
      userId,
      data: applicationData,
      timestamp: serverTimestamp(),
      type: "pre-submission"
    });
  } catch (error) {
    console.error("Error creating application snapshot:", error);
  }
};
