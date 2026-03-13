import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { integrationService } from "../../services/integrationService";
import { trackStage, LifecycleStage } from "../lib/firebase/studentLifecycle";

// --- PAYMENT SERVICE ---

export const initiatePayment = async (userId: string, amount: number, serviceType: string, applicationId?: string) => {
  try {
    const paymentRef = await addDoc(collection(db, "payments"), {
      userId,
      applicationId: applicationId || null,
      serviceType,
      amount,
      currency: "ZMW",
      paymentStatus: "Pending",
      createdAt: serverTimestamp(),
      transactionId: `ZII-PAY-${Date.now()}` // Placeholder for Zynle ID
    });

    return paymentRef.id;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentId: string) => {
  try {
    // Placeholder for Zynle Verification Logic
    const paymentRef = doc(db, "payments", paymentId);
    await updateDoc(paymentRef, {
      paymentStatus: "Completed",
      updatedAt: serverTimestamp()
    });

    // Trigger Email Notification
    const paymentDoc = await getDoc(paymentRef);
    if (paymentDoc.exists()) {
      const data = paymentDoc.data();
      
      // Update Lifecycle Stage
      if (data.applicationId) {
        await trackStage(data.applicationId, data.userId, LifecycleStage.PAYMENT_COMPLETED);
      }

      const userDoc = await getDoc(doc(db, "users", data.userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.email) {
          await integrationService.sendEmail({
            to_email: userData.email,
            subject: "Payment Receipt - Zambians In India",
            template_id: "payment_success",
            student_id: data.userId,
            variables: {
              name: userData.displayName || "Student",
              amount: data.amount.toString(),
              currency: data.currency,
              service: data.serviceType,
              transactionId: data.transactionId
            }
          });
        }
        if (userData.phone) {
          await integrationService.sendSMS({
            to_phone_e164: userData.phone,
            message_body: `Payment Success! We have received your payment of ${data.amount} ${data.currency} for ${data.serviceType}. Ref: ${data.transactionId}.`,
            student_id: data.userId
          });
          await integrationService.sendWhatsApp({
            to_whatsapp: userData.phone,
            conversation_type: 'notification',
            student_id: data.userId,
            template_name: 'payment_success_wa',
            template_variables: { 
              name: userData.displayName || 'Student', 
              amount: data.amount.toString(),
              service: data.serviceType
            }
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Payment verification failed:", error);
    throw error;
  }
};

export const generateReceipt = async (paymentId: string) => {
  // Placeholder for Receipt Generation
  return `https://zambiansinindia.com/receipts/${paymentId}.pdf`;
};
