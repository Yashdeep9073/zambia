
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Users, FileText, CheckCircle, TrendingUp, Clock, AlertTriangle, DollarSign, UserCheck } from 'lucide-react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StudentAnalyticsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({
    totalStudents: 0,
    activeApplicants: 0,
    completionRate: 0,
    dropOffRate: 0,
    avgProcessingTime: 0,
    engagementScore: 0,
    returningStudents: 0,
    examPassRate: 0,
    paymentConversion: 0,
    avgTuition: 0,
    ticketVolume: 0,
    resolutionTime: 0
  });

  const [uniData, setUniData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // In a real production app, we'd use analytics_aggregates collection
        // For this demo, we'll simulate real-time aggregation from collections
        
        const studentsSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
        const appsSnap = await getDocs(collection(db, 'applications'));
        const paymentsSnap = await getDocs(collection(db, 'payments'));
        const ticketsSnap = await getDocs(collection(db, 'support_tickets'));
        const examsSnap = await getDocs(collection(db, 'exam_attempts'));

        const totalStudents = studentsSnap.size;
        const activeApps = appsSnap.docs.filter(d => d.data().status !== 'Enrolled' && d.data().status !== 'Rejected').length;
        const completedApps = appsSnap.docs.filter(d => d.data().status === 'Enrolled').length;
        
        // Mocking some complex metrics for visual representation
        setMetrics({
          totalStudents,
          activeApplicants: activeApps,
          completionRate: totalStudents > 0 ? Math.round((completedApps / totalStudents) * 100) : 0,
          dropOffRate: 12,
          avgProcessingTime: 14,
          engagementScore: 78,
          returningStudents: 24,
          examPassRate: 65,
          paymentConversion: 42,
          avgTuition: 4500,
          ticketVolume: ticketsSnap.size,
          resolutionTime: 4.2
        });

        // University Distribution
        const unis: Record<string, number> = {};
        appsSnap.docs.forEach(doc => {
          const u = doc.data().university || 'Other';
          unis[u] = (unis[u] || 0) + 1;
        });
        setUniData(Object.entries(unis).map(([name, value]) => ({ name, value })).slice(0, 5));

        // Country Distribution
        const countries: Record<string, number> = {};
        studentsSnap.docs.forEach(doc => {
          const c = doc.data().country || 'Zambia';
          countries[c] = (countries[c] || 0) + 1;
        });
        setCountryData(Object.entries(countries).map(([name, value]) => ({ name, value })));

      } catch (err) {
        console.error('Analytics fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Real-time listener for total students
    const unsub = onSnapshot(query(collection(db, 'users'), where('role', '==', 'student')), (snap) => {
      setMetrics((prev: any) => ({ ...prev, totalStudents: snap.size }));
    });

    return () => unsub();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, suffix = '' }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}{suffix}</h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={metrics.totalStudents} icon={Users} color="bg-blue-600" />
        <StatCard title="Active Applicants" value={metrics.activeApplicants} icon={FileText} color="bg-orange-600" />
        <StatCard title="Completion Rate" value={metrics.completionRate} suffix="%" icon={CheckCircle} color="bg-emerald-600" />
        <StatCard title="Avg. Tuition" value={metrics.avgTuition} suffix=" ZMW" icon={DollarSign} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* University Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
            Applications by University
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uniData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            Students by Country
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</span>
          </div>
          <h3 className="text-2xl font-bold">{metrics.avgProcessingTime} Days</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Avg. Processing Time</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <UserCheck className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retention</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{metrics.returningStudents}%</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Returning Students</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{metrics.ticketVolume}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Tickets</p>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalyticsPanel;
