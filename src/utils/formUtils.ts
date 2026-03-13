
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  serverTimestamp,
  DocumentReference
} from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./firestoreUtils";

/**
 * submitFormResilient
 * 
 * A utility to ensure form submissions are resilient to network failures.
 * It attempts to write to Firestore, and if it fails due to network issues,
 * it can be extended to queue the request or use local persistence.
 * 
 * For now, it implements robust error handling and serverTimestamping.
 */
export async function submitFormResilient<T extends object>(
  collectionName: string,
  data: T,
  documentId?: string
): Promise<string> {
  const dataWithTimestamp = {
    ...data,
    updatedAt: serverTimestamp(),
    _resilient: true
  };

  try {
    if (documentId) {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, dataWithTimestamp, { merge: true });
      return documentId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...dataWithTimestamp,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    // Log the error using our standardized utility
    handleFirestoreError(
      error, 
      documentId ? OperationType.UPDATE : OperationType.CREATE, 
      collectionName + (documentId ? `/${documentId}` : '')
    );
    
    // Fallback: Save to localStorage for manual recovery if needed
    const pendingKey = `pending_submission_${Date.now()}`;
    localStorage.setItem(pendingKey, JSON.stringify({ collectionName, data, documentId }));
    
    throw error;
  }
}
