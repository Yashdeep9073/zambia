
import React, { useState, useEffect } from 'react';
import { AppPhase, StudentProfile, UserRole, PublicView } from '../types';
import { 
  FileText, Check, Upload, Banknote, Plane, Building, 
  Download, Calendar, Activity, ShieldCheck, Target, ArrowRight,
  BookOpen, Video, Globe, Users, PenTool, Zap, Bell, CreditCard,
  Bot, AlertTriangle, Share2, Star, Lock, Info, ChevronRight, ChevronLeft,
  XCircle, CheckCircle, Loader, MessageSquare, GraduationCap, School, 
  HelpCircle, Phone, Play, Lightbulb, User, MapPin, Home, Layout, Mail, FileCheck, ClipboardList, Award,
  DollarSign, Save, X, Smile, Clock, Briefcase, Link, Heart, Search, PlusCircle, Trash2
} from 'lucide-react';
import StudentDashboard from './StudentDashboard';
import WaitingRoom from './WaitingRoom';

interface DashboardFlowProps {
  currentPhase: AppPhase;
  onPhaseComplete: (nextPhase: AppPhase) => void;
  userRole: UserRole;
  onNavigate?: (view: PublicView) => void; // Added prop for navigation
}

const COURSES = [
  "Computer Science", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", 
  "Medicine (MBBS)", "Pharmacy", "Nursing", "Public Health", "Business Administration (MBA)", 
  "Economics", "Accounting", "Law", "International Relations", "Agriculture", "Biotechnology", 
  "Architecture", "Fashion Design", "Mass Communication", "Psychology", "Data Science"
];

const ZAMBIA_LOCATIONS: Record<string, string[]> = {
  "Lusaka Province": ["Lusaka", "Chilanga", "Chongwe", "Kafue", "Rufunsa", "Luangwa", "Chirundu"],
  "Copperbelt Province": ["Ndola", "Kitwe", "Chingola", "Mufulira", "Luanshya", "Kalulushi", "Chililabombwe", "Masaiti", "Mpongwe", "Lufwanyama"],
  "Central Province": ["Kabwe", "Kapiri Mposhi", "Mkushi", "Mumbwa", "Serenje", "Chibombo", "Itezhi-Tezhi", "Ngabwe", "Chitambo", "Luano"],
  "Southern Province": ["Livingstone", "Choma", "Mazabuka", "Monze", "Kalomo", "Namwala", "Gwembe", "Siavonga", "Sinazongwe", "Kazungula", "Zimba", "Pemba", "Chikankata"],
  "Eastern Province": ["Chipata", "Petauke", "Katete", "Lundazi", "Nyimba", "Mambwe", "Chadiza", "Vubwi", "Sinda"],
  "North-Western Province": ["Solwezi", "Mwinilunga", "Kasempa", "Zambezi", "Kabompo", "Mufumbwe", "Chavuma", "Ikelenge", "Manyinga", "Mushindamo", "Kalumbila"],
  "Northern Province": ["Kasama", "Mbala", "Mpika", "Mporokoso", "Mpulungu", "Luwingu", "Kaputa", "Mungwi", "Nchelenge"],
  "Luapula Province": ["Mansa", "Kawambwa", "Nchelenge", "Samfya", "Mwense", "Chiengi", "Mwansabombwe", "Chembe", "Lunga", "Chifunabuli", "Milenge"],
  "Western Province": ["Mongu", "Kaoma", "Senanga", "Sesheke", "Lukulu", "Kalabo", "Shangombo", "Sioma", "Nkeyema", "Limulunga", "Luampa", "Mitete", "Mulobezi", "Mwandi", "Nalolo", "Sikongo"],
  "Muchinga Province": ["Chinsali", "Isoka", "Mpika", "Nakonde", "Mafinga", "Shiwang'andu", "Kanchibiya", "Lavushimanda"]
};

const COUNTRIES = [
  { name: "Zambia", code: "+260" },
  { name: "India", code: "+91" },
  { name: "Malawi", code: "+265" },
  { name: "Zimbabwe", code: "+263" },
  { name: "Botswana", code: "+267" },
  { name: "Namibia", code: "+264" },
  { name: "South Africa", code: "+27" },
  { name: "Tanzania", code: "+255" },
  { name: "DR Congo", code: "+243" },
];

