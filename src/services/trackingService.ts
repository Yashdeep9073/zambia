import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { DbDeviceTracking, DbIpLog, DbAnalyticsSession } from "../types/db";

// Helper to get basic browser info
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";
  else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) browser = "IE";
  else if (ua.indexOf("Edge") > -1) browser = "Edge";
  
  return {
    browser,
    os: navigator.platform,
    deviceType: /Mobi|Android/i.test(ua) ? "Mobile" : "Desktop",
    userAgent: ua
  };
};

// Generate a simple fingerprint (in a real app, use a library like fingerprintjs)
const generateFingerprint = () => {
  const { userAgent, language, platform } = navigator;
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const str = `${userAgent}-${language}-${platform}-${screenRes}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

export const trackSessionStart = async (userId?: string) => {
  try {
    const fingerprint = generateFingerprint();
    const browserInfo = getBrowserInfo();
    
    // In a real scenario, we'd call an external API for IP/Geo
    // For now, we'll placeholder or rely on Cloud Functions to enrich this
    
    const sessionData: DbAnalyticsSession = {
      userId,
      sessionStart: serverTimestamp(),
      entryPage: window.location.pathname,
      deviceFingerprint: fingerprint,
      // IP and Geo would typically be added by a backend function trigger
      // or fetched here via a public API if allowed
    };

    const docRef = await addDoc(collection(db, "analytics_sessions"), sessionData);
    localStorage.setItem("zii_current_session_id", docRef.id);
    
    // Also update device tracking
    await updateDeviceTracking(fingerprint, userId, browserInfo);

    return docRef.id;
  } catch (error) {
    console.error("Error tracking session start:", error);
    return null;
  }
};

export const trackSessionEnd = async () => {
  const sessionId = localStorage.getItem("zii_current_session_id");
  if (!sessionId) return;

  try {
    const sessionRef = doc(db, "analytics_sessions", sessionId);
    await updateDoc(sessionRef, {
      sessionEnd: serverTimestamp(),
      exitPage: window.location.pathname
    });
    localStorage.removeItem("zii_current_session_id");
  } catch (error) {
    console.error("Error tracking session end:", error);
  }
};

const updateDeviceTracking = async (fingerprint: string, userId: string | undefined, browserInfo: any) => {
  try {
    const deviceRef = doc(db, "device_tracking", fingerprint);
    const deviceDoc = await getDoc(deviceRef);

    if (deviceDoc.exists()) {
      await updateDoc(deviceRef, {
        lastSeen: serverTimestamp(),
        userId: userId || deviceDoc.data().userId // Update user ID if we have it now
      });
    } else {
      const deviceData: DbDeviceTracking = {
        userId,
        firstSeen: serverTimestamp(),
        lastSeen: serverTimestamp(),
        deviceType: browserInfo.deviceType,
        browser: browserInfo.browser,
        os: browserInfo.os,
        fingerprintHash: fingerprint,
        flagged: false
      };
      await setDoc(deviceRef, deviceData);
    }
  } catch (error) {
    console.error("Error updating device tracking:", error);
  }
};

export const logIp = async (userId?: string, ipAddress: string = "unknown") => {
    // This is ideally called from a secure context or with an IP fetched from a service
    try {
        await addDoc(collection(db, "ip_logs"), {
            userId,
            ipAddress,
            timestamp: serverTimestamp(),
            riskScore: 0,
            suspiciousFlag: false
        } as DbIpLog);
    } catch (e) {
        console.error("Failed to log IP", e);
    }
}
