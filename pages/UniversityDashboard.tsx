
import React, { useState, useEffect } from 'react';
import { 
  Building, Users, Mail, CheckCircle, DollarSign, Plane, 
  User, LayoutDashboard, FileText, BarChart, Bell, Settings, 
  LogOut, Upload, Search, Download, AlertTriangle, Shield, 
  MessageSquare, Menu, X, Filter, ChevronRight, Briefcase, 
  Globe, Megaphone, Target, Video, Phone, Star, MapPin, Clock,
  Calendar, TrendingUp
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { auth, db } from '../src/firebase';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy,
  getDoc
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../src/utils/firestoreUtils';
import UniversityProfilePanel from '../src/university-dashboard/UniversityProfilePanel';
import StudentApplicationsTable from '../src/university-dashboard/StudentApplicationsTable';
import RecruitmentFunnelChart from '../src/university-dashboard/RecruitmentFunnelChart';
import LeadsManagement from '../src/university-dashboard/LeadsManagement';
import MarketingHub from '../src/university-dashboard/MarketingHub';
import SupportCenter from '../src/university-dashboard/SupportCenter';

interface UniversityDashboardProps {
  onLogout: () => void;
}

// --- MOCK DATA FOR ISOLATION ---
const UNI_ID = "UNI-001"; // Represents "CT University"
const UNI_NAME = "CT University";

const UNI_METRICS = [
  { id: 1, title: 'Total Leads Uploaded', count: '120', bg: 'bg-blue-50', color: 'text-blue-600', icon: Upload },
  { id: 2, title: 'Leads Assigned by ZII', count: '450', bg: 'bg-emerald-50', color: 'text-emerald-600', icon: Users },
  { id: 3, title: 'Active Applications', count: '310', bg: 'bg-orange-50', color: 'text-orange-600', icon: FileText },
  { id: 4, title: 'Offer Letters Issued', count: '280', bg: 'bg-purple-50', color: 'text-purple-600', icon: Mail },
  { id: 5, title: 'Accepted Offers', count: '210', bg: 'bg-green-50', color: 'text-green-600', icon: CheckCircle },
  { id: 6, title: 'Reg Fees Paid', count: '185', bg: 'bg-teal-50', color: 'text-teal-600', icon: DollarSign },
  { id: 7, title: 'Offers Declined', count: '15', bg: 'bg-red-50', color: 'text-red-600', icon: X },
  { id: 8, title: 'Visas Submitted', count: '150', bg: 'bg-indigo-50', color: 'text-indigo-600', icon: Shield },
  { id: 9, title: 'Visas Approved', count: '140', bg: 'bg-green-100', color: 'text-green-700', icon: CheckCircle },
  { id: 10, title: 'Visas Rejected', count: '5', bg: 'bg-red-100', color: 'text-red-700', icon: AlertTriangle },
  { id: 11, title: 'Confirmed Arrival', count: '120', bg: 'bg-yellow-50', color: 'text-yellow-600', icon: Plane },
  { id: 12, title: 'Arrived in India', count: '110', bg: 'bg-blue-100', color: 'text-blue-800', icon: MapPin },
  { id: 13, title: 'Enrolled Students', count: '300', bg: 'bg-slate-100', color: 'text-slate-800', icon: Building },
  { id: 14, title: 'Deferred', count: '20', bg: 'bg-gray-50', color: 'text-gray-600', icon: Clock },
  { id: 15, title: 'Conversion Rate', count: '68%', bg: 'bg-emerald-100', color: 'text-emerald-800', icon: BarChart },
];

const MOCK_STUDENTS = [
  { id: 'ZII-2025-5001', name: 'James Banda', course: 'B.Tech CSE', status: 'Offer Accepted', stage: 'Visa', uploadedBy: 'ZII' },
  { id: 'ZII-2025-5002', name: 'Sarah Phiri', course: 'BBA', status: 'New Lead', stage: 'Application', uploadedBy: 'Uni' },
  { id: 'ZII-2025-5003', name: 'Moses Zulu', course: 'MBA', status: 'Visa Approved', stage: 'Travel', uploadedBy: 'ZII' },
  { id: 'ZII-2025-5004', name: 'Esther Lungu', course: 'B.Pharm', status: 'Enrolled', stage: 'Enrolled', uploadedBy: 'Uni' },
  { id: 'ZII-2025-5005', name: 'John Tembo', course: 'B.Sc Nursing', status: 'Offer Issued', stage: 'Offer', uploadedBy: 'ZII' },
];

const MARKETING_STRATEGIES = [
  { id: 1, title: "Joint Scholarship Webinars", status: "Active", impact: "High" },
  { id: 2, title: "Virtual Campus Tours", status: "Scheduled", impact: "Medium" },
  { id: 3, title: "Alumni Ambassador Program", status: "Active", impact: "High" },
  { id: 4, title: "Career Guidance Sessions", status: "Planning", impact: "High" },
  { id: 5, title: "WhatsApp Info Sessions", status: "Active", impact: "Medium" },
  { id: 6, title: "University Spotlight Week", status: "Completed", impact: "High" },
  { id: 7, title: "Province Outreach", status: "Planning", impact: "Medium" },
  { id: 8, title: "Parent Seminars", status: "Active", impact: "High" },
  { id: 9, title: "Grade 12 Results Campaign", status: "Pending", impact: "High" },
  { id: 10, title: "Early Bird Incentives", status: "Active", impact: "Medium" },
  { id: 11, title: "Co-branded Digital Flyers", status: "Active", impact: "Low" },
  { id: 12, title: "Radio Mentions", status: "Active", impact: "Medium" },
  { id: 13, title: "Waiting Room Promo", status: "Active", impact: "Medium" },
  { id: 14, title: "Alumni Success Stories", status: "Active", impact: "High" },
  { id: 15, title: "Intake Countdown", status: "Scheduled", impact: "High" },
];

const UniversityDashboard: React.FC<UniversityDashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'students' | 'leads' | 'marketing' | 'settings' | 'exhibition'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Real Data State
  const [universityProfile, setUniversityProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentService, setPaymentService] = useState<{name: string, amount: number} | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // 1. Listen to University Profile
    const profilePath = `universities/${user.uid}`;
    const unsubscribeProfile = onSnapshot(doc(db, 'universities', user.uid), (doc) => {
      if (doc.exists()) {
        setUniversityProfile({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    }, (error) => {
      console.error("Profile listener error:", error);
      handleFirestoreError(error, OperationType.GET, profilePath);
      setLoading(false);
    });

    // 2. Listen to Student Applications
    // Note: We check both universityId and university_id in the rules, 
    // but here we query by universityId as it's the primary field used in the dashboard
    const appsPath = 'applications';
    const q = query(
      collection(db, 'applications'), 
      where('universityId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeApps = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        studentName: doc.data().studentName || 'Unknown Student',
        course: doc.data().course || 'N/A',
        status: doc.data().status || 'New',
        stage: doc.data().stage || 'Application'
      }));
      setApplications(apps);
    }, (error) => {
      console.error("Applications listener error:", error);
      handleFirestoreError(error, OperationType.LIST, appsPath);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeApps();
    };
  }, []);

  // Derived Metrics
  const metrics = [
    { id: 1, title: 'Total Leads', count: applications.length.toString(), bg: 'bg-blue-50', color: 'text-blue-600', icon: Upload },
    { id: 2, title: 'Active Apps', count: applications.filter(a => a.status !== 'Enrolled' && a.status !== 'Rejected').length.toString(), bg: 'bg-orange-50', color: 'text-orange-600', icon: FileText },
    { id: 3, title: 'Offers Issued', count: applications.filter(a => a.status === 'Offer Issued').length.toString(), bg: 'bg-purple-50', color: 'text-purple-600', icon: Mail },
    { id: 4, title: 'Enrolled', count: applications.filter(a => a.status === 'Enrolled').length.toString(), bg: 'bg-slate-100', color: 'text-slate-800', icon: Building },
    { id: 5, title: 'Conversion', count: applications.length > 0 ? `${Math.round((applications.filter(a => a.status === 'Enrolled').length / applications.length) * 100)}%` : '0%', bg: 'bg-emerald-100', color: 'text-emerald-800', icon: BarChart },
  ];

  const funnelData = [
    { name: 'Leads', value: applications.length, color: '#3b82f6' },
    { name: 'Offers', value: applications.filter(a => ['Offer Issued', 'Offer Accepted', 'Enrolled'].includes(a.status)).length, color: '#8b5cf6' },
    { name: 'Accepted', value: applications.filter(a => ['Offer Accepted', 'Enrolled'].includes(a.status)).length, color: '#10b981' },
    { name: 'Enrolled', value: applications.filter(a => a.status === 'Enrolled').length, color: '#0f172a' },
  ];

  const handlePaymentSuccess = (tid: string) => {
    setPaymentModalOpen(false);
    alert(`Payment Successful! Transaction ID: ${tid}. Your exhibition slot is confirmed.`);
  };

  const SidebarItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => { setCurrentView(id); setSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${
        currentView === id 
          ? 'bg-emerald-800 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="bg-emerald-900 p-2 rounded-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{universityProfile?.universityName || 'University'}</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Partner Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-2 hover:bg-slate-50 rounded-full"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)]">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
          <SidebarItem id="overview" label="Dashboard" icon={LayoutDashboard} />
          <SidebarItem id="students" label="Student List" icon={Users} />
          <SidebarItem id="leads" label="Lead Management" icon={Filter} />
          <SidebarItem id="marketing" label="Marketing & Campaigns" icon={Megaphone} />
          <SidebarItem id="exhibition" label="Exhibition Booking" icon={Calendar} />
          <SidebarItem id="support" label="Support Center" icon={MessageSquare} />
          
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Admissions</p>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-800 transition">
             <Mail className="w-5 h-5" /> <span>Offer Letters</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-800 transition">
             <Shield className="w-5 h-5" /> <span>Visa Status</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-800 transition">
             <Plane className="w-5 h-5" /> <span>Arrivals</span>
          </button>

          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Support</p>
          <button 
            onClick={() => window.dispatchEvent(new Event('open-chat-bot'))}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-800 transition"
          >
             <MessageSquare className="w-5 h-5" /> <span>ZII Consultant</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100 bg-white">
          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 py-3 rounded-xl font-bold transition">
            <LogOut className="w-4 h-4" /> <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-72 min-w-0">
        
        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 p-2 hover:bg-slate-100 rounded-full">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
              {currentView === 'overview' && 'University Overview'}
              {currentView === 'students' && 'Enrolled & Active Students'}
              {currentView === 'leads' && 'Lead Management'}
              {currentView === 'marketing' && 'Marketing Hub'}
              {currentView === 'exhibition' && 'Virtual Exhibition'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 items-center">
               <Star className="w-3 h-3 mr-1 fill-current"/> Gold Partner
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-xs">
              {universityProfile?.universityName?.substring(0, 2).toUpperCase() || 'UN'}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-4 lg:p-8 space-y-8 overflow-x-hidden">
          
          {/* OVERVIEW DASHBOARD */}
          {currentView === 'overview' && (
            <div className="animate-fade-in-up space-y-8">
              {/* Profile Summary */}
              <UniversityProfilePanel profile={universityProfile} />

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-lg transition cursor-pointer group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition ${metric.color}`}>
                      <metric.icon className="w-12 h-12" />
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${metric.bg} ${metric.color}`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wide mb-1">{metric.title}</p>
                    <p className="text-2xl font-extrabold text-slate-800">{metric.count}</p>
                  </div>
                ))}
              </div>

              {/* Charts & Funnel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecruitmentFunnelChart data={funnelData} />
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-6 text-lg">Pipeline Status</h3>
                  <div className="space-y-4">
                    {['Lead', 'Application', 'Offer Letter', 'Acceptance', 'Visa', 'Arrival', 'Enrolled'].map((step, i) => {
                      const count = applications.filter(a => a.stage === step).length;
                      const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0;
                      return (
                        <div key={step} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                            <span>{step}</span>
                            <span>{count} Students</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-1000" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity Table (Preview) */}
              <StudentApplicationsTable applications={applications.slice(0, 5)} />
            </div>
          )}

          {/* STUDENTS LIST VIEW */}
          {currentView === 'students' && (
             <div className="animate-fade-in-up">
                <StudentApplicationsTable applications={applications} />
             </div>
          )}

          {/* MARKETING VIEW */}
          {currentView === 'marketing' && (
             <MarketingHub universityProfile={universityProfile} />
          )}

          {/* LEADS MANAGEMENT VIEW */}
          {currentView === 'leads' && (
             <LeadsManagement />
          )}

          {/* EXHIBITION VIEW */}
          {currentView === 'exhibition' && (
            <div className="animate-fade-in-up">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
                    <h2 className="text-3xl font-extrabold mb-2">Virtual Education Fair 2025</h2>
                    <p className="text-purple-100 mb-6">Secure your booth for the biggest Zambian student recruitment event.</p>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm text-center">
                            <p className="text-xs uppercase font-bold text-purple-200">Date</p>
                            <p className="text-xl font-bold">15-20 Aug</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm text-center">
                            <p className="text-xs uppercase font-bold text-purple-200">Expected</p>
                            <p className="text-xl font-bold">5,000+ Students</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-bl-xl">STANDARD</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Silver Booth</h3>
                        <p className="text-slate-500 text-sm mb-4">Standard listing + 1 Webinar slot.</p>
                        <p className="text-2xl font-extrabold text-slate-900 mb-6">$1,650</p>
                        <button 
                            onClick={() => { setPaymentService({ name: 'Silver Booth Exhibition', amount: 1650 * 25 }); setPaymentModalOpen(true); }}
                            className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-200"
                        >
                            Book Silver
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border-2 border-purple-500 shadow-xl transform scale-105 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Gold Booth</h3>
                        <p className="text-slate-500 text-sm mb-4">Featured listing + 3 Webinars + Email Blast.</p>
                        <p className="text-2xl font-extrabold text-slate-900 mb-6">$2,500</p>
                        <button 
                            onClick={() => { setPaymentService({ name: 'Gold Booth Exhibition', amount: 2500 * 25 }); setPaymentModalOpen(true); }}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg"
                        >
                            Book Gold
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">EXCLUSIVE</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Platinum Partner</h3>
                        <p className="text-slate-500 text-sm mb-4">Homepage Takeover + Unlimited Webinars.</p>
                        <p className="text-2xl font-extrabold text-slate-900 mb-6">$8,500</p>
                        <button 
                            onClick={() => { setPaymentService({ name: 'Platinum Exhibition', amount: 8500 * 25 }); setPaymentModalOpen(true); }}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
                        >
                            Book Platinum
                        </button>
                    </div>
                </div>
            </div>
          )}

          {/* SUPPORT VIEW */}
          {currentView === 'support' && (
             <SupportCenter />
          )}

        </div>
      </main>

      {/* PAYMENT MODAL */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        serviceName={paymentService?.name || ''}
        amount={paymentService?.amount || 0}
        currency="ZMW"
        onSuccess={handlePaymentSuccess}
        studentName={universityProfile?.universityName || 'University'}
        studentId={universityProfile?.university_id || ''}
      />
    </div>
  );
};

export default UniversityDashboard;
