// src/lib/firebase/handleUniversityFormSubmit.ts
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { submitFormResilient } from "../../utils/formUtils";
import { integrationService } from "../../../services/integrationService";
import { logAppEvent } from "../../services/analyticsService";

export const handleUniversityFormSubmit = async (
  type: 'registration' | 'partner_interest',
  data: any,
  uid?: string
) => {
  try {
    // 1. Save to Firestore using resilient utility
    const collectionName = type === 'registration' ? 'universities' : 'university_interests';
    const docId = await submitFormResilient(collectionName, {
      ...data,
      type,
      status: 'pending_review',
      createdAt: serverTimestamp(),
    }, uid);

    // 2. Trigger Notifications (User + Both Admins)
    const adminEmails = ["zambiansinindia@gmail.com", "maorderzambia@gmail.com"];
    
    // Email to University
    await integrationService.sendEmail({
      to_email: data.email,
      subject: type === 'registration' ? "Welcome to ZII University Network" : "ZII Partnership Interest Received",
      template_id: type === 'registration' ? "university_welcome" : "university_interest_ack",
      variables: {
        universityName: data.universityName,
        contactName: data.contactName,
        uniId: data.university_id || docId,
        source: "university_portal"
      }
    });

    // Emails to Admins
    for (const adminEmail of adminEmails) {
      await integrationService.sendEmail({
        to_email: adminEmail,
        subject: `New University ${type === 'registration' ? 'Partner' : 'Interest'}: ${data.universityName}`,
        template_id: "admin_notification",
        variables: {
          universityName: data.universityName,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          type: type,
          source: "admin_alert"
        }
      });
    }

    // 3. Log Analytics
    await logAppEvent(`university_${type}_submitted`, {
      university_name: data.universityName,
      doc_id: docId
    });

    return docId;
  } catch (error) {
    console.error(`Error in handleUniversityFormSubmit (${type}):`, error);
    throw error;
  }
};
