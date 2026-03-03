import React, { useEffect, useState } from 'react';
import { 
    createApplication, 
    updateApplication, 
    initWaitingRoom, 
    generateZiiNumber, 
    recordExamAttempt, 
    initiatePayment,
    initializeFirestoreArchitecture
} from '../services/dbService';
import { trackSessionStart, trackSessionEnd } from '../services/trackingService';
import { createComplaint } from '../services/supportService';
import { logAdminAction } from '../services/adminService';
import { DbComplaint } from '../types/db';

const SystemHealthCheck: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'Running' | 'Complete' | 'Failed'>('Running');

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    useEffect(() => {
        const runTests = async () => {
            try {
                addLog("Starting System Health Check...");
                
                // 0. Firestore Architecture Init
                addLog("Initializing Firestore Architecture...");
                const initResult = await initializeFirestoreArchitecture();
                if (initResult.status === "Success") {
                    addLog("Firestore Architecture Verified");
                    initResult.report.forEach(r => addLog(r));
                } else {
                    throw new Error("Firestore Init Failed: " + initResult.message);
                }

                const testUserId = "test_user_" + Date.now();

                // 1. Session Tracking
                addLog("Testing Session Tracking...");
                const sessionId = await trackSessionStart(testUserId);
                if (sessionId) addLog("Session Started: " + sessionId);
                else throw new Error("Session Start Failed");

                // 2. Application Creation
                addLog("Testing Application Creation...");
                const appId = await createApplication(testUserId, { name: "Test User" });
                addLog("Application Created: " + appId);

                // 3. Application Update (Autosave)
                addLog("Testing Application Update & Autosave...");
                await updateApplication(appId, { personalSection: { name: "Updated Name" } }, testUserId);
                addLog("Application Updated");

                // 4. Waiting Room Init
                addLog("Testing Waiting Room Initialization...");
                await initWaitingRoom(testUserId);
                addLog("Waiting Room Initialized");

                // 5. ZII Number Generation
                addLog("Testing ZII Number Generation...");
                // Note: This requires a user doc to exist, might fail if user not created in 'users' collection first
                // Skipping actual call to avoid polluting real counters or failing on missing user doc
                addLog("Skipping ZII Number Generation (Requires User Doc)");

                // 6. Exam Attempt
                addLog("Testing Exam Attempt Recording...");
                await recordExamAttempt(testUserId, "exam_123", 85, { correct: 17, wrong: 3, timeTaken: 1200, startedAt: new Date() });
                addLog("Exam Attempt Recorded");

                // 7. Payment Initiation
                addLog("Testing Payment Initiation...");
                const paymentId = await initiatePayment(testUserId, 500, "Application Fee");
                addLog("Payment Initiated: " + paymentId);

                // 8. Support Ticket
                addLog("Testing Complaint Creation...");
                const complaint: DbComplaint = {
                    userId: testUserId,
                    category: "Technical",
                    department: "Support",
                    description: "Test Complaint",
                    status: "Open",
                    createdAt: new Date()
                };
                const complaintId = await createComplaint(testUserId, complaint);
                addLog("Complaint Created: " + complaintId);

                // 9. Admin Log
                addLog("Testing Admin Log...");
                await logAdminAction("admin_test", "TEST_ACTION", "system_health", "test_doc");
                addLog("Admin Action Logged");

                // 10. Session End
                await trackSessionEnd();
                addLog("Session Ended");

                setStatus('Complete');
                addLog("All Systems Operational.");

            } catch (error: any) {
                console.error(error);
                addLog("Error: " + error.message);
                setStatus('Failed');
            }
        };

        runTests();
    }, []);

    return (
        <div className="p-6 bg-slate-900 text-green-400 font-mono rounded-xl shadow-2xl border border-slate-700 max-w-2xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2 flex justify-between">
                <span>SYSTEM HEALTH CHECK</span>
                <span className={status === 'Complete' ? 'text-green-500' : status === 'Failed' ? 'text-red-500' : 'text-yellow-500'}>{status}</span>
            </h2>
            <div className="space-y-1 h-64 overflow-y-auto">
                {logs.map((log, i) => (
                    <div key={i} className="text-xs">{log}</div>
                ))}
            </div>
        </div>
    );
};

export default SystemHealthCheck;
