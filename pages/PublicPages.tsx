
import React, { useState, useEffect } from 'react';
import { PublicView, UserRole } from '../types';
import { 
  Building, MapPin, Phone, Mail, GraduationCap, Users, BookOpen, 
  Search as SearchIcon, ArrowRight, CheckCircle, Globe, Briefcase, 
  Calendar, Award, Bot, Info, Video, HelpCircle, FileText,
  Home, DollarSign, HeartPulse, ShieldCheck, Download, MessageSquare, 
  TrendingUp, Plane, Lock, Key, AlertTriangle, Star, Check, ChevronDown, ChevronUp, Layout, Smartphone, Target, Lightbulb, Anchor, Layers,
  Compass, Smile, Zap, Coffee, Music, Mic, Library, Book, Heart, Filter, Flag, Server, LifeBuoy, Megaphone, Share2,
  Play, Upload, LogIn, ExternalLink, ArrowLeft, X, Send, Loader, Clock, Facebook, Twitter, Instagram, Linkedin, Search, Store, Eye, EyeOff, Scale, Handshake,
  Wifi, Monitor, Paperclip, AlertOctagon, UserPlus, Youtube, PenTool, UserCheck, Gift, Rocket
} from 'lucide-react';
import Footer from '../components/Footer';
import ApplyPage from './ApplyPage';
import ForUniversities from './ForUniversities';
import LegalPages from './LegalPages';
import StudentCentre from './StudentCentre';
import ScholarshipExamPage from './ScholarshipExamPage';
import MedicalPage from './MedicalPage';
import TourismPage from './TourismPage';
import WorkPage from './WorkPage';
import InvestPage from './InvestPage';
import ImportPage from './ImportPage';
import MoneyTransferPage from './MoneyTransferPage';
import RecruitmentPage from './RecruitmentPage';
import SearchResults from './SearchResults';
import { FULL_COURSES_DATA, UNIVERSITIES_LIST, Course, University } from '../src/data/courses';

