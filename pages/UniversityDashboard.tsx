
import React, { useState } from 'react';
import { 
  Building, Users, Mail, CheckCircle, DollarSign, Plane, 
  User, LayoutDashboard, FileText, BarChart, Bell, Settings, 
  LogOut, Upload, Search, Download, AlertTriangle, Shield, 
  MessageSquare, Menu, X, Filter, ChevronRight, Briefcase, 
  Globe, Megaphone, Target, Video, Phone, Star, MapPin, Clock,
  Calendar
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

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
  
  // Payment State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentService, setPaymentService] = useState<{name: string, amount: number} | null>(null);

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
            <h1 className="font-bold text-lg leading-tight">{UNI_NAME}</h1>
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
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-800 transition">
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
              CT
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-4 lg:p-8 space-y-8 overflow-x-hidden">
          
          {/* OVERVIEW DASHBOARD */}
          {currentView === 'overview' && (
            <div className="animate-fade-in-up">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {UNI_METRICS.map((metric) => (
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

              {/* Pipeline Visualization */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-800 mb-6 text-lg">Student Pipeline Tracker</h3>
                <div className="flex flex-col md:flex-row justify-between items-center relative gap-6 md:gap-0">
                   <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-0 hidden md:block"></div>
                   {['Lead', 'Application', 'Offer Letter', 'Acceptance', 'Visa', 'Arrival', 'Enrolled'].map((step, i) => (
                      <div key={step} className="relative z-10 flex flex-col items-center bg-white p-2 w-full md:w-auto">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-4 transition ${i < 4 ? 'bg-emerald-500 text-white border-emerald-200' : 'bg-white text-slate-400 border-slate-200'}`}>
                            {i + 1}
                         </div>
                         <span className="mt-2 text-xs font-bold text-slate-600 uppercase">{step}</span>
                      </div>
                   ))}
                </div>
              </div>

              {/* Recent Activity Table (Preview) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800">Recent Student Activity</h3>
                   <button onClick={() => setCurrentView('students')} className="text-emerald-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                      <tr>
                        <th className="px-6 py-4 whitespace-nowrap">Student ID</th>
                        <th className="px-6 py-4 whitespace-nowrap">Name</th>
                        <th className="px-6 py-4 whitespace-nowrap">Course</th>
                        <th className="px-6 py-4 whitespace-nowrap">Status</th>
                        <th className="px-6 py-4 whitespace-nowrap">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_STUDENTS.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-mono text-slate-400 font-bold whitespace-nowrap">{s.id}</td>
                          <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{s.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{s.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                              {s.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">{s.uploadedBy === 'Uni' ? 'University Upload' : 'ZII Assignment'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS LIST VIEW */}
          {currentView === 'students' && (
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                   <div>
                      <h3 className="font-bold text-xl text-slate-900">Student Database</h3>
                      <p className="text-sm text-slate-500">Restricted View: {UNI_NAME} Students Only</p>
                   </div>
                   <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-1 md:flex-none">
                         <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"/>
                         <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                      </div>
                      <button className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 whitespace-nowrap">
                         <Download className="w-4 h-4 mr-2"/> Export CSV
                      </button>
                   </div>
                </div>
                <div className="p-12 text-center text-slate-500">
                   <p className="mb-4">Full student list available in database mode.</p>
                   <button className="text-emerald-600 font-bold hover:underline" onClick={() => setCurrentView('overview')}>Back to Dashboard</button>
                </div>
             </div>
          )}

          {/* MARKETING VIEW */}
          {currentView === 'marketing' && (
             <div className="animate-fade-in-up">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white mb-8 shadow-lg">
                   <div className="flex justify-between items-start">
                      <div>
                         <h2 className="text-3xl font-extrabold mb-2">Marketing Hub</h2>
                         <p className="text-orange-100">Collaborate with ZII to boost your enrollments.</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                         <Megaphone className="w-8 h-8 text-white"/>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                         <p className="text-xs uppercase font-bold text-orange-200 mb-1">Total Impressions</p>
                         <p className="text-2xl font-bold">1.2M</p>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                         <p className="text-xs uppercase font-bold text-orange-200 mb-1">Leads Generated</p>
                         <p className="text-2xl font-bold">450</p>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                         <p className="text-xs uppercase font-bold text-orange-200 mb-1">Campaign ROI</p>
                         <p className="text-2xl font-bold">450%</p>
                      </div>
                   </div>
                </div>

                <h3 className="font-bold text-slate-900 text-xl mb-6">Active Strategies & Campaigns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {MARKETING_STRATEGIES.map((strat) => (
                      <div key={strat.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition cursor-pointer group">
                         <div className="flex justify-between items-start mb-4">
                            <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-orange-50 group-hover:text-orange-600 transition text-slate-500">
                               <Target className="w-6 h-6"/>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${strat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                               {strat.status}
                            </span>
                         </div>
                         <h4 className="font-bold text-slate-800 mb-2">{strat.title}</h4>
                         <div className="flex items-center text-xs font-medium text-slate-500">
                            <span className={`w-2 h-2 rounded-full mr-2 ${strat.impact === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                            {strat.impact} Impact Strategy
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* LEADS MANAGEMENT VIEW */}
          {currentView === 'leads' && (
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fade-in-up">
                <div className="max-w-2xl mx-auto">
                   <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                         <Upload className="w-8 h-8"/>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Upload New Leads</h2>
                      <p className="text-slate-500">Add prospective students to your pipeline manually or via CSV.</p>
                   </div>

                   <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition mb-8 group">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-blue-500 transition"/>
                      <p className="font-bold text-slate-700">Drag & Drop CSV File</p>
                      <p className="text-xs text-slate-500 mt-2">Columns: Name, Email, Phone, Course, Intake</p>
                   </div>

                   <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                         <span className="px-2 bg-white text-slate-500 font-bold uppercase">Or Enter Manually</span>
                      </div>
                   </div>

                   <form className="mt-8 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" placeholder="First Name" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                         <input type="text" placeholder="Last Name" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                      </div>
                      <input type="email" placeholder="Email Address" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                      <input type="tel" placeholder="Phone Number" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                      <button type="button" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition">
                         Add Lead to Pipeline
                      </button>
                   </form>
                </div>
             </div>
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
                        <p className="text-2xl font-extrabold text-slate-900 mb-6">$500</p>
                        <button 
                            onClick={() => { setPaymentService({ name: 'Silver Booth Exhibition', amount: 500 * 25 }); setPaymentModalOpen(true); }} // Approx rate
                            className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-200"
                        >
                            Book Silver
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border-2 border-purple-500 shadow-xl transform scale-105 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Gold Booth</h3>
                        <p className="text-slate-500 text-sm mb-4">Featured listing + 3 Webinars + Email Blast.</p>
                        <p className="text-2xl font-extrabold text-slate-900 mb-6">$1,200</p>
                        <button 
                            onClick={() => { setPaymentService({ name: 'Gold Booth Exhibition', amount: 1200 * 25 }); setPaymentModalOpen(true); }}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg"
                        >
                            Book Gold
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">EXCLUSIVE</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Platinum Partner</h3>
                        <p className="text-slate-500 text-sm mb-4">Homepage Takeover + Unlimited Webinars.</p>
                        <p className="text-2xl font-extrabold text-slate-900 mb-6">$2,500</p>
                        <button 
                            onClick={() => { setPaymentService({ name: 'Platinum Exhibition', amount: 2500 * 25 }); setPaymentModalOpen(true); }}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
                        >
                            Book Platinum
                        </button>
                    </div>
                </div>
            </div>
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
        studentName={UNI_NAME}
        studentId={UNI_ID}
      />
    </div>
  );
};

export default UniversityDashboard;
