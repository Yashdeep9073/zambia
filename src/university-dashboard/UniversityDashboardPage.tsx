// src/university-dashboard/UniversityDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { auth, db } from '../lib/firebase/firebaseConfig';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import UniversityProfilePanel from './UniversityProfilePanel';
import StudentApplicationsTable from './StudentApplicationsTable';
import RecruitmentFunnelChart from './RecruitmentFunnelChart';
import { getUniversityProfile } from '../lib/firebase/universityAuth';

const UniversityDashboardPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchData = async () => {
      try {
        // 1. Get Profile
        const uniProfile = await getUniversityProfile(user.uid);
        setProfile(uniProfile);

        // 2. Real-time Applications
        const q = query(
          collection(db, "applications"), 
          where("universityId", "==", uniProfile?.university_id || "")
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          setApplications(apps);
          
          // Calculate Stats for Funnel
          const funnelData = [
            { name: 'Leads', value: apps.length * 2 }, // Simulated leads for demo
            { name: 'Applied', value: apps.length },
            { name: 'Offers', value: apps.filter((a: any) => a.status === 'approved').length },
            { name: 'Enrolled', value: apps.filter((a: any) => a.status === 'enrolled').length }
          ];
          setStats(funnelData);
          setLoading(false);
        }, (error) => {
          console.error("Error in onSnapshot:", error);
          // Fallback to getDocs
          getDocs(q).then(snap => {
            const apps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplications(apps);
            setLoading(false);
          });
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-amber-500">ZII</span> PARTNER
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500 text-slate-900 rounded-xl font-bold transition-all">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-all">
            <Users className="w-5 h-5" /> Students
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-all">
            <FileText className="w-5 h-5" /> Documents
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-all">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-medium transition-all">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search students or applications..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{profile?.contactName}</p>
                <p className="text-xs text-slate-500">{profile?.universityName}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                {profile?.contactName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900">University Dashboard</h2>
              <p className="text-slate-500">Welcome back! Here is what's happening with your recruitment.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <UniversityProfilePanel profile={profile} />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Recent Applications</h3>
                  <button className="text-sm font-bold text-amber-600 hover:underline">View all</button>
                </div>
                <StudentApplicationsTable applications={applications} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recruitment Funnel</h3>
                <RecruitmentFunnelChart data={stats} />
                <div className="mt-6 space-y-3">
                  {stats.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">{item.name}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500 rounded-2xl p-6 text-slate-900 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <h3 className="text-lg font-bold mb-2">Need Support?</h3>
                <p className="text-sm font-medium opacity-80 mb-4">Your dedicated ZII Account Manager is available for any recruitment assistance.</p>
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UniversityDashboardPage;
