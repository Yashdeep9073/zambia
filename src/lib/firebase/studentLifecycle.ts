
import { db } from "../../firebase";
import { doc, updateDoc, serverTimestamp, addDoc, collection, getDoc } from "firebase/firestore";
import { logAnalyticsEvent, AnalyticsEventType } from "../../services/analyticsService";
import { integrationService } from "../../../services/integrationService";

export enum LifecycleStage {
  APPLY = "apply",
  DRAFT = "draft",
  SUBMITTED = "submitted",
  PAYMENT_COMPLETED = "payment_completed",
  APPROVED = "approved",
  COMPLETED = "completed"
}

/**
 * trackStage
 * Updates the lifecycle_status of an application and logs the event.
 * Triggers notifications to student and admins.
 */
export const trackStage = async (applicationId: string, userId: string, stage: LifecycleStage, studentEmail?: string, studentName?: string) => {
  try {
    const appRef = doc(db, "applications", applicationId);
    const userRef = doc(db, "users", userId);
    
    // 1. Update Application Firestore
    await updateDoc(appRef, {
      lifecycle_status: stage,
      [`lifecycle_${stage}_at`]: serverTimestamp(),
      lastUpdateTimestamp: serverTimestamp()
    });

    // 2. Update User Profile Firestore
    await updateDoc(userRef, {
      lifecycleStage: stage,
      currentStage: stage,
      lastActive: serverTimestamp()
    });

    // 3. Log Analytics Event
    await logAnalyticsEvent(userId, AnalyticsEventType.FORM_SUBMITTED, { 
      applicationId, 
      stage,
      source: "lifecycle_tracker"
    });

    // 4. Fetch User Data for Notifications
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : null;
    const studentPhone = userData?.phone;

    // 5. Trigger Notifications
    const adminEmails = ["zambiansinindia@gmail.com", "maorderzambia@gmail.com"];
    
    // Notify Admins
    for (const email of adminEmails) {
      await integrationService.sendEmail({
        to_email: email,
        subject: `Lifecycle Update: ${studentName || 'Student'} -> ${stage.toUpperCase()}`,
        template_id: "admin_lifecycle_notification",
        variables: {
          studentName: studentName || "Student",
          applicationId,
          newStage: stage,
          timestamp: new Date().toLocaleString()
        }
      });
    }

    // Notify Student
    if (studentEmail) {
      await integrationService.sendEmail({
        to_email: studentEmail,
        subject: `Application Status Update: ${stage.replace('_', ' ').toUpperCase()}`,
        template_id: "student_lifecycle_notification",
        variables: {
          name: studentName || "Student",
          stage: stage.replace('_', ' '),
          nextSteps: getNextSteps(stage)
        }
      });
    }

    // SMS & WhatsApp for critical stages
    if (studentPhone && (stage === LifecycleStage.SUBMITTED || stage === LifecycleStage.PAYMENT_COMPLETED || stage === LifecycleStage.APPROVED)) {
      await integrationService.sendSMS({
        to_phone_e164: studentPhone,
        message_body: `ZII Update: Your application is now ${stage.replace('_', ' ')}. Check your dashboard for details.`,
        student_id: userId
      });

      await integrationService.sendWhatsApp({
        to_whatsapp: studentPhone,
        conversation_type: 'notification',
        student_id: userId,
        template_name: 'lifecycle_update_wa',
        template_variables: {
          name: studentName || 'Student',
          stage: stage.replace('_', ' ')
        }
      });
    }

    return true;
  } catch (error) {
    console.error("Error tracking lifecycle stage:", error);
    throw error;
  }
};

const getNextSteps = (stage: LifecycleStage): string => {
  switch (stage) {
    case LifecycleStage.SUBMITTED:
      return "Your application is being reviewed. Please wait for the payment link.";
    case LifecycleStage.PAYMENT_COMPLETED:
      return "Payment received. We are now processing your final admission.";
    case LifecycleStage.APPROVED:
      return "Congratulations! Your application is approved. Check your portal for the offer letter.";
    case LifecycleStage.COMPLETED:
      return "Welcome to India! Your journey is complete.";
    default:
      return "Please check your dashboard for updates.";
  }
};
