import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from "firebase/firestore";

export enum AnalyticsEventType {
  REGISTRATION_STARTED = 'registration_started',
  REGISTRATION_COMPLETED = 'registration_completed',
  FORM_SECTION_COMPLETED = 'form_section_completed',
  FORM_SUBMITTED = 'form_submitted',
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_COMPLETED = 'payment_completed',
  EXAM_STARTED = 'exam_started',
  EXAM_COMPLETED = 'exam_completed',
  DOCUMENT_UPLOADED = 'document_uploaded',
  WAITING_ROOM_ENTERED = 'waiting_room_entered',
  OFFER_LETTER_VIEWED = 'offer_letter_viewed',
}

// Legacy exports for compatibility
export const logAppEvent = async (eventType: string, data?: any) => {
  return logAnalyticsEvent(undefined, eventType as any, data);
};

export const trackApplicationStart = async (userId: string) => {
  return logAnalyticsEvent(userId, AnalyticsEventType.REGISTRATION_STARTED);
};

export const trackApplicationComplete = async (userId: string) => {
  return logAnalyticsEvent(userId, AnalyticsEventType.REGISTRATION_COMPLETED);
};

export const trackPaymentSuccess = async (userId: string, amount?: any, currency?: any) => {
  return logAnalyticsEvent(userId, AnalyticsEventType.PAYMENT_COMPLETED, { amount, currency });
};

export const trackExamAttempt = async (userId: string, examId?: any, score?: any) => {
  return logAnalyticsEvent(userId, AnalyticsEventType.EXAM_COMPLETED, { examId, score });
};

export const trackWaitingRoomProgress = async (userId: string, data?: any) => {
  return logAnalyticsEvent(userId, AnalyticsEventType.WAITING_ROOM_ENTERED, data);
};

export const logAnalyticsEvent = async (userId: string | undefined, eventType: AnalyticsEventType, metadata: any = {}) => {
  try {
    const eventData = {
      userId: userId || 'anonymous',
      eventType,
      metadata,
      timestamp: serverTimestamp(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    await addDoc(collection(db, "analytics_events"), eventData);

    // Update aggregates
    const date = new Date().toISOString().split('T')[0];
    const aggregateRef = doc(db, "analytics_aggregates", date);
    
    await setDoc(aggregateRef, {
      [eventType]: increment(1),
      lastUpdated: serverTimestamp()
    }, { merge: true });

  } catch (error) {
    console.error("Failed to log analytics event:", error);
  }
};
