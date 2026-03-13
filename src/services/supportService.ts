import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { DbComplaint, DbSupportTicket } from "../types/db";
import { integrationService } from "../../services/integrationService";

const COMPLAINT_COLLECTION = "complaints";
const TICKET_COLLECTION = "support_tickets";

export const createComplaint = async (userId: string, complaintData: DbComplaint) => {
  try {
    const complaintRef = await addDoc(collection(db, COMPLAINT_COLLECTION), {
      ...complaintData,
      createdAt: serverTimestamp(),
      status: "Open"
    });

    // Trigger Email Notification
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.email) {
        await integrationService.sendEmail({
          to_email: userData.email,
          subject: "Complaint Received - Zambians In India",
          template_id: "complaint_received",
          student_id: userId,
          variables: {
            name: userData.displayName || "Student",
            complaintId: complaintRef.id,
            category: complaintData.category || "General",
            source: "complaint_create"
          }
        });
      }
      if (userData.phone) {
        await integrationService.sendSMS({
          to_phone_e164: userData.phone,
          message_body: `Hi ${userData.displayName || 'Student'}, we have received your complaint (ID: ${complaintRef.id}). We will review it shortly.`,
          student_id: userId
        });
      }
    }

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

    // Trigger Email Notification
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.email) {
        await integrationService.sendEmail({
          to_email: userData.email,
          subject: "Support Ticket Created - Zambians In India",
          template_id: "support_ticket_created",
          student_id: userId,
          variables: {
            name: userData.displayName || "Student",
            ticketId: ticketRef.id,
            category: ticketData.category || "Support"
          }
        });
      }
      if (userData.phone) {
        await integrationService.sendSMS({
          to_phone_e164: userData.phone,
          message_body: `ZII Support: Ticket #${ticketRef.id} created for ${ticketData.category}. We are on it!`,
          student_id: userId
        });
      }
    }

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
