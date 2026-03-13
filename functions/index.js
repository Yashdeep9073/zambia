const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const db = admin.firestore();

// Nodemailer configuration (Africa-focused, using africa-south1)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "zambiansinindia@gmail.com",
    pass: functions.config().email.pass // Ensure this is set in Firebase config
  }
});

/**
 * onLifecycleStatusChange
 * Triggers when an application's lifecycle_status changes.
 * Sends notifications and logs analytics.
 */
exports.onLifecycleStatusChange = functions.region("africa-south1").firestore
  .document("applications/{appId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const appId = context.params.appId;

    if (newData.lifecycle_status === oldData.lifecycle_status) return null;

    const stage = newData.lifecycle_status;
    const userId = newData.userId;

    // Fetch User Data
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData) return null;

    const studentEmail = userData.email;
    const studentPhone = userData.phone;
    const studentName = userData.fullName || userData.displayName || "Student";

    // 1. Send Email to Student
    if (studentEmail) {
      const mailOptions = {
        from: '"Zambians In India" <zambiansinindia@gmail.com>',
        to: studentEmail,
        subject: `Application Status: ${stage.toUpperCase()}`,
        html: `<p>Hello ${studentName},</p><p>Your application status has been updated to: <b>${stage.replace('_', ' ')}</b>.</p><p>Check your dashboard for next steps.</p>`
      };
      await transporter.sendMail(mailOptions);
    }

    // 2. Notify Admins
    const adminEmails = ["zambiansinindia@gmail.com", "maorderzambia@gmail.com"];
    for (const email of adminEmails) {
      await transporter.sendMail({
        from: '"ZII System" <zambiansinindia@gmail.com>',
        to: email,
        subject: `Lifecycle Update: ${studentName} -> ${stage.toUpperCase()}`,
        text: `Student ${studentName} (${userId}) has moved to stage: ${stage}. Application ID: ${appId}`
      });
    }

    // 3. Log to notifications_sent
    await db.collection("notifications_sent").add({
      userId,
      appId,
      stage,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      channels: ["email"]
    });

    // 4. Log Analytics Event
    await db.collection("analytics_events").add({
      userId,
      type: "LIFECYCLE_CLOUD_TRIGGER",
      metadata: { appId, stage },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return true;
  });
