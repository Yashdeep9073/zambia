
import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import { 
  Building, MapPin, Phone, Mail, GraduationCap, Users, BookOpen, 
  Search as SearchIcon, ArrowRight, CheckCircle, Globe, Briefcase, 
  Calendar, Award, Bot, Info, Video, HelpCircle, FileText,
  Home, DollarSign, HeartPulse, ShieldCheck, Download, MessageSquare, 
  TrendingUp, Plane, Lock, Key, AlertTriangle, Star, Check, ChevronDown, ChevronUp, Layout, Smartphone, Target, Lightbulb, Anchor, Layers,
  Compass, Smile, Zap, Coffee, Music, Mic, Library, Book, Heart, Filter, Flag, Server, LifeBuoy, Megaphone, Share2,
  Play, Upload, LogIn, ExternalLink, ArrowLeft, X, Send, Loader, Clock, Facebook, Twitter, Instagram, Linkedin, Search, Store
} from 'lucide-react';
import Footer from '../components/Footer';
import ApplyPage from './ApplyPage';

interface PublicPagesProps {
  view: PublicView;
  onLogin: (role: UserRole) => void;
  onNavigate: (view: PublicView) => void;
}

const PublicPages: React.FC<PublicPagesProps> = ({ view, onLogin, onNavigate }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeHubTab, setActiveHubTab] = useState<'prospective' | 'current' | 'alumni'>('prospective');
  
  // Contact Page State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [contactCategory, setContactCategory] = useState('GENERAL');
  const [contactSearch, setContactSearch] = useState('');

  // Login Page State
  const [activePortal, setActivePortal] = useState<'STUDENT' | 'ADMIN' | 'PARENT' | 'UNIVERSITY'>('STUDENT');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const handlePortalLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoggingIn(true);
      setLoginError('');

      // Simulate network delay for realism
      setTimeout(() => {
          let success = false;
          
          if (activePortal === 'STUDENT') {
              if (loginUsername === 'student' && loginPassword === '12345') {
                  onLogin(UserRole.CURRENT_STUDENT);
                  success = true;
              }
          } else if (activePortal === 'ADMIN') {
              if (loginUsername === 'admin' && loginPassword === '12345') {
                  onLogin(UserRole.ADMIN_CONSULTANT);
                  success = true;
              }
          } else if (activePortal === 'PARENT') {
              if (loginUsername === 'parent' && loginPassword === '12345') {
                  onLogin(UserRole.PARENT);
                  success = true;
              }
          } else if (activePortal === 'UNIVERSITY') {
              // Accepts Uni or Uni1 as per previous/current prompt variations
              if ((loginUsername === 'Uni1' || loginUsername === 'Uni') && loginPassword === '12345') {
                  onLogin(UserRole.PARTNER_UNIVERSITY);
                  success = true;
              }
          }

          if (!success) {
              setLoginError("Incorrect username or password. Please try again.");
              setIsLoggingIn(false);
          }
      }, 1000);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Password reset link sent to ${forgotPasswordEmail}`);
      setShowForgotPassword(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('submitting');
      // Simulate network request
      setTimeout(() => {
          setFormStatus('success');
          setContactForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
          setTimeout(() => setFormStatus('idle'), 5000); // Reset after 5 seconds
      }, 1500);
  };

  // --- DATA FOR CONTACT PAGE SECTIONS ---
  const HELP_SECTIONS: Record<string, { id: number, title: string, icon: any, desc?: string }[]> = {
    PROSPECTIVE: [
      { id: 11, title: "Start Application Help", icon: Play, desc: "Issues with registration or account creation." },
      { id: 12, title: "Eligibility & Course Selection", icon: BookOpen, desc: "Not sure what to study? Guidance here." },
      { id: 13, title: "Document Upload Support", icon: Upload, desc: "Scan quality and file size help." },
      { id: 14, title: "Application Progress Issues", icon: Loader, desc: "Stuck on a specific step?" },
      { id: 15, title: "Offer Letter Questions", icon: Mail, desc: "Understanding your admission offer." },
      { id: 16, title: "Acceptance & Rejection", icon: CheckCircle, desc: "Next steps after decision." },
      { id: 17, title: "Scholarship & Financial", icon: DollarSign, desc: "Fees, waivers and payment terms." },
      { id: 18, title: "Visa & Immigration", icon: Plane, desc: "Embassy interview and requirements." },
      { id: 19, title: "Pre-Departure & Travel", icon: Briefcase, desc: "Packing list and flight bookings." },
      { id: 20, title: "Arrival & Settlement", icon: MapPin, desc: "Airport pickup and hostel check-in." },
    ],
    CURRENT: [
      { id: 21, title: "Academic Challenges", icon: Book, desc: "Exams, results, and faculty issues." },
      { id: 22, title: "Accommodation & Living", icon: Home, desc: "Hostel, food, and roommate changes." },
      { id: 23, title: "Health & Wellness", icon: HeartPulse, desc: "Medical insurance and hospitals." },
      { id: 24, title: "Cultural Adjustment", icon: Globe, desc: "Adapting to life in India." },
      { id: 25, title: "Emergency Assistance", icon: AlertTriangle, desc: "Urgent help line." },
      { id: 26, title: "Complaints & Escalations", icon: ScaleIcon, desc: "Report misconduct or severe issues." },
    ],
    ALUMNI: [
      { id: 27, title: "Alumni Engagement", icon: Users },
      { id: 28, title: "Career & Employment", icon: Briefcase },
      { id: 29, title: "Degree Recognition", icon: Award },
      { id: 30, title: "Mentorship & Giving Back", icon: Heart },
    ],
    PARTNERS: [
      { id: 31, title: "University Partnerships", icon: Building },
      { id: 32, title: "Admissions Verification", icon: CheckCircle },
      { id: 33, title: "Compliance & Government", icon: ShieldCheck },
      { id: 34, title: "Data & Reporting", icon: Server },
      { id: 35, title: "Marketing & Media", icon: Megaphone },
      { id: 36, title: "Vendors & Services", icon: Store },
      { id: 37, title: "Affiliate Programs", icon: Users },
      { id: 38, title: "Tech Integrations", icon: Zap },
    ],
    GOVT: [
      { id: 39, title: "Government & Embassy", icon: Flag },
      { id: 40, title: "Policy & Research", icon: Library },
    ]
  };

  // Helper for icons used in data map
  function ScaleIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg> }

  // --- REUSABLE MICRO-COMPONENTS ---

  const TrustBadge = ({ icon, text, subtext }: { icon: React.ReactNode, text: string, subtext?: string }) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="text-blue-900 mb-4 p-3 bg-blue-50 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors">{icon}</div>
      <span className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">{text}</span>
      {subtext && <span className="text-xs text-slate-500">{subtext}</span>}
    </div>
  );

  const ServiceCard: React.FC<{ title: string; icon: React.ReactNode; desc: string; colorClass: string; badge?: string }> = ({ title, icon, desc, colorClass, badge }) => (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`}></div>
      {badge && <div className="absolute top-2 right-2 bg-slate-100 text-[9px] font-bold px-2 py-0.5 rounded text-slate-500">{badge}</div>}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${colorClass.replace('bg-', 'text-').replace('-500', '-600')} bg-opacity-10 bg-gray-100`}>
         {icon}
      </div>
      <h4 className="font-bold text-slate-900 mb-1 text-sm lg:text-base group-hover:text-orange-600 transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center group-hover:text-slate-700">
        Explore <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition" />
      </button>
    </div>
  );

  // --- PAGE LAYOUTS ---

  // APPLY ONLINE PAGE (NEW)
  if (view === PublicView.APPLY_ONLINE) {
    return <ApplyPage onLogin={onLogin} onNavigate={onNavigate} />;
  }

  // PORTAL LOGIN PAGE
  if (view === PublicView.PORTAL_LOGIN) {
      return (
          <div className="min-h-screen bg-slate-50 flex flex-col">
              {/* Navigation Controls */}
              <div className="absolute top-4 left-4 z-50">
                  <button onClick={() => window.history.back()} className="p-2 bg-white/80 rounded-full shadow-sm hover:bg-white text-slate-600"><ArrowLeft className="w-6 h-6"/></button>
              </div>
              <div className="absolute top-4 right-4 z-50 hidden md:block">
                  <button onClick={() => onNavigate(PublicView.HOME)} className="p-2 bg-white/80 rounded-full shadow-sm hover:bg-white text-slate-600"><X className="w-6 h-6"/></button>
              </div>

              <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
                  <div className="max-w-lg w-full space-y-6">
                      
                      {/* Portal Selector - Optimized Grid for Mobile */}
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
                          
                          {/* Mobile Close Button Inside Form */}
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
                                          <input
                                              type="password"
                                              required
                                              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-slate-50"
                                              placeholder="Password"
                                              value={loginPassword}
                                              onChange={(e) => setLoginPassword(e.target.value)}
                                          />
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
                                  
                                  {/* Credentials Hint */}
                                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                     <p className="text-xs text-slate-500 font-bold mb-1">Demo Credentials (Copy/Paste)</p>
                                     {activePortal === 'STUDENT' && <p className="text-xs font-mono text-slate-400">student / 12345</p>}
                                     {activePortal === 'ADMIN' && <p className="text-xs font-mono text-slate-400">admin / 12345</p>}
                                     {activePortal === 'PARENT' && <p className="text-xs font-mono text-slate-400">parent / 12345</p>}
                                     {activePortal === 'UNIVERSITY' && <p className="text-xs font-mono text-slate-400">Uni1 / 12345</p>}
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
                      
                      {/* Login Footer Links */}
                      <div className="flex justify-center space-x-6 text-sm font-bold text-slate-500">
                          <button onClick={() => alert("Redirecting to FAQ...")} className="hover:text-emerald-600">FAQ</button>
                          <button onClick={() => onNavigate(PublicView.CONTACT)} className="hover:text-emerald-600">Contact Us</button>
                      </div>

                  </div>
              </div>
              <Footer onNavigate={onNavigate} />
          </div>
      );
  }

  // COURSES & PROGRAMS PAGE (NEW)
  if (view === PublicView.COURSES) {
      // ... existing courses code ...
      return (
          <div className="min-h-screen bg-slate-50 font-sans">
              {/* Hero */}
              <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070')] opacity-20 bg-cover bg-center"></div>
                  <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                      <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Courses & Programs</h1>
                      <p className="text-emerald-100 max-w-2xl mx-auto text-base md:text-lg">
                          Discover world-class accredited programs from India's top universities.
                      </p>
                  </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
                  
                  {/* SEARCH SECTION */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 -mt-20 relative z-20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="relative">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search by University</label>
                              <div className="relative">
                                  <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400"/>
                                  <input type="text" placeholder="e.g. CT University" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
                              </div>
                          </div>
                          <div className="relative">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search by Course</label>
                              <div className="relative">
                                  <BookOpen className="absolute left-3 top-3 w-5 h-5 text-slate-400"/>
                                  <input type="text" placeholder="e.g. Computer Science" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
                              </div>
                          </div>
                          <div className="relative">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search by Region</label>
                              <div className="relative">
                                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400"/>
                                  <select className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none">
                                      <option>All Regions</option>
                                      <option>Punjab</option>
                                      <option>Maharashtra</option>
                                      <option>Karnataka</option>
                                      <option>Tamil Nadu</option>
                                      <option>Delhi NCR</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                          <button className="bg-emerald-700 text-white px-8 py-2 rounded-lg font-bold text-sm hover:bg-emerald-800 transition shadow-md w-full md:w-auto">
                              Search Programs
                          </button>
                      </div>
                  </div>

                  {/* Career Guidance Section */}
                  <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
                      <div className="md:w-2/3">
                          <h3 className="text-2xl font-bold mb-2 flex items-center"><Lightbulb className="w-6 h-6 text-yellow-400 mr-3"/> Career Guidance</h3>
                          <p className="text-blue-100 mb-6 text-sm md:text-base">Not sure what to study? Let our AI-driven career pathfinder match your interests and grades to the perfect course with high employability in Zambia.</p>
                          <div className="flex flex-wrap gap-2">
                             <div className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold border border-white/20">STEM Focus</div>
                             <div className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold border border-white/20">Healthcare</div>
                             <div className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold border border-white/20">Business</div>
                          </div>
                      </div>
                      <div className="md:w-1/3 mt-6 md:mt-0 flex justify-end w-full md:w-auto">
                          <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105 w-full md:w-auto">
                              Start Assessment
                          </button>
                      </div>
                  </div>
                  
                  {/* Recommended University Section */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-500 relative">
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl z-10">
                          #1 RECOMMENDED BY ZII
                      </div>
                      <div className="grid md:grid-cols-2">
                          <div className="h-48 md:h-auto relative">
                              <img src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop" className="w-full h-full object-cover" alt="CT University" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                  <div>
                                      <h3 className="text-xl md:text-2xl font-bold text-white">CT University</h3>
                                      <p className="text-emerald-300 font-bold">Ludhiana, Punjab</p>
                                  </div>
                              </div>
                          </div>
                          <div className="p-6 md:p-8 flex flex-col justify-center">
                              <div className="mb-6">
                                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">Best for Zambians</span>
                                  <p className="text-slate-600 mb-4 text-sm md:text-base">
                                      CT University is our top partner, offering specific scholarship quotas for Zambian students. Known for its Engineering, Healthcare, and Management programs.
                                  </p>
                                  <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700 font-medium mb-6">
                                      <li className="flex items-center"><Check className="w-4 h-4 text-orange-500 mr-2"/> Up to 100% Scholarship</li>
                                      <li className="flex items-center"><Check className="w-4 h-4 text-orange-500 mr-2"/> English Medium</li>
                                      <li className="flex items-center"><Check className="w-4 h-4 text-orange-500 mr-2"/> Modern Campus</li>
                                      <li className="flex items-center"><Check className="w-4 h-4 text-orange-500 mr-2"/> Zambian Community</li>
                                  </ul>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-4">
                                  <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="flex-1 bg-emerald-700 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 shadow-md transition">
                                      Apply Now
                                  </button>
                                  <a href="https://www.ctuniversity.in/" target="_blank" rel="noopener noreferrer" className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center transition">
                                      Visit Website <ExternalLink className="w-4 h-4 ml-2"/>
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Program Listings */}
                  <div>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 border-l-4 border-emerald-500 pl-4">Popular Programs (Study in India)</h2>
                      <p className="text-slate-500 mb-8 text-sm">Source: <a href="https://www.studyinindia.gov.in/courses/exploreallcoruses" target="_blank" className="text-blue-600 underline">Government of India - Study in India Portal</a></p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                              { name: "Computer Science Engineering", level: "B.Tech / M.Tech", duration: "4 Years", tags: ["High Demand", "Tech"] },
                              { name: "Business Administration", level: "BBA / MBA", duration: "3 Years", tags: ["Management", "Finance"] },
                              { name: "Pharmacy", level: "B.Pharm / M.Pharm", duration: "4 Years", tags: ["Medical", "Science"] },
                              { name: "Civil Engineering", level: "B.Tech", duration: "4 Years", tags: ["Construction", "Design"] },
                              { name: "Nursing", level: "B.Sc Nursing", duration: "4 Years", tags: ["Healthcare", "Clinical"] },
                              { name: "Agriculture", level: "B.Sc Agriculture", duration: "4 Years", tags: ["Farming", "Research"] },
                          ].map((course, i) => (
                              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition group">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="bg-slate-100 p-3 rounded-full group-hover:bg-orange-100 transition">
                                          <BookOpen className="w-6 h-6 text-slate-600 group-hover:text-orange-600" />
                                      </div>
                                      <span className="text-xs font-bold text-slate-400">{course.duration}</span>
                                  </div>
                                  <h3 className="font-bold text-lg text-slate-900 mb-1">{course.name}</h3>
                                  <p className="text-sm text-emerald-600 font-bold mb-4">{course.level}</p>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                      {course.tags.map(tag => (
                                          <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">{tag}</span>
                                      ))}
                                  </div>
                                  <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full text-center text-sm font-bold text-emerald-700 border border-emerald-200 py-2 rounded-lg hover:bg-emerald-50 transition active:scale-95">
                                      View Details & Apply
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

              </div>
              <Footer onNavigate={onNavigate} />
          </div>
      );
  }

  // 1. ABOUT US PAGE
  if (view === PublicView.ABOUT) {
    // ... existing About Us code ...
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <div className="flex-grow pb-24">
        
        {/* 1. HERO SECTION */}
        <div className="relative bg-slate-900 text-white min-h-[70vh] flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           {/* Abstract Map Nodes Visual */}
           <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 Q 50 50 100 0" stroke="white" strokeWidth="0.2" fill="none" />
                 <path d="M0 0 Q 50 50 100 100" stroke="white" strokeWidth="0.2" fill="none" />
              </svg>
           </div>
           
           <div className="max-w-5xl mx-auto px-4 relative z-10 text-center py-20">
              <div className="inline-block mb-6 animate-fade-in-down">
                 <span className="bg-amber-500 text-blue-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Official Education Initiative
                 </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight">
                 Zambians In India
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
                 The official community-led platform bridging Zambia and India. <br/>
                 <span className="text-amber-400 font-medium">Not an agent. A movement.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-amber-50 transition shadow-xl active:scale-95">
                    Our Mission
                 </button>
                 <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition shadow-lg transform hover:scale-105 active:scale-95">
                    Start Your Journey
                 </button>
                 <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="px-8 py-4 border border-blue-400 text-white rounded-full font-bold text-lg hover:bg-blue-800/50 transition active:scale-95">
                    Student Portal
                 </button>
              </div>
           </div>
        </div>

        {/* 2. WHO WE ARE */}
        <div className="py-20 bg-white">
           <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <div>
                 <h3 className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-2">History & Heritage</h3>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 mb-6">Built by those who walked the path.</h2>
                 <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                    <p>
                       Zambians In India (ZII) was founded in 2015 not as a business, but as a solution. A group of Zambian graduates, having navigated the complexities of studying abroad, united to create a transparent, safe, and guided pathway for the next generation.
                    </p>
                    <p>
                       We are the only platform that combines government-aligned safety protocols with the lived experience of over 6,500 alumni.
                    </p>
                 </div>
                 <div className="mt-8 flex items-center space-x-8">
                    <div>
                       <p className="text-4xl font-bold text-blue-900">2015</p>
                       <p className="text-xs uppercase text-slate-500 mt-1">Established</p>
                    </div>
                    <div>
                       <p className="text-4xl font-bold text-blue-900">100%</p>
                       <p className="text-xs uppercase text-slate-500 mt-1">Zambian Led</p>
                    </div>
                 </div>
              </div>
              <div className="relative h-64 md:h-[500px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-2xl p-8 flex items-center justify-center">
                 {/* Stylized Map Visual Representation */}
                 <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                 <div className="relative z-10 w-full h-full flex flex-col justify-between">
                    <div className="self-start bg-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
                       <p className="font-bold text-green-800 flex items-center"><MapPin className="w-4 h-4 mr-2"/> Lusaka, Zambia</p>
                       <p className="text-xs text-green-700 mt-1">Strategic HQ</p>
                    </div>
                    
                    <div className="self-center border-l-2 border-dashed border-amber-400 h-16 md:h-24 my-4"></div>
                    
                    <div className="self-end bg-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm text-right">
                       <p className="font-bold text-orange-800 flex items-center justify-end">New Delhi, India <MapPin className="w-4 h-4 ml-2"/></p>
                       <p className="text-xs text-orange-700 mt-1">Operations Hub</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ... remaining sections (Mission, Vision, Why India, etc.) ... */}
        {/* Simplified for brevity as they are unchanged */}
        <div id="mission" className="py-20 bg-blue-900 text-white relative">
           <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="inline-block p-3 bg-white/10 rounded-full mb-6 text-amber-400"><Target className="w-8 h-8"/></div>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-serif font-bold mb-8 leading-tight">
                 "To democratize access to world-class Indian education, removing agents and exploitation through <span className="text-amber-400 border-b-2 border-amber-400">AI-guided transparency.</span>"
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-blue-100">
                 <div className="p-6 border border-white/10 rounded-xl bg-white/5">
                    <ShieldCheck className="w-8 h-8 mb-4 mx-auto text-amber-400"/>
                    <h4 className="font-bold text-white mb-2">Safety First</h4>
                    <p className="text-sm opacity-80">Rigorous verification of every university partner.</p>
                 </div>
                 <div className="p-6 border border-white/10 rounded-xl bg-white/5">
                    <DollarSign className="w-8 h-8 mb-4 mx-auto text-amber-400"/>
                    <h4 className="font-bold text-white mb-2">Affordability</h4>
                    <p className="text-sm opacity-80">Negotiating scholarships directly for families.</p>
                 </div>
                 <div className="p-6 border border-white/10 rounded-xl bg-white/5">
                    <Bot className="w-8 h-8 mb-4 mx-auto text-amber-400"/>
                    <h4 className="font-bold text-white mb-2">Innovation</h4>
                    <p className="text-sm opacity-80">Using technology to eliminate bias and barriers.</p>
                 </div>
              </div>
              <div className="mt-12">
                  <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-amber-500 text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition shadow-xl transform hover:scale-105 active:scale-95">
                      Apply Online
                  </button>
              </div>
           </div>
        </div>

        <Footer onNavigate={onNavigate} />
      </div>
      </div>
    );
  }

  // STUDENT CENTRE PAGE
  if (view === PublicView.STUDENT_CENTRE) {
      // ... existing code ...
      return (
          <div className="min-h-screen bg-slate-50 font-sans">
              {/* Hero */}
              <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070')] opacity-10 bg-cover bg-center"></div>
                  <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                      <div className="inline-block p-3 bg-white/10 rounded-full mb-4">
                          <Users className="w-8 h-8 text-amber-400" />
                      </div>
                      <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Student Centre</h1>
                      <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                          Resources, community, and support for every stage of your journey.
                      </p>
                  </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 py-12">
                  {/* Tabs */}
                  <div className="flex justify-center mb-12 overflow-x-auto">
                      <div className="bg-white p-1 rounded-xl shadow-md inline-flex border border-slate-200 min-w-max">
                          {['prospective', 'current', 'alumni'].map((tab) => (
                              <button
                                  key={tab}
                                  onClick={() => setActiveHubTab(tab as any)}
                                  className={`px-6 py-3 rounded-lg text-sm font-bold capitalize transition-all ${
                                      activeHubTab === tab 
                                      ? 'bg-blue-900 text-white shadow' 
                                      : 'text-slate-500 hover:text-blue-900 hover:bg-slate-50'
                                  }`}
                              >
                                  {tab} Students
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Content */}
                  <div className="animate-fade-in-up">
                      {activeHubTab === 'prospective' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <ServiceCard title="Scholarship Search" icon={<SearchIcon/>} desc="Find financial aid opportunities matched to your grades." colorClass="bg-emerald-500" />
                              <ServiceCard title="Application Guide" icon={<FileText/>} desc="Step-by-step PDF guide on how to apply using the portal." colorClass="bg-blue-500" />
                              <ServiceCard title="Talk to Alumni" icon={<MessageSquare/>} desc="Connect with students already studying in India." colorClass="bg-orange-500" />
                              <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between mt-6">
                                  <div className="mb-6 md:mb-0">
                                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to start?</h3>
                                      <p className="text-slate-600">Create your account today and get a free consultation.</p>
                                  </div>
                                  <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg w-full md:w-auto">
                                      Apply Now
                                  </button>
                              </div>
                          </div>
                      )}
                      {activeHubTab === 'current' && (
                          <div className="space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                  <ServiceCard title="Visa Renewal" icon={<Plane/>} desc="Guidance on FRRO registration and extensions." colorClass="bg-purple-500" />
                                  <ServiceCard title="Exam Results" icon={<Award/>} desc="Check your university semester results via portal." colorClass="bg-indigo-500" />
                                  <ServiceCard title="Housing Support" icon={<Home/>} desc="Find safe accommodation near your campus." colorClass="bg-pink-500" />
                                  <ServiceCard title="Emergency" icon={<AlertTriangle/>} desc="24/7 Helpline for Zambian students in distress." colorClass="bg-red-500" />
                             </div>
                             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                 <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Download className="w-5 h-5 mr-2 text-blue-600"/> Essential Downloads</h3>
                                 <div className="space-y-4">
                                     {[
                                         { name: "FRRO Registration Guide 2025.pdf", size: "2.4 MB" },
                                         { name: "Zambian Embassy Contact List.pdf", size: "1.1 MB" },
                                         { name: "Student Medical Insurance Claim Form.docx", size: "0.5 MB" }
                                     ].map((file, i) => (
                                         <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-300 transition cursor-pointer group">
                                             <div className="flex items-center overflow-hidden">
                                                 <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition mr-4 flex-shrink-0"/>
                                                 <div className="truncate">
                                                     <p className="font-bold text-slate-800 text-sm group-hover:text-blue-700 truncate">{file.name}</p>
                                                     <p className="text-xs text-slate-500">{file.size}</p>
                                                 </div>
                                             </div>
                                             <Download className="w-5 h-5 text-slate-300 group-hover:text-blue-500 flex-shrink-0"/>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                          </div>
                      )}
                      {activeHubTab === 'alumni' && (
                          <div>
                              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white mb-8 text-center">
                                  <h3 className="text-2xl font-bold mb-4">Join the Alumni Network</h3>
                                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                                      Over 6,500 graduates have passed through this corridor. Connect for jobs, mentorship, and business opportunities back home in Zambia.
                                  </p>
                                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                                      <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-amber-400 transition">Register as Alumni</button>
                                      <button className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition">View Job Board</button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
              <Footer onNavigate={onNavigate} />
          </div>
      );
  }

  // CONTACT US PAGE
  if (view === PublicView.CONTACT) {
      // ... existing Contact code ...
      // (This part is preserved as is, just wrapped in the same return logic)
      const renderHelpItems = (category: string) => {
        const items = HELP_SECTIONS[category] || [];
        const filtered = items.filter(item => 
          contactSearch === '' || 
          item.title.toLowerCase().includes(contactSearch.toLowerCase()) ||
          (item.desc && item.desc.toLowerCase().includes(contactSearch.toLowerCase()))
        );

        if (filtered.length === 0 && contactSearch !== '') {
           return <p className="text-center text-slate-500 py-8">No matching support topics found.</p>;
        }

        return (
          <div className="grid md:grid-cols-2 gap-4">
             {filtered.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group flex items-start">
                    <div className="bg-slate-50 p-2 rounded-lg text-slate-600 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition mr-4">
                       <item.icon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800">{item.title}</h4>
                        {item.desc && <p className="text-xs text-slate-500 mt-1">{item.desc}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 ml-auto self-center group-hover:text-emerald-500"/>
                </div>
             ))}
          </div>
        );
      };

      return (
          <div className="min-h-screen bg-slate-50 font-sans">
              {/* HERO & SEARCH */}
              <div className="bg-slate-900 text-white pt-20 pb-16 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070')] opacity-10 bg-cover bg-center"></div>
                  <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                      <h1 className="text-3xl md:text-5xl font-extrabold mb-6">How can we help you?</h1>
                      <div className="relative max-w-2xl mx-auto">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                              type="text"
                              className="block w-full pl-12 pr-4 py-4 rounded-full border-0 text-slate-900 shadow-2xl ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                              placeholder="Search help..."
                              value={contactSearch}
                              onChange={(e) => setContactSearch(e.target.value)}
                          />
                      </div>
                  </div>
              </div>

              {/* QUICK HELP SELECTOR TABS */}
              <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-slate-200 shadow-sm overflow-x-auto">
                  <div className="max-w-7xl mx-auto px-4">
                      <div className="flex space-x-2 py-3 min-w-max">
                          {[
                              { id: 'GENERAL', label: 'General Help' },
                              { id: 'PROSPECTIVE', label: 'Prospective Students' },
                              { id: 'CURRENT', label: 'Current Students' },
                              { id: 'ALUMNI', label: 'Alumni' },
                              { id: 'PARTNERS', label: 'Partners' },
                              { id: 'GOVT', label: 'Government' },
                          ].map(tab => (
                              <button
                                  key={tab.id}
                                  onClick={() => { setContactCategory(tab.id); setContactSearch(''); }}
                                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                                      contactCategory === tab.id
                                      ? 'bg-emerald-800 text-white shadow-md'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                              >
                                  {tab.label}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
                  {contactCategory === 'GENERAL' && !contactSearch && (
                      <div className="grid lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2 space-y-8">
                              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start">
                                  <Info className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-1"/>
                                  <div>
                                      <h3 className="font-bold text-slate-900 mb-1">Official Support Channels</h3>
                                      <p className="text-sm text-slate-600">
                                          Zambians In India (ZII) provides 24/7 support through our dedicated offices in Lusaka and New Delhi. 
                                          Please use the form below for general inquiries or urgent issues.
                                      </p>
                                  </div>
                              </div>
                              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200" id="contact-form">
                                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                      <MessageSquare className="w-6 h-6 mr-3 text-orange-500"/> Send us a Message
                                  </h3>
                                  {formStatus === 'success' ? (
                                      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in-up">
                                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                              <CheckCircle className="w-8 h-8 text-green-600"/>
                                          </div>
                                          <h4 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h4>
                                          <p className="text-green-700">Thank you for contacting ZII. A consultant will reply to your email within 24 hours.</p>
                                          <button onClick={() => setFormStatus('idle')} className="mt-6 text-sm font-bold text-green-800 underline">Send another message</button>
                                      </div>
                                  ) : (
                                      <form className="space-y-5" onSubmit={handleContactSubmit}>
                                          <div className="grid md:grid-cols-2 gap-4">
                                              <div>
                                                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Full Name</label>
                                                  <input 
                                                      type="text" required placeholder="e.g. John Phiri" 
                                                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                      value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                                  />
                                              </div>
                                              <div>
                                                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Email Address</label>
                                                  <input 
                                                      type="email" required placeholder="john@example.com" 
                                                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                      value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                                  />
                                              </div>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Subject</label>
                                              <select 
                                                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                  value={contactForm.subject} onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                                              >
                                                  <option>General Inquiry</option>
                                                  <option>Admissions & Application</option>
                                                  <option>Scholarship Question</option>
                                                  <option>Technical Issue (Portal)</option>
                                                  <option>Partnership Proposal</option>
                                              </select>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Message</label>
                                              <textarea 
                                                  rows={4} required placeholder="How can we help you today?" 
                                                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                  value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                              ></textarea>
                                          </div>
                                          <button 
                                              type="submit" disabled={formStatus === 'submitting'}
                                              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center shadow-lg transition transform active:scale-95"
                                          >
                                              {formStatus === 'submitting' ? <><Loader className="w-5 h-5 mr-2 animate-spin"/> Sending...</> : <><Send className="w-5 h-5 mr-2"/> Send Message</>}
                                          </button>
                                      </form>
                                  )}
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                  <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                      <h4 className="font-bold text-slate-900 mb-3 flex items-center"><Clock className="w-5 h-5 mr-2 text-slate-400"/> Working Hours</h4>
                                      <ul className="text-sm text-slate-600 space-y-1">
                                          <li className="flex justify-between"><span>Mon - Fri:</span> <span>08:00 - 17:00</span></li>
                                          <li className="flex justify-between"><span>Saturday:</span> <span>09:00 - 13:00</span></li>
                                          <li className="flex justify-between text-red-500"><span>Sunday:</span> <span>Closed</span></li>
                                      </ul>
                                  </div>
                                  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center">
                                      <h4 className="font-bold text-slate-900 mb-2">Find Us</h4>
                                      <p className="text-xs text-slate-500 mb-4">231 Kasangula Road, Roma, Lusaka</p>
                                      <a href="https://www.google.com/maps/place/231+Kasangula+Road,+Roma,+Lusaka,+Zambia" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-bold text-sm flex items-center hover:underline">
                                          <MapPin className="w-4 h-4 mr-1"/> Open Google Maps
                                      </a>
                                  </div>
                              </div>
                          </div>
                          <div className="space-y-6">
                              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                                  <h4 className="text-red-800 font-bold flex items-center mb-2"><AlertTriangle className="w-5 h-5 mr-2"/> Emergency?</h4>
                                  <p className="text-xs text-red-700 mb-4">For urgent student safety issues in India:</p>
                                  <a href="tel:+919999999999" className="block w-full text-center bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition">
                                      Call +91 99 999 99999
                                  </a>
                              </div>
                              <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-emerald-600">
                                  <div className="flex items-center mb-4 text-emerald-800">
                                      <Flag className="w-6 h-6 mr-3"/>
                                      <div>
                                          <h4 className="font-bold text-lg">Head Office</h4>
                                          <p className="text-xs text-slate-500">Lusaka, Zambia</p>
                                      </div>
                                  </div>
                                  <div className="space-y-3 text-sm text-slate-600">
                                      <p className="flex items-start"><MapPin className="w-4 h-4 mr-3 mt-1 text-emerald-500 flex-shrink-0"/> 231 Kasangula Road, Roma</p>
                                      <p className="flex items-center"><Phone className="w-4 h-4 mr-3 text-emerald-500"/> +260 762 523 854</p>
                                      <p className="flex items-center"><Mail className="w-4 h-4 mr-3 text-emerald-500"/> admissions@zii.org.zm</p>
                                  </div>
                              </div>
                              <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-orange-500">
                                  <div className="flex items-center mb-4 text-orange-800">
                                      <Globe className="w-6 h-6 mr-3"/>
                                      <div>
                                          <h4 className="font-bold text-lg">Regional Hub</h4>
                                          <p className="text-xs text-slate-500">New Delhi, India</p>
                                      </div>
                                  </div>
                                  <div className="space-y-3 text-sm text-slate-600">
                                      <p className="flex items-start"><MapPin className="w-4 h-4 mr-3 mt-1 text-orange-500 flex-shrink-0"/> B-Block, Connaught Place</p>
                                      <p className="flex items-center"><Phone className="w-4 h-4 mr-3 text-orange-500"/> +91 99 999 99999</p>
                                      <p className="flex items-center"><Mail className="w-4 h-4 mr-3 text-orange-500"/> delhi@zii.org.zm</p>
                                  </div>
                              </div>
                              <div className="bg-[#25D366] text-white p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-[#20bd5a] transition">
                                  <div className="flex items-center mb-2">
                                      <MessageSquare className="w-6 h-6 mr-3"/>
                                      <h4 className="font-bold text-lg">WhatsApp Support</h4>
                                  </div>
                                  <p className="text-xs opacity-90 mb-4">Instant replies from student advisors.</p>
                                  <button className="bg-white text-green-700 w-full py-2 rounded-lg font-bold text-sm">Start Chat</button>
                              </div>
                              <div className="flex justify-center space-x-4 pt-4">
                                  <div className="p-3 bg-white rounded-full shadow-sm hover:text-blue-600 cursor-pointer"><Facebook className="w-5 h-5"/></div>
                                  <div className="p-3 bg-white rounded-full shadow-sm hover:text-blue-400 cursor-pointer"><Twitter className="w-5 h-5"/></div>
                                  <div className="p-3 bg-white rounded-full shadow-sm hover:text-pink-500 cursor-pointer"><Instagram className="w-5 h-5"/></div>
                                  <div className="p-3 bg-white rounded-full shadow-sm hover:text-blue-700 cursor-pointer"><Linkedin className="w-5 h-5"/></div>
                              </div>
                          </div>
                      </div>
                  )}
                  {(contactCategory !== 'GENERAL' || contactSearch) && (
                      <div className="animate-fade-in-up">
                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                              {contactSearch ? `Search Results for "${contactSearch}"` : `Support Topics: ${contactCategory.replace('_', ' ')}`}
                          </h3>
                          {contactSearch 
                              ? (
                                 <div className="space-y-8">
                                    {['PROSPECTIVE', 'CURRENT', 'ALUMNI', 'PARTNERS', 'GOVT'].map(cat => {
                                       const results = renderHelpItems(cat);
                                       return (
                                          <div key={cat}>
                                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{cat}</h4>
                                             {results}
                                          </div>
                                       );
                                    })}
                                 </div>
                              )
                              : renderHelpItems(contactCategory)
                          }
                          {!contactSearch && (
                             <div className="mt-12 p-8 bg-blue-50 rounded-2xl text-center">
                                 <p className="text-blue-900 font-bold mb-4">Can't find what you're looking for?</p>
                                 <button onClick={() => setContactCategory('GENERAL')} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                                     Contact General Support
                                 </button>
                             </div>
                          )}
                      </div>
                  )}
              </div>
              <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 lg:hidden flex space-x-4 z-50">
                  <a href="tel:+260762523854" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center">
                      <Phone className="w-5 h-5 mr-2"/> Call
                  </a>
                  <a href="https://wa.me/260762523854" className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 mr-2"/> Chat
                  </a>
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
