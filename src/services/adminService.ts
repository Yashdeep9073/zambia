import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { DbAdminLog } from "../types/db";

const ADMIN_LOG_COLLECTION = "admin_logs";

export const logAdminAction = async (adminId: string, actionType: string, affectedCollection: string, documentId: string, ipAddress?: string) => {
  try {
    const logData: DbAdminLog = {
      adminId,
      actionType,
      affectedCollection,
      documentId,
      timestamp: serverTimestamp(),
      ipAddress
    };

    await addDoc(collection(db, ADMIN_LOG_COLLECTION), logData);
  } catch (error) {
    console.error("Error logging admin action:", error);
  }
};

export const getAdminLogs = async (limitCount: number = 50) => {
  try {
    const q = query(collection(db, ADMIN_LOG_COLLECTION), orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    return [];
  }
};

export const getLogsByAdmin = async (adminId: string) => {
  try {
    const q = query(collection(db, ADMIN_LOG_COLLECTION), where("adminId", "==", adminId), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching logs by admin:", error);
    return [];
  }
};
