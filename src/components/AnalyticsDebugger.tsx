
import React, { useState } from 'react';
import { logAppEvent, trackApplicationStart, trackApplicationComplete, trackPaymentSuccess, trackExamAttempt, trackWaitingRoomProgress } from '../services/analyticsService';
import { AdminAnalyticsService } from '../../services/adminAnalyticsService';
import { Loader, CheckCircle, AlertCircle, Play } from 'lucide-react';

const AnalyticsDebugger: React.FC = () => {
  const [status, setStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const runTest = async (testName: string, testFn: () => any) => {
    setStatus(prev => ({ ...prev, [testName]: 'loading' }));
    addLog(`Starting test: ${testName}...`);
    try {
      await testFn();
      setStatus(prev => ({ ...prev, [testName]: 'success' }));
      addLog(`Success: ${testName}`);
    } catch (err: any) {
      setStatus(prev => ({ ...prev, [testName]: 'error' }));
      addLog(`Error in ${testName}: ${err.message}`);
    }
  };

  const tests = [
    {
      id: 'registration',
      label: 'User Registration Event',
      fn: () => logAppEvent('user_registration', { user_id: 'test_user_123', method: 'google' })
    },
    {
      id: 'login',
      label: 'User Login Event',
      fn: () => logAppEvent('login', { user_id: 'test_user_123', method: 'google' })
    },
    {
      id: 'app_start',
      label: 'Application Start',
      fn: () => trackApplicationStart('test_user_123')
    },
    {
      id: 'app_submit',
      label: 'Application Submission',
      fn: () => trackApplicationComplete('test_user_123')
    },
    {
      id: 'payment',
      label: 'Payment Success',
      fn: () => trackPaymentSuccess('test_user_123', 500, 'ZMW')
    },
    {
      id: 'exam',
      label: 'Exam Attempt',
      fn: () => trackExamAttempt('test_user_123', 'scholarship_exam_001', 85)
    },
    {
      id: 'waiting_room',
      label: 'Waiting Room Entry',
      fn: () => trackWaitingRoomProgress('test_user_123', 10)
    },
    {
      id: 'email_sent',
      label: 'Email Sent Log',
      fn: () => AdminAnalyticsService.trackNotificationEvent('email', 'sent', { recipient: 'test@example.com', templateId: 'welcome_email' })
    },
    {
      id: 'email_opened',
      label: 'Email Opened Log',
      fn: () => AdminAnalyticsService.trackNotificationEvent('email', 'opened', { recipient: 'test@example.com', templateId: 'welcome_email' })
    },
    {
        id: 'aggregate',
        label: 'Run Analytics Aggregation',
        fn: () => AdminAnalyticsService.aggregateEmailMetrics()
    }
  ];

  const runAll = async () => {
    for (const test of tests) {
      await runTest(test.id, test.fn);
    }
  };

  React.useEffect(() => {
    if (window.location.search.includes('autoTest=true')) {
      runAll();
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Analytics Synchronization Debugger</h3>
          <p className="text-sm text-slate-500">Test event triggers and verify Firestore synchronization.</p>
        </div>
        <button 
          onClick={runAll}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition"
        >
          <Play className="w-4 h-4 mr-2" /> Run All Tests
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {tests.map(test => (
          <div key={test.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-medium text-slate-700">{test.label}</span>
            <div className="flex items-center">
              {status[test.id] === 'loading' && <Loader className="w-5 h-5 text-blue-500 animate-spin" />}
              {status[test.id] === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              {status[test.id] === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {(!status[test.id] || status[test.id] === 'idle') && (
                <button 
                  onClick={() => runTest(test.id, test.fn)}
                  className="p-1 hover:bg-slate-200 rounded-lg transition"
                >
                  <Play className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs text-emerald-400">
        <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
          <span className="text-slate-500 uppercase tracking-widest font-bold">Execution Logs</span>
          <button onClick={() => setLogs([])} className="text-slate-500 hover:text-white">Clear</button>
        </div>
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">No logs yet. Run a test to begin.</div>
        ) : (
          logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)
        )}
      </div>
    </div>
  );
};

export default AnalyticsDebugger;
