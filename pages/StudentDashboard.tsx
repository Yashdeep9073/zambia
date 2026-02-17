import React from 'react';
import { 
  Activity, FileText, CheckCircle, Mail, DollarSign, Plane, 
  User, Bell, Calendar, HelpCircle, Settings, Users, Download, 
  MessageSquare, LogOut, Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const dashboardItems = [
    { label: "Application Status", icon: Activity, status: "Under Review" },
    { label: "Documents Checklist", icon: FileText, status: "2 Pending" },
    { label: "Messages", icon: Mail, status: "3 New" },
    { label: "Scholarships Tracker", icon: DollarSign, status: "Eligible" },
    { label: "Visa Updates", icon: Plane, status: "Not Started" },
    { label: "My Profile", icon: User },
    { label: "Notifications", icon: Bell, status: "1 Alert" },
    { label: "Timeline", icon: Calendar },
    { label: "Help Center", icon: HelpCircle },
    { label: "Settings", icon: Settings },
    { label: "Community", icon: Users },
    { label: "Events", icon: Clock },
    { label: "Downloads", icon: Download },
    { label: "Support", icon: MessageSquare },
    { label: "Logout", icon: LogOut, danger: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 border-l-8 border-emerald-500 pl-4">Student Dashboard</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {dashboardItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition cursor-pointer group flex flex-col items-center justify-center text-center h-40 ${item.danger ? 'hover:bg-red-50 hover:border-red-200' : 'hover:border-emerald-200'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${item.danger ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className={`font-bold text-sm ${item.danger ? 'text-red-600' : 'text-slate-800'}`}>{item.label}</span>
              {item.status && (
                <span className="mt-2 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-full group-hover:bg-orange-100 group-hover:text-orange-600 transition">
                  {item.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;