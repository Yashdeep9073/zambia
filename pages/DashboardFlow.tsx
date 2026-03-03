
import React, { useState, useEffect, useRef } from 'react';
import { AppPhase, StudentProfile, UserRole, PublicView } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { 
  createApplication, 
  updateApplication, 
  getApplication, 
  subscribeToApplication 
} from '../src/services/dbService';
import { 
  FileText, Check, Upload, Banknote, Plane, Building, 
  Download, Activity, ShieldCheck, Target, ArrowRight,
  BookOpen, Video, Globe, Users, PenTool, Zap, Bell, CreditCard,
  Bot, AlertTriangle, Share2, Star, Lock, Info, ChevronRight, ChevronLeft,
  XCircle, CheckCircle, Loader, MessageSquare, GraduationCap, School, 
  HelpCircle, Phone, Play, Lightbulb, User, MapPin, Home, Layout, Mail, FileCheck, ClipboardList, Award,
  DollarSign, Save, X, Smile, Clock, Briefcase, Link, Heart, Search, PlusCircle, Trash2, Camera, Facebook, LayoutDashboard, LogOut, AlertCircle
} from 'lucide-react';
import StudentDashboard from './StudentDashboard';
import WaitingRoom from './WaitingRoom';
import OfferLetterPage from './OfferLetterPage';
import PreDepartureGuide from './PreDepartureGuide';
import LifecycleTracker from '../components/LifecycleTracker';

interface DashboardFlowProps {
  currentPhase: AppPhase;
  onPhaseComplete: (nextPhase: AppPhase) => void;
  userRole: UserRole;
  onNavigate?: (view: PublicView) => void;
  onRoleChange?: (role: UserRole) => void;
  currentView?: PublicView;
  onLogout?: () => void;
}

import { COURSES_LIST } from '../src/data/courses';

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

