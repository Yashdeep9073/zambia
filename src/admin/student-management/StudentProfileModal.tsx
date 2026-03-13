
import React, { useEffect, useState } from 'react';
import { X, User, Mail, Phone, MapPin, GraduationCap, FileText, DollarSign, MessageSquare, Activity, CheckCircle, Clock } from 'lucide-react';
import { getStudentApplications, getStudentPayments, getStudentTickets } from '../../lib/firebase/studentQueries';

interface StudentProfileModalProps {
  student: any;
  onClose: () => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appData, payData, tickData] = await Promise.all([
          getStudentApplications(student.id),
          getStudentPayments(student.id),
          getStudentTickets(student.id)
        ]);
        setApplications(appData);
        setPayments(payData);
        setTickets(tickData);
      } catch (err) {
        console.error('Error fetching student details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [student.id]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Profile • {student.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{student.country || 'Zambia'}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Academic Interest</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>{student.uni || 'Not Selected'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{student.course || 'Not Selected'}</span>
                  </div>
                </div>
              </section>

              <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Engagement Score</h3>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-slate-900">{student.engagement || 0}</span>
                  <span className="text-sm text-slate-400 mb-1">/ 100</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${student.engagement || 0}%` }} />
                </div>
              </section>
            </div>

            {/* Right Column: Activity & History */}
            <div className="lg:col-span-2 space-y-8">
              {/* Applications */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applications</h3>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{applications.length} Found</span>
                </div>
                {loading ? (
                  <div className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
                ) : applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{app.university || 'General Application'}</p>
                            <p className="text-[10px] text-slate-400">{app.course || 'No Course'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">{app.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No applications submitted yet.</p>
                )}
              </section>

              {/* Payments */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payments</h3>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{payments.length} Found</span>
                </div>
                {loading ? (
                  <div className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
                ) : payments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {payments.map(pay => (
                      <div key={pay.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                            <DollarSign className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{pay.currency} {pay.amount}</p>
                            <p className="text-[10px] text-slate-400">{pay.serviceType || 'Service Fee'}</p>
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No payment records found.</p>
                )}
              </section>

              {/* Support Tickets */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support Tickets</h3>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{tickets.length} Found</span>
                </div>
                {loading ? (
                  <div className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
                ) : tickets.length > 0 ? (
                  <div className="space-y-3">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{ticket.category}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{ticket.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${ticket.status === 'Open' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No support tickets created.</p>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition">
            Close Profile
          </button>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
