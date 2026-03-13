
import React, { useState, useEffect } from 'react';
import { Users, Plus, BarChart2, Filter, Download, RefreshCcw, Search, LayoutGrid, List } from 'lucide-react';
import StudentTable from './StudentTable';
import StudentAnalyticsPanel from './StudentAnalyticsPanel';
import StudentCreateForm from './StudentCreateForm';
import StudentProfileModal from './StudentProfileModal';
import { subscribeToStudents } from '../../lib/firebase/studentQueries';

const StudentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToStudents(
      (data) => {
        setStudents(data);
        setLoading(false);
      },
      (err) => {
        console.error('Subscription error:', err);
        setError('Failed to load student data. Please check your connection.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Users className="w-6 h-6 mr-3 text-emerald-600" />
            Student Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage, track and analyze student applications across Zambia.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-200/50 p-1 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center px-6 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <List className="w-4 h-4 mr-2" />
          Student List
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center px-6 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          Live Analytics
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing with Firestore...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-center">
          <p className="text-red-600 font-bold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'list' ? (
            <StudentTable 
              data={students} 
              onViewProfile={(student) => setSelectedStudent(student)} 
            />
          ) : (
            <StudentAnalyticsPanel />
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateForm && (
        <StudentCreateForm 
          onClose={() => setShowCreateForm(false)} 
          onSuccess={() => {
            setShowCreateForm(false);
            // Success notification could go here
          }} 
        />
      )}

      {selectedStudent && (
        <StudentProfileModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
};

export default StudentManagementPage;