const DashboardFlow: React.FC<DashboardFlowProps> = ({ currentPhase, onPhaseComplete, userRole, onNavigate, onRoleChange, currentView, onLogout }) => {
  const { currentUser } = useAuth();
  // Load profile from local storage if available
  const [profile, setProfile] = useState<StudentProfile & any>(() => {
    const saved = localStorage.getItem('zii_profile_data');
    const defaultProfile = {
      applicantType: 'Student',
      name: '', phone: '', email: '', countryCode: '+260', password: '',
      programInterest: '', 
      studyLevel: '', studyMode: '',
      dob: '', parentName: '', parentPhone: '', parentEmail: '', 
      intake: 'June 2026', applyToAll: true, grades: [], 
      currentGrade: '', budget: '',
      nationality: 'Zambian', uploadedDocuments: [],
      parentRelationship: 'Parent', maritalStatus: 'Single', nrcNumber: '',
      prevIntlExposure: 'No',
      englishProficiency: 'Native/Fluent',
      discoverySource: '',
      emergencyContact: '',
      academicHistory: {
          institutions: [{ name: '', year: '', examBoard: '', country: 'Zambia' }]
      },
      recommenderName: '',
      recommenderPhone: '',
      studentNumber: '',
      // New Fields Initialization
      nextOfKin: { fullName: '', relationship: '', phone: '', email: '', address: '' },
      highestQualification: { level: 'Grade 12', title: '', institution: '', year: '', country: 'Zambia', grade: '' },
      shareCount: 0,
      isShareVerified: false,
      // Enhanced Fields
      parents: [],
      country: 'Zambia',
      province: '',
      town: '',
      travelledAbroad: 'No',
      travelledCountries: '',
      gender: '',
      // Gamification Fields
      points: 0,
      badges: [],
      lastActiveSection: 'personal',
      lifecycleProgress: 0,
    };
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  });

  // Sync with Firestore
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToApplication(currentUser.uid, (data) => {
        if (data) {
          // Merge Firestore data with local state
          setProfile((prev: any) => ({
            ...prev,
            ...data.personalSection, // Assuming personalSection maps to profile
            studentNumber: data.studentNumber || prev.studentNumber,
            // Map other sections as needed
          }));
          // Also update phase if needed
          if (data.stage && parseInt(data.stage) > currentPhase) {
             onPhaseComplete(parseInt(data.stage));
          }
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  // Autosave to Firestore
  useEffect(() => {
    const saveToFirestore = async () => {
      if (currentUser && profile.studentNumber) { // Only save if registered (has ZII number)
         try {
             // We need an appId. If we don't have one in state, we might need to fetch or create.
             // For now, updateApplication takes appId. But createApplication returns appId.
             // We should store appId in profile or state.
             // Assuming we can update by userId or we have appId.
             // dbService.updateApplication takes appId.
             // Let's assume we have a way to get appId or update by userId.
             // For now, I'll skip this automatic update if I don't have appId, 
             // but handleRegistrationSubmit will create it.
         } catch (e) {
             console.error("Autosave failed", e);
         }
      }
    };
    const timer = setTimeout(saveToFirestore, 2000); // Debounce
    return () => clearTimeout(timer);
  }, [profile, currentUser]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({}); // Track touched fields for validation
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'parent' | 'uploads'>(() => {
      // Resume from last active section if available
      return (profile.lastActiveSection as any) || 'personal';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState<'form' | 'flying' | 'success'>('form');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false); // Share Engine Modal
  const [multiStatement, setMultiStatement] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success'>>({
      results: 'idle',
      id: 'idle'
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [activeErrorField, setActiveErrorField] = useState<string | null>(null);

  // Auto-open application if logged in and incomplete
  useEffect(() => {
      if (userRole === UserRole.CURRENT_STUDENT && currentPhase === AppPhase.APPLICATION_ENTRY) {
          setShowApplicationForm(true);
      }
  }, [userRole, currentPhase]);

  // Persist active tab
  useEffect(() => {
      if (userRole === UserRole.CURRENT_STUDENT) {
          setProfile((prev: any) => ({ ...prev, lastActiveSection: activeTab }));
      }
  }, [activeTab, userRole]);

  // Enhanced Field Hint Component
  const FieldHint = ({ content, forceVisible = false }: { content: string, forceVisible?: boolean }) => {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        if (forceVisible) setShow(true);
    }, [forceVisible]);

    return (
      <div className="relative inline-block ml-2 z-10 group">
        <Info 
          className={`w-4 h-4 cursor-pointer transition transform hover:scale-110 ${forceVisible ? 'text-red-500 animate-pulse' : 'text-emerald-600 hover:text-emerald-800'}`}
          onClick={(e) => { e.preventDefault(); setShow(!show); }}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => !forceVisible && setShow(false)}
        />
        {show && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-emerald-900 text-white text-xs p-3 rounded-lg shadow-xl z-50 animate-fade-in border border-emerald-700">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-emerald-900"></div>
          </div>
        )}
      </div>
    );
  };

  // Validation Icon Component
  const ValidationIcon = ({ isValid, isTouched }: { isValid: boolean, isTouched: boolean }) => {
      if (!isTouched) return null;
      return isValid ? (
          <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2 animate-bounce-slow pointer-events-none" />
      ) : (
          <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2 animate-pulse pointer-events-none" />
      );
  };

  // Enhanced Validation Logic
  const validateField = (name: string, value: any, profileData?: any) => {
    let error = '';
    const p = profileData || profile; // Use provided profile data or current state

    switch (name) {
      case 'email':
      case 'parentEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address.';
        break;
      case 'phone':
      case 'parentPhone':
      case 'recommenderPhone':
        if (!/^\+?[\d\s-]{10,}$/.test(value)) error = 'Enter a valid phone number (min 10 digits).';
        break;
      case 'nrc':
        if (!/\d{6}\/\d{2}\/\d{1}/.test(value)) error = 'Format: 123456/10/1';
        break;
      case 'dob':
        if (!value) return 'Date of Birth is required.';
        const date = new Date(value);
        const ageDiff = Date.now() - date.getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (isNaN(date.getTime())) error = 'Invalid date.';
        else if (date > new Date()) error = 'Date cannot be in the future.';
        else if (age < 16) error = 'You must be at least 16 years old.';
        break;
      case 'text':
      case 'name':
      case 'parentName':
      case 'recommenderName':
      case 'emergencyContact':
        if (!value || value.length < 2) error = 'Minimum 2 characters required.';
        break;
      case 'country':
      case 'province':
      case 'town':
      case 'gender':
      case 'maritalStatus':
      case 'englishProficiency':
      case 'discoverySource':
        if (!value || value === 'Select' || value === 'Select...') error = 'Please select an option.';
        break;
      case 'travelledCountries':
        if (p.travelledAbroad === 'Yes' && (!value || value.length < 2)) error = 'Please list the countries.';
        break;
      default:
        if (!value) error = 'This field is required';
    }
    return error;
  };

  // Auto-Save every 10 seconds
  useEffect(() => {
      const interval = setInterval(() => {
          localStorage.setItem('zii_profile_data', JSON.stringify(profile));
          // Optional: Show a subtle toast or indicator
      }, 10000);
      return () => clearInterval(interval);
  }, [profile]);

  // Handle Field Change with Validation
  const handleFieldChange = (field: string, value: any) => {
      // Special handling for nested fields or specific logic can go here
      if (field === 'nrc') {
          setProfile(prev => ({ ...prev, nrcNumber: value }));
      } else if (field === 'dob') {
          setProfile(prev => ({ ...prev, dob: value }));
      } else {
          setProfile(prev => ({ ...prev, [field]: value }));
      }

      if (touched[field]) {
          const error = validateField(field, value);
          setErrors(prev => ({ ...prev, [field]: error }));
      }
  };

  const handleFieldBlur = (field: string) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      let value = profile[field];
      if (field === 'nrc') value = profile.nrcNumber;
      if (field === 'dob') value = profile.dob;
      
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Parent Management
  const addParent = () => {
      if ((profile.parents?.length || 0) < 3) {
          setProfile(prev => ({
              ...prev,
              parents: [...(prev.parents || []), { fullName: '', relationship: '', phone: '', email: '', occupation: '' }]
          }));
      }
  };

  const removeParent = (index: number) => {
      setProfile(prev => ({
          ...prev,
          parents: prev.parents?.filter((_, i) => i !== index)
      }));
  };

  const updateParent = (index: number, field: string, value: string) => {
      const newParents = [...(profile.parents || [])];
      newParents[index] = { ...newParents[index], [field]: value } as any;
      setProfile(prev => ({ ...prev, parents: newParents }));
  };

  // Ensure at least one parent exists
  useEffect(() => {
      if (!profile.parents || profile.parents.length === 0) {
          setProfile(prev => ({ ...prev, parents: [{ fullName: '', relationship: '', phone: '', email: '', occupation: '' }] }));
      }
  }, []);

  // Refs for auto-advance
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const programRef = useRef<HTMLSelectElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const nrcRef = useRef<HTMLInputElement>(null);

  // Persist profile changes
  useEffect(() => {
    localStorage.setItem('zii_profile_data', JSON.stringify(profile));
  }, [profile]);

  // Updated CSS Class for 3D Inputs
  const inputClass = "w-full p-4 rounded-xl border-2 border-red-500 shadow-[3px_3px_0px_rgba(220,38,38,1)] bg-white focus:shadow-[0px_0px_8px_rgba(220,38,38,0.6)] focus:translate-x-[1px] focus:translate-y-[1px] transition-all duration-200 ease-out outline-none text-slate-800 font-bold placeholder-slate-400";

  const handleAutoAdvance = (e: any, nextRef: React.RefObject<HTMLElement> | null) => {
      // Basic auto advance logic
      if (nextRef && nextRef.current) {
          nextRef.current.focus();
      }
  };

  const handleFileUpload = (type: string, file: File) => {
      setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
      // Simulate backend upload
      setTimeout(() => {
          setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
          setProfile((prev: any) => ({ ...prev, uploadedDocuments: [...(prev.uploadedDocuments || []), type] }));
      }, 1500);
  };

  // --- STUDENT FLOW RENDERING ---

  const renderPhaseContent = () => {
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

       const handleRegistrationSubmit = async () => {
          const newErrors: Record<string, string> = {};
          
          if (!profile.name.trim()) newErrors.name = "Full Name is required";
          if (!profile.phone.trim()) newErrors.phone = "Phone Number is required";
          if (!profile.email) newErrors.email = "Email Address is required";
          if (!profile.password) newErrors.password = "Create a password";
          if (!profile.studyLevel) newErrors.studyLevel = "Select a level";
          
          setErrors(newErrors);
          
          if (Object.keys(newErrors).length === 0) {
              const uniqueId = `ZII-${new Date().getFullYear()}-${Math.floor(3276 + Math.random() * 9000)}`;
              setProfile((p: any) => ({ ...p, studentNumber: uniqueId }));
              
              if (currentUser) {
                  try {
                      await createApplication(currentUser.uid, {
                          ...profile,
                          studentNumber: uniqueId
                      });
                  } catch (e) {
                      console.error("Failed to create application in Firestore", e);
                  }
              }

              if (onRoleChange) onRoleChange(UserRole.CURRENT_STUDENT);
              onPhaseComplete(AppPhase.APPLICATION_ENTRY);
              setShowApplicationForm(true);
              setShowSuccessModal(true);
          }
       };

       const handleClose = () => {
           if (onNavigate) onNavigate(PublicView.APPLY_ONLINE);
           else window.history.back();
       };

       return (
          <div className="min-h-[85vh] flex items-center justify-center py-4 lg:py-8 px-4 bg-slate-50">
             <div className="bg-white max-w-6xl w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative">
                <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition z-10"><X className="w-6 h-6" /></button>
                <div className="bg-white border-b border-slate-200 p-6 md:p-8 relative">
                   <div className="text-center mb-6"><span className="bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">OFFICIAL APPLICATION FORM</span></div>
                   
                   {/* Instruction Header */}
                   <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                      <p className="text-red-800 font-bold text-sm">Begin completing your application below by entering your details in the red highlighted boxes.</p>
                   </div>

                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div><h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Start Here</h2><p className="text-slate-600 text-sm md:text-base max-w-2xl">Create your official ZII account.</p></div>
                      <div className="w-full md:w-auto bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1 w-full md:w-48"><span>STEP 1 of 5</span><span>{Math.round(progress)}%</span></div>
                          <div className="w-full md:w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
                      </div>
                   </div>
                </div>

                <div className="p-6 md:p-10 bg-slate-50/50">
                   <form id="start-here-form" onSubmit={(e) => { e.preventDefault(); handleRegistrationSubmit(); }}>
                       <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <label className="block text-xs font-bold text-blue-800 uppercase mb-2">Who are you applying as?</label>
                          <select className={inputClass} value={profile.applicantType} onChange={(e) => setProfile({...profile, applicantType: e.target.value as any})}>
                              <option value="Student">Student (Applying for myself)</option>
                              <option value="Representative">Parent / Guardian / Applying for someone else</option>
                          </select>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <div>
                                <label className="label">Full Name (as per ID)</label>
                                <input ref={nameRef} type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className={`${inputClass} ${errors.name ? 'border-red-600 animate-shake' : ''}`} placeholder="e.g. John Phiri" />
                                {errors.name && <p className="error-text">{errors.name}</p>}
                             </div>
                             <div>
                                <label className="label">Phone Number (WhatsApp)</label>
                                <div className="flex">
                                   <select className="px-3 rounded-l-xl border-2 border-r-0 border-red-500 bg-slate-100 text-slate-700 font-bold text-sm focus:outline-none" value={profile.countryCode} onChange={(e) => setProfile({...profile, countryCode: e.target.value})}>
                                       {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                   </select>
                                   <input ref={phoneRef} type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className={`flex-1 ${inputClass} rounded-l-none`} placeholder="762 523 854" />
                                </div>
                                {errors.phone && <p className="error-text">{errors.phone}</p>}
                             </div>
                             <div>
                                <label className="label">Email Address</label>
                                <input ref={emailRef} type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className={`${inputClass} ${errors.email ? 'border-red-600 animate-shake' : ''}`} placeholder="student@example.com" />
                                {errors.email && <p className="error-text">{errors.email}</p>}
                             </div>
                             <div>
                                <label className="label">Create Password</label>
                                <input ref={passwordRef} type="password" value={profile.password} onChange={(e) => setProfile({...profile, password: e.target.value})} className={`${inputClass} ${errors.password ? 'border-red-600 animate-shake' : ''}`} placeholder="Create a secure password" />
                                {errors.password && <p className="error-text">{errors.password}</p>}
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div>
                                <label className="label">Desired Course</label>
                                <select 
                                    ref={programRef}
                                    value={profile.programInterest} 
                                    onChange={(e) => {
                                        setProfile({...profile, programInterest: e.target.value});
                                    }} 
                                    className={`${inputClass} ${errors.programInterest ? 'border-red-600 animate-shake' : ''}`}
                                >
                                   <option value="">Select a Program</option>
                                   {COURSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
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
                                <select className={inputClass} value={profile.studyMode} onChange={(e) => setProfile({...profile, studyMode: e.target.value as any})}>
                                    <option value="">Select Mode</option>
                                    <option value="OnCampus">Full-time On Campus – India</option>
                                    <option value="Online">Online</option>
                                </select>
                             </div>
                          </div>
                       </div>

                       <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
                          <button type="button" onClick={handleClose} className="text-slate-500 font-bold hover:text-slate-800 flex items-center px-4 py-2 order-2 md:order-1"><ChevronLeft className="w-5 h-5 mr-1" /> Back</button>
                          <button type="submit" className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center order-1 md:order-2">Continue to Details <ArrowRight className="w-5 h-5 ml-2" /></button>
                       </div>
                   </form>
                </div>
             </div>
          </div>
       );
    }

    // PHASE 2: FULL APPLICATION FORM
    if (currentPhase === AppPhase.APPLICATION_ENTRY) {
       if (!showApplicationForm && userRole === UserRole.CURRENT_STUDENT) {
           return null;
       }

       const handleClose = () => {
           setShowApplicationForm(false);
           if (userRole !== UserRole.CURRENT_STUDENT) {
               if (onNavigate) onNavigate(PublicView.APPLY_ONLINE);
               else window.history.back();
           } else {
               // Show toast or alert for auto-save
               alert("Your progress has been auto-saved.");
           }
       };

       const handleSmartSubmit = () => {
           const newErrors: Record<string, string> = {};
           const newTouched: Record<string, boolean> = {};
           let firstErrorField = '';
           let errorTab = '';
     
           // 1. Personal Details
           const personalFields = ['dob', 'gender', 'nrc', 'maritalStatus', 'country', 'province', 'town', 'travelledAbroad', 'travelledCountries', 'englishProficiency', 'emergencyContact', 'discoverySource'];
           
           for (const field of personalFields) {
               if (field === 'province' && profile.country !== 'Zambia') continue;
               if (field === 'town' && profile.country !== 'Zambia') continue;
               if (field === 'travelledCountries' && profile.travelledAbroad !== 'Yes') continue;
     
               const value = field === 'nrc' ? profile.nrcNumber : profile[field];
               const error = validateField(field, value);
               if (error) {
                   newErrors[field] = error;
                   if (!firstErrorField) {
                       firstErrorField = field;
                       errorTab = 'personal';
                   }
               }
               newTouched[field] = true;
           }
     
           // 2. Academic History
           if (profile.academicHistory.institutions.length === 0) {
                // Should not happen
           } else {
               profile.academicHistory.institutions.forEach((inst: any, idx: number) => {
                   if (!inst.name) {
                       newErrors[`institution_${idx}_name`] = 'Required';
                       if (!firstErrorField) { firstErrorField = `institution_${idx}_name`; errorTab = 'academic'; }
                   }
                   if (!inst.year) {
                       newErrors[`institution_${idx}_year`] = 'Required';
                       if (!firstErrorField) { firstErrorField = `institution_${idx}_year`; errorTab = 'academic'; }
                   }
                   if (!inst.examBoard) {
                       newErrors[`institution_${idx}_examBoard`] = 'Required';
                       if (!firstErrorField) { firstErrorField = `institution_${idx}_examBoard`; errorTab = 'academic'; }
                   }
               });
           }
     
           // 3. Parent Details
           if (!profile.parents || profile.parents.length === 0) {
               newErrors.parents = "At least one parent/guardian is required";
               if (!firstErrorField) { firstErrorField = 'add-parent-btn'; errorTab = 'parent'; }
           } else {
               profile.parents.forEach((p: any, i: number) => {
                   if (!p.fullName) {
                       newErrors[`parent_${i}_fullName`] = "Name required";
                       if (!firstErrorField) { firstErrorField = `parent_${i}_fullName`; errorTab = 'parent'; }
                   }
                   if (!p.relationship) {
                       newErrors[`parent_${i}_relationship`] = "Required";
                       if (!firstErrorField) { firstErrorField = `parent_${i}_relationship`; errorTab = 'parent'; }
                   }
                   if (!p.phone) {
                       newErrors[`parent_${i}_phone`] = "Required";
                       if (!firstErrorField) { firstErrorField = `parent_${i}_phone`; errorTab = 'parent'; }
                   }
               });
           }
     
           // Recommender
           if (!profile.recommenderName) {
               newErrors.recommenderName = "Required";
               if (!firstErrorField) { firstErrorField = 'recommenderName'; errorTab = 'parent'; }
           }
           if (!profile.recommenderPhone) {
               newErrors.recommenderPhone = "Required";
               if (!firstErrorField) { firstErrorField = 'recommenderPhone'; errorTab = 'parent'; }
           }
     
           setErrors(newErrors);
           setTouched(prev => ({ ...prev, ...newTouched }));
     
           if (firstErrorField) {
               setActiveTab(errorTab as any);
               setActiveErrorField(firstErrorField);
               
               // Allow time for tab switch and render
               setTimeout(() => {
                   const element = document.getElementById(firstErrorField);
                   if (element) {
                       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                       element.focus();
                   }
               }, 100);
               
               // Clear active error field after a delay
               setTimeout(() => setActiveErrorField(null), 3000);
           } else {
               // Success
               setIsSubmitting(true);
               setSubmissionStage('flying');
               setTimeout(() => {
                   setSubmissionStage('success');
                   setIsSubmitting(false);
                   setShowShareModal(true);
               }, 4000);
           }
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
                   {/* Share Engine Modal */}
                   {showShareModal && (
                       <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
                           <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center relative overflow-hidden">
                               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                               <div className="mb-6">
                                   <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                       <Star className="w-10 h-10 text-yellow-600" />
                                   </div>
                               </div>
                               <h2 className="text-2xl font-extrabold text-slate-900 mb-2">🎉 Congratulations!</h2>
                               <p className="text-slate-600 mb-6 font-medium">You are now eligible to qualify for a <span className="text-purple-600 font-bold">10% Scholarship Bonus!</span></p>
                               
                               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-left">
                                   <p className="text-sm font-bold text-slate-700 mb-2">How to claim:</p>
                                   <p className="text-xs text-slate-500 mb-4">Share this opportunity to 10 WhatsApp or Facebook Groups to unlock your bonus.</p>
                                   
                                   <div className="space-y-3">
                                       <button onClick={() => setProfile((p: any) => ({...p, shareCount: (p.shareCount || 0) + 1}))} className="w-full flex items-center justify-between bg-[#25D366] text-white p-3 rounded-lg font-bold text-sm hover:opacity-90 transition">
                                           <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-2"/> Share on WhatsApp</span>
                                           <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{(profile.shareCount || 0)}/10</span>
                                       </button>
                                       <button onClick={() => setProfile((p: any) => ({...p, shareCount: (p.shareCount || 0) + 1}))} className="w-full flex items-center justify-between bg-[#1877F2] text-white p-3 rounded-lg font-bold text-sm hover:opacity-90 transition">
                                           <span className="flex items-center"><Facebook className="w-4 h-4 mr-2"/> Share on Facebook</span>
                                           <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{(profile.shareCount || 0)}/10</span>
                                       </button>
                                   </div>
                               </div>

                               {(profile.shareCount || 0) >= 10 ? (
                                   <button onClick={() => setShowShareModal(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition animate-pulse">
                                       Claim Bonus & Continue
                                   </button>
                               ) : (
                                   <button onClick={() => setShowShareModal(false)} className="text-slate-400 text-xs font-bold hover:text-slate-600">
                                       Skip for now (Lose Bonus)
                                   </button>
                               )}
                           </div>
                       </div>
                   )}

                   <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 md:p-12 text-center border-4 border-emerald-500 relative overflow-hidden">
                       <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle className="w-12 h-12 text-emerald-600" /></div>
                       <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Application successfully submitted.</h2>
                       <p className="text-lg text-slate-600 mb-4">
                          Your application has been sent to our partner universities and is currently being assessed. Each submission is reviewed and verified manually by university professionals.
                       </p>
                       <p className="text-lg text-slate-600 mb-8 font-bold">
                          Processing time is typically between 24–78 hours.
                       </p>
                       <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-8">
                          <p className="text-orange-800 text-sm">
                             Increase your chances of getting a higher scholarship by completing all required tasks in the Waiting Room within 24 hours to unlock your Offer Letter.
                          </p>
                       </div>
                       <button onClick={() => { onPhaseComplete(AppPhase.OFFER_MANAGEMENT); if(onNavigate) onNavigate(PublicView.HOME); setSubmissionStage('form'); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg">Go to Waiting Room</button>
                   </div>
               </div>
           );
       }

       return (
          <div id="application-form" className="min-h-screen bg-slate-50 pb-20">
             <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="bg-emerald-900 text-white p-2 overflow-hidden whitespace-nowrap">
                   <div className="animate-marquee inline-block text-xs font-bold uppercase tracking-widest">
                      Welcome {profile.name} • ZII Number: {profile.studentNumber} • Complete your application today • Official ZII Portal
                   </div>
                </div>
                <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div><h1 className="text-xl font-bold text-slate-900">Application Form</h1><p className="text-xs font-bold text-orange-600">{profile.name} | {profile.studentNumber}</p></div>
                   <div className="flex space-x-2 w-full md:w-auto justify-end">
                       <button className="text-slate-500 hover:text-emerald-600 p-2"><Save className="w-5 h-5"/></button>
                       <button onClick={handleClose} className="text-slate-500 hover:text-red-600 p-2"><X className="w-5 h-5"/></button>
                   </div>
                </div>
                <div className="max-w-5xl mx-auto px-4 mt-2 overflow-x-auto">
                   <div className="flex space-x-8 min-w-max pb-2">
                       {['personal', 'academic', 'parent', 'uploads'].map((tab) => (
                          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                       ))}
                   </div>
                </div>
             </div>

             <div className="max-w-4xl mx-auto px-4 mt-8">
                <GamifiedDashboard progress={activeTab === 'personal' ? 25 : activeTab === 'academic' ? 50 : activeTab === 'parent' ? 75 : 90} />

                {activeTab === 'personal' && (
                   <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-900 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-600"/> Personal Details</h3></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="relative">
                            <label className="label flex items-center">Date of Birth <FieldHint content="You must be at least 16 years old. Format: DD/MM/YYYY" forceVisible={activeErrorField === 'dob'} /></label>
                            <div className="relative">
                                <input 
                                    id="dob"
                                    type="date" 
                                    className={`${inputClass} ${errors.dob ? 'border-red-500 animate-shake' : touched.dob ? 'border-green-500' : ''}`}
                                    value={profile.dob} 
                                    onChange={(e) => handleFieldChange('dob', e.target.value)}
                                    onBlur={() => handleFieldBlur('dob')}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                <ValidationIcon isValid={!errors.dob} isTouched={!!touched.dob} />
                            </div>
                            {errors.dob && <p className="text-xs text-red-500 font-bold mt-1">{errors.dob}</p>}
                         </div>
                         <div className="relative">
                            <label className="label flex items-center">Gender <FieldHint content="Select your gender as per your ID." forceVisible={activeErrorField === 'gender'} /></label>
                            <select id="gender" className={`${inputClass} ${errors.gender ? 'border-red-500 animate-shake' : ''}`} value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value})}>
                                <option>Select</option><option>Male</option><option>Female</option>
                            </select>
                         </div>
                         <div className="relative">
                            <label className="label flex items-center">NRC / Passport Number <FieldHint content="Enter exactly as shown on your ID. Format: 123456/10/1" forceVisible={activeErrorField === 'nrc'} /></label>
                            <div className="relative">
                                <input 
                                    id="nrc"
                                    type="text" 
                                    className={`${inputClass} ${errors.nrc ? 'border-red-500 animate-shake' : touched.nrc ? 'border-green-500' : ''}`}
                                    placeholder="e.g. 123456/10/1" 
                                    value={profile.nrcNumber} 
                                    onChange={(e) => handleFieldChange('nrc', e.target.value)}
                                    onBlur={() => handleFieldBlur('nrc')}
                                />
                                <ValidationIcon isValid={!errors.nrc} isTouched={!!touched.nrc} />
                            </div>
                            {errors.nrc && <p className="text-xs text-red-500 font-bold mt-1">{errors.nrc}</p>}
                         </div>
                         <div><label className="label">Marital Status</label><select className={inputClass} value={profile.maritalStatus} onChange={(e) => setProfile({...profile, maritalStatus: e.target.value})}><option>Single</option><option>Married</option></select></div>
                      </div>
                      <div className="border-t border-slate-100 pt-6">
                         <h4 className="font-bold text-slate-800 mb-4 flex items-center text-sm uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2"/> Location</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label flex items-center">Country <FieldHint content="Select your country of residence." forceVisible={activeErrorField === 'country'} /></label>
                                <select 
                                    id="country"
                                    className={`${inputClass} ${errors.country ? 'border-red-500 animate-shake' : ''}`} 
                                    value={profile.country} 
                                    onChange={(e) => {
                                        setProfile({...profile, country: e.target.value, province: '', town: ''});
                                        if (e.target.value === 'Zambia') setSelectedProvince('');
                                    }}
                                >
                                    <option value="Zambia">Zambia</option>
                                    <option value="Malawi">Malawi</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {profile.country === 'Zambia' ? (
                                <div>
                                    <label className="label flex items-center">Province <FieldHint content="Select your province." forceVisible={activeErrorField === 'province'} /></label>
                                    <select 
                                        id="province"
                                        className={`${inputClass} ${errors.province ? 'border-red-500 animate-shake' : ''}`} 
                                        value={selectedProvince} 
                                        onChange={(e) => { setSelectedProvince(e.target.value); setProfile({...profile, province: e.target.value, town: ''}); }}
                                    >
                                        <option value="">Select Province</option>
                                        {Object.keys(ZAMBIA_LOCATIONS).map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="label">State / Province</label>
                                    <input type="text" className={`${inputClass} ${errors.province ? 'border-red-500 animate-shake' : ''}`} value={profile.province} onChange={(e) => setProfile({...profile, province: e.target.value})} />
                                </div>
                            )}
                            {profile.country === 'Zambia' ? (
                                <div>
                                    <label className="label flex items-center">Town / City <FieldHint content="Select your town." forceVisible={activeErrorField === 'town'} /></label>
                                    <select 
                                        id="town"
                                        className={`${inputClass} ${errors.town ? 'border-red-500 animate-shake' : ''}`} 
                                        value={profile.town} 
                                        onChange={(e) => setProfile({...profile, town: e.target.value})} 
                                        disabled={!selectedProvince}
                                    >
                                        <option value="">Select Town</option>
                                        {selectedProvince && ZAMBIA_LOCATIONS[selectedProvince].map(city => (<option key={city} value={city}>{city}</option>))}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="label">Town / City</label>
                                    <input type="text" className={`${inputClass} ${errors.town ? 'border-red-500 animate-shake' : ''}`} value={profile.town} onChange={(e) => setProfile({...profile, town: e.target.value})} />
                                </div>
                            )}
                         </div>
                      </div>
                      <div className="border-t border-slate-100 pt-6 bg-slate-50/50 p-4 -mx-4 rounded-xl">
                          <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center"><Target className="w-4 h-4 mr-2"/> Additional Info</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="label flex items-center">Have you ever travelled abroad? <FieldHint content="Select Yes if you have visited any country outside your home country." forceVisible={activeErrorField === 'travelledAbroad'} /></label>
                                  <select id="travelledAbroad" className={`${inputClass} ${errors.travelledAbroad ? 'border-red-500 animate-shake' : ''}`} value={profile.travelledAbroad} onChange={(e) => setProfile({...profile, travelledAbroad: e.target.value as any})}>
                                      <option>No</option><option>Yes</option>
                                  </select>
                              </div>
                              {profile.travelledAbroad === 'Yes' && (
                                  <div className="animate-fade-in">
                                      <label className="label flex items-center">Which countries? <FieldHint content="List the countries you have visited, separated by commas." forceVisible={activeErrorField === 'travelledCountries'} /></label>
                                      <input 
                                        id="travelledCountries"
                                        type="text" 
                                        className={`${inputClass} ${errors.travelledCountries ? 'border-red-500 animate-shake' : ''}`} 
                                        placeholder="e.g. South Africa, UK, Dubai" 
                                        value={profile.travelledCountries} 
                                        onChange={(e) => setProfile({...profile, travelledCountries: e.target.value})} 
                                      />
                                  </div>
                              )}
                              <div><label className="label">English Proficiency</label><select id="englishProficiency" className={`${inputClass} ${errors.englishProficiency ? 'border-red-500 animate-shake' : ''}`} value={profile.englishProficiency} onChange={(e) => setProfile({...profile, englishProficiency: e.target.value})}><option>Native/Fluent</option><option>Intermediate</option><option>Basic</option></select></div>
                              <div><label className="label">Emergency Contact Name</label><input id="emergencyContact" type="text" className={`${inputClass} ${errors.emergencyContact ? 'border-red-500 animate-shake' : ''}`} placeholder="Full Name" value={profile.emergencyContact} onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})} /></div>
                              <div><label className="label">How did you hear about us?</label><select id="discoverySource" className={`${inputClass} ${errors.discoverySource ? 'border-red-500 animate-shake' : ''}`} value={profile.discoverySource} onChange={(e) => setProfile({...profile, discoverySource: e.target.value})}><option value="">Select...</option><option>Facebook</option><option>Radio</option><option>Friend/Family</option><option>School Visit</option></select></div>
                          </div>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                         <button className="flex items-center text-slate-500 font-bold text-sm hover:text-emerald-600 order-2 md:order-1"><Save className="w-4 h-4 mr-2"/> Save & Continue Later</button>
                         <button onClick={() => setActiveTab('academic')} className="btn-primary w-full md:w-auto order-1 md:order-2">Next Step</button>
                      </div>
                   </div>
                )}

                {activeTab === 'academic' && (
                   <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-emerald-600"/> Academic History</h3>
                      <p className="text-sm text-slate-500 italic bg-blue-50 p-2 rounded">Instruction: Use the high school(s) shown on your Statement of Results.</p>
                      
                      {profile.academicHistory.institutions.map((inst: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative mb-4">
                              {idx > 0 && <button onClick={() => removeInstitution(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="relative">
                                      <label className="label">Institution Name</label>
                                      <div className="relative">
                                          <input id={`institution_${idx}_name`} type="text" className={`${inputClass} ${errors[`institution_${idx}_name`] ? 'border-red-500 animate-shake' : ''}`} placeholder="e.g. Kabulonga Boys" value={inst.name} onChange={(e) => updateInstitution(idx, 'name', e.target.value)} />
                                          <ValidationIcon isValid={!errors[`institution_${idx}_name`] && !!inst.name} isTouched={!!inst.name} />
                                      </div>
                                      {errors[`institution_${idx}_name`] && <p className="text-xs text-red-500 font-bold mt-1">{errors[`institution_${idx}_name`]}</p>}
                                  </div>
                                  <div className="relative">
                                      <label className="label">Year of Completion</label>
                                      <div className="relative">
                                          <input id={`institution_${idx}_year`} type="text" className={`${inputClass} ${errors[`institution_${idx}_year`] ? 'border-red-500 animate-shake' : ''}`} placeholder="YYYY" value={inst.year} onChange={(e) => updateInstitution(idx, 'year', e.target.value)} />
                                          <ValidationIcon isValid={!errors[`institution_${idx}_year`] && !!inst.year} isTouched={!!inst.year} />
                                      </div>
                                      {errors[`institution_${idx}_year`] && <p className="text-xs text-red-500 font-bold mt-1">{errors[`institution_${idx}_year`]}</p>}
                                  </div>
                                  <div className="relative">
                                      <label className="label">Examination Board</label>
                                      <div className="relative">
                                          <input id={`institution_${idx}_examBoard`} type="text" className={`${inputClass} ${errors[`institution_${idx}_examBoard`] ? 'border-red-500 animate-shake' : ''}`} placeholder="e.g. ECZ / Cambridge" value={inst.examBoard} onChange={(e) => updateInstitution(idx, 'examBoard', e.target.value)} />
                                          <ValidationIcon isValid={!errors[`institution_${idx}_examBoard`] && !!inst.examBoard} isTouched={!!inst.examBoard} />
                                      </div>
                                      {errors[`institution_${idx}_examBoard`] && <p className="text-xs text-red-500 font-bold mt-1">{errors[`institution_${idx}_examBoard`]}</p>}
                                  </div>
                                  <div><label className="label">Country</label><select id={`institution_${idx}_country`} className={inputClass} value={inst.country} onChange={(e) => updateInstitution(idx, 'country', e.target.value)}>{COUNTRIES.map(c => <option key={c.name}>{c.name}</option>)}</select></div>
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
                   <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-600"/> Parent / Guardian Details</h3>
                          <button onClick={addParent} className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center transition hover:scale-105"><PlusCircle className="w-4 h-4 mr-1"/> Add Another</button>
                      </div>
                      
                      {profile.parents?.map((parent, index) => (
                          <div key={index} className="relative bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 animate-fade-in">
                              {index > 0 && (
                                  <button onClick={() => removeParent(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full"><Trash2 className="w-5 h-5"/></button>
                              )}
                              <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider flex items-center"><User className="w-4 h-4 mr-2 text-slate-400"/> Guardian #{index + 1}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="relative">
                                      <label className="label flex items-center">Full Name <FieldHint content="Enter the full name of your parent or guardian." forceVisible={activeErrorField === `parent_${index}_fullName`} /></label>
                                      <div className="relative">
                                          <input id={`parent_${index}_fullName`} type="text" className={`${inputClass} ${errors[`parent_${index}_fullName`] ? 'border-red-500 animate-shake' : ''}`} value={parent.fullName} onChange={(e) => updateParent(index, 'fullName', e.target.value)} placeholder="e.g. John Doe" />
                                          <ValidationIcon isValid={!errors[`parent_${index}_fullName`] && !!parent.fullName} isTouched={!!parent.fullName} />
                                      </div>
                                      {errors[`parent_${index}_fullName`] && <p className="text-xs text-red-500 font-bold mt-1">{errors[`parent_${index}_fullName`]}</p>}
                                  </div>
                                  <div className="relative">
                                      <label className="label flex items-center">Relationship <FieldHint content="e.g. Father, Mother, Uncle, Aunt." forceVisible={activeErrorField === `parent_${index}_relationship`} /></label>
                                      <select id={`parent_${index}_relationship`} className={`${inputClass} ${errors[`parent_${index}_relationship`] ? 'border-red-500 animate-shake' : ''}`} value={parent.relationship} onChange={(e) => updateParent(index, 'relationship', e.target.value)}>
                                          <option value="">Select...</option><option>Father</option><option>Mother</option><option>Guardian</option><option>Other</option>
                                      </select>
                                      {errors[`parent_${index}_relationship`] && <p className="text-xs text-red-500 font-bold mt-1">{errors[`parent_${index}_relationship`]}</p>}
                                  </div>
                                  <div className="relative">
                                      <label className="label flex items-center">Phone Number <FieldHint content="Enter a valid phone number." forceVisible={activeErrorField === `parent_${index}_phone`} /></label>
                                      <div className="relative">
                                          <input id={`parent_${index}_phone`} type="tel" className={`${inputClass} ${errors[`parent_${index}_phone`] ? 'border-red-500 animate-shake' : ''}`} value={parent.phone} onChange={(e) => updateParent(index, 'phone', e.target.value)} placeholder="+260..." />
                                          <ValidationIcon isValid={!errors[`parent_${index}_phone`] && !!parent.phone} isTouched={!!parent.phone} />
                                      </div>
                                      {errors[`parent_${index}_phone`] && <p className="text-xs text-red-500 font-bold mt-1">{errors[`parent_${index}_phone`]}</p>}
                                  </div>
                                  <div>
                                      <label className="label flex items-center">Email Address <FieldHint content="Optional but recommended." /></label>
                                      <input id={`parent_${index}_email`} type="email" className={inputClass} value={parent.email} onChange={(e) => updateParent(index, 'email', e.target.value)} placeholder="email@example.com" />
                                  </div>
                                  <div className="md:col-span-2">
                                      <label className="label flex items-center">Occupation <FieldHint content="What does your guardian do for a living?" /></label>
                                      <input id={`parent_${index}_occupation`} type="text" className={inputClass} value={parent.occupation} onChange={(e) => updateParent(index, 'occupation', e.target.value)} placeholder="e.g. Teacher, Farmer, Business Owner" />
                                  </div>
                              </div>
                          </div>
                      ))}

                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center border-t border-slate-100 pt-6"><User className="w-5 h-5 mr-2 text-emerald-600"/> Recommender (Mandatory)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative">
                              <label className="label flex items-center">Recommender Name <FieldHint content="Teacher, Pastor, or Mentor." forceVisible={activeErrorField === 'recommenderName'} /></label>
                              <div className="relative">
                                  <input id="recommenderName" type="text" className={`${inputClass} ${errors.recommenderName ? 'border-red-500 animate-shake' : ''}`} placeholder="Teacher / Pastor / Mentor" value={profile.recommenderName} onChange={(e) => setProfile({...profile, recommenderName: e.target.value})} />
                                  <ValidationIcon isValid={!errors.recommenderName && !!profile.recommenderName} isTouched={!!profile.recommenderName} />
                              </div>
                              {errors.recommenderName && <p className="text-xs text-red-500 font-bold mt-1">{errors.recommenderName}</p>}
                          </div>
                          <div className="relative">
                              <label className="label flex items-center">Recommender Phone <FieldHint content="Phone number for verification." forceVisible={activeErrorField === 'recommenderPhone'} /></label>
                              <div className="relative">
                                  <input id="recommenderPhone" type="tel" className={`${inputClass} ${errors.recommenderPhone ? 'border-red-500 animate-shake' : ''}`} value={profile.recommenderPhone} onChange={(e) => setProfile({...profile, recommenderPhone: e.target.value})} />
                                  <ValidationIcon isValid={!errors.recommenderPhone && !!profile.recommenderPhone} isTouched={!!profile.recommenderPhone} />
                              </div>
                              {errors.recommenderPhone && <p className="text-xs text-red-500 font-bold mt-1">{errors.recommenderPhone}</p>}
                          </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                         <button className="flex items-center text-slate-500 font-bold text-sm hover:text-emerald-600 order-2 md:order-1"><Save className="w-4 h-4 mr-2"/> Save & Continue Later</button>
                         <button onClick={() => setActiveTab('uploads')} className="btn-primary w-full md:w-auto order-1 md:order-2">Next Step</button>
                      </div>
                   </div>
                )}

                {activeTab === 'uploads' && (
                   <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-fade-in-up">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><Upload className="w-5 h-5 mr-2 text-emerald-600"/> Documents</h3>
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-sm text-orange-800">
                          <p className="font-bold flex items-center mb-2"><AlertTriangle className="w-4 h-4 mr-2"/> Scan Instructions:</p>
                          <ul className="list-disc pl-5 space-y-1 text-xs">
                              <li>Upload clear scanned copies of required documents. Ensure all text is visible.</li>
                              <li>Formats: PDF, JPG, PNG. Max 5MB.</li>
                              <li>You can upload a file or take a picture directly using your device.</li>
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
                              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer group relative ${uploadStatus.results === 'success' ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                                  <input id="results" type="file" accept="image/*,application/pdf" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFileUpload('results', e.target.files[0])} />
                                  <div className="flex flex-col items-center">
                                      <div className="flex space-x-4 mb-3">
                                          {uploadStatus.results === 'success' ? <CheckCircle className="w-10 h-10 text-green-500"/> : uploadStatus.results === 'uploading' ? <Loader className="w-10 h-10 text-slate-400 animate-spin"/> : (
                                            <>
                                              <FileText className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 transition"/>
                                              <Camera className="w-10 h-10 text-slate-300 group-hover:text-orange-500 transition"/>
                                            </>
                                          )}
                                      </div>
                                      <p className="font-bold text-slate-700">Grade 12 Certificate / Results</p>
                                      <p className="text-xs text-slate-500 mt-1">Tap to Upload File or Take Picture</p>
                                  </div>
                              </div>
                          )}
                         <div className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer group relative ${uploadStatus.id === 'success' ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                            <input id="id" type="file" accept="image/*,application/pdf" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFileUpload('id', e.target.files[0])} />
                            <div className="flex flex-col items-center">
                                <div className="flex space-x-4 mb-3">
                                    {uploadStatus.id === 'success' ? <CheckCircle className="w-10 h-10 text-green-500"/> : uploadStatus.id === 'uploading' ? <Loader className="w-10 h-10 text-slate-400 animate-spin"/> : (
                                      <>
                                        <CreditCard className="w-10 h-10 text-slate-300 group-hover:text-orange-500 transition"/>
                                        <Camera className="w-10 h-10 text-slate-300 group-hover:text-orange-500 transition"/>
                                      </>
                                    )}
                                </div>
                                <p className="font-bold text-slate-700">NRC or Passport</p>
                                <p className="text-xs text-slate-500 mt-1">Tap to Upload File or Take Picture (Front & Back)</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex justify-between pt-8 border-t border-slate-100">
                         <button onClick={() => setActiveTab('parent')} className="text-slate-500 font-bold hover:text-slate-800">Back</button>
                         {isSubmitting ? (
                            <button disabled className="bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold opacity-75 cursor-wait flex items-center"><Loader className="w-5 h-5 mr-2 animate-spin"/> Processing...</button>
                         ) : (
                            <button onClick={handleSmartSubmit} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition transform hover:-translate-y-1">Submit Application</button>
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
        return <WaitingRoom onPhaseComplete={onPhaseComplete} />;
    }

    // PHASE 4: OFFER LETTER (NEW INDEPENDENT PHASE)
    if (currentPhase === AppPhase.OFFER_LETTER) {
        return <OfferLetterPage onPhaseComplete={onPhaseComplete} studentName={profile.name} />;
    }

    // PHASE 5: PRE-DEPARTURE (Visa, Passport, etc.)
    if (currentPhase === AppPhase.PRE_DEPARTURE) {
        return <PreDepartureGuide />;
    }

    return (
      <div className="flex items-center justify-center h-64">
         <div className="text-center">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-slate-700">Phase Under Development</h2>
            <p className="text-slate-500">This section of the student lifecycle is coming soon.</p>
         </div>
      </div>
    );
  };

  const handleResume = () => {
      if (currentPhase === AppPhase.APPLICATION_ENTRY) {
          setShowApplicationForm(true);
          setTimeout(() => {
              const formElement = document.getElementById('application-form');
              if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else if (currentPhase === AppPhase.MARKETING_LEAD) {
          const formElement = document.getElementById('start-here-form');
          if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const getPhaseLabel = (phase: AppPhase) => {
      switch (phase) {
          case AppPhase.MARKETING_LEAD: return 'Start Here';
          case AppPhase.APPLICATION_ENTRY: return 'Application';
          case AppPhase.OFFER_MANAGEMENT: return 'Waiting Room';
          case AppPhase.OFFER_LETTER: return 'Offer Letter';
          case AppPhase.PRE_DEPARTURE: return 'Pre-Departure';
          default: return AppPhase[phase]?.replace('_', ' ') || 'Unknown';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       {/* SUCCESS MODAL */}
       {showSuccessModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
               <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full text-center relative overflow-hidden shadow-2xl border-4 border-white my-auto">
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
                   <button onClick={() => {
                       onPhaseComplete(AppPhase.APPLICATION_ENTRY);
                       setShowSuccessModal(false);
                       setShowApplicationForm(true);
                   }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                       Continue Application <ArrowRight className="w-5 h-5 ml-2"/>
                   </button>
               </div>
           </div>
       )}

       {/* 1. FULL DASHBOARD VIEW */}
       {currentView === PublicView.FULL_DASHBOARD && (userRole === UserRole.CURRENT_STUDENT || currentPhase > AppPhase.MARKETING_LEAD) && !showSuccessModal && (
          <StudentDashboard 
              currentPhase={currentPhase} 
              profile={profile} 
              onNavigate={onNavigate} 
              onResume={() => setShowApplicationForm(true)}
          />
       )}

       {/* 2. MINIMAL DASHBOARD VIEW (DEFAULT) */}
       {currentView !== PublicView.FULL_DASHBOARD && (userRole === UserRole.CURRENT_STUDENT || currentPhase > AppPhase.MARKETING_LEAD) && !showSuccessModal && (
          <div className="max-w-7xl mx-auto px-4 py-8 w-full animate-fade-in">
              {/* HEADER BLOCK */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4">
                      <div className="relative group cursor-pointer">
                          <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center">
                              {profile.uploadedDocuments?.includes('photo') ? (
                                  <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                  <User className="w-8 h-8 text-slate-400" />
                              )}
                          </div>
                          <div className="absolute bottom-0 right-0 bg-emerald-500 p-1 rounded-full border-2 border-white shadow-sm">
                              <Camera className="w-3 h-3 text-white" />
                          </div>
                      </div>
                      <div>
                          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {profile.name.split(' ')[0]}</h1>
                          <p className="text-sm text-slate-500 font-mono">ZII ID: <span className="font-bold text-slate-700">{profile.studentNumber || 'PENDING'}</span></p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                          currentPhase === AppPhase.APPLICATION_ENTRY ? 'bg-orange-100 text-orange-700' :
                          currentPhase === AppPhase.OFFER_MANAGEMENT ? 'bg-blue-100 text-blue-700' :
                          currentPhase === AppPhase.OFFER_LETTER ? 'bg-purple-100 text-purple-700' :
                          'bg-emerald-100 text-emerald-700'
                      }`}>
                          {getPhaseLabel(currentPhase)}
                      </span>
                      <button onClick={onLogout} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition" title="Logout">
                          <LogOut className="w-5 h-5" />
                      </button>
                  </div>
              </div>

              {/* RESUME BLOCK */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <Target className="w-48 h-48 text-orange-500 transform rotate-12" />
                  </div>
                  <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">Action Required</span>
                      </div>
                      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Resume Your Application</h2>
                      <p className="text-slate-600 mb-8 max-w-xl font-medium">
                          You are currently in the <span className="font-bold text-orange-600">{getPhaseLabel(currentPhase)}</span> phase. 
                          Continue where you left off to secure your spot.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                          <button 
                              onClick={handleResume}
                              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition shadow-lg flex items-center justify-center group-hover:scale-[1.02] transform duration-200"
                          >
                              <Play className="w-5 h-5 mr-2 fill-current" /> Resume Application
                          </button>
                          <button 
                              onClick={() => onNavigate && onNavigate(PublicView.FULL_DASHBOARD)}
                              className="bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition flex items-center justify-center"
                          >
                              <LayoutDashboard className="w-5 h-5 mr-2" /> Go to Full Dashboard
                          </button>
                      </div>
                  </div>
              </div>

              {/* PHASE CONTENT */}
              <div id="phase-content" className="animate-fade-in-up delay-100">
                  {renderPhaseContent()}
              </div>
          </div>
       )}
       
       {/* 3. MAIN CONTENT (Render Phase Content for non-students or Full Dashboard hidden logic) */}
       {!(userRole === UserRole.CURRENT_STUDENT || currentPhase > AppPhase.MARKETING_LEAD) && (
         <div className="flex-1">
           {renderPhaseContent()}
         </div>
       )}
    </div>
  );
};

export default DashboardFlow;
