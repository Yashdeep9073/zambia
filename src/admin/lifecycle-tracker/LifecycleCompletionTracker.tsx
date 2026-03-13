
import React, { useState, useEffect } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper 
} from '@tanstack/react-table';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { DbApplication } from '../../types/db';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface LifecycleData {
  id: string;
  userId: string;
  name: string;
  email: string;
  lifecycle_status: string;
  lastUpdateTimestamp: Timestamp | any;
  progress: number;
}

const columnHelper = createColumnHelper<LifecycleData>();

const LifecycleCompletionTracker: React.FC = () => {
  const [data, setData] = useState<LifecycleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    // Query for students who have at least started (including draft/apply)
    const q = query(
      collection(db, "applications"),
      where("lifecycle_status", "in", ["apply", "draft", "submitted", "payment_completed", "approved", "completed"]),
      orderBy("lastUpdateTimestamp", "desc")
    );

    // Try real-time listener first
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: LifecycleData[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data() as DbApplication;
        results.push({
          id: doc.id,
          userId: d.userId,
          name: d.personalSection?.fullName || 'Unknown',
          email: d.personalSection?.email || 'No Email',
          lifecycle_status: d.lifecycle_status,
          lastUpdateTimestamp: d.lastUpdateTimestamp,
          progress: calculateProgress(d.lifecycle_status)
        });
      });
      setData(results);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Snapshot error, falling back to getDocs:", err);
      // Fallback to getDocs if snapshot fails (e.g. offline or permission issue)
      fetchDataFallback(q);
    });

    return () => unsubscribe();
  }, []);

  const fetchDataFallback = async (q: any) => {
    try {
      const snapshot = await getDocs(q);
      const results: LifecycleData[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data() as DbApplication;
        results.push({
          id: doc.id,
          userId: d.userId,
          name: d.personalSection?.fullName || 'Unknown',
          email: d.personalSection?.email || 'No Email',
          lifecycle_status: d.lifecycle_status,
          lastUpdateTimestamp: d.lastUpdateTimestamp,
          progress: calculateProgress(d.lifecycle_status)
        });
      });
      setData(results);
      setLoading(false);
    } catch (err) {
      console.error("Fallback fetch failed:", err);
      setError("Failed to load lifecycle data. Please check your connection.");
      setLoading(false);
    }
  };

  const calculateProgress = (status: string) => {
    switch (status) {
      case 'apply': return 5;
      case 'draft': return 15;
      case 'submitted': return 30;
      case 'payment_completed': return 55;
      case 'approved': return 80;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Student Name',
      cell: info => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mr-3">
            {info.getValue().charAt(0)}
          </div>
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => <span className="text-slate-500 text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('id', {
      header: 'App ID',
      cell: info => <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{info.getValue().substring(0, 8)}...</code>,
    }),
    columnHelper.accessor('lifecycle_status', {
      header: 'Current Stage',
      cell: info => {
        const status = info.getValue();
        const colors: Record<string, string> = {
          apply: 'bg-slate-100 text-slate-700 border-slate-200',
          draft: 'bg-amber-100 text-amber-700 border-amber-200',
          submitted: 'bg-blue-100 text-blue-700 border-blue-200',
          payment_completed: 'bg-purple-100 text-purple-700 border-purple-200',
          approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          completed: 'bg-orange-100 text-orange-700 border-orange-200'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-slate-100 text-slate-700'}`}>
            {status.replace('_', ' ').toUpperCase()}
          </span>
        );
      },
    }),
    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: info => (
        <div className="w-full max-w-[120px]">
          <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400">
            <span>{info.getValue()}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${info.getValue() === 100 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
              style={{ width: `${info.getValue()}%` }}
            ></div>
          </div>
        </div>
      ),
    }),
  ];

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-emerald-600" />
              Student Lifecycle Tracker
            </h2>
            <p className="text-sm text-slate-500 mt-1">Real-time monitoring of student application progress.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isOffline && (
              <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Clock className="w-3 h-3 mr-1" /> Offline Mode
              </span>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
            <p className="font-medium">Loading lifecycle data...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
            <p className="font-medium text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-slate-200" />
            </div>
            <p className="font-bold text-slate-500">No students have completed the lifecycle yet.</p>
            <p className="text-sm">Active applications will appear here in real-time.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-slate-50/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                  {row.getVisibleCells().map(cell => (
                    <th key={cell.id} className="px-6 py-4 font-normal">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Total Tracked: {filteredData.length}</span>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
          Live Sync Active
        </div>
      </div>
    </div>
  );
};

export default LifecycleCompletionTracker;
