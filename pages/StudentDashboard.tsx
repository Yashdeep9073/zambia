import React, { useState, useEffect } from 'react';
import { 
  Activity, FileText, CheckCircle, Mail, DollarSign, Plane, 
  User, Bell, Calendar, HelpCircle, Settings, Users, Download, 
  MessageSquare, LogOut, Clock, Target, BookOpen, Globe, MapPin, 
  Heart, FileCheck, BarChart, Award, CreditCard, Shield, Smartphone, 
  Gift, ChevronDown, ChevronUp, AlertTriangle, ExternalLink, Phone, 
  Video, Zap, Check, X, GraduationCap, Upload, Lock
} from 'lucide-react';
import { AppPhase, StudentProfile, PublicView } from '../types';

interface StudentDashboardProps {
  currentPhase: AppPhase;
  profile: StudentProfile;
  onNavigate?: (view: PublicView) => void;
  onResume?: (tab?: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ currentPhase, profile, onNavigate, onResume }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Application Update", message: "Your application is under review.", time: "2h ago", read: false },
    { id: 2, title: "Welcome", message: "Welcome to your student dashboard.", time: "1d ago", read: true },
  ]);

  // Calculate completion percentage based on phase
  const getProgress = () => {
    const totalStages = 10;
    let currentStage = 1;
    
    switch(currentPhase) {
      case AppPhase.MARKETING_LEAD: currentStage = 1; break;
      case AppPhase.APPLICATION_ENTRY: currentStage = 2; break;
      case AppPhase.OFFER_MANAGEMENT: currentStage = 3; break;
      case AppPhase.OFFER_LETTER: currentStage = 4; break;
      case AppPhase.PRE_DEPARTURE: currentStage = 5; break;
      case AppPhase.VISA_PROCESS: currentStage = 6; break;
      case AppPhase.TRAVEL_ARRIVAL: currentStage = 7; break;
      case AppPhase.SETTLEMENT: currentStage = 8; break;
      case AppPhase.COMMUNITY: currentStage = 9; break;
      case AppPhase.GRADUATION: currentStage = 10; break;
      default: currentStage = 1;
    }
    
    return (currentStage / totalStages) * 100;
  };

  const progress = getProgress();

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const scrollToSection = () => {
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  // --- SECTIONS ---

  const renderLifecycleTracker = () => {
    const stages = [
      { id: 1, label: "Start Here", phase: AppPhase.MARKETING_LEAD },
      { id: 2, label: "Application", phase: AppPhase.APPLICATION_ENTRY },
      { id: 3, label: "Waiting Room", phase: AppPhase.OFFER_MANAGEMENT },
      { id: 4, label: "Offer Letter", phase: AppPhase.OFFER_LETTER },
      { id: 5, label: "Pre-Departure", phase: AppPhase.PRE_DEPARTURE },
      { id: 6, label: "Visa Submitted", phase: AppPhase.VISA_PROCESS },
      { id: 7, label: "Travel", phase: AppPhase.TRAVEL_ARRIVAL },
      { id: 8, label: "Arrived", phase: AppPhase.SETTLEMENT },
      { id: 9, label: "Enrolled", phase: AppPhase.COMMUNITY },
      { id: 10, label: "Graduation", phase: AppPhase.GRADUATION },
    ];

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-x-auto">
        <div className="flex justify-between items-center min-w-[800px] relative">
            {/* Progress Bar Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-0"></div>
            {/* Active Progress Bar */}
            <div className="absolute top-1/2 left-0 h-1 bg-orange-500 -z-0 transition-all duration-1000" style={{ width: `${progress}%` }}></div>

            {stages.map((stage) => {
                const isActive = currentPhase === stage.phase;
                const isCompleted = currentPhase > stage.phase;
                
                return (
                    <div key={stage.id} className="relative z-10 flex flex-col items-center group cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-4 transition-all duration-300 ${
                            isActive ? 'bg-orange-500 text-white border-orange-200 scale-110 shadow-lg' : 
                            isCompleted ? 'bg-emerald-500 text-white border-emerald-200' : 
                            'bg-white text-slate-300 border-slate-200'
                        }`}>
                            {isCompleted ? <Check className="w-5 h-5"/> : stage.id}
                        </div>
                        <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                            isActive ? 'text-orange-600' : 
                            isCompleted ? 'text-emerald-600' : 
                            'text-slate-300'
                        }`}>
                            {stage.label}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>
    );
  };

  const renderResumeCard = () => (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10">
            <div className="inline-flex items-center bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-orange-500/30">
                <Zap className="w-3 h-3 mr-2" /> Action Required
            </div>
            <h2 className="text-3xl font-extrabold mb-2">Resume Your Application</h2>
            <p className="text-slate-400 mb-8 max-w-xl">
                You are currently at the <span className="text-white font-bold">{AppPhase[currentPhase].replace('_', ' ')}</span> stage. 
                Complete the pending tasks to unlock the next phase of your journey.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <button 
                    onClick={() => {
                        if (onResume) onResume();
                        scrollToSection();
                    }}
                    className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 flex items-center transform hover:-translate-y-1"
                >
                    Resume Now <ChevronDown className="w-5 h-5 ml-2" />
                </button>

                {/* Quick Navigation Icons */}
                <div className="flex gap-3 overflow-x-auto pb-2 max-w-full">
                    {[
                        { id: 'personal', icon: User, label: 'Personal' },
                        { id: 'academic', icon: GraduationCap, label: 'Academic' },
                        { id: 'uploads', icon: Upload, label: 'Uploads' },
                        { id: 'waiting', icon: Clock, label: 'Waiting Room', locked: currentPhase < AppPhase.OFFER_MANAGEMENT },
                    ].map((item) => (
                        <button 
                            key={item.id} 
                            disabled={item.locked}
                            onClick={() => {
                                if (onResume) onResume(item.id);
                                scrollToSection();
                            }}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition min-w-[80px] ${
                                item.locked 
                                ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed' 
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            }`}
                        >
                            {item.locked ? <Lock className="w-5 h-5 mb-1"/> : <item.icon className="w-5 h-5 mb-1"/>}
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderProfileSnapshot = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
        <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-slate-800 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-600"/> Profile Snapshot</h3>
            <button className="text-xs font-bold text-emerald-600 hover:underline">Update</button>
        </div>
        <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mr-4 border-2 border-slate-200">
                <User className="w-8 h-8" />
            </div>
            <div>
                <h4 className="font-bold text-slate-900">{profile.name || "Student Name"}</h4>
                <p className="text-xs text-slate-500 font-mono">{profile.studentNumber || "ZII-PENDING"}</p>
                <p className="text-xs text-emerald-600 font-bold mt-1">Verified Student</p>
            </div>
        </div>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Course</span>
                <span className="font-bold text-slate-800">{profile.programInterest || "Not Selected"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Passport</span>
                <span className="font-bold text-orange-500">Pending Upload</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Scholarship</span>
                <span className="font-bold text-slate-800">50% Eligible</span>
            </div>
        </div>
    </div>
  );

  const renderTasksPanel = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
        <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-slate-800 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-emerald-600"/> Pending Tasks</h3>
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">3 Due</span>
        </div>
        <div className="space-y-3">
            {[
                { label: "Complete Application Form", done: currentPhase > AppPhase.APPLICATION_ENTRY },
                { label: "Upload Grade 12 Results", done: profile.uploadedDocuments?.includes('results') },
                { label: "Take 'About India' Quiz", done: false },
                { label: "Upload Passport Copy", done: false },
                { label: "Pay Registration Fee", done: false },
            ].map((task, i) => (
                <div key={i} className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                        {task.done && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.label}</span>
                </div>
            ))}
        </div>
    </div>
  );

  const renderFinancialSnapshot = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-slate-800 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-emerald-600"/> Financial Estimate</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">Calculator</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Tuition (Year 1)</p>
                <p className="text-lg font-bold text-slate-900">$1,500</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Hostel & Food</p>
                <p className="text-lg font-bold text-slate-900">$2,000</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Visa & Flight</p>
                <p className="text-lg font-bold text-slate-900">$800</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Pocket Money</p>
                <p className="text-lg font-bold text-slate-900">$100/mo</p>
            </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
            <span className="text-sm font-bold text-emerald-800">Total Est. Budget</span>
            <span className="text-xl font-extrabold text-emerald-700">$4,300</span>
        </div>
    </div>
  );

  const renderDynamicModules = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
        {[
            { label: "Goal Tracker", icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Study Prep", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "India Guide", icon: Globe, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Campus Map", icon: MapPin, color: "text-green-500", bg: "bg-green-50" },
            { label: "Health Info", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
            { label: "Auto Letters", icon: FileCheck, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Analytics", icon: BarChart, color: "text-cyan-500", bg: "bg-cyan-50" },
            { label: "Mentorship", icon: Users, color: "text-teal-500", bg: "bg-teal-50" },
            { label: "Payments", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Downloads", icon: Download, color: "text-slate-500", bg: "bg-slate-50" },
            { label: "Security", icon: Shield, color: "text-gray-500", bg: "bg-gray-50" },
            { label: "Email Verify", icon: Mail, color: "text-yellow-500", bg: "bg-yellow-50" },
            { label: "Mobile Verify", icon: Smartphone, color: "text-pink-500", bg: "bg-pink-50" },
            { label: "Referrals", icon: Users, color: "text-violet-500", bg: "bg-violet-50" },
            { label: "Rewards", icon: Gift, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((module, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${module.bg} ${module.color} group-hover:scale-110 transition`}>
                    <module.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">{module.label}</span>
            </div>
        ))}
    </div>
  );

  return (
    <div className="bg-slate-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back, {profile.name?.split(' ')[0] || 'Student'}</h1>
                <p className="text-slate-500 font-medium">Let's continue your journey to studying in India.</p>
            </div>
            <div className="flex space-x-3">
                <button className="bg-white p-2 rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-emerald-600 relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-slate-800">Score: 85/100</span>
                </div>
            </div>
        </div>

        {/* LIFECYCLE TRACKER */}
        {renderLifecycleTracker()}

        {/* RESUME CARD */}
        {renderResumeCard()}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="space-y-8">
                {renderProfileSnapshot()}
                
                {/* NOTIFICATIONS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Bell className="w-5 h-5 mr-2 text-emerald-600"/> Notifications</h3>
                    <div className="space-y-4">
                        {notifications.map(n => (
                            <div key={n.id} className="flex items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${n.read ? 'bg-slate-300' : 'bg-orange-500'}`}></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{n.title}</p>
                                    <p className="text-xs text-slate-500">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DEADLINES */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-4 flex items-center"><Clock className="w-5 h-5 mr-2 text-orange-500"/> Upcoming Deadlines</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                            <span className="text-sm text-slate-300">Intake Closing</span>
                            <span className="font-bold text-orange-400">15 Days</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                            <span className="text-sm text-slate-300">Visa Submission</span>
                            <span className="font-bold text-white">20 Aug</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MIDDLE COLUMN */}
            <div className="space-y-8">
                {renderTasksPanel()}
                
                {/* OFFER STATUS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Mail className="w-5 h-5 mr-2 text-emerald-600"/> Offer Status</h3>
                    {currentPhase >= AppPhase.OFFER_LETTER ? (
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                            <h4 className="font-bold text-emerald-800">Offer Letter Available</h4>
                            <button className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700">View Offer</button>
                        </div>
                    ) : (
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                            <Clock className="w-10 h-10 text-orange-500 mx-auto mb-2 animate-pulse" />
                            <h4 className="font-bold text-orange-800">Under Review</h4>
                            <p className="text-xs text-orange-600 mt-1">Your application is being reviewed by partner universities.</p>
                        </div>
                    )}
                </div>

                {/* SCHOLARSHIP METER */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-emerald-600"/> Scholarship Probability</h3>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    High Chance
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-emerald-600">
                                    85%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
                            <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
                        </div>
                        <p className="text-xs text-slate-500">Complete the "About India" quiz to boost this score.</p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
                {renderFinancialSnapshot()}

                {/* DOCUMENT VAULT */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center"><FileText className="w-5 h-5 mr-2 text-emerald-600"/> Document Vault</h3>
                    <div className="space-y-2">
                        {['Grade 12 Results', 'NRC Copy', 'Passport Copy'].map((doc, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-xs font-bold text-slate-700">{doc}</span>
                                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded">
                                    {i === 0 ? 'Uploaded' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 border-2 border-dashed border-slate-300 text-slate-500 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 transition">
                        + Upload New Document
                    </button>
                </div>

                {/* LIVE SUPPORT */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-emerald-600"/> Live Support</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <button className="flex flex-col items-center justify-center p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition">
                            <Phone className="w-5 h-5 text-emerald-600 mb-1"/>
                            <span className="text-[10px] font-bold text-emerald-700">Call</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                            <MessageSquare className="w-5 h-5 text-blue-600 mb-1"/>
                            <span className="text-[10px] font-bold text-blue-700">Chat</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
                            <Smartphone className="w-5 h-5 text-green-600 mb-1"/>
                            <span className="text-[10px] font-bold text-green-700">WhatsApp</span>
                        </button>
                    </div>
                </div>

                {/* COMMUNITY */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="font-bold mb-2 flex items-center"><Users className="w-5 h-5 mr-2"/> ZII Community</h3>
                    <p className="text-xs text-indigo-100 mb-4">Join 5,000+ Zambian students in India.</p>
                    <button className="w-full bg-white/20 backdrop-blur-sm py-2 rounded-lg text-sm font-bold hover:bg-white/30 transition">
                        Join Community
                    </button>
                </div>
            </div>
        </div>

        {/* DYNAMIC MODULES */}
        {renderDynamicModules()}

        {/* ARRIVAL STATUS */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4">
                    <Plane className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Arrival Status</h3>
                    <p className="text-sm text-slate-500">Have you arrived in India?</p>
                </div>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition">
                Confirm Arrival
            </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;