const GamifiedDashboard = ({ progress }: { progress: number }) => (
  <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 shadow-xl border border-slate-700 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-20">
      <GraduationCap className="w-32 h-32 text-orange-500" />
    </div>
    <div className="relative z-10">
      <h3 className="text-xl font-bold mb-2 flex items-center"><Target className="w-6 h-6 mr-2 text-orange-500"/> Application Progress</h3>
      <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between text-xs font-bold text-slate-400">
        <span>Start</span>
        <span className="text-orange-400">{progress} Points</span>
        <span>Complete (100)</span>
      </div>
      <p className="mt-4 text-sm text-emerald-300 font-medium">
        Current Phase: <span className="text-white bg-emerald-900 px-2 py-1 rounded">Application Entry</span>
      </p>
    </div>
  </div>
);

const DashboardFlow: React.FC<DashboardFlowProps> = ({ currentPhase, onPhaseComplete, userRole, onNavigate }) => {
  const [profile, setProfile] = useState<StudentProfile & any>({
    applicantType: 'Student',
    name: '', phone: '', email: '', countryCode: '+260', password: '',
    programInterest: '', 
    studyLevel: undefined, studyMode: undefined,
    dob: '', parentName: '', parentPhone: '', parentEmail: '', 
    intake: 'June 2026', applyToAll: true, grades: [], 
    currentGrade: '', budget: '',
    nationality: 'Zambian', uploadedDocuments: [],
    parentRelationship: 'Parent', maritalStatus: 'Single', nrcNumber: '',
    // Modified Fields
    prevIntlExposure: 'No',
    englishProficiency: 'Native/Fluent',
    emergencyContact: '',
    discoverySource: '',
    // Academic History Array
    academicHistory: {
        institutions: [{ name: '', year: '', examBoard: '', country: 'Zambia' }]
    },
    recommenderName: '',
    recommenderPhone: ''
  });

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'parent' | 'uploads'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState<'form' | 'flying' | 'success'>('form');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [multiStatement, setMultiStatement] = useState(false);

  // --- STUDENT FLOW ---

  // PHASE 1: REGISTRATION (Start Here)
  if (currentPhase === AppPhase.MARKETING_LEAD) {
     const calculateProgress = () => {
       let filled = 0;
       if (profile.name) filled++;
       if (profile.phone) filled++;
       if (profile.email) filled++;
       if (profile.password) filled++;
       if (profile.studyLevel) filled++;
       if (profile.programInterest) filled++;
       return (filled / 6) * 100;
     };

     const progress = calculateProgress();

     const handleRegistrationSubmit = () => {
        const newErrors: Record<string, string> = {};
        
        if (!profile.name.trim()) newErrors.name = "Full Name is required";
        if (!profile.phone.trim()) newErrors.phone = "Phone Number is required";
        if (!profile.email) newErrors.email = "Email Address is required";
        if (!profile.password) newErrors.password = "Create a password";
        if (!profile.studyLevel) newErrors.studyLevel = "Select a level";
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            const uniqueId = `ZII-${new Date().getFullYear()}-${Math.floor(3276 + Math.random() * 9000)}`;
            setProfile(p => ({ ...p, studentNumber: uniqueId }));
            setShowSuccessModal(true);
        }
     };

     const handleClose = () => {
         if (onNavigate) onNavigate(PublicView.APPLY_ONLINE);
         else window.history.back();
     };

     return (
        <div className="min-h-[85vh] flex items-center justify-center py-4 lg:py-8 px-4 bg-slate-50">
           
           {/* SUCCESS MODAL */}
           {showSuccessModal && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fade-in">
                   <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full text-center relative overflow-hidden shadow-2xl border-4 border-white">
                       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-orange-500 to-emerald-500 animate-gradient-x"></div>
                       <div className="mb-6 relative">
                           <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                               <ShieldCheck className="w-12 h-12 text-emerald-600" />
                           </div>
                           <div className="absolute -top-2 -right-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">OFFICIAL</div>
                       </div>
                       <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Account Created!</h2>
                       <p className="text-slate-500 mb-8 font-medium">Welcome to the official ZII family.</p>
                       <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 mb-8 text-center relative group hover:border-orange-400 transition">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">YOUR OFFICIAL ZII NUMBER</p>
                           <p className="text-4xl font-black text-slate-800 tracking-wider font-mono select-all group-hover:text-orange-600 transition">{profile.studentNumber}</p>
                           <p className="text-[10px] text-red-500 font-bold mt-4 flex items-center justify-center"><AlertTriangle className="w-3 h-3 mr-1"/> IMPORTANT: WRITE THIS NUMBER DOWN NOW.</p>
                       </div>
                       <button onClick={() => onPhaseComplete(AppPhase.APPLICATION_ENTRY)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                           Continue Application <ArrowRight className="w-5 h-5 ml-2"/>
                       </button>
                   </div>
               </div>
           )}

           <div className="bg-white max-w-6xl w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative">
              <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition z-10"><X className="w-6 h-6" /></button>
              <div className="bg-white border-b border-slate-200 p-6 md:p-8 relative">
                 <div className="text-center mb-6"><span className="bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">OFFICIAL APPLICATION FORM</span></div>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div><h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Start Here</h2><p className="text-slate-600 text-sm md:text-base max-w-2xl">Create your official ZII account.</p></div>
                    <div className="mt-4 md:mt-0 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 w-full md:w-auto">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1 w-full md:w-48"><span>STEP 1 of 5</span><span>{Math.round(progress)}%</span></div>
                        <div className="w-full md:w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
                    </div>
                 </div>
              </div>

              <div className="p-6 md:p-10 bg-slate-50/50">
                 <form onSubmit={(e) => { e.preventDefault(); handleRegistrationSubmit(); }}>
                     <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <label className="block text-xs font-bold text-blue-800 uppercase mb-2">Who are you applying as?</label>
                        <select className="w-full p-3 rounded-lg border border-blue-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={profile.applicantType} onChange={(e) => setProfile({...profile, applicantType: e.target.value as any})}>
                            <option value="Student">Student (Applying for myself)</option>
                            <option value="Representative">Parent / Guardian / Applying for someone else</option>
                        </select>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div>
                              <label className="label">Full Name (as per ID)</label>
                              <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className={`input-field ${errors.name ? 'border-red-300' : ''}`} placeholder="e.g. John Phiri" />
                              {errors.name && <p className="error-text">{errors.name}</p>}
                           </div>
                           <div>
                              <label className="label">Phone Number (WhatsApp)</label>
                              <div className="flex">
                                 <select className="px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-bold text-sm focus:outline-none" value={profile.countryCode} onChange={(e) => setProfile({...profile, countryCode: e.target.value})}>
                                     {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                 </select>
                                 <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className={`flex-1 w-full p-4 rounded-r-xl border ${errors.phone ? 'border-red-300' : 'border-slate-300'} bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition`} placeholder="762 523 854" />
                              </div>
                              {errors.phone && <p className="error-text">{errors.phone}</p>}
                           </div>
                           <div>
                              <label className="label">Email Address</label>
                              <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className={`input-field ${errors.email ? 'border-red-300' : ''}`} placeholder="student@example.com" />
                              {errors.email && <p className="error-text">{errors.email}</p>}
                           </div>
                           <div>
                              <label className="label">Create Password</label>
                              <input type="password" value={profile.password} onChange={(e) => setProfile({...profile, password: e.target.value})} className={`input-field ${errors.password ? 'border-red-300' : ''}`} placeholder="Create a secure password" />
                              {errors.password && <p className="error-text">{errors.password}</p>}
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <label className="label">Desired Course</label>
                              <select value={profile.programInterest} onChange={(e) => setProfile({...profile, programInterest: e.target.value})} className={`input-field ${errors.programInterest ? 'border-red-300' : ''}`}>
                                 <option value="">Select a Program</option>
                                 {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="label">Level of Study</label>
                              <div className="grid grid-cols-2 gap-3">
                                 {['Diploma', 'Degree', 'Masters', 'PhD'].map(level => (
                                    <button type="button" key={level} onClick={() => setProfile({...profile, studyLevel: level as any})} className={`p-3 rounded-lg border font-bold text-sm transition ${profile.studyLevel === level ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'}`}>{level}</button>
                                 ))}
                              </div>
                              {errors.studyLevel && <p className="error-text">{errors.studyLevel}</p>}
                           </div>
                           <div>
                              <label className="label">Preferred Mode</label>
                              <select className="input-field" value={profile.studyMode} onChange={(e) => setProfile({...profile, studyMode: e.target.value as any})}>
                                  <option value="">Select Mode</option>
                                  <option value="OnCampus">Full-time On Campus – India</option>
                                  <option value="Online">Online</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="mt-10 flex justify-between items-center">
                        <button type="button" onClick={handleClose} className="text-slate-500 font-bold hover:text-slate-800 flex items-center px-4 py-2"><ChevronLeft className="w-5 h-5 mr-1" /> Back</button>
                        <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center">Continue to Details <ArrowRight className="w-5 h-5 ml-2" /></button>
                     </div>
                 </form>
              </div>
           </div>
        </div>
     );
  }

  // PHASE 2: FULL APPLICATION FORM
  if (currentPhase === AppPhase.APPLICATION_ENTRY) {
     const handleFinalSubmit = () => {
         setIsSubmitting(true);
         setSubmissionStage('flying');
         setTimeout(() => {
             setSubmissionStage('success');
             setIsSubmitting(false);
         }, 4000);
     };

     const addInstitution = () => {
        if (profile.academicHistory.institutions.length < 7) {
            setProfile({
                ...profile, 
                academicHistory: {
                    ...profile.academicHistory,
                    institutions: [...profile.academicHistory.institutions, { name: '', year: '', examBoard: '', country: 'Zambia' }]
                }
            });
        }
     };

     const removeInstitution = (index: number) => {
        const newInst = [...profile.academicHistory.institutions];
        newInst.splice(index, 1);
        setProfile({ ...profile, academicHistory: { ...profile.academicHistory, institutions: newInst } });
     };

     const updateInstitution = (index: number, field: string, value: string) => {
        const newInst = [...profile.academicHistory.institutions];
        newInst[index] = { ...newInst[index], [field]: value };
        setProfile({ ...profile, academicHistory: { ...profile.academicHistory, institutions: newInst } });
     };

     if (submissionStage === 'flying') {
         return (
             <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <div className="relative w-full max-w-4xl h-64 flex items-center justify-center">
                     <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                         <div className="h-full bg-orange-500 animate-progress-indeterminate"></div>
                     </div>
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce-slow">
                         <Plane className="w-24 h-24 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform rotate-90" />
                         <div className="mt-8 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                             <span className="text-sm font-bold tracking-widest uppercase">Application in Transit</span>
                         </div>
                     </div>
                 </div>
                 <h2 className="text-3xl font-extrabold mt-12 mb-4 text-center px-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange-400">Your application is being sent to partner universities.</h2>
                 <p className="text-slate-400 animate-pulse">Do not close this browser...</p>
             </div>
         );
     }

     if (submissionStage === 'success') {
         return (
             <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center p-4">
                 <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 md:p-12 text-center border-4 border-emerald-500 relative overflow-hidden">
                     <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle className="w-12 h-12 text-emerald-600" /></div>
                     <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Congratulations!</h2>
                     <p className="text-lg text-slate-600 mb-8">Your application has been received. You are now one step closer to your dream.</p>
                     <button onClick={() => { onPhaseComplete(AppPhase.OFFER_MANAGEMENT); if(onNavigate) onNavigate(PublicView.HOME); setSubmissionStage('form'); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg">Go to Waiting Room</button>
                 </div>
             </div>
         );
     }

     return (
        <div className="min-h-screen bg-slate-50 pb-20">
           <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
              <div className="bg-emerald-900 text-white p-2 overflow-hidden whitespace-nowrap">
                 <div className="animate-marquee inline-block text-xs font-bold uppercase tracking-widest">
                    Welcome {profile.name} • ZII Number: {profile.studentNumber} • Complete your application today • Official ZII Portal
                 </div>
              </div>
              <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                 <div><h1 className="text-xl font-bold text-slate-900">Application Form</h1><p className="text-xs font-bold text-orange-600">{profile.name} | {profile.studentNumber}</p></div>
                 <div className="flex space-x-2"><button className="text-slate-500 hover:text-emerald-600 p-2"><Save className="w-5 h-5"/></button></div>
              </div>
              <div className="max-w-5xl mx-auto px-4 mt-2 flex space-x-8 overflow-x-auto">
                 {['personal', 'academic', 'parent', 'uploads'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                 ))}
              </div>
           </div>

           <div className="max-w-4xl mx-auto px-4 mt-8">
              <GamifiedDashboard progress={activeTab === 'personal' ? 25 : activeTab === 'academic' ? 50 : activeTab === 'parent' ? 75 : 90} />

              {activeTab === 'personal' && (
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-900 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-600"/> Personal Details</h3></div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div><label className="label">Date of Birth</label><input type="text" placeholder="Date / Month / Year" className="input-field" value={profile.dob} onChange={(e) => setProfile({...profile, dob: e.target.value})} /></div>
                       <div><label className="label">Gender</label><select className="input-field" value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value})}><option>Select</option><option>Male</option><option>Female</option></select></div>
                       <div><label className="label">NRC / Passport Number</label><input type="text" className="input-field" placeholder="e.g. 123456/10/1" value={profile.nrcNumber} onChange={(e) => setProfile({...profile, nrcNumber: e.target.value})} /></div>
                       <div><label className="label">Marital Status</label><select className="input-field" value={profile.maritalStatus} onChange={(e) => setProfile({...profile, maritalStatus: e.target.value})}><option>Single</option><option>Married</option></select></div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                       <h4 className="font-bold text-slate-800 mb-4 flex items-center text-sm uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2"/> Location</h4>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div><label className="label">Province</label><select className="input-field" value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setProfile({...profile, currentCity: ''}); }}><option value="">Select Province</option>{Object.keys(ZAMBIA_LOCATIONS).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                          <div><label className="label">Town / City</label><select className="input-field" value={profile.currentCity} onChange={(e) => setProfile({...profile, currentCity: e.target.value})} disabled={!selectedProvince}><option value="">Select Town</option>{selectedProvince && ZAMBIA_LOCATIONS[selectedProvince].map(city => (<option key={city} value={city}>{city}</option>))}</select></div>
                       </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6 bg-slate-50/50 p-4 -mx-4 rounded-xl">
                        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center"><Target className="w-4 h-4 mr-2"/> Additional Info</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div><label className="label">Previous International Exposure?</label><select className="input-field" value={profile.prevIntlExposure} onChange={(e) => setProfile({...profile, prevIntlExposure: e.target.value})}><option>No</option><option>Yes</option></select></div>
                            <div><label className="label">English Proficiency</label><select className="input-field" value={profile.englishProficiency} onChange={(e) => setProfile({...profile, englishProficiency: e.target.value})}><option>Native/Fluent</option><option>Intermediate</option><option>Basic</option></select></div>
                            <div><label className="label">Emergency Contact Name</label><input type="text" className="input-field" placeholder="Full Name" value={profile.emergencyContact} onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})} /></div>
                            <div><label className="label">How did you hear about us?</label><select className="input-field" value={profile.discoverySource} onChange={(e) => setProfile({...profile, discoverySource: e.target.value})}><option value="">Select...</option><option>Facebook</option><option>Radio</option><option>Friend/Family</option><option>School Visit</option></select></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                       <button className="flex items-center text-slate-500 font-bold text-sm hover:text-emerald-600"><Save className="w-4 h-4 mr-2"/> Save & Continue Later</button>
                       <button onClick={() => setActiveTab('academic')} className="btn-primary">Next Step</button>
                    </div>
                 </div>
              )}

              {activeTab === 'academic' && (
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-emerald-600"/> Academic History</h3>
                    <p className="text-sm text-slate-500 italic bg-blue-50 p-2 rounded">Instruction: Use the high school(s) shown on your Statement of Results.</p>
                    
                    {profile.academicHistory.institutions.map((inst: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative mb-4">
                            {idx > 0 && <button onClick={() => removeInstitution(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="label">Institution Name</label><input type="text" className="input-field" placeholder="e.g. Kabulonga Boys" value={inst.name} onChange={(e) => updateInstitution(idx, 'name', e.target.value)} /></div>
                                <div><label className="label">Year of Completion</label><input type="text" className="input-field" placeholder="YYYY" value={inst.year} onChange={(e) => updateInstitution(idx, 'year', e.target.value)} /></div>
                                <div><label className="label">Examination Board</label><input type="text" className="input-field" placeholder="e.g. ECZ / Cambridge" value={inst.examBoard} onChange={(e) => updateInstitution(idx, 'examBoard', e.target.value)} /></div>
                                <div><label className="label">Country</label><select className="input-field" value={inst.country} onChange={(e) => updateInstitution(idx, 'country', e.target.value)}>{COUNTRIES.map(c => <option key={c.name}>{c.name}</option>)}</select></div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setMultiStatement(!multiStatement)}>
                        <button onClick={addInstitution} type="button" className="flex items-center text-sm font-bold text-orange-600 hover:text-orange-700">
                            <PlusCircle className="w-4 h-4 mr-2"/> Do you have more than one Statement of Results?
                        </button>
                    </div>

                    <div className="flex justify-between pt-4">
                       <button onClick={() => setActiveTab('personal')} className="text-slate-500 font-bold hover:text-slate-800">Back</button>
                       <button onClick={() => setActiveTab('parent')} className="btn-primary">Next Step</button>
                    </div>
                 </div>
              )}

              {activeTab === 'parent' && (
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-emerald-600"/> Parent / Guardian (Mandatory)</h3>
                    <div className="grid md:grid-cols-2 gap-6 border-b border-slate-100 pb-8">
                       <div><label className="label">Full Name</label><input type="text" className="input-field" value={profile.parentName} onChange={(e) => setProfile({...profile, parentName: e.target.value})} /></div>
                       <div><label className="label">Relationship</label><select className="input-field" value={profile.parentRelationship} onChange={(e) => setProfile({...profile, parentRelationship: e.target.value})}><option>Father</option><option>Mother</option><option>Uncle</option><option>Aunt</option><option>Brother/Sister</option><option>Sponsor</option></select></div>
                       <div><label className="label">Phone Number</label><input type="tel" className="input-field" value={profile.parentPhone} onChange={(e) => setProfile({...profile, parentPhone: e.target.value})} /></div>
                       <div><label className="label">Email (Optional)</label><input type="email" className="input-field" value={profile.parentEmail} onChange={(e) => setProfile({...profile, parentEmail: e.target.value})} /></div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-600"/> Recommender (Mandatory)</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div><label className="label">Recommender Name</label><input type="text" className="input-field" placeholder="Teacher / Pastor / Mentor" value={profile.recommenderName} onChange={(e) => setProfile({...profile, recommenderName: e.target.value})} /></div>
                       <div><label className="label">Recommender Phone</label><input type="tel" className="input-field" value={profile.recommenderPhone} onChange={(e) => setProfile({...profile, recommenderPhone: e.target.value})} /></div>
                    </div>
                    <div className="flex justify-between pt-4">
                       <button onClick={() => setActiveTab('academic')} className="text-slate-500 font-bold hover:text-slate-800">Back</button>
                       <button onClick={() => setActiveTab('uploads')} className="btn-primary">Next Step</button>
                    </div>
                 </div>
              )}

              {activeTab === 'uploads' && (
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><Upload className="w-5 h-5 mr-2 text-emerald-600"/> Documents</h3>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-sm text-orange-800">
                        <p className="font-bold flex items-center mb-2"><AlertTriangle className="w-4 h-4 mr-2"/> Scan Instructions:</p>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                            <li>Ensure document is flat and well-lit.</li>
                            <li>Formats: PDF, JPG, PNG. Max 5MB.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        {multiStatement ? (
                            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <p className="font-bold text-slate-700 mb-2">Multiple Statements</p>
                                <p className="text-xs text-slate-500 mb-4">Please upload all your Statement of Results files here.</p>
                                <div className="flex gap-2">
                                    <button className="bg-white border border-slate-300 px-3 py-1 rounded text-xs font-bold shadow-sm">Choose File 1</button>
                                    <button className="bg-white border border-slate-300 px-3 py-1 rounded text-xs font-bold shadow-sm">Choose File 2</button>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer group">
                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-emerald-500 transition"/>
                                <p className="font-bold text-slate-700">Grade 12 Certificate / Results</p>
                                <p className="text-xs text-slate-500 mt-1">Click to browse or drag file here</p>
                            </div>
                        )}
                       <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer group">
                          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-orange-500 transition"/>
                          <p className="font-bold text-slate-700">NRC or Passport</p>
                          <p className="text-xs text-slate-500 mt-1">Front & Back</p>
                       </div>
                    </div>

                    <div className="flex justify-between pt-8 border-t border-slate-100">
                       <button onClick={() => setActiveTab('parent')} className="text-slate-500 font-bold hover:text-slate-800">Back</button>
                       {isSubmitting ? (
                          <button disabled className="bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold opacity-75 cursor-wait flex items-center"><Loader className="w-5 h-5 mr-2 animate-spin"/> Processing...</button>
                       ) : (
                          <button onClick={handleFinalSubmit} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition transform hover:-translate-y-1">Submit Application</button>
                       )}
                    </div>
                 </div>
              )}
           </div>
        </div>
     );
  }

  // PHASE 3: WAITING ROOM
  if (currentPhase === AppPhase.OFFER_MANAGEMENT) {
      return <WaitingRoom />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="text-center">
          <Info className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
          <h2 className="text-xl font-bold text-slate-700">Phase Under Development</h2>
          <p className="text-slate-500">This section of the student lifecycle is coming soon.</p>
       </div>
    </div>
  );
};

export default DashboardFlow;