const ServiceCard = ({ title, icon, desc, colorClass }: { title: string, icon: React.ReactNode, desc: string, colorClass: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition group cursor-pointer h-full">
    <div className={`${colorClass} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition`}>
       <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
    </div>
    <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

interface PublicPagesProps {
  view: PublicView;
  onLogin: (role: UserRole) => void;
  onNavigate: (view: PublicView) => void;
}

const PublicPages: React.FC<PublicPagesProps> = ({ view, onLogin, onNavigate }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeHubTab, setActiveHubTab] = useState<'prospective' | 'current' | 'alumni'>('prospective');
  
  // Contact Page State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '', department: 'Student Applications', priority: 'Medium' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeSupportTab, setActiveSupportTab] = useState('BEFORE');
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(null);

  // Login Page State
  const [activePortal, setActivePortal] = useState<'STUDENT' | 'ADMIN' | 'PARENT' | 'UNIVERSITY'>('STUDENT');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  
  // Courses Page State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [compareList, setCompareList] = useState<Course[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseFilterType, setCourseFilterType] = useState('All');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showUniWizard, setShowUniWizard] = useState(false);

  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const handleAIRecommendation = () => {
    setShowAIRecommendation(true);
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
    }, 2500);
  };

  // --- DYNAMIC SEO TITLES ---
  useEffect(() => {
    let title = "Zambians In India | Official Portal";
    let desc = "The official education bridge between Zambia and India.";

    switch(view) {
      case PublicView.ABOUT:
        title = "About Zambians In India | Study in India Official Student Support";
        desc = "Learn how Zambians In India connects students to top Indian universities, provides verified admissions guidance, and supports families through every step of the journey.";
        break;
      case PublicView.COURSES:
        title = "Accredited Courses in India for Zambians | ZII";
        desc = "Browse verified Bachelor's, Master's and PhD programs in India. Engineering, Medicine, Business, and ICT courses accepted by ZAQA.";
        break;
      case PublicView.STUDENT_CENTRE:
        title = "Student Centre | Visa, Accommodation & Alumni Support | ZII";
        desc = "Resources for prospective and current students. Access scholarship search, visa renewal guides, and connect with the alumni network.";
        break;
      case PublicView.SCHOLARSHIP_EXAM:
        title = "Full Scholarship Exam | 100% Sponsorship | ZII";
        desc = "Register for the Full Scholarship Exam. Your pathway to 100% full sponsorship at top Indian universities.";
        break;
      case PublicView.CONTACT:
        title = "Contact Zambians In India | Full Student Support & Application Help";
        desc = "Get full assistance for your university application, uploads, waiting room tasks, university onboarding, and student support across Zambia.";
        break;
      case PublicView.PORTAL_LOGIN:
        title = "Secure Login | Student, Parent & Admin Portal | ZII";
        desc = "Access your dashboard to track applications, view offer letters, and manage student profiles securely.";
        break;
      case PublicView.ADMIN_LOGIN:
        title = "Admin Login | ZII System";
        break;
      case PublicView.LEGAL_STATUS:
      case PublicView.PARTNER_UNIVERSITIES:
      case PublicView.VISA_DISCLAIMER:
      case PublicView.PRIVACY_POLICY:
      case PublicView.TERMS_CONDITIONS:
      case PublicView.CORPORATE_PROFILE:
        title = "Legal & Institutional Disclosure | ZII";
        desc = "Official legal status, disclaimers, and institutional details of Zambians In India.";
        break;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [view]);

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const handlePortalLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoggingIn(true);
      setLoginError('');

      try {
          // Firebase authentication disabled for auto-login
          // const { loginUser } = await import('../src/services/authService');
          // await loginUser(loginUsername, loginPassword);
          
          // Role-based redirection logic would go here
          // For now, we'll use the selected portal to determine the role
          // Ideally, the role should come from the user's profile in Firestore
          
          if (activePortal === 'STUDENT') {
              onLogin(UserRole.CURRENT_STUDENT);
          } else if (activePortal === 'ADMIN') {
              onLogin(UserRole.ADMIN_CONSULTANT);
          } else if (activePortal === 'PARENT') {
              onLogin(UserRole.PARENT);
          } else if (activePortal === 'UNIVERSITY') {
              onLogin(UserRole.PARTNER_UNIVERSITY);
          }
      } catch (error: any) {
          console.error("Login failed:", error);
          setLoginError(error.message || "Incorrect username or password. Please try again.");
      } finally {
          setIsLoggingIn(false);
      }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Password reset link sent to ${forgotPasswordEmail}`);
      setShowForgotPassword(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('submitting');
      setTimeout(() => {
          setFormStatus('success');
          // Reset form but keep department
          setContactForm(prev => ({ ...prev, name: '', email: '', subject: 'General Inquiry', message: '' }));
          setTimeout(() => setFormStatus('idle'), 5000);
      }, 1500);
  };

  const openChatBot = () => {
    window.dispatchEvent(new Event('open-chat-bot'));
  };

  const STUCK_SCENARIOS = [
    { id: 1, q: "I cannot upload my Grade 12 results.", a: "Ensure file is PDF/JPG under 5MB. Try using Chrome browser on a laptop if mobile fails.", action: "Retry Upload" },
    { id: 2, q: "My internet disconnected mid-application.", a: "Don't panic. Our system auto-saves every 30 seconds. Log back in to resume.", action: "Login" },
    { id: 3, q: "I forgot my password.", a: "Use the 'Forgot Password' link on the login page to reset via email.", action: "Reset Pass" },
    { id: 4, q: "My waiting room task shows incomplete.", a: "Tasks take up to 2 minutes to sync. Refresh the page or re-upload the proof.", action: "Refresh" },
    { id: 5, q: "I submitted but did not receive confirmation.", a: "Check your spam folder. If empty, your dashboard status is the source of truth.", action: "Check Status" },
    { id: 6, q: "My documents were rejected.", a: "Read the rejection reason (usually blurriness). Re-scan and re-upload.", action: "Re-Upload" },
    { id: 7, q: "I selected the wrong course.", a: "You can edit your course preference in the Waiting Room before the Offer Letter is issued.", action: "Edit Profile" },
    { id: 8, q: "My payment is not reflecting.", a: "Bank transfers take 24-48 hours. Upload your POP receipt to speed it up.", action: "Upload POP" },
    { id: 9, q: "I do not understand the waiting room.", a: "It's a gamified holding area. Complete tasks to increase your scholarship chances.", action: "Watch Video" },
    { id: 10, q: "My offer letter is locked.", a: "You must complete all mandatory Waiting Room tasks to unlock it.", action: "Go to Room" },
    { id: 11, q: "I uploaded the wrong file.", a: "Go to 'My Documents' in the dashboard and click 'Replace' next to the file.", action: "Manage Docs" },
    { id: 12, q: "I cannot select a dropdown option.", a: "Refresh your browser. Ensure Javascript is enabled.", action: "Reload" },
    { id: 13, q: "The red boxes are not responding.", a: "Ensure you are clicking inside the box. Try a different browser.", action: "Try Chrome" },
    { id: 14, q: "My parent needs guidance.", a: "Book a Virtual Meeting for you and your parent with our counselors.", action: "Book Meeting" },
    { id: 15, q: "I need help from my province.", a: "Check our 'Mobile Support Agents' section for a partner near you.", action: "Find Agent" },
    { id: 16, q: "I do not have a scanner.", a: "Use a scanning app like CamScanner on your phone. Ensure good lighting.", action: "Scan Guide" },
    { id: 17, q: "I do not have stable internet.", a: "Visit a local internet cafe or ZII partner agent. Do not apply on unstable data.", action: "Find Cafe" },
    { id: 18, q: "My email is not verified.", a: "Click 'Resend Verification' on your dashboard. Check Spam.", action: "Resend" },
    { id: 19, q: "I need urgent manual review.", a: "Use the 'Escalate' button in your dashboard (Premium feature) or use Chat.", action: "Open Chat" },
    { id: 20, q: "I want to change my university.", a: "Contact Student Affairs immediately via the Chatbot.", action: "Chat Now" },
  ];

  const SUPPORT_TABS = {
    BEFORE: { title: "Before Applying", icon: HelpCircle, items: [
      { q: "Do I qualify?", a: "Minimum 5 credits for Degree. Pass for Diploma." },
      { q: "How much does it cost?", a: "Application is free. Tuition varies by university." },
      { q: "Which intake is open?", a: "We are currently accepting for June 2026 intake." }
    ]},
    DURING: { title: "During Application", icon: PenTool, items: [
      { q: "Form stuck on Step 2?", a: "Ensure all required red fields are filled." },
      { q: "Can I save and exit?", a: "Yes, use the 'Save' icon at top right." },
      { q: "Photo upload failed?", a: "Ensure it is JPG/PNG and under 5MB." }
    ]},
    WAITING: { title: "Waiting Room", icon: Clock, items: [
      { q: "Why am I here?", a: "Universities are reviewing your file. Complete tasks meanwhile." },
      { q: "How to get points?", a: "Complete the Quiz, Video Challenge, and Essay." },
      { q: "How long is the wait?", a: "Typically 24-72 hours for Offer Letter generation." }
    ]},
    OFFER: { title: "Offer Letter", icon: Award, items: [
      { q: "How to accept?", a: "Click 'Accept' and sign digitally." },
      { q: "Is scholarship guaranteed?", a: "Yes, the offer letter states your final scholarship." },
      { q: "Can I defer?", a: "Yes, but scholarship % may change." }
    ]},
    VISA: { title: "Visa & Travel", icon: Plane, items: [
      { q: "Visa requirements?", a: "Check the Pre-Departure Guide in your dashboard." },
      { q: "Flight booking?", a: "We provide group booking links after visa approval." },
      { q: "Accommodation?", a: "Hostel is booked automatically upon fee payment." }
    ]},
    PARTNER: { title: "Partnerships", icon: Handshake, items: [
      { q: "How to partner?", a: "Visit the 'For Universities' page." },
      { q: "Agent commission?", a: "We work on official mandates, not ad-hoc commissions." }
    ]}
  };

  function ScaleIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg> }

  // --- PAGE LAYOUTS ---

  // LEGAL & TRUST PAGES
  if ([PublicView.LEGAL_STATUS, PublicView.PARTNER_UNIVERSITIES, PublicView.VISA_DISCLAIMER, PublicView.PRIVACY_POLICY, PublicView.TERMS_CONDITIONS, PublicView.CORPORATE_PROFILE].includes(view)) {
    return <LegalPages view={view} onNavigate={onNavigate} />;
  }

  // FOR UNIVERSITIES PAGE
  if (view === PublicView.FOR_UNIVERSITIES) {
    return <ForUniversities onNavigate={onNavigate} onLogin={onLogin} />;
  }

  // APPLY ONLINE PAGE
  if (view === PublicView.APPLY_ONLINE) {
    return <ApplyPage onLogin={onLogin} onNavigate={onNavigate} />;
  }

  // PORTAL LOGIN PAGE
  if (view === PublicView.PORTAL_LOGIN) {
      return (
          <div className="min-h-screen bg-slate-50 flex flex-col">
              <div className="absolute top-4 left-4 z-50">
                  <button onClick={() => window.history.back()} className="p-2 bg-white/80 rounded-full shadow-sm hover:bg-white text-slate-600"><ArrowLeft className="w-6 h-6"/></button>
              </div>
              <div className="absolute top-4 right-4 z-50 hidden md:block">
                  <button onClick={() => onNavigate(PublicView.HOME)} className="p-2 bg-white/80 rounded-full shadow-sm hover:bg-white text-slate-600"><X className="w-6 h-6"/></button>
              </div>

              <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
                  <div className="max-w-lg w-full space-y-6">
                      <div className="text-center mb-8">
                          <h3 className="text-lg font-bold text-slate-700 uppercase tracking-widest mb-4">Choose the Portal for You</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                             {[
                                { id: 'STUDENT', label: 'Student', icon: <Users/> },
                                { id: 'ADMIN', label: 'Admin', icon: <Lock/> },
                                { id: 'PARENT', label: 'Parent', icon: <Heart/> },
                                { id: 'UNIVERSITY', label: 'Uni', icon: <Building/> }
                             ].map((role: any) => (
                                 <button
                                    key={role.id}
                                    onClick={() => { setActivePortal(role.id); setLoginUsername(''); setLoginPassword(''); setLoginError(''); }}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                                        activePortal === role.id 
                                        ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                                        : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                 >
                                     <div className={`w-6 h-6 mb-1 ${activePortal === role.id ? 'text-white' : 'text-slate-400'}`}>{role.icon}</div>
                                     <span className="text-[10px] font-bold uppercase">{role.label}</span>
                                 </button>
                             ))}
                          </div>
                      </div>

                      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-orange-500"></div>
                          
                          <button onClick={() => onNavigate(PublicView.HOME)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 md:hidden z-20">
                             <X className="w-6 h-6"/>
                          </button>

                          <div className="text-center">
                              <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                  {activePortal === 'STUDENT' && <GraduationCap className="h-8 w-8 text-emerald-600" />}
                                  {activePortal === 'ADMIN' && <Lock className="h-8 w-8 text-emerald-600" />}
                                  {activePortal === 'PARENT' && <Users className="h-8 w-8 text-emerald-600" />}
                                  {activePortal === 'UNIVERSITY' && <Building className="h-8 w-8 text-emerald-600" />}
                              </div>
                              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{activePortal === 'UNIVERSITY' ? 'University' : activePortal.charAt(0) + activePortal.slice(1).toLowerCase()} Login</h2>
                              <p className="mt-2 text-sm text-slate-600">Secure access to your ZII dashboard.</p>
                          </div>

                          {!showForgotPassword ? (
                              <form className="mt-8 space-y-6" onSubmit={handlePortalLogin}>
                                  <div className="rounded-md shadow-sm -space-y-px">
                                      <div className="mb-4">
                                          <label className="block text-sm font-bold text-slate-700 mb-2">Username / ZII Number</label>
                                          <input
                                              type="text"
                                              required
                                              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-slate-50"
                                              placeholder="Enter your ID"
                                              value={loginUsername}
                                              onChange={(e) => setLoginUsername(e.target.value)}
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                                          <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-slate-50 pr-10"
                                                placeholder="Password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </button>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center">
                                          <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                          />
                                          <label htmlFor="remember-me" className="ml-2 block text-slate-900">
                                            Remember Password
                                          </label>
                                      </div>
                                      <div className="text-right">
                                          <button type="button" onClick={() => setShowForgotPassword(true)} className="block font-medium text-orange-600 hover:text-orange-500 mb-1">
                                              Forgot Password?
                                          </button>
                                          <button type="button" onClick={() => alert("Please contact support to recover your ZII ID.")} className="block font-medium text-slate-400 hover:text-slate-600 text-xs">
                                              Forgot ZII Number?
                                          </button>
                                      </div>
                                  </div>

                                  {loginError && (
                                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                          <div className="flex">
                                              <div className="flex-shrink-0">
                                                  <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                                              </div>
                                              <div className="ml-3">
                                                  <p className="text-sm text-red-700 font-bold">{loginError}</p>
                                              </div>
                                          </div>
                                      </div>
                                  )}

                                  <div className="flex flex-col sm:flex-row gap-4">
                                      <button
                                          type="submit"
                                          disabled={isLoggingIn}
                                          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                          {isLoggingIn ? (
                                              <span className="flex items-center">
                                                  <Loader className="h-5 w-5 mr-2 animate-spin" /> Verifying...
                                              </span>
                                          ) : (
                                              <>
                                                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                                      <LogIn className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" aria-hidden="true" />
                                                  </span>
                                                  Sign In
                                              </>
                                          )}
                                      </button>
                                      {activePortal === 'STUDENT' && (
                                          <button
                                              type="button"
                                              onClick={() => onNavigate(PublicView.APPLY_ONLINE)}
                                              className="w-full flex justify-center py-3 px-4 border-2 border-slate-200 text-sm font-bold rounded-xl text-slate-600 bg-white hover:bg-slate-50 focus:outline-none transition active:scale-95"
                                          >
                                              Register
                                          </button>
                                      )}
                                  </div>
                                  
                                  <div className="text-[10px] text-slate-400 text-center leading-tight mt-4">
                                      By continuing, the user fully authorizes the upload, storage, and use of submitted documents strictly for educational application, admission, and compliance purposes only.
                                  </div>
                              </form>
                          ) : (
                              <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-2">Enter your Registered Email</label>
                                      <input
                                          type="email"
                                          required
                                          className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-slate-50"
                                          placeholder="student@example.com"
                                          value={forgotPasswordEmail}
                                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                      />
                                  </div>
                                  <button
                                      type="submit"
                                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none shadow-lg"
                                  >
                                      Reset Password
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setShowForgotPassword(false)}
                                      className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700"
                                  >
                                      Back to Login
                                  </button>
                              </form>
                          )}
                      </div>
                      
                      <div className="flex justify-center space-x-6 text-sm font-bold text-slate-500">
                          <button onClick={() => onNavigate(PublicView.CONTACT)} className="hover:text-emerald-600">FAQ</button>
                          <button onClick={() => onNavigate(PublicView.CONTACT)} className="hover:text-emerald-600">Contact Us</button>
                      </div>

                  </div>
              </div>
              <Footer onNavigate={onNavigate} />
          </div>
      );
  }

  // COURSES & PROGRAMS PAGE
  if (view === PublicView.COURSES) {
      const filteredCourses = FULL_COURSES_DATA.filter(c => {
          const matchesSearch = c.name.toLowerCase().includes(courseSearch.toLowerCase());
          const matchesType = courseFilterType === 'All' || c.type === courseFilterType;
          return matchesSearch && matchesType;
      });

      const toggleCompare = (course: Course) => {
          if (compareList.find(c => c.id === course.id)) {
              setCompareList(compareList.filter(c => c.id !== course.id));
          } else {
              if (compareList.length < 3) {
                  setCompareList([...compareList, course]);
              } else {
                  alert("You can only compare up to 3 courses.");
              }
          }
      };

      return (
          <div className="min-h-screen bg-slate-50 font-sans">
              {/* Modals */}
              {selectedCourse && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
                          {/* Top Close Button */}
                          <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-10"><X className="w-6 h-6"/></button>
                          
                          <div className="h-48 bg-slate-900 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-slate-900 opacity-90"></div>
                              <div className="absolute bottom-0 left-0 p-8">
                                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">{selectedCourse.type}</span>
                                  <h2 className="text-3xl md:text-4xl font-bold text-white">{selectedCourse.name}</h2>
                              </div>
                          </div>

                          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="md:col-span-2 space-y-8">
                                  <section>
                                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Info className="w-5 h-5 mr-2 text-emerald-600"/> Course Description</h3>
                                      <p className="text-slate-600 leading-relaxed">{selectedCourse.description}</p>
                                  </section>

                                  <section>
                                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500"/> Why Study This Course?</h3>
                                      <ul className="grid grid-cols-1 gap-3">
                                          {selectedCourse.whyStudy.map((point, i) => (
                                              <li key={i} className="flex items-start text-slate-700">
                                                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5"/>
                                                  {point}
                                              </li>
                                          ))}
                                      </ul>
                                  </section>

                                  <section>
                                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-blue-600"/> Career Opportunities</h3>
                                      <div className="flex flex-wrap gap-2">
                                          {selectedCourse.careerOpportunities.map((job, i) => (
                                              <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm border border-blue-100">{job}</span>
                                          ))}
                                      </div>
                                  </section>
                              </div>

                              <div className="space-y-6">
                                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                      <h4 className="font-bold text-slate-900 mb-4">Course Details</h4>
                                      <div className="space-y-4 text-sm">
                                          <div className="flex justify-between border-b border-slate-200 pb-2">
                                              <span className="text-slate-500">Duration</span>
                                              <span className="font-bold text-slate-900">{selectedCourse.duration}</span>
                                          </div>
                                          <div className="flex justify-between border-b border-slate-200 pb-2">
                                              <span className="text-slate-500">Avg. Salary</span>
                                              <span className="font-bold text-emerald-600 text-right w-1/2">{selectedCourse.averageSalary}</span>
                                          </div>
                                          <div className="flex flex-col border-b border-slate-200 pb-2">
                                              <div className="flex justify-between mb-1">
                                                  <span className="text-slate-500">Tuition Est.</span>
                                                  <span className="font-bold text-slate-900 text-right w-1/2">{selectedCourse.tuition}</span>
                                              </div>
                                              <span className="text-[10px] text-slate-500 italic text-right">*On full self sponsorship. Scholarship will reduce this fee.</span>
                                          </div>
                                      </div>
                                      <div className="mt-6 space-y-3">
                                          <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full btn-primary py-3 text-lg shadow-lg">Apply Now</button>
                                          <button className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center">
                                              <Download className="w-4 h-4 mr-2"/> Download Brochure
                                          </button>
                                          <button className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-100 flex items-center justify-center">
                                              <Share2 className="w-4 h-4 mr-2"/> Share This Course
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Bottom Close Button */}
                          <div className="p-4 border-t border-slate-100 flex justify-end">
                              <button onClick={() => setSelectedCourse(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition">Close</button>
                          </div>
                      </div>
                  </div>
              )}

              {showCompareModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-x-auto">
                      <div className="bg-white rounded-2xl w-full max-w-6xl p-6 relative animate-fade-in-up">
                          <button onClick={() => setShowCompareModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="w-6 h-6"/></button>
                          <h2 className="text-2xl font-bold mb-6">Course Comparison</h2>
                          <div className="grid grid-cols-4 gap-4 min-w-[800px]">
                              <div className="col-span-1 space-y-4 pt-12 font-bold text-slate-500">
                                  <div className="h-10 flex items-center">Duration</div>
                                  <div className="h-10 flex items-center">Tuition</div>
                                  <div className="h-10 flex items-center">Salary Potential</div>
                                  <div className="h-10 flex items-center">Level</div>
                              </div>
                              {compareList.map(c => (
                                  <div key={c.id} className="col-span-1 space-y-4 border-l pl-4">
                                      <h3 className="font-bold text-lg h-12 flex items-center">{c.name}</h3>
                                      <div className="h-10 flex items-center bg-slate-50 px-2 rounded">{c.duration}</div>
                                      <div className="h-10 flex items-center bg-slate-50 px-2 rounded text-sm">{c.tuition}</div>
                                      <div className="h-10 flex items-center bg-slate-50 px-2 rounded text-sm">{c.averageSalary}</div>
                                      <div className="h-10 flex items-center bg-slate-50 px-2 rounded">{c.type}</div>
                                      <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full btn-primary text-xs py-2">Apply</button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {selectedUniversity && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/95 backdrop-blur-md overflow-y-auto">
                      <div className="bg-white md:rounded-3xl w-full max-w-5xl h-full md:h-auto md:max-h-[95vh] overflow-y-auto relative animate-fade-in-up shadow-2xl flex flex-col">
                          
                          {/* 1️⃣ UNIVERSITY HEADER BLOCK */}
                          <div className="relative bg-slate-900 text-white shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                              
                              {/* Top Controls */}
                              <div className="absolute top-4 right-4 z-20 flex gap-2">
                                  <button onClick={() => setSelectedUniversity(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition">
                                      <X className="w-6 h-6"/>
                                  </button>
                              </div>

                              <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-2 shadow-xl flex items-center justify-center shrink-0">
                                      {selectedUniversity.logo ? (
                                          <img src={selectedUniversity.logo} alt={selectedUniversity.name} className="max-w-full max-h-full object-contain" />
                                      ) : (
                                          <Building className="w-12 h-12 text-slate-300"/>
                                      )}
                                  </div>
                                  <div className="flex-grow space-y-2">
                                      <div className="flex flex-wrap gap-2 mb-2">
                                          {selectedUniversity.rank <= 100 && (
                                              <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center shadow-lg">
                                                  <Award className="w-3 h-3 mr-1"/> Top 100 India University
                                              </span>
                                          )}
                                          {selectedUniversity.id === 'ct-university' && (
                                              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center shadow-lg animate-pulse">
                                                  <Star className="w-3 h-3 mr-1"/> Most Highly Recommended
                                              </span>
                                          )}
                                          <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center shadow-lg">
                                              <CheckCircle className="w-3 h-3 mr-1"/> Verified & Inspected
                                          </span>
                                      </div>
                                      <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">{selectedUniversity.name}</h2>
                                      <div className="flex flex-wrap gap-4 text-sm text-slate-300 font-medium">
                                          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-orange-500"/> {selectedUniversity.location}</span>
                                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-emerald-500"/> Est. {selectedUniversity.establishedYear || '19XX'}</span>
                                          <span className="flex items-center"><Building className="w-4 h-4 mr-1 text-blue-500"/> {selectedUniversity.type || 'Private University'}</span>
                                      </div>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                          {(selectedUniversity.accreditation || ['UGC', 'NAAC']).map((acc, i) => (
                                              <span key={i} className="text-[10px] border border-slate-600 px-2 py-0.5 rounded text-slate-400">{acc}</span>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="flex-grow overflow-y-auto">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                                  
                                  {/* LEFT COLUMN (Main Content) */}
                                  <div className="lg:col-span-2 p-6 md:p-10 space-y-10 border-r border-slate-100">
                                      
                                      {/* 2️⃣ UNIVERSITY INTRODUCTION VIDEO */}
                                      <section className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black relative aspect-video group">
                                          <iframe 
                                              width="100%" 
                                              height="100%" 
                                              src={selectedUniversity.youtubeUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                                              title="University Video" 
                                              frameBorder="0" 
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                              allowFullScreen
                                              className="absolute inset-0 w-full h-full"
                                          ></iframe>
                                          <div className="absolute bottom-4 right-4">
                                              <a 
                                                  href={selectedUniversity.id === 'ct-university' ? "https://www.youtube.com/@CTUniversityOfficial" : "https://www.youtube.com/results?search_query=" + selectedUniversity.name} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center hover:bg-red-700 transition shadow-lg"
                                              >
                                                  <Youtube className="w-4 h-4 mr-2"/> Watch Official Channel
                                              </a>
                                          </div>
                                      </section>

                                      {/* 3️⃣ VERIFIED UNIVERSITY OVERVIEW */}
                                      <section>
                                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><ShieldCheck className="w-6 h-6 mr-2 text-emerald-600"/> Verified Overview</h3>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                              {[
                                                  { label: "Campus Size", val: selectedUniversity.campusSize || "100+ Acres", icon: MapPin },
                                                  { label: "Students", val: selectedUniversity.studentCount || "15,000+", icon: Users },
                                                  { label: "Intl. Students", val: selectedUniversity.internationalCount || "500+", icon: Globe },
                                                  { label: "Faculties", val: selectedUniversity.facultyCount || "12+", icon: BookOpen },
                                              ].map((stat, i) => (
                                                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center hover:shadow-md transition">
                                                      <stat.icon className="w-6 h-6 mx-auto mb-2 text-slate-400"/>
                                                      <div className="font-bold text-slate-900 text-lg">{stat.val}</div>
                                                      <div className="text-xs text-slate-500 font-bold uppercase">{stat.label}</div>
                                                  </div>
                                              ))}
                                          </div>
                                      </section>

                                      {/* 4️⃣ WHY STUDY AT THIS UNIVERSITY? */}
                                      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                                          <div className="absolute top-0 right-0 p-8 opacity-10"><Star className="w-64 h-64 text-white"/></div>
                                          <h3 className="text-xl font-bold mb-6 flex items-center relative z-10"><Rocket className="w-6 h-6 mr-2 text-orange-500"/> Why Study Here?</h3>
                                          <ul className="space-y-4 relative z-10">
                                              {(selectedUniversity.whyStudy || [
                                                  "Strong industry linkages & partnerships.",
                                                  "High employability rate for graduates.",
                                                  "International student-friendly campus.",
                                                  "Modern infrastructure & labs.",
                                                  "Dedicated placement cell."
                                              ]).map((point, i) => (
                                                  <li key={i} className="flex items-start">
                                                      <div className="bg-orange-500/20 p-1 rounded-full mr-3 mt-0.5">
                                                          <Check className="w-4 h-4 text-orange-400"/>
                                                      </div>
                                                      <span className="font-medium text-lg leading-snug">{point}</span>
                                                  </li>
                                              ))}
                                          </ul>
                                      </section>

                                      {/* 5️⃣ CAREER OUTCOMES */}
                                      <section>
                                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Briefcase className="w-6 h-6 mr-2 text-blue-600"/> Career Outcomes</h3>
                                          <div className="flex flex-wrap gap-3">
                                              {(selectedUniversity.careerOutcomes || ["Software Engineer", "Manager", "Researcher", "Entrepreneur"]).map((career, i) => (
                                                  <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold border border-blue-100 flex items-center">
                                                      <TrendingUp className="w-4 h-4 mr-2 opacity-50"/> {career}
                                                  </span>
                                              ))}
                                          </div>
                                      </section>

                                      {/* 7️⃣ CAMPUS LIFE & FACILITIES */}
                                      <section>
                                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Coffee className="w-6 h-6 mr-2 text-orange-600"/> Campus Life & Facilities</h3>
                                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                              {(selectedUniversity.facilities || ["Hostels", "Library", "Sports", "Labs", "Cafeteria", "Medical"]).map((fac, i) => (
                                                  <div key={i} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2"/>
                                                      <span className="text-sm font-bold text-slate-700">{fac}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </section>

                                      {/* 9️⃣ COURSES OFFERED */}
                                      <section id="courses-section">
                                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Book className="w-6 h-6 mr-2 text-indigo-600"/> Faculties & Courses</h3>
                                          <div className="space-y-2">
                                              {(selectedUniversity.faculties || ["Engineering", "Management", "Science", "Arts", "Law"]).map((faculty, i) => (
                                                  <div key={i} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition cursor-pointer group">
                                                      <div className="flex justify-between items-center">
                                                          <span className="font-bold text-slate-800">{faculty}</span>
                                                          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600"/>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                          <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="mt-4 text-emerald-600 font-bold text-sm hover:underline flex items-center">
                                              View Detailed Course List <ArrowRight className="w-4 h-4 ml-1"/>
                                          </button>
                                      </section>

                                      {/* 13️⃣ SUCCESS STORIES */}
                                      <section className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                                          <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center"><Smile className="w-6 h-6 mr-2 text-emerald-600"/> Student Success Stories</h3>
                                          <div className="flex gap-4 overflow-x-auto pb-4">
                                              {[1, 2].map((_, i) => (
                                                  <div key={i} className="min-w-[280px] bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                                                      <div className="flex items-center mb-3">
                                                          <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                                                          <div>
                                                              <p className="font-bold text-sm">Zambian Student</p>
                                                              <p className="text-xs text-slate-500">B.Tech CSE, 2nd Year</p>
                                                          </div>
                                                      </div>
                                                      <p className="text-sm text-slate-600 italic">"The campus is amazing and the faculty is very supportive. I feel at home here."</p>
                                                  </div>
                                              ))}
                                          </div>
                                      </section>

                                      {/* 14️⃣ ADMISSION PROCESS SNAPSHOT */}
                                      <section>
                                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Plane className="w-6 h-6 mr-2 text-slate-600"/> Admission Process</h3>
                                          <div className="flex justify-between items-center relative">
                                              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10"></div>
                                              {['Apply', 'Review', 'Offer', 'Visa', 'Travel'].map((step, i) => (
                                                  <div key={i} className="flex flex-col items-center bg-white px-2">
                                                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2 shadow-lg">
                                                          {i + 1}
                                                      </div>
                                                      <span className="text-[10px] font-bold uppercase text-slate-500">{step}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </section>

                                  </div>

                                  {/* RIGHT COLUMN (Sticky Sidebar) */}
                                  <div className="bg-slate-50 p-6 md:p-8 border-l border-slate-100 space-y-8">
                                      
                                      {/* 8️⃣ ESTIMATED COST BLOCK */}
                                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                                          <h3 className="font-bold text-slate-900 mb-4 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-emerald-600"/> Estimated Cost</h3>
                                          <div className="space-y-4">
                                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                                  <span className="text-sm text-slate-500">Tuition (Sem)</span>
                                                  <span className="font-bold text-slate-900">{selectedUniversity.costEstimate?.tuition || "K5,000 - K7,000"}</span>
                                              </div>
                                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                                  <span className="text-sm text-slate-500">Hostel</span>
                                                  <span className="font-bold text-slate-900">{selectedUniversity.costEstimate?.accommodation || "K3,000"}</span>
                                              </div>
                                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                                  <span className="text-sm text-slate-500">Meals</span>
                                                  <span className="font-bold text-emerald-600">{selectedUniversity.costEstimate?.meals || "Included"}</span>
                                              </div>
                                              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                                                  <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Scholarship Available</span>
                                                  <span className="text-2xl font-black text-emerald-600">{selectedUniversity.scholarship}</span>
                                              </div>
                                              <div className="flex items-center justify-center text-xs font-bold text-slate-500">
                                                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                                  Pay After Visa Approval Available
                                              </div>
                                          </div>
                                      </div>

                                      {/* 6️⃣ INTERNATIONAL STUDENT SUPPORT */}
                                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                          <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Globe className="w-5 h-5 mr-2 text-blue-600"/> International Support</h3>
                                          <ul className="space-y-3">
                                              {['Dedicated International Office', 'Visa Support Guidance', 'Airport Pickup', 'Cultural Integration'].map((item, i) => (
                                                  <li key={i} className="flex items-center text-sm text-slate-600">
                                                      <Check className="w-4 h-4 text-blue-500 mr-2"/> {item}
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>

                                      {/* 10️⃣ SCHOLARSHIP OPPORTUNITIES */}
                                      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg">
                                          <h3 className="font-bold mb-2 flex items-center"><Gift className="w-5 h-5 mr-2"/> Scholarships</h3>
                                          <p className="text-sm text-orange-100 mb-4">Special allocation for Zambian students available now.</p>
                                          <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full bg-white text-orange-600 py-2 rounded-xl font-bold text-sm hover:bg-orange-50 transition shadow-md">
                                              Apply for Scholarship
                                          </button>
                                      </div>

                                      {/* 15️⃣ CALL TO ACTION SECTION */}
                                      <div className="space-y-3 sticky top-4">
                                          <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                                              Apply Now <ArrowRight className="w-5 h-5 ml-2"/>
                                          </button>
                                          <button onClick={() => setShowCompareModal(true)} className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center">
                                              <Scale className="w-5 h-5 mr-2"/> Compare University
                                          </button>
                                          <div className="grid grid-cols-2 gap-3">
                                              <button className="bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 flex items-center justify-center">
                                                  <Heart className="w-4 h-4 mr-2"/> Save
                                              </button>
                                              <button className="bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 flex items-center justify-center">
                                                  <Share2 className="w-4 h-4 mr-2"/> Share
                                              </button>
                                          </div>
                                          <button onClick={() => onNavigate(PublicView.CONTACT)} className="w-full bg-slate-50 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 flex items-center justify-center mt-2">
                                              <Phone className="w-4 h-4 mr-2"/> Request Call Back
                                          </button>
                                          <button className="w-full text-slate-400 text-xs font-bold hover:text-slate-600 flex items-center justify-center mt-4">
                                              <Download className="w-3 h-3 mr-1"/> Download Brochure
                                          </button>
                                      </div>

                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Hero Section */}
              <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070')] opacity-20 bg-cover bg-center"></div>
                  <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                      <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Courses & Programs</h1>
                      <p className="text-emerald-100 max-w-2xl mx-auto text-base md:text-lg">
                          Discover world-class accredited programs from India's top universities.
                      </p>
                      
                      {/* Intake Countdown */}
                      <div className="mt-6 bg-orange-600/90 backdrop-blur text-white py-2 px-6 rounded-full inline-block font-bold text-sm md:text-base animate-pulse shadow-lg border border-orange-400">
                          ⏳ June 2026 Intake: <span className="text-yellow-300">14 Days Left</span> to Apply for 100% Scholarship!
                      </div>

                      {/* Search Bar */}
                      <div className="mt-8 max-w-2xl mx-auto relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"/>
                          <input 
                              type="text" 
                              placeholder="Search for a course (e.g. Nursing, Engineering)..." 
                              className="w-full pl-12 pr-4 py-4 rounded-full text-slate-900 font-bold focus:ring-4 focus:ring-emerald-500 outline-none shadow-xl"
                              value={courseSearch}
                              onChange={(e) => setCourseSearch(e.target.value)}
                          />
                          <button 
                              onClick={handleAIRecommendation}
                              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 rounded-full font-bold text-xs md:text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg flex items-center transition transform hover:scale-105"
                          >
                              <Bot className="w-4 h-4 mr-2"/> Ask AI
                          </button>
                      </div>
                  </div>
              </div>

              {/* AI Recommendation Modal */}
              {showAIRecommendation && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="bg-white rounded-2xl w-full max-w-md relative animate-fade-in-up overflow-hidden shadow-2xl">
                          <button onClick={() => setShowAIRecommendation(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-10"><X className="w-5 h-5"/></button>
                          
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
                              <Bot className="w-12 h-12 mx-auto mb-3 text-white/90"/>
                              <h2 className="text-2xl font-bold">ZII AI Advisor</h2>
                              <p className="text-indigo-100 text-sm">Personalized University Matching</p>
                          </div>

                          <div className="p-6">
                              {aiAnalyzing ? (
                                  <div className="text-center py-8 space-y-4">
                                      <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto"/>
                                      <p className="text-slate-600 font-medium animate-pulse">Analyzing scholarship trends...</p>
                                      <p className="text-slate-400 text-xs">Matching your profile with 100+ universities</p>
                                  </div>
                              ) : (
                                  <div className="space-y-6 animate-fade-in">
                                      <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-start">
                                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 shrink-0"/>
                                          <div>
                                              <h3 className="font-bold text-green-800">Top Recommendation Found!</h3>
                                              <p className="text-sm text-green-700 mt-1">Based on current scholarship availability and job market trends, we highly recommend:</p>
                                          </div>
                                      </div>

                                      <div className="space-y-3">
                                          <div onClick={() => { setShowAIRecommendation(false); setSelectedUniversity(UNIVERSITIES_LIST.find(u => u.id === 'ct-university') || null); }} className="p-4 border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition group">
                                              <div className="flex justify-between items-center mb-2">
                                                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Best Overall</span>
                                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500"/>
                                              </div>
                                              <h4 className="font-bold text-slate-900">CT University</h4>
                                              <p className="text-xs text-slate-500">Highest Scholarship (100%) • Modern Campus</p>
                                          </div>

                                          <div onClick={() => { setShowAIRecommendation(false); setSelectedUniversity(UNIVERSITIES_LIST.find(u => u.id === 'lamrin-tech') || null); }} className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition group">
                                              <div className="flex justify-between items-center mb-2">
                                                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Best for Skills</span>
                                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500"/>
                                              </div>
                                              <h4 className="font-bold text-slate-900">Lamrin Tech Skills University</h4>
                                              <p className="text-xs text-slate-500">IBM & Tata Partners • Guaranteed Jobs</p>
                                          </div>
                                      </div>

                                      <button onClick={() => setShowAIRecommendation(false)} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200">
                                          Close Recommendation
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
                  
                  {/* Filters & Comparison Bar */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-30">
                      <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                          {['All', 'Undergraduate', 'Postgraduate', 'Diploma'].map(type => (
                              <button 
                                  key={type}
                                  onClick={() => setCourseFilterType(type)}
                                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${courseFilterType === type ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                              >
                                  {type}
                              </button>
                          ))}
                      </div>
                      
                      {compareList.length > 0 && (
                          <button 
                              onClick={() => setShowCompareModal(true)}
                              className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-700 shadow-md animate-pulse"
                          >
                              Compare ({compareList.length}) Courses
                          </button>
                      )}
                      
                      <button 
                          onClick={() => onNavigate(PublicView.APPLY_ONLINE)} 
                          className="bg-slate-800 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-700 shadow-md"
                      >
                          Compare Universities
                      </button>
                  </div>

                  {/* Course Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => (
                          <div key={course.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-xl transition group flex flex-col h-full">
                              <div className="p-6 flex-grow">
                                  <div className="flex justify-between items-start mb-4">
                                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{course.type}</span>
                                      <div className="flex items-center space-x-2">
                                          <input 
                                              type="checkbox" 
                                              checked={!!compareList.find(c => c.id === course.id)}
                                              onChange={() => toggleCompare(course)}
                                              className="rounded text-emerald-600 focus:ring-emerald-500"
                                          />
                                          <span className="text-xs text-slate-400">Compare</span>
                                      </div>
                                  </div>
                                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-emerald-700 transition">{course.name}</h3>
                                  <p className="text-sm text-slate-500 line-clamp-3 mb-4">{course.description}</p>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                      {course.tags.slice(0, 3).map(tag => (
                                          <span key={tag} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">{tag}</span>
                                      ))}
                                  </div>
                              </div>
                              <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex gap-3">
                                  <button onClick={() => setSelectedCourse(course)} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition">
                                      View Details
                                  </button>
                                  <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition shadow-sm">
                                      Apply
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* University Ranking Section */}
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                          <h2 className="text-2xl font-bold flex items-center"><Award className="w-6 h-6 text-yellow-500 mr-3"/> Top 100 Universities in India</h2>
                          <button className="text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20">View Methodology</button>
                      </div>
                      <div className="max-h-[600px] overflow-y-auto">
                          {UNIVERSITIES_LIST.map((uni) => (
                              <div key={uni.id} className={`p-6 border-b border-slate-100 flex items-center hover:bg-slate-50 transition ${uni.rank <= 2 ? 'bg-yellow-50/50' : ''}`}>
                                  <div className="w-12 h-12 flex items-center justify-center font-bold text-xl text-slate-400 mr-6">
                                      {uni.rank === 1 ? <span className="text-4xl">🥇</span> : uni.rank === 2 ? <span className="text-4xl">🥈</span> : `#${uni.rank}`}
                                  </div>
                                  <div className="flex-grow">
                                      <div className="flex items-center gap-3 mb-1">
                                          <h3 className="font-bold text-lg text-slate-900">{uni.name}</h3>
                                          {uni.isPartner && <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Partner</span>}
                                          {uni.rank === 1 && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold flex items-center"><Star className="w-3 h-3 mr-1"/> Most Recommended</span>}
                                      </div>
                                      <p className="text-sm text-slate-500 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {uni.location}</p>
                                  </div>
                                  <div className="text-right hidden md:block">
                                      <div className="text-sm font-bold text-emerald-600">{uni.scholarship}</div>
                                      <button onClick={() => setSelectedUniversity(uni)} className="text-xs text-slate-400 hover:text-orange-600 underline mt-1">View Details</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

              </div>
              <Footer onNavigate={onNavigate} />
          </div>
      );
  }

  // ABOUT US PAGE
  if (view === PublicView.ABOUT) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden">
        {/* 1. HERO SECTION */}
        <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
           <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070')] bg-cover bg-center"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
           
           <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
              <div className="inline-block mb-6 animate-fade-in-down">
                 <span className="bg-orange-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-orange-500">
                    Trusted. Verified. Official.
                 </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
                 Connecting Zambia to <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">World-Class Indian Universities.</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
                 The official community-led platform bridging Zambia and India. <br/>
                 <span className="text-orange-400 font-bold">Not an agent. A movement.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-emerald-500">
                    Apply Now
                 </button>
                 <button onClick={() => onNavigate(PublicView.PORTAL_LOGIN)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                    Login
                 </button>
                 <button onClick={() => onNavigate(PublicView.FOR_UNIVERSITIES)} className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition shadow-xl active:scale-95">
                    Partner with Us
                 </button>
              </div>
           </div>
        </div>

        {/* 2. OUR STORY */}
        <div className="py-24 bg-white">
           <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <div>
                 <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Our Heritage</div>
                 <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Built By Those Who Walked The Path.</h2>
                 <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                    <p>
                       Zambians In India (ZII) was founded over 5 years ago with a single, powerful mission: <strong>to eliminate confusion, fraud, and misinformation</strong> in the study abroad process.
                    </p>
                    <p>
                       We are not a commercial agency. We are a structured ecosystem developed by former students and education experts who understand the challenges families face. Our platform replaces uncertainty with a verified, secure, and transparent application journey.
                    </p>
                    <p>
                       Today, we are the trusted bridge for thousands of Zambian students, ensuring every admission is legitimate, every scholarship is real, and every student is supported from Lusaka to their university campus.
                    </p>
                 </div>
                 <div className="mt-10">
                    <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="text-orange-600 font-bold text-lg flex items-center hover:underline">
                       Start Your Journey Today <ArrowRight className="ml-2 w-5 h-5"/>
                    </button>
                 </div>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-orange-500 rounded-3xl transform rotate-3 opacity-10"></div>
                 <div className="relative bg-slate-100 rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070" alt="Students" className="w-full h-full object-cover"/>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
                       <p className="text-white font-bold text-xl">"Education is the most powerful weapon which you can use to change the world."</p>
                       <p className="text-orange-400 text-sm mt-2">- Nelson Mandela</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. OUR MISSION */}
        <div className="py-24 bg-slate-900 text-white">
           <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16">Our Core Mission Pillars</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                 {[
                    { icon: Search, title: "Transparency", desc: "No hidden fees. Direct tuition payments to universities." },
                    { icon: ShieldCheck, title: "Student Protection", desc: "Vetted institutions and verified offer letters." },
                    { icon: Handshake, title: "Verified Partnerships", desc: "Official agreements with India's top universities." },
                    { icon: Scale, title: "Ethical Admissions", desc: "Merit-based scholarships and honest guidance." },
                    { icon: TrendingUp, title: "Student Success", desc: "Support beyond admission: visa, travel, and settling in." }
                 ].map((item, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition group">
                       <item.icon className="w-10 h-10 text-emerald-400 mb-6 mx-auto group-hover:scale-110 transition"/>
                       <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                       <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                 ))}
              </div>
              <div className="mt-16">
                 <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                    Apply Through a Verified Process
                 </button>
              </div>
           </div>
        </div>

        {/* 4. OUR VISION */}
        <div className="py-24 bg-emerald-900 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <Globe className="w-20 h-20 text-orange-400 mx-auto mb-8 animate-pulse"/>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                 Building Future Professionals. <br/> Expanding Global Access.
              </h2>
              <p className="text-xl text-emerald-100 mb-10 font-light">
                 Our vision is to be the leading education bridge between Zambia and India, empowering a new generation of skilled professionals who will drive Zambia's development.
              </p>
              <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-white">
                 Join the Movement
              </button>
           </div>
        </div>

        {/* 5. WHAT WE DO */}
        <div className="py-24 bg-white">
           <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                 <h2 className="text-4xl font-serif font-bold text-slate-900">What We Do</h2>
                 <p className="text-slate-500 mt-4 text-lg">Comprehensive support from your first question to your graduation day.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    {[
                       "University Matching & Course Selection",
                       "Official Application Processing",
                       "Document Verification & Guidance",
                       "Scholarship Negotiation",
                       "Waiting Room & Status Tracking",
                       "Manual University Review Coordination",
                       "Pre-Departure & Visa Advisory"
                    ].map((service, i) => (
                       <div key={i} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:border-emerald-200 transition">
                          <CheckCircle className="w-6 h-6 text-emerald-600 mr-4 flex-shrink-0"/>
                          <span className="font-bold text-slate-700">{service}</span>
                       </div>
                    ))}
                 </div>
                 <div className="bg-slate-900 rounded-3xl p-10 text-white flex flex-col justify-center items-center text-center">
                    <Award className="w-16 h-16 text-orange-500 mb-6"/>
                    <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                    <p className="text-slate-300 mb-8">Take the first step towards a world-class education today.</p>
                    <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition shadow-lg w-full md:w-auto">
                       Begin Your Official Application
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* 6. HOW OUR PROCESS WORKS */}
        <div className="py-24 bg-slate-50">
           <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 text-center mb-16">How Our Process Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 relative">
                 <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 -translate-y-1/2 rounded-full"></div>
                 {[
                    { step: 1, label: "Start Application", icon: Play },
                    { step: 2, label: "Submit Docs", icon: Upload },
                    { step: 3, label: "Waiting Room", icon: Clock },
                    { step: 4, label: "Uni Review", icon: Eye },
                    { step: 5, label: "Offer Letter", icon: Mail },
                    { step: 6, label: "Visa & Travel", icon: Plane },
                    { step: 7, label: "Join Community", icon: Users }
                 ].map((s, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center group">
                       <div className="w-16 h-16 bg-white border-4 border-emerald-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition group-hover:border-orange-500 mb-4">
                          <s.icon className="w-6 h-6 text-slate-700"/>
                       </div>
                       <div className="text-center bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-100">
                          <span className="block text-xs font-bold text-orange-600 mb-1">Step {s.step}</span>
                          <span className="block text-xs font-bold text-slate-800 uppercase leading-tight">{s.label}</span>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="mt-16 text-center">
                 <p className="text-slate-600 mb-8 font-medium">Join the growing community of over <span className="text-emerald-700 font-extrabold text-xl">22,000+</span> Zambians already in India.</p>
                 <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-emerald-700 text-white px-12 py-4 rounded-full font-bold text-xl hover:bg-emerald-800 transition shadow-xl transform hover:scale-105 active:scale-95">
                    Start Now
                 </button>
              </div>
           </div>
        </div>

        {/* 7. WHY CHOOSE ZII */}
        <div className="py-24 bg-white">
           <div className="max-w-5xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12">Why Choose Zambians In India?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                 {[
                    "Direct channels to partner universities (No middlemen).",
                    "Transparent communication at every stage.",
                    "Real-time application updates via our portal.",
                    "Dedicated Student Affairs Office support.",
                    "Structured, gamified application system.",
                    "Secure handling of personal data and documents."
                 ].map((point, i) => (
                    <div key={i} className="flex items-start p-6 bg-orange-50 rounded-xl border border-orange-100">
                       <Star className="w-6 h-6 text-orange-500 mr-4 flex-shrink-0"/>
                       <span className="font-bold text-slate-800">{point}</span>
                    </div>
                 ))}
              </div>
              <div className="mt-12">
                 <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-xl active:scale-95">
                    Apply with Confidence
                 </button>
              </div>
           </div>
        </div>

        {/* 8. STUDENT & PARENT SUPPORT */}
        <div className="py-24 bg-blue-900 text-white">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <Users className="w-20 h-20 text-blue-300 mx-auto mb-6"/>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Unmatched Student & Parent Support</h2>
              <p className="text-xl text-blue-100 mb-10 font-light">
                 We don't just process applications; we partner with families. From our Saturday Student & Parent Fairs to direct one-on-one consultations, we are here for you.
              </p>
              <div className="bg-white/10 p-6 rounded-2xl inline-block mb-10 backdrop-blur-md border border-white/20">
                 <p className="font-bold flex items-center justify-center text-amber-400"><Calendar className="w-5 h-5 mr-2"/> Join us every Saturday at 9AM for our Student & Parent Fair.</p>
              </div>
              <div>
                 <button onClick={() => onNavigate(PublicView.HOME)} className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-xl active:scale-95">
                    Book a Virtual Meeting
                 </button>
              </div>
           </div>
        </div>

        {/* 9. UNIVERSITY PARTNERSHIP SECTION */}
        <div className="py-24 bg-white">
           <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                 <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">For Institutions</div>
                 <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Partner With Zambians In India</h2>
                 <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                    We connect top-tier Indian universities with qualified, motivated Zambian students through a structured and documented application funnel. Our manual pre-screening ensures high-quality applicants and long-term enrollment success.
                 </p>
                 <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-emerald-600 mr-3"/> Access to qualified student pool</li>
                    <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-emerald-600 mr-3"/> Transparent data reporting</li>
                    <li className="flex items-center text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-emerald-600 mr-3"/> Long-term collaboration</li>
                 </ul>
                 <div className="flex gap-4">
                    <button onClick={() => onNavigate(PublicView.FOR_UNIVERSITIES)} className="bg-emerald-800 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-900 transition shadow-lg">Partner With Us</button>
                    <button onClick={() => onNavigate(PublicView.FOR_UNIVERSITIES)} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition">Visit Universities Page</button>
                 </div>
              </div>
              <div className="md:w-1/2 relative">
                 <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 shadow-2xl transform rotate-2">
                    <Building className="w-16 h-16 text-slate-300 mb-4"/>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">University Portal</h3>
                    <p className="text-slate-500 mb-6">Manage applications, issue offers, and track student arrivals from a dedicated dashboard.</p>
                    <div className="h-2 w-full bg-slate-200 rounded-full mb-2"></div>
                    <div className="h-2 w-2/3 bg-slate-200 rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* 10. COMMITMENT TO INTEGRITY */}
        <div className="py-24 bg-slate-50 border-t border-slate-200">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <ShieldCheck className="w-16 h-16 text-emerald-600 mx-auto mb-6"/>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Our Commitment to Integrity</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                 We believe in ethical admissions practices. We strictly oppose hidden fees, unauthorized placements, and misleading information. Our student-first approach ensures that every decision made is in the best interest of the applicant's future.
              </p>
              <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="text-emerald-700 font-bold text-lg border-b-2 border-emerald-500 hover:text-emerald-900 transition">
                 Apply Through Official Channels
              </button>
           </div>
        </div>

        {/* 11. FINAL CONVERSION */}
        <div className="py-32 bg-gradient-to-r from-orange-600 to-red-600 text-white text-center">
           <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">Your Future Starts Now.</h2>
              <p className="text-xl md:text-2xl text-orange-100 font-light mb-12">
                 Stop delaying your education journey. Begin the verified process today.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                 <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-white text-orange-700 px-12 py-5 rounded-full font-extrabold text-xl hover:bg-slate-100 transition shadow-2xl transform hover:scale-105 active:scale-95">
                    Apply Now
                 </button>
                 <button onClick={() => onNavigate(PublicView.HOME)} className="bg-transparent border-2 border-white text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-white/10 transition shadow-xl active:scale-95">
                    Book Consultation
                 </button>
              </div>
           </div>
        </div>

        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  // STUDENT CENTRE PAGE
  if (view === PublicView.STUDENT_CENTRE) {
    return <StudentCentre onNavigate={onNavigate} onLogin={onLogin} />;
  }

  // SCHOLARSHIP EXAM PAGE
  if (view === PublicView.SCHOLARSHIP_EXAM) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <ScholarshipExamPage onNavigate={onNavigate} />
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  // --- SERVICE HUBS ---
  if (view === PublicView.MEDICAL_HUB) return <MedicalPage onNavigate={onNavigate} onLogin={onLogin} />;
  if (view === PublicView.TOURISM_HUB) return <TourismPage onNavigate={onNavigate} onLogin={onLogin} />;
  if (view === PublicView.WORK_HUB) return <WorkPage onNavigate={onNavigate} onLogin={onLogin} />;
  if (view === PublicView.INVEST_HUB) return <InvestPage onNavigate={onNavigate} onLogin={onLogin} />;
  if (view === PublicView.IMPORT_HUB) return <ImportPage onNavigate={onNavigate} onLogin={onLogin} />;
  if (view === PublicView.MONEY_HUB) return <MoneyTransferPage onNavigate={onNavigate} onLogin={onLogin} />;
  if (view === PublicView.RECRUITMENT_HUB) return <RecruitmentPage onNavigate={onNavigate} onLogin={onLogin} />;
  if (view === PublicView.SEARCH_RESULTS) return <SearchResults onNavigate={onNavigate} onLogin={onLogin} />;

  // --- REBUILT CONTACT PAGE (STUDENT SUPPORT COMMAND CENTER) ---
  if (view === PublicView.CONTACT) {
      return (
          <div className="min-h-screen bg-slate-50 font-sans">
              {/* 1. HERO SECTION */}
              <div className="bg-slate-900 text-white pt-24 pb-16 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084')] opacity-20 bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900/60"></div>
                  
                  <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                      <div className="inline-flex items-center bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1 text-blue-300 font-bold text-xs uppercase tracking-widest mb-6">
                         <LifeBuoy className="w-3 h-3 mr-2" /> Student Support Center
                      </div>
                      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                          Need Help? <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">You’re in the Right Place.</span>
                      </h1>
                      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light">
                          From application to offer letter — every question answered here. 
                          Our autonomous system is designed to get you unstuck immediately.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <button onClick={openChatBot} className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center">
                              <Bot className="w-5 h-5 mr-2"/> Ask Student Affairs AI
                          </button>
                          <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-lg flex items-center justify-center">
                              Start Official Application
                          </button>
                          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-300 rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center">
                              Book Virtual Meeting
                          </button>
                      </div>
                  </div>
              </div>

              {/* 2. SEGMENTED SUPPORT TABS */}
              <div className="max-w-6xl mx-auto px-4 py-12 -mt-10 relative z-20">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="flex overflow-x-auto border-b border-slate-100 p-2 gap-2 bg-slate-50">
                          {Object.entries(SUPPORT_TABS).map(([key, tab]) => (
                              <button
                                  key={key}
                                  onClick={() => { setActiveSupportTab(key); setActiveFAQIndex(null); }}
                                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeSupportTab === key ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                              >
                                  <tab.icon className={`w-4 h-4 mr-2 ${activeSupportTab === key ? 'text-blue-500' : 'text-slate-400'}`}/>
                                  {tab.title}
                              </button>
                          ))}
                      </div>
                      
                      <div className="p-8">
                          <div className="grid md:grid-cols-2 gap-12">
                              <div>
                                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                      <HelpCircle className="w-5 h-5 mr-3 text-orange-500"/> Frequently Asked Questions
                                  </h3>
                                  <div className="space-y-3">
                                      {SUPPORT_TABS[activeSupportTab as keyof typeof SUPPORT_TABS].items.map((item, idx) => (
                                          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                                              <button 
                                                  onClick={() => setActiveFAQIndex(activeFAQIndex === idx ? null : idx)}
                                                  className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-700 hover:bg-slate-50 transition"
                                              >
                                                  {item.q}
                                                  {activeFAQIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                                              </button>
                                              {activeFAQIndex === idx && (
                                                  <div className="p-4 pt-0 text-sm text-slate-600 bg-slate-50 border-t border-slate-100">
                                                      {item.a}
                                                  </div>
                                              )}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 flex flex-col justify-center text-center">
                                  <Bot className="w-16 h-16 text-blue-500 mx-auto mb-4"/>
                                  <h4 className="text-lg font-bold text-blue-900 mb-2">Still have questions?</h4>
                                  <p className="text-blue-700 text-sm mb-6">Our AI agent is trained on thousands of student scenarios just like yours.</p>
                                  <button onClick={openChatBot} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
                                      Ask AI Now
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 4. STUCK SCENARIOS GRID */}
              <div className="py-16 bg-slate-100">
                  <div className="max-w-6xl mx-auto px-4">
                      <div className="text-center mb-12">
                          <h2 className="text-3xl font-bold text-slate-900 mb-4">If You’re Stuck, Check Here First</h2>
                          <p className="text-slate-600">Common issues and their immediate solutions.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {STUCK_SCENARIOS.map((scenario) => (
                              <div key={scenario.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group">
                                  <div className="flex items-start mb-3">
                                      <div className="bg-red-50 text-red-500 p-2 rounded-lg mr-3 font-bold text-xs shrink-0 mt-1">#{scenario.id}</div>
                                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{scenario.q}</h4>
                                  </div>
                                  <p className="text-xs text-slate-500 mb-4 leading-relaxed pl-11">{scenario.a}</p>
                                  <div className="pl-11">
                                      <button className="text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline flex items-center">
                                          {scenario.action} <ArrowRight className="w-3 h-3 ml-1"/>
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* 5. MOBILE SUPPORT AGENTS */}
              <div className="py-16 bg-white">
                  <div className="max-w-5xl mx-auto px-4">
                      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                          <div className="relative z-10 md:w-1/2">
                              <span className="bg-orange-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Offline Support</span>
                              <h2 className="text-3xl font-bold mb-4">No Internet? No Problem.</h2>
                              <p className="text-slate-300 mb-6 text-lg">
                                  Visit any of our registered partner agents across Zambia for assistance with uploading documents and completing your application.
                              </p>
                              <ul className="space-y-2 mb-8 text-sm text-slate-400">
                                  <li className="flex items-center"><MapPin className="w-4 h-4 text-orange-500 mr-2"/> Internet Cafés</li>
                                  <li className="flex items-center"><MapPin className="w-4 h-4 text-orange-500 mr-2"/> Mobile Money Booths</li>
                                  <li className="flex items-center"><MapPin className="w-4 h-4 text-orange-500 mr-2"/> Government Youth Centers</li>
                              </ul>
                              <button onClick={() => window.open('https://www.zambiansinindia.com/partners', '_blank')} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition shadow-lg">
                                  Find a Local Partner
                              </button>
                          </div>
                          <div className="relative z-10 md:w-1/2 flex justify-center">
                              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-sm">
                                  <div className="flex items-center mb-4">
                                      <Wifi className="w-8 h-8 text-red-400 mr-4"/>
                                      <div>
                                          <h4 className="font-bold text-white">Connection Lost?</h4>
                                          <p className="text-xs text-slate-300">Our system auto-saves your progress.</p>
                                      </div>
                                  </div>
                                  <div className="h-1 bg-white/20 rounded-full w-full mb-2">
                                      <div className="h-full bg-green-500 w-3/4 rounded-full"></div>
                                  </div>
                                  <p className="text-xs text-right text-green-400 font-mono">Last saved: 2 mins ago</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 6. DEPARTMENTAL SUPPORT ROUTING */}
              <div className="py-16 bg-slate-50" id="support-form">
                  <div className="max-w-4xl mx-auto px-4">
                      <div className="text-center mb-12">
                          <h2 className="text-3xl font-bold text-slate-900">Submit a Support Ticket</h2>
                          <p className="text-slate-500 mt-2">Direct line to specific departments. 24-hour response time.</p>
                      </div>

                      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                          {formStatus === 'success' ? (
                              <div className="p-16 text-center">
                                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                      <CheckCircle className="w-10 h-10 text-green-600"/>
                                  </div>
                                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Ticket #8842 Created</h3>
                                  <p className="text-slate-600 mb-8">
                                      Your request has been routed to the {contactForm.department}. You will receive an email update shortly.
                                  </p>
                                  <button onClick={() => setFormStatus('idle')} className="text-blue-600 font-bold hover:underline">Submit another ticket</button>
                              </div>
                          ) : (
                              <div className="p-8">
                                  <form onSubmit={handleContactSubmit} className="space-y-6">
                                      <div className="grid md:grid-cols-2 gap-6">
                                          <div>
                                              <label className="label">Department</label>
                                              <select 
                                                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                                  value={contactForm.department}
                                                  onChange={(e) => setContactForm({...contactForm, department: e.target.value})}
                                              >
                                                  <option>Student Applications Department</option>
                                                  <option>University Onboarding Department</option>
                                                  <option>Technical Support Department</option>
                                                  <option>Student Affairs Office</option>
                                              </select>
                                          </div>
                                          <div>
                                              <label className="label">Priority Level</label>
                                              <select 
                                                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                                  value={contactForm.priority}
                                                  onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                                              >
                                                  <option>Low</option>
                                                  <option>Medium</option>
                                                  <option>High</option>
                                                  <option>Urgent</option>
                                              </select>
                                          </div>
                                      </div>

                                      <div className="grid md:grid-cols-2 gap-6">
                                          <div>
                                              <label className="label">Full Name</label>
                                              <input 
                                                  type="text" required 
                                                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                                  value={contactForm.name}
                                                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                              />
                                          </div>
                                          <div>
                                              <label className="label">Email Address</label>
                                              <input 
                                                  type="email" required 
                                                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                                  value={contactForm.email}
                                                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                              />
                                          </div>
                                      </div>

                                      <div>
                                          <label className="label">Issue Description</label>
                                          <textarea 
                                              rows={4} required 
                                              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                              placeholder="Describe your issue in detail..."
                                              value={contactForm.message}
                                              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                          ></textarea>
                                      </div>

                                      <div>
                                          <label className="label">Attachment (Optional)</label>
                                          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition">
                                              <Paperclip className="w-5 h-5 mx-auto text-slate-400 mb-2"/>
                                              <span className="text-xs text-slate-500">Click to upload screenshot or document</span>
                                          </div>
                                      </div>

                                      <button 
                                          type="submit" 
                                          disabled={formStatus === 'submitting'}
                                          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center"
                                      >
                                          {formStatus === 'submitting' ? <Loader className="w-5 h-5 animate-spin mr-2"/> : 'Submit Ticket'}
                                      </button>
                                  </form>
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* 8. MULTIMEDIA SUPPORT */}
              <div className="py-16 bg-white">
                  <div className="max-w-6xl mx-auto px-4">
                      <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Visual & Audio Guides</h2>
                      
                      <div className="grid md:grid-cols-3 gap-8">
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition">
                              <div className="aspect-video bg-slate-900 rounded-xl mb-4 relative overflow-hidden group cursor-pointer">
                                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070')] bg-cover opacity-50 group-hover:opacity-70 transition"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <Play className="w-12 h-12 text-white fill-current"/>
                                  </div>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-2 flex items-center"><Youtube className="w-4 h-4 text-red-600 mr-2"/> Application Walkthrough</h4>
                              <p className="text-xs text-slate-500">Step-by-step video guide on how to complete the application form correctly.</p>
                          </div>

                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition">
                              <div className="h-40 bg-orange-100 rounded-xl mb-4 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                                      <Mic className="w-8 h-8"/>
                                  </div>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-2">Audio Guide</h4>
                              <p className="text-xs text-slate-500">Listen to the application instructions (Low Data usage).</p>
                              <button className="mt-3 text-orange-600 text-xs font-bold uppercase tracking-wide hover:underline">Play Now</button>
                          </div>

                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition">
                              <div className="h-40 bg-blue-100 rounded-xl mb-4 flex items-center justify-center">
                                  <FileText className="w-16 h-16 text-blue-500"/>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-2">Download PDF Manual</h4>
                              <p className="text-xs text-slate-500">Offline readable guide for when you have no internet.</p>
                              <button className="mt-3 text-blue-600 text-xs font-bold uppercase tracking-wide hover:underline">Download (2MB)</button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 10. ESCALATION POLICY */}
              <div className="py-12 bg-slate-900 text-white text-center">
                  <div className="max-w-4xl mx-auto px-4">
                      <h3 className="text-xl font-bold mb-8">Expected Response Times</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3"/>
                              <h4 className="font-bold text-lg">Instant</h4>
                              <p className="text-sm text-slate-300">AI Agent Support</p>
                          </div>
                          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                              <UserCheck className="w-8 h-8 text-blue-400 mx-auto mb-3"/>
                              <h4 className="font-bold text-lg">2 - 6 Hours</h4>
                              <p className="text-sm text-slate-300">Human Support Review</p>
                          </div>
                          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                              <Building className="w-8 h-8 text-emerald-400 mx-auto mb-3"/>
                              <h4 className="font-bold text-lg">24 - 78 Hours</h4>
                              <p className="text-sm text-slate-300">University Manual Review</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 11. FINAL AUTONOMOUS CTA */}
              <div className="py-24 bg-white text-center">
                  <div className="max-w-3xl mx-auto px-4">
                      <AlertOctagon className="w-16 h-16 text-blue-600 mx-auto mb-6"/>
                      <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Every Question Has an Answer Here.</h2>
                      <p className="text-xl text-slate-600 mb-10 font-light">
                          Before you wait, search above or ask the Student Affairs Office AI for immediate assistance.
                      </p>
                      <div className="flex justify-center gap-6">
                          <button onClick={openChatBot} className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-xl transform hover:scale-105">
                              Ask AI Now
                          </button>
                          <button onClick={() => document.getElementById('support-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-slate-100 text-slate-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition shadow-sm border border-slate-300">
                              Submit Support Ticket
                          </button>
                      </div>
                  </div>
              </div>

              <Footer onNavigate={onNavigate} />
          </div>
      );
  }

  // Fallback
  return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
              <Info className="w-16 h-16 text-slate-300 mx-auto mb-4"/>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Page Under Construction</h2>
              <p className="text-slate-500 mb-6">This section of the public website is being updated.</p>
              <button onClick={() => onNavigate(PublicView.HOME)} className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold">
                  Back Home
              </button>
          </div>
      </div>
  );
};

export default PublicPages;
