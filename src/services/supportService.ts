import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { DbComplaint, DbSupportTicket } from "../types/db";

const COMPLAINT_COLLECTION = "complaints";
const TICKET_COLLECTION = "support_tickets";

export const createComplaint = async (userId: string, complaintData: DbComplaint) => {
  try {
    const complaintRef = await addDoc(collection(db, COMPLAINT_COLLECTION), {
      ...complaintData,
      createdAt: serverTimestamp(),
      status: "Open"
    });
    return complaintRef.id;
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw error;
  }
};

export const createSupportTicket = async (userId: string, ticketData: DbSupportTicket) => {
  try {
    const ticketRef = await addDoc(collection(db, TICKET_COLLECTION), {
      ...ticketData,
      created_at: serverTimestamp(),
      status: "Open"
    });
    return ticketRef.id;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
};

export const getComplaintsByUser = async (userId: string) => {
  try {
    const q = query(collection(db, COMPLAINT_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }
};

export const updateComplaintStatus = async (complaintId: string, status: string, resolvedAt: any = null) => {
  try {
    const complaintRef = doc(db, COMPLAINT_COLLECTION, complaintId);
    await updateDoc(complaintRef, {
      status,
      resolvedAt: resolvedAt ? serverTimestamp() : null
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    throw error;
  }
};
