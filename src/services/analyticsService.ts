import { 
  logEvent 
} from "firebase/analytics";
import { analytics, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DbAnalyticsEvent } from "../types/db";

// --- ANALYTICS SERVICE ---

const EVENTS_COLLECTION = "analytics_events";

export const logAppEvent = async (eventName: string, params?: any) => {
  try {
    // 1. Log to Google Analytics
    logEvent(analytics, eventName, params);

    // 2. Log to Firestore for custom analysis
    const eventData: DbAnalyticsEvent = {
      userId: params?.user_id || "anonymous",
      eventType: eventName,
      eventCategory: params?.category || "general",
      eventLabel: params?.label || "",
      timestamp: serverTimestamp(),
      page: window.location.pathname,
      stage: params?.stage || "",
      metadata: params
    };

    await addDoc(collection(db, EVENTS_COLLECTION), eventData);

  } catch (error) {
    console.error("Analytics Error:", error);
  }
};

export const trackPageView = (pageName: string) => {
  logAppEvent("page_view", { page_title: pageName, category: "navigation" });
};

export const trackApplicationStart = (userId: string) => {
  logAppEvent("application_start", { user_id: userId, category: "conversion" });
};

export const trackApplicationComplete = (userId: string) => {
  logAppEvent("application_complete", { user_id: userId, category: "conversion" });
};

export const trackPaymentSuccess = (userId: string, amount: number, currency: string) => {
  logAppEvent("purchase", { 
    transaction_id: `txn_${Date.now()}`, 
    value: amount, 
    currency: currency, 
    user_id: userId,
    category: "ecommerce"
  });
};

export const trackExamAttempt = (userId: string, examId: string, score: number) => {
  logAppEvent("exam_attempt", { 
    user_id: userId, 
    exam_id: examId, 
    score: score,
    category: "engagement"
  });
};

export const trackDropOff = (userId: string, stage: string, reason?: string) => {
    logAppEvent("application_dropoff", {
        user_id: userId,
        stage: stage,
        reason: reason,
        category: "retention"
    });
}

export const trackWaitingRoomProgress = (userId: string, progress: number) => {
    logAppEvent("waiting_room_progress", {
        user_id: userId,
        progress: progress,
        category: "engagement"
    });
}
