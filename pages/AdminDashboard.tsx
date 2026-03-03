
import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, CheckCircle, XCircle, Mail, DollarSign, Plane, 
  Globe, Bell, Settings, Search, LayoutDashboard, Database, 
  Activity, Shield, Download, ChevronRight, Info, AlertTriangle, 
  LogOut, Menu, X, Filter, RefreshCcw, Lock, Eye, Calendar,
  BarChart2, PieChart, TrendingUp, UserCheck, Briefcase, Zap, Phone, Clock,
  Link, Power, Save, Check, Server, MessageSquare, Map
} from 'lucide-react';
import { UserRole } from '../types';
import { integrationService } from '../services/integrationService';

interface AdminDashboardProps {
  onLogout: () => void;
}

// --- MOCK DATA ---
const METRICS_DATA = [
  { id: 1, title: 'Total Applications', count: '4,980', trend: '+12%', description: 'Total number of applications received since launch.', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', viewId: 'all_applications' },
  { id: 2, title: 'Total Site Visitors', count: '128,400', trend: '+5%', description: 'Unique visitors to the landing page.', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-100', viewId: 'traffic' },
  { id: 3, title: 'Applications Started', count: '6,210', trend: '+8%', description: 'Users who clicked "Start Here" but haven\'t completed.', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100', viewId: 'incomplete_apps' },
  { id: 4, title: 'Applications Completed', count: '3,980', trend: '+15%', description: 'Fully submitted applications pending review.', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', viewId: 'completed_apps' },
  { id: 5, title: 'Offer Letters Issued', count: '2,450', trend: '+20%', description: 'Official offer letters sent to students.', icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-100', viewId: 'offers_issued' },
  { id: 6, title: 'Offers Accepted', count: '1,860', trend: '+18%', description: 'Students who have accepted their offer.', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100', viewId: 'offers_accepted' },
  { id: 7, title: 'Offers Rejected', count: '420', trend: '-2%', description: 'Students who declined the offer.', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', viewId: 'offers_rejected' },
  { id: 8, title: 'Acceptance Letters', count: '2,120', trend: '+10%', description: 'Final acceptance letters issued after fee payment.', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-100', viewId: 'acceptance_letters' },
  { id: 9, title: 'Visas Submitted', count: '1,540', trend: '+22%', description: 'Visa applications submitted to High Commission.', icon: Plane, color: 'text-sky-600', bg: 'bg-sky-100', viewId: 'visas_submitted' },
  { id: 10, title: 'Visas Approved', count: '1,120', trend: '+25%', description: 'Visas successfully granted.', icon: Shield, color: 'text-green-700', bg: 'bg-green-200', viewId: 'visas_approved' },
  { id: 11, title: 'Visas Rejected', count: '190', trend: '-5%', description: 'Visas denied by High Commission.', icon: AlertTriangle, color: 'text-red-700', bg: 'bg-red-200', viewId: 'visas_rejected' },
  { id: 12, title: 'Ready to Travel', count: '980', trend: '+30%', description: 'Students with Visa and Ticket ready.', icon: Briefcase, color: 'text-yellow-600', bg: 'bg-yellow-100', viewId: 'ready_travel' },
  { id: 13, title: 'Travelled', count: '870', trend: '+28%', description: 'Students who have arrived in India.', icon: Plane, color: 'text-blue-800', bg: 'bg-blue-200', viewId: 'travelled' },
  { id: 14, title: 'Enrolled Students', count: '1,640', trend: '+12%', description: 'Active students currently studying.', icon: Database, color: 'text-slate-800', bg: 'bg-slate-200', viewId: 'enrolled' },
  { id: 15, title: 'Total Alumni', count: '4,200', trend: '+4%', description: 'Graduated students in the network.', icon: Users, color: 'text-pink-600', bg: 'bg-pink-100', viewId: 'alumni' },
];

const MOCK_STUDENTS = [
  { id: 'ZII-2025-1001', name: 'John Phiri', uni: 'CT University', course: 'B.Tech CS', status: 'Offer Issued', date: '2025-01-15', engagement: 85, risk: 'Low', lastLogin: '2h ago' },
  { id: 'ZII-2025-1002', name: 'Mary Banda', uni: 'Lovely Professional', course: 'BBA', status: 'Visa Approved', date: '2025-01-12', engagement: 92, risk: 'Low', lastLogin: '1d ago' },
  { id: 'ZII-2025-1003', name: 'Peter Zulu', uni: 'Chandigarh University', course: 'MBA', status: 'Application Review', date: '2025-01-18', engagement: 45, risk: 'Medium', lastLogin: '5d ago' },
  { id: 'ZII-2025-1004', name: 'Sarah Lungu', uni: 'CT University', course: 'B.Sc Nursing', status: 'Offer Accepted', date: '2025-01-10', engagement: 78, risk: 'Low', lastLogin: '3h ago' },
  { id: 'ZII-2025-1005', name: 'David Mumba', uni: 'Sharda University', course: 'Civil Eng', status: 'Rejected', date: '2025-01-05', engagement: 12, risk: 'High', lastLogin: '2w ago' },
  { id: 'ZII-2025-1006', name: 'Grace Mulenga', uni: 'CT University', course: 'Pharmacy', status: 'Travelled', date: '2024-12-20', engagement: 95, risk: 'Low', lastLogin: '1h ago' },
  { id: 'ZII-2025-1007', name: 'Joseph Tembo', uni: 'Amity University', course: 'B.Com', status: 'Visa Pending', date: '2025-01-14', engagement: 60, risk: 'Medium', lastLogin: '3d ago' },
  { id: 'ZII-2025-1008', name: 'Esther Sakala', uni: 'CT University', course: 'Medicine', status: 'Enrolled', date: '2024-08-15', engagement: 88, risk: 'Low', lastLogin: '4h ago' },
  { id: 'ZII-2025-1009', name: 'Brian Chanda', uni: 'SRM University', course: 'B.Arch', status: 'New', date: '2025-01-19', engagement: 30, risk: 'High', lastLogin: 'Never' },
  { id: 'ZII-2025-1010', name: 'Catherine Mwape', uni: 'CT University', course: 'Law', status: 'Scholarship Check', date: '2025-01-19', engagement: 70, risk: 'Low', lastLogin: '12h ago' },
];

const SIDEBAR_SECTIONS = [
  { group: 'Core Operations', items: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart2 },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'pipeline', label: 'Applications Pipeline', icon: Activity },
    { id: 'waiting_room', label: 'Waiting Room Monitor', icon: Clock },
  ]},
  { group: 'Financials', items: [
    { id: 'revenue', label: 'Revenue & Cashflow', icon: DollarSign },
    { id: 'forecast', label: 'Revenue Forecast', icon: TrendingUp },
  ]},
  { group: 'University & Offers', items: [
    { id: 'partners', label: 'Universities & Partners', icon: Database },
    { id: 'offers', label: 'Offer Letters', icon: Mail },
    { id: 'acceptance', label: 'Acceptance Letters', icon: CheckCircle },
    { id: 'scholarships', label: 'Scholarships Engine', icon: DollarSign },
  ]},
  { group: 'Visa & Travel', items: [
    { id: 'visa', label: 'Visa Processing', icon: Shield },
    { id: 'travel', label: 'Travel Readiness', icon: Plane },
    { id: 'enrolled', label: 'Enrolled Students', icon: Database },
    { id: 'alumni', label: 'Alumni Records', icon: Users },
  ]},
  { group: 'Communication', items: [
    { id: 'call_agent', label: 'Call Agent Control', icon: Phone },
    { id: 'live_calls', label: 'Live Calls & Logs', icon: Activity },
    { id: 'escalation', label: 'Escalations & Queue', icon: AlertTriangle },
    { id: 'notifications', label: 'Notifications Hub', icon: Bell },
  ]},
  { group: 'System & Control', items: [
    { id: 'integrations', label: 'System Integrations', icon: Link }, // NEW
    { id: 'verification', label: 'Documents Verification', icon: FileText },
    { id: 'knowledge', label: 'Knowledge Base', icon: Info },
    { id: 'cms', label: 'CMS & Blog', icon: LayoutDashboard },
    { id: 'automation', label: 'Automation Rules', icon: Zap },
    { id: 'tasks', label: 'Task Manager', icon: CheckCircle },
    { id: 'fraud', label: 'Fraud & Risk', icon: Lock },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'emergency', label: 'Emergency Controls', icon: AlertTriangle, danger: true },
  ]}
];

// --- COMPONENTS ---

const IntegrationsPanel = () => {
  const [configs, setConfigs] = useState(integrationService.getConfigs());
  const [activeTab, setActiveTab] = useState('sms');
  const [testStatus, setTestStatus] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'sms', label: 'SMS Gateway', icon: MessageSquare },
    { id: 'whatsapp', label: 'WhatsApp API', icon: MessageSquare },
    { id: 'email', label: 'Email Service', icon: Mail },
    { id: 'voice', label: 'Voice / Calls', icon: Phone },
    { id: 'maps', label: 'Maps & Location', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'storage', label: 'File Storage', icon: Database },
    { id: 'ai', label: 'AI Automation', icon: Zap },
  ];

  const activeConfig = configs.find(c => c.type === activeTab);

  const handleUpdate = (updates: any) => {
    if (!activeConfig) return;
    integrationService.updateConfig(activeConfig.id, updates);
    setConfigs(integrationService.getConfigs()); // Refresh local state
  };

  const handleTest = async () => {
    setTestStatus({ type: 'loading', msg: 'Testing connection...' });
    const result = await integrationService.testConnection(activeTab);
    setTestStatus({ type: result.success ? 'success' : 'error', msg: result.message });
    setTimeout(() => setTestStatus(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2 overflow-x-auto md:overflow-x-visible flex md:block">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-4 hidden md:block">Integration Hub</h3>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setTestStatus(null); }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition whitespace-nowrap md:whitespace-normal ${activeTab === tab.id ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400'}`}/>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Configuration Area */}
      <div className="flex-1 p-8">
        {activeConfig ? (
          <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "w-6 h-6 mr-3 text-emerald-600" })}
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-bold uppercase ${activeConfig.enabled ? 'text-green-600' : 'text-slate-400'}`}>{activeConfig.enabled ? 'Enabled' : 'Disabled'}</span>
                <button 
                  onClick={() => handleUpdate({ enabled: !activeConfig.enabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${activeConfig.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${activeConfig.enabled ? 'translate-x-6' : ''}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Service Provider</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-medium"
                  value={activeConfig.provider}
                  onChange={(e) => handleUpdate({ provider: e.target.value })}
                >
                  {activeTab === 'sms' && <>
                    <option value="twilio">Twilio</option>
                    <option value="africastalking">Africa's Talking</option>
                    <option value="termii">Termii</option>
                  </>}
                  {activeTab === 'whatsapp' && <>
                    <option value="meta">Meta Cloud API</option>
                    <option value="twilio">Twilio</option>
                  </>}
                  {activeTab === 'email' && <>
                    <option value="sendgrid">SendGrid</option>
                    <option value="ses">Amazon SES</option>
                  </>}
                  {activeTab === 'voice' && <>
                    <option value="elevenlabs">ElevenLabs</option>
                    <option value="twilio">Twilio Voice</option>
                  </>}
                  {activeTab === 'maps' && <option value="google_maps">Google Maps Platform</option>}
                  {activeTab === 'analytics' && <option value="ga4">Google Analytics 4</option>}
                  {activeTab === 'storage' && <option value="aws_s3">Amazon S3</option>}
                  {activeTab === 'ai' && <option value="openai">OpenAI</option>}
                </select>
              </div>

              {/* Environment */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Environment Mode</label>
                <div className="flex bg-slate-100 p-1 rounded-xl w-max">
                  <button 
                    onClick={() => handleUpdate({ environment: 'sandbox' })}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeConfig.environment === 'sandbox' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                  >
                    Sandbox / Test
                  </button>
                  <button 
                    onClick={() => handleUpdate({ environment: 'production' })}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeConfig.environment === 'production' ? 'bg-red-100 text-red-700' : 'text-slate-500'}`}
                  >
                    Live Production
                  </button>
                </div>
              </div>

              {/* API Keys */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">API Key / Token</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>
                  <input 
                    type="password" 
                    placeholder="sk_live_..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
                    value={activeConfig.apiKey}
                    onChange={(e) => handleUpdate({ apiKey: e.target.value })}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Keys are encrypted at rest using AES-256.</p>
              </div>

              {/* Webhook (Read Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Webhook Callback URL</label>
                <div className="flex items-center space-x-2">
                  <code className="bg-slate-100 text-slate-600 px-4 py-3 rounded-xl text-xs font-mono flex-1 border border-slate-200 overflow-x-auto">
                    https://api.zambiansinindia.com/v1/webhooks/{activeTab}/{activeConfig.environment}
                  </code>
                  <button className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 flex-shrink-0"><Link className="w-4 h-4 text-slate-600"/></button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center space-x-4">
                <button 
                  onClick={handleTest}
                  disabled={!activeConfig.enabled}
                  className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCcw className={`w-4 h-4 mr-2 ${testStatus?.type === 'loading' ? 'animate-spin' : ''}`}/> 
                  Test Connection
                </button>
                {testStatus && (
                  <span className={`text-sm font-bold ${testStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {testStatus.msg}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Settings className="w-12 h-12 mb-4 opacity-50"/>
            <p>Select an integration to configure</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ metric: any, onClick: () => void, onInfo: (e: any) => void }> = ({ metric, onClick, onInfo }) => (
  <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${metric.color}`}>
      <metric.icon className="w-16 h-16" />
    </div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
        <metric.icon className="w-6 h-6" />
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onInfo(metric); }}
        className="text-slate-300 hover:text-slate-500 transition"
      >
        <Info className="w-5 h-5" />
      </button>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{metric.title}</h3>
      <div className="flex items-end space-x-2">
        <span className="text-3xl font-extrabold text-slate-800">{metric.count}</span>
        <span className={`text-xs font-bold mb-1 ${metric.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
          {metric.trend}
        </span>
      </div>
    </div>
  </div>
);

const DataTable = ({ title, data, onViewProfile }: { title: string, data: any[], onViewProfile: (student: any) => void }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
      <div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500">Real-time data snapshot</p>
      </div>
      <div className="flex gap-2">
         <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><Filter className="w-4 h-4"/></button>
         <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><Download className="w-4 h-4"/></button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">ID</th>
            <th className="px-6 py-4 whitespace-nowrap">Name</th>
            <th className="px-6 py-4 whitespace-nowrap">University</th>
            <th className="px-6 py-4 whitespace-nowrap">Course</th>
            <th className="px-6 py-4 whitespace-nowrap">Status</th>
            <th className="px-6 py-4 whitespace-nowrap">Date</th>
            <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => onViewProfile(student)}>
              <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400 whitespace-nowrap">{student.id}</td>
              <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{student.uni}</td>
              <td className="px-6 py-4 whitespace-nowrap">{student.course}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                  ${student.status.includes('Accepted') || student.status.includes('Approved') || student.status.includes('Enrolled') ? 'bg-emerald-100 text-emerald-700' : ''}
                  ${student.status.includes('Rejected') ? 'bg-red-100 text-red-700' : ''}
                  ${student.status.includes('Pending') || student.status.includes('Review') || student.status.includes('New') ? 'bg-orange-100 text-orange-700' : ''}
                  ${student.status.includes('Offer Issued') ? 'bg-blue-100 text-blue-700' : ''}
                `}>
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs whitespace-nowrap">{student.date}</td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <button 
                  onClick={(e) => { e.stopPropagation(); onViewProfile(student); }}
                  className="text-emerald-600 hover:text-emerald-800 font-bold text-xs"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-4 border-t border-slate-100 text-center">
      <button className="text-xs font-bold text-slate-500 hover:text-slate-800">Load More Records</button>
    </div>
  </div>
);

const StudentProfilePanel = ({ student, onClose }: { student: any, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('application');

  if (!student) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto animate-slide-left">
       <div className="sticky top-0 bg-white/90 backdrop-blur z-10 border-b border-slate-100">
          <div className="p-6 flex justify-between items-start">
             <div>
                <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                <div className="flex items-center space-x-2 mt-2">
                   <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">{student.id}</span>
                   <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{student.status}</span>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
          </div>
          <div className="px-6 flex space-x-6 overflow-x-auto">
             {['Application', 'Academic', 'Documents', 'Waiting Room', 'Offers', 'Visa'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition ${activeTab === tab.toLowerCase() ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                   {tab}
                </button>
             ))}
          </div>
       </div>

       <div className="p-8">
          {activeTab === 'application' && (
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                      <p className="font-medium text-slate-800">student@example.com</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                      <p className="font-medium text-slate-800">+260 762 523 854</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Target University</label>
                      <p className="font-medium text-slate-800">{student.uni}</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Course</label>
                      <p className="font-medium text-slate-800">{student.course}</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Submission Date</label>
                      <p className="font-medium text-slate-800">{student.date}</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Assigned Agent</label>
                      <p className="font-medium text-slate-800">System Auto-Assign</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Engagement Score</label>
                      <div className="flex items-center mt-1">
                        <span className="font-bold text-slate-800 mr-2">{student.engagement || 0}/100</span>
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${student.engagement > 70 ? 'bg-green-500' : student.engagement > 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${student.engagement || 0}%` }}></div>
                        </div>
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Dropout Risk</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            student.risk === 'High' ? 'bg-red-100 text-red-600' : 
                            student.risk === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                            'bg-green-100 text-green-600'
                        }`}>
                            {student.risk || 'Unknown'}
                        </span>
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Last Login</label>
                      <p className="font-medium text-slate-800">{student.lastLogin || 'N/A'}</p>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <h4 className="font-bold text-slate-800 mb-2">Admin Actions</h4>
                   <div className="flex space-x-3">
                      <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-700">Approve Application</button>
                      <button className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-xs font-bold hover:bg-red-200">Reject</button>
                   </div>
                </div>
             </div>
          )}
          {/* Placeholder for other tabs */}
          {activeTab !== 'application' && (
             <div className="text-center py-12">
                <Database className="w-12 h-12 text-slate-200 mx-auto mb-4"/>
                <p className="text-slate-500 font-bold">Data currently unavailable in demo mode.</p>
                <p className="text-xs text-slate-400">Database connection required.</p>
             </div>
          )}
       </div>
    </div>
  );
};

// --- REVENUE & FORECAST COMPONENTS ---

const RevenuePanel = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('zii_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      // Add some mock data if empty
      const mocks = [
        { id: 'ZYN-1001', studentName: 'John Phiri', service: 'Application Fee', amount: 150, currency: 'ZMW', date: '2025-01-15', status: 'Success' },
        { id: 'ZYN-1002', studentName: 'Mary Banda', service: 'Visa Assist', amount: 250, currency: 'ZMW', date: '2025-01-16', status: 'Success' },
        { id: 'ZYN-1003', studentName: 'Peter Zulu', service: 'Premium Fast Track', amount: 750, currency: 'ZMW', date: '2025-01-18', status: 'Success' },
      ];
      setTransactions(mocks);
    }
  }, []);

  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Group by service for "Category" chart
  const byCategory = transactions.reduce((acc: any, curr) => {
    acc[curr.service] = (acc[curr.service] || 0) + curr.amount;
    return acc;
  }, {});

  const maxCat = Math.max(...Object.values(byCategory).map((v: any) => v), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Total Revenue (YTD)</h3>
          <div className="text-3xl font-extrabold text-slate-900">ZMW {totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-green-600 font-bold mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12% vs last month</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Pending Payments</h3>
          <div className="text-3xl font-extrabold text-slate-900">ZMW 4,250</div>
          <div className="text-xs text-orange-500 font-bold mt-1">7 invoices outstanding</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Avg. Transaction</h3>
          <div className="text-3xl font-extrabold text-slate-900">ZMW 320</div>
          <div className="text-xs text-slate-400 font-bold mt-1">Based on {transactions.length} transactions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Recent Transactions</h3>
          <div className="overflow-y-auto max-h-80 space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <DollarSign className="w-5 h-5"/>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tx.studentName}</p>
                    <p className="text-xs text-slate-500">{tx.service} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">+{tx.currency} {tx.amount.toLocaleString()}</p>
                  <p className="text-[10px] uppercase font-bold text-green-600">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Revenue by Service</h3>
          <div className="space-y-4">
            {Object.entries(byCategory).map(([cat, amount]: [string, any]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">{cat}</span>
                  <span className="text-slate-900">ZMW {amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(amount / maxCat) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ForecastPanel = () => {
  const [conversionRate, setConversionRate] = useState(15);
  const [traffic, setTraffic] = useState(5000);
  const [avgValue, setAvgValue] = useState(350);

  const projectedRevenue = (traffic * (conversionRate / 100)) * avgValue;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Revenue Forecast Simulator</h2>
        <p className="text-slate-500">Project future earnings based on adjustable variables.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span>Monthly Traffic</span>
              <span className="text-blue-600">{traffic.toLocaleString()} visitors</span>
            </label>
            <input 
              type="range" min="1000" max="50000" step="1000" 
              value={traffic} onChange={(e) => setTraffic(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span>Conversion Rate (Paid)</span>
              <span className="text-green-600">{conversionRate}%</span>
            </label>
            <input 
              type="range" min="1" max="50" step="1" 
              value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span>Avg. Transaction Value</span>
              <span className="text-orange-600">ZMW {avgValue}</span>
            </label>
            <input 
              type="range" min="50" max="2000" step="50" 
              value={avgValue} onChange={(e) => setAvgValue(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-2xl flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <p className="text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">Projected Monthly Revenue</p>
           <h3 className="text-5xl font-extrabold text-green-400 mb-4 relative z-10">ZMW {projectedRevenue.toLocaleString()}</h3>
           <p className="text-sm text-slate-400 relative z-10">
             Based on {traffic.toLocaleString()} visitors converting at {conversionRate}%.
           </p>
           <button className="mt-8 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition relative z-10">
             Export Report
           </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState<any | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<any | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile initial load
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  // --- RENDER FUNCTIONS ---

  const renderDashboardGrid = () => (
    <>
      <div className="mb-8">
         <h2 className="text-2xl font-bold text-slate-900">Executive Overview</h2>
         <p className="text-slate-500">Real-time system performance metrics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {METRICS_DATA.map((metric) => (
          <MetricCard 
            key={metric.id} 
            metric={metric} 
            onClick={() => { setActiveView('detail'); setSelectedMetric(metric); }}
            onInfo={setShowInfoModal}
          />
        ))}
      </div>
      
      {/* Visual Pipeline */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
         <h3 className="font-bold text-slate-800 mb-6">Application Pipeline Flow</h3>
         <div className="flex flex-col md:flex-row justify-between items-center relative gap-6 md:gap-0">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-0 hidden md:block"></div>
            {['Visitors', 'Started', 'Completed', 'Offers', 'Visas', 'Enrolled'].map((stage, idx) => (
               <div key={stage} className="relative z-10 flex flex-col items-center group cursor-pointer w-full md:w-auto">
                  <div className="w-10 h-10 rounded-full bg-white border-4 border-emerald-500 shadow-md flex items-center justify-center font-bold text-emerald-700 group-hover:scale-110 transition">
                     {idx + 1}
                  </div>
                  <span className="mt-2 text-xs font-bold text-slate-600 uppercase bg-white px-2">{stage}</span>
               </div>
            ))}
         </div>
      </div>
    </>
  );

  const renderDetailView = () => (
     <div>
        <button onClick={() => setActiveView('dashboard')} className="mb-6 flex items-center text-slate-500 hover:text-slate-800 text-sm font-bold">
           <ChevronRight className="w-4 h-4 rotate-180 mr-1"/> Back to Dashboard
        </button>
        <DataTable 
           title={selectedMetric?.title || 'Data View'} 
           data={MOCK_STUDENTS}
           onViewProfile={setSelectedStudent}
        />
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform transition-transform duration-300 z-30 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}>
         <div className="p-6 border-b border-slate-800 flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-1.5 rounded-lg shadow-lg shadow-orange-500/50">
                   <Shield className="w-6 h-6 text-white"/>
                </div>
                <div>
                   <h1 className="font-extrabold text-lg tracking-tight">ZII ADMIN</h1>
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest">Super Admin</p>
                </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X className="w-5 h-5"/></button>
         </div>

         <div className="p-4 space-y-8">
            {SIDEBAR_SECTIONS.map((section) => (
               <div key={section.group}>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">{section.group}</h4>
                  <div className="space-y-1">
                     {section.items.map((item: any) => (
                        <button 
                           key={item.id}
                           onClick={() => {
                             setActiveView(item.id === 'dashboard' ? 'dashboard' : item.id);
                             if (window.innerWidth < 1024) setSidebarOpen(false);
                           }}
                           className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.danger ? 'text-red-400 hover:bg-red-900/20' : (activeView === item.id ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white')}`}
                        >
                           <item.icon className="w-4 h-4 opacity-70"/>
                           <span>{item.label}</span>
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>
         
         <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
            <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-600 text-white py-2 rounded-lg transition text-sm font-bold">
               <LogOut className="w-4 h-4"/> <span>Logout</span>
            </button>
         </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
         {/* Top Header */}
         <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center">
               <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 lg:hidden text-slate-500 hover:bg-slate-100 rounded-lg">
                  <Menu className="w-6 h-6"/>
               </button>
               <div className="relative hidden md:block w-96">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"/>
                  <input type="text" placeholder="Search student by name, ZII ID or university..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
               </div>
            </div>
            
            <div className="flex items-center space-x-4">
               <div className="hidden sm:flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div> System Online
               </div>
               <button className="relative p-2 text-slate-400 hover:text-slate-600 transition">
                  <Bell className="w-6 h-6"/>
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:bg-orange-500 transition">
                  SA
               </div>
            </div>
         </header>

         {/* Content Area */}
         <div className="flex-1 overflow-auto p-4 lg:p-8">
            {activeView === 'dashboard' ? renderDashboardGrid() : 
             activeView === 'integrations' ? <IntegrationsPanel /> : 
             activeView === 'revenue' ? <RevenuePanel /> :
             activeView === 'forecast' ? <ForecastPanel /> :
             activeView === 'detail' ? renderDetailView() : 
             <div className="text-center text-slate-400 py-20 font-bold">Module Under Development</div>}
         </div>
      </main>

      {/* INFO POPUP MODAL */}
      {showInfoModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
               <button onClick={() => setShowInfoModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
               <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-4 ${showInfoModal.bg} ${showInfoModal.color}`}>
                     <showInfoModal.icon className="w-6 h-6"/>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-900">{showInfoModal.title}</h3>
                     <p className="text-xs font-bold text-slate-500 uppercase">Metric Definition</p>
                  </div>
               </div>
               <div className="space-y-4 text-sm text-slate-600">
                  <p><strong>Definition:</strong> {showInfoModal.description}</p>
                  <p><strong>Calculation:</strong> Real-time aggregation of database records with status flag matching "{showInfoModal.viewId}".</p>
                  <p><strong>Admin Action:</strong> Click the card to view detailed records, export data, or batch process items.</p>
               </div>
               <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button onClick={() => setShowInfoModal(null)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800">Got it</button>
               </div>
            </div>
         </div>
      )}

      {/* STUDENT SIDE PANEL */}
      {selectedStudent && (
         <StudentProfilePanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
