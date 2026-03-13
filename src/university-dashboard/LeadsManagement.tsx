
import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Search, Filter, Trash2, Mail } from 'lucide-react';
import Papa from 'papaparse';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';

const LeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'university_leads'),
      where('universityId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const user = auth.currentUser;
        if (!user) return;

        const newLeads = results.data.filter((row: any) => row.fullName && row.email);
        
        try {
          for (const lead of newLeads as any[]) {
            await addDoc(collection(db, 'university_leads'), {
              universityId: user.uid,
              fullName: lead.fullName,
              email: lead.email,
              phone: lead.phone || '',
              course: lead.course || '',
              intake: lead.intake || '',
              status: 'pending',
              createdAt: serverTimestamp()
            });
          }

          // Trigger notification to admin
          await addDoc(collection(db, 'mail'), {
            to: ['zambiansinindia@gmail.com', 'maorderzambia@gmail.com'],
            message: {
              subject: `New Leads Uploaded - ${user.email}`,
              text: `University ${user.email} has uploaded ${newLeads.length} new leads.`,
              html: `<p>University <b>${user.email}</b> has uploaded <b>${newLeads.length}</b> new leads.</p>`
            },
            createdAt: serverTimestamp()
          });

          alert(`Successfully uploaded ${newLeads.length} leads.`);
        } catch (error) {
          console.error("Error uploading leads:", error);
          alert("Error uploading leads. Please check your connection.");
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        alert("Error parsing CSV file.");
        setUploading(false);
      }
    });
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteDoc(doc(db, 'university_leads', id));
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.status === 'pending').length,
    processed: leads.filter(l => l.status === 'processed').length,
    error: leads.filter(l => l.status === 'error').length
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Leads</p>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-2xl font-black text-blue-700">{stats.pending}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Processed</p>
          <p className="text-2xl font-black text-emerald-700">{stats.processed}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Errors</p>
          <p className="text-2xl font-black text-red-700">{stats.error}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Upload className="w-8 h-8"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Bulk Upload</h2>
            <p className="text-slate-500 mb-8">Upload prospective students via CSV.</p>

            <label className={`block w-full border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer transition group ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'}`}>
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-blue-500 transition"/>
              <p className="font-bold text-slate-700">{uploading ? 'Processing File...' : 'Click to Upload CSV'}</p>
              <p className="text-xs text-slate-500 mt-2">Required: fullName, email</p>
            </label>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Manual Entry</h2>
          <p className="text-slate-500 mb-8">Add a single lead to your pipeline.</p>
          
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) return;
            
            const formData = new FormData(e.currentTarget);
            const leadData = {
              universityId: user.uid,
              fullName: `${formData.get('firstName')} ${formData.get('lastName')}`,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              course: formData.get('course') as string,
              intake: formData.get('intake') as string,
              status: 'pending',
              createdAt: serverTimestamp()
            };

            try {
              await addDoc(collection(db, 'university_leads'), leadData);
              
              // Notification
              await addDoc(collection(db, 'mail'), {
                to: ['zambiansinindia@gmail.com', 'maorderzambia@gmail.com'],
                message: {
                  subject: `New Manual Lead - ${user.email}`,
                  text: `University ${user.email} added a new lead: ${leadData.fullName}`,
                  html: `<p>University <b>${user.email}</b> added a new lead: <b>${leadData.fullName}</b></p>`
                },
                createdAt: serverTimestamp()
              });

              // Track notification
              await addDoc(collection(db, 'analytics_notifications'), {
                universityId: user.uid,
                type: 'manual_lead_entry',
                recipient: 'admin',
                status: 'sent',
                timestamp: serverTimestamp()
              });

              (e.target as HTMLFormElement).reset();
              alert("Lead added successfully!");
            } catch (error) {
              console.error("Error adding lead:", error);
              alert("Failed to add lead.");
            }
          }}>
            <div className="grid grid-cols-2 gap-4">
              <input required name="firstName" type="text" placeholder="First Name" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
              <input required name="lastName" type="text" placeholder="Last Name" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
            <input required name="email" type="email" placeholder="Email Address" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
            <input name="phone" type="tel" placeholder="Phone Number" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
            <div className="grid grid-cols-2 gap-4">
              <input name="course" type="text" placeholder="Desired Course" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
              <input name="intake" type="text" placeholder="Intake (e.g. Aug 2025)" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition">
              Add Lead to Pipeline
            </button>
          </form>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 text-lg">Lead Database</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Course/Intake</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition group">
                  <td className="px-6 py-4 font-bold text-slate-800">{lead.fullName}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{lead.email}</div>
                    <div className="text-xs text-slate-400">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{lead.course}</div>
                    <div className="text-xs text-slate-400">{lead.intake}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      lead.status === 'processed' ? 'bg-emerald-100 text-emerald-700' :
                      lead.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {lead.createdAt?.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto">
                      <Search className="w-12 h-12 text-slate-200 mx-auto mb-4"/>
                      <p className="font-bold">No leads found</p>
                      <p className="text-sm">Try adjusting your search or upload a new CSV file.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsManagement;
