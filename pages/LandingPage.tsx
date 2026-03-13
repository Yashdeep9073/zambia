
import React, { useState, useEffect } from 'react';
import { UserRole, PublicView } from '../types';
import { 
  ArrowRight, Check, MapPin, ShieldCheck, Users, 
  Calendar, Video, PlayCircle, Plane, DollarSign, Phone, Star, 
  Award, Share2, MessageCircle, Download, LogIn, Play, Map,
  Globe, TrendingUp, FileText, Newspaper, X, HeartPulse, Briefcase, ShoppingBag, Search
} from 'lucide-react';
import Footer from '../components/Footer';
import WhatsAppFunnel from '../components/WhatsAppFunnel';
import EligibilityMatcher from '../src/components/EligibilityMatcher';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: PublicView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onNavigate }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showVirtualModal, setShowVirtualModal] = useState(false);
  
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  // Office Appointment State
  const [selectedDay, setSelectedDay] = useState('');

  // Virtual Meeting Form State
  const [vmForm, setVmForm] = useState({ fullName: '', email: '', phone: '', date: '', time: '' });

  // Scholarship Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('March 30, 2026 23:59:59').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // --- SEO OPTIMIZATION ---
  useEffect(() => {
    document.title = "Zambians In India | Official Zambia–India Student Portal";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Apply to top Indian universities from Zambia with Zambians In India (ZII). Official student portal for 100% scholarships, verified admissions, and student visa guidance. Join 6,500+ Zambian students in India today.");
    }
  }, []);

  const testimonials = [
    { name: "Daniel Mwale", role: "Zambia Police Headquarters", text: "ZII handled everything. I just packed my bags. The campus at CT University is amazing and I'm already interning.", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop", uni: "CT University" },
    { name: "Micheal Matambo", role: "Zambia Airforce", text: "The community support is real. I found my roommate through the portal before even flying.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", uni: "CT University" },
    { name: "Yvette Mbewe", role: "Ministry of Health Zambia - Also the Nelson Mandela Washington Fellow Winner - USA", text: "My parents were worried, but the parent portal kept them updated every week. Best decision ever.", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop", uni: "CT University" }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.zambiansinindia.com');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent("Check out Zambians In India: https://www.zambiansinindia.com");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleVirtualSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Booking Request Sent for ${vmForm.fullName}. A Zoom link will be sent to ${vmForm.email}.`);
      setShowVirtualModal(false);
      setVmForm({ fullName: '', email: '', phone: '', date: '', time: '' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-fade-in-up text-sm font-bold flex items-center w-11/12 max-w-sm justify-center text-center">
          <Check className="w-4 h-4 mr-2 text-green-400 flex-shrink-0"/> <span>Message copied to clipboard</span>
        </div>
      )}

      {/* DOWNLOAD FORMS MODAL */}
      {showDownloadModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-fade-in">
              <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 md:p-12 shadow-2xl relative border-4 border-emerald-500">
                  <button onClick={() => setShowDownloadModal(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition">
                      <X className="w-6 h-6" />
                  </button>
                  
                  <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Download className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Download Forms</h2>
                      <p className="text-slate-500 font-bold">Official ZII Application Documents</p>
                  </div>

                  <div className="space-y-4 mb-8">
                      {[
                          { name: "ZII Official Application Form 2025", size: "1.2 MB", type: "PDF" },
                          { name: "Scholarship Exam Syllabus", size: "850 KB", type: "PDF" },
                          { name: "Parent Consent & Guarantee Form", size: "450 KB", type: "PDF" },
                          { name: "Budget & Financial Planning Guide", size: "2.1 MB", type: "PDF" },
                          { name: "Pre-Departure Checklist", size: "320 KB", type: "PDF" }
                      ].map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-500 transition cursor-pointer">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
                                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition" />
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.type} • {doc.size}</p>
                                  </div>
                              </div>
                              <button onClick={() => alert(`Downloading ${doc.name}...`)} className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition">
                                  <Download className="w-4 h-4" />
                              </button>
                          </div>
                      ))}
                  </div>

                  <button 
                      onClick={() => setShowDownloadModal(false)}
                      className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 shadow-lg transition transform active:scale-95"
                  >
                      Close
                  </button>
              </div>
          </div>
      )}

      {/* VIRTUAL MEETING MODAL */}
      {showVirtualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full relative border-4 border-orange-500 shadow-2xl overflow-hidden">
                  <button onClick={() => setShowVirtualModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition z-10"><X className="w-5 h-5 text-slate-500"/></button>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Book Virtual Meeting</h3>
                  <form onSubmit={handleVirtualSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                          <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none" value={vmForm.fullName} onChange={(e) => setVmForm({...vmForm, fullName: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                          <input required type="email" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none" value={vmForm.email} onChange={(e) => setVmForm({...vmForm, email: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                          <input required type="tel" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none" value={vmForm.phone} onChange={(e) => setVmForm({...vmForm, phone: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                              <input required type="date" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none" value={vmForm.date} onChange={(e) => setVmForm({...vmForm, date: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                              <select required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none" value={vmForm.time} onChange={(e) => setVmForm({...vmForm, time: e.target.value})}>
                                  <option value="">Select</option>
                                  <option value="09:00">09:00</option>
                                  <option value="11:00">11:00</option>
                                  <option value="14:00">14:00</option>
                                  <option value="16:00">16:00</option>
                              </select>
                          </div>
                      </div>
                      <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 shadow-lg mt-4 transition transform active:scale-95">Confirm Booking</button>
                  </form>
              </div>
          </div>
      )}

      {/* --------------------------------------------------------------------------------
         SECTION 1: HERO BANNER
         -------------------------------------------------------------------------------- */}
      <div className="relative bg-emerald-900 text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1523050853064-8035655ad80c?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop'; e.currentTarget.onerror = null; }}
          />
        </div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 pt-20 pb-12 w-full">
          <div className="inline-flex items-center bg-orange-500 text-white text-[10px] lg:text-xs font-bold px-4 py-1.5 lg:px-6 lg:py-2 rounded-full mb-6 lg:mb-8 shadow-xl animate-pulse tracking-wider">
            <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-2 fill-current" /> TRUSTED BY PARENTS & GOVT
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 lg:mb-6 leading-tight max-w-5xl">
            Welcome to the Official home of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">'ZAMBIANS IN INDIA'</span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-emerald-100 mb-8 max-w-3xl font-light px-4 leading-relaxed">
             Gain unlimited access to the over <strong className="text-white">6500+ Zambians</strong> currently living and studying in India.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8 lg:mb-12 text-[10px] sm:text-xs lg:text-base font-bold tracking-wide">
             <span className="bg-black/30 px-3 py-1.5 rounded backdrop-blur-sm border border-white/20 whitespace-nowrap">GOVERNMENT APPROVED</span>
             <span className="bg-black/30 px-3 py-1.5 rounded backdrop-blur-sm border border-white/20 whitespace-nowrap">NO AGENT FEE</span>
             <span className="bg-black/30 px-3 py-1.5 rounded backdrop-blur-sm border border-white/20 whitespace-nowrap">TRUSTED BY PARENTS</span>
          </div>
          
          <div className="flex flex-col w-full max-w-sm sm:w-auto sm:max-w-none sm:flex-row gap-4 lg:gap-6 px-4 sm:px-0 mb-12">
            <button 
              onClick={() => onNavigate(PublicView.APPLY_ONLINE)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-orange-500 text-lg font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 hover:border-orange-600 transition shadow-2xl transform active:scale-95"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            
            <button 
              onClick={() => setShowDownloadModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-bold rounded-full text-white hover:bg-white hover:text-emerald-900 transition shadow-lg backdrop-blur-sm bg-white/10 active:scale-95"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Forms
            </button>

            <button 
              onClick={() => onNavigate(PublicView.PORTAL_LOGIN)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-400 text-lg font-bold rounded-full text-emerald-100 hover:bg-emerald-800 transition shadow-lg backdrop-blur-sm bg-emerald-900/50 active:scale-95"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </button>
          </div>

          {/* 3D Glassmorphism Search Bar */}
          <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in-up">
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search') as string;
                if (query) localStorage.setItem('zii_search_query', query);
                onNavigate(PublicView.SEARCH_RESULTS); 
              }}
              className="relative flex items-center w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[40px] p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(255,165,0,0.2)] transition-shadow duration-300"
            >
              <div className="pl-4 pr-2">
                <Search className="w-8 h-8 text-orange-400 drop-shadow-md" />
              </div>
              <input 
                type="text" 
                name="search"
                placeholder="Search courses, scholarships, medical, jobs, invest, tourism..." 
                className="w-full bg-transparent text-white placeholder-slate-300 text-lg px-4 py-4 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform active:scale-95 hidden sm:block"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 2: WHY INDIA IS #1 CHOICE
         -------------------------------------------------------------------------------- */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">Why India is the #1 Choice</h2>
              <p className="text-lg lg:text-xl text-orange-600 font-medium px-4">
                 "We dont just send you to school, we connect your future to the worlds fastest growing economy" <span className="font-bold text-slate-900">#INDIA</span>
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
              {[
                { title: "World-Class Education", icon: "https://img.icons8.com/3d-fluency/94/graduation-cap.png", desc: "Globally accredited degrees recognized by ZAQA." },
                { title: "Cheaper than Zambia", icon: "https://img.icons8.com/3d-fluency/94/money-bag.png", desc: "Tuition & living costs lower than private local unis." },
                { title: "Global Connection", icon: "https://img.icons8.com/3d-fluency/94/globe.png", desc: "Network with students from 50+ countries." },
                { title: "Top Scholarships", icon: "https://img.icons8.com/3d-fluency/94/star.png", desc: "Access to Top Scholarships & Financial Aid." },
                { title: "High Career Ops", icon: "https://img.icons8.com/3d-fluency/94/briefcase.png", desc: "High Career & Internship Opportunities." },
              ].map((item, i, arr) => (
                <div 
                  key={i} 
                  id={`why-india-icon-${i}`}
                  onClick={() => {
                    const nextIndex = (i + 1) % arr.length;
                    document.getElementById(`why-india-icon-${nextIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="p-6 lg:p-8 bg-slate-50 rounded-2xl hover:shadow-2xl transition border border-slate-100 group hover:-translate-y-2 duration-300 cursor-pointer"
                >
                   <div className="p-4 rounded-2xl inline-block mb-4 lg:mb-6 transition transform group-hover:rotate-12 duration-500">
                      <img 
                        src={item.icon} 
                        alt={item.title} 
                        className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl" 
                        loading="lazy" 
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => { e.currentTarget.src = '/assets/fallback-image.png'; e.currentTarget.onerror = null; }}
                      />
                   </div>
                   <h3 className="font-bold text-lg mb-3 text-slate-900">{item.title}</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 3: THE ZII ADVANTAGE
         -------------------------------------------------------------------------------- */}
      <div className="relative bg-slate-950 text-white py-20 lg:py-32 overflow-hidden">
         {/* 3D Background Elements */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 lg:mb-24">
               <span className="inline-block py-1 px-3 rounded-full bg-slate-800 border border-slate-700 text-orange-400 text-sm font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(255,165,0,0.2)]">Our Promise to You</span>
               <h2 className="text-4xl lg:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
                  The <span className="text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">ZII</span> Advantage
               </h2>
               <p className="text-lg lg:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                  We treat every student like family. Your journey is protected, transparent, and guided by those who truly care about your future.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
               {/* Card 1 */}
               <div className="group relative p-8 lg:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl hover:border-orange-500/50 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.15)] hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(249,115,22,0.3)] transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                           <DollarSign className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">No Hidden Fees</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                           We believe in absolute transparency. You pay your tuition directly to the university's official account. No middleman markups, no surprise charges.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Card 2 */}
               <div className="group relative p-8 lg:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(16,185,129,0.3)] transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                           <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">Verified Agents and Consultants</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                           Every advisor you speak with is officially vetted and certified. We protect you from scams and ensure you receive accurate, trustworthy guidance.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Card 3 */}
               <div className="group relative p-8 lg:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(59,130,246,0.3)] transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                           <Globe className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">Government Monitored Portal</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                           Our platform operates under strict compliance and monitoring. Your data is secure, and your application process is officially recognized.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Card 4 */}
               <div className="group relative p-8 lg:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(168,85,247,0.3)] transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                           <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">6500+ Zambians</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                           Join a massive, thriving community. With over 6,500 Zambians currently living and studying in India, you will never feel far from home.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 3.5: ELIGIBILITY MATCHER
         -------------------------------------------------------------------------------- */}
      <EligibilityMatcher />

      {/* --------------------------------------------------------------------------------
         SECTION 4: YOUR JOURNEY (6 STEPS)
         -------------------------------------------------------------------------------- */}
      <div id="how-it-works" className="py-16 lg:py-24 bg-emerald-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900">Your Journey</h2>
               <p className="text-lg lg:text-xl text-slate-600 mt-4 max-w-2xl mx-auto">6 Simple Steps from Lusaka to Campus. Guided by AI and Alumni.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
               {[
                  { step: 1, title: "Apply Online", iconUrl: "https://img.icons8.com/3d-fluency/256/laptop.png", alt: "Ultra realistic 3D laptop displaying application form with futuristic UI hologram effect and Zambia-India subtle flags" },
                  { step: 2, title: "Eligibility Verification", iconUrl: "https://img.icons8.com/3d-fluency/256/checked-checkbox.png", alt: "3D document with green verified checkmark and digital scanning light effect" },
                  { step: 3, title: "Offer Letter", iconUrl: "https://img.icons8.com/3d-fluency/256/mail.png", alt: "Official envelope opening with university crest glowing and premium academic gold seal" },
                  { step: 4, title: "Acceptance", iconUrl: "https://img.icons8.com/3d-fluency/256/certificate.png", alt: "Certificate glowing with bold 100% Scholarship seal, gold embossed medal, and academic ribbon" },
                  { step: 5, title: "VISA", iconUrl: "https://img.icons8.com/3d-fluency/256/passport.png", alt: "Passport open with stamped visa and holographic approval glow" },
                  { step: 6, title: "Fly to India", iconUrl: "https://img.icons8.com/3d-fluency/256/paper-plane.png", alt: "Ultra realistic 3D airplane mid-air with motion trail and globe beneath" },
               ].map((s) => (
                  <button 
                     key={s.step} 
                     onClick={() => {
                        if (s.step === 2) {
                           document.getElementById('eligibility-section')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                           onNavigate(PublicView.APPLY_ONLINE);
                        }
                     }}
                     className="bg-white p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition flex flex-col items-center text-center group border border-emerald-100 hover:border-orange-500 relative overflow-hidden active:scale-95"
                  >
                     <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-bl-xl">STEP {s.step}</div>
                     <div className="w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center mb-4 lg:mb-6 transition duration-500 relative group-hover:scale-110 group-hover:-translate-y-2">
                        <img 
                           src={s.iconUrl} 
                           alt={s.alt} 
                           loading="lazy" 
                           className="w-full h-full object-contain drop-shadow-2xl"
                           onError={(e) => { e.currentTarget.src = 'https://img.icons8.com/3d-fluency/256/star.png'; e.currentTarget.onerror = null; }}
                        />
                     </div>
                     <h3 className="text-xl lg:text-2xl font-bold mb-3 text-slate-800">{s.title}</h3>
                     <p className="text-sm text-slate-500 mb-6">Click to access resources & AI guide</p>
                     <span className="text-orange-600 text-sm font-bold flex items-center uppercase tracking-widest group-hover:translate-x-1 transition">
                        View Details <ArrowRight className="w-4 h-4 ml-2"/>
                     </span>
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 5: VIDEO PLACEHOLDER
         -------------------------------------------------------------------------------- */}
      <div className="py-16 lg:py-24 bg-white">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="mb-12">
               <span className="text-orange-600 font-bold tracking-widest uppercase text-sm bg-orange-50 px-3 py-1 rounded-full">Step-by-Step Guide</span>
               <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4">Application Process Video</h2>
               <p className="text-slate-500 mt-2">See exactly how to navigate the ZII portal.</p>
            </div>
            
            <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto group cursor-pointer border-4 border-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-orange-600 text-white p-5 rounded-full shadow-2xl group-hover:scale-110 transition transform">
                        <Play className="w-10 h-10 fill-current" />
                    </div>
                    <p className="text-white font-bold mt-4 text-lg drop-shadow-md">Click play to watch the full application process video</p>
                </div>
                <a href="https://www.youtube.com/watch?v=3sd1vQv6CAI" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" aria-label="Watch Video"></a>
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 6: REAL STORIES. REAL OUTCOMES.
         -------------------------------------------------------------------------------- */}
      <div className="py-16 lg:py-24 bg-slate-900 text-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">Real Stories. Real Outcomes.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {testimonials.map((t, i) => (
                  <div key={i} className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-orange-500 transition relative group mt-12 md:mt-0 flex flex-col h-full">
                     <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 md:left-8 md:translate-x-0">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-800 overflow-hidden shadow-[0_0_15px_rgba(255,165,0,0.5)] group-hover:shadow-[0_0_25px_rgba(255,165,0,0.8)] transition-all duration-300 group-hover:scale-110">
                           <img 
                             src={t.img} 
                             alt={t.name} 
                             className="w-full h-full object-cover" 
                             loading="lazy" 
                             referrerPolicy="no-referrer"
                             crossOrigin="anonymous"
                             onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`; e.currentTarget.onerror = null; }}
                           />
                        </div>
                     </div>
                     <div className="mt-12 flex-grow flex flex-col">
                        <div className="flex text-orange-500 mb-4 justify-center md:justify-start">
                           {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-300 italic mb-6 leading-relaxed text-center md:text-left flex-grow">"{t.text}"</p>
                        <div className="border-t border-slate-700 pt-4 text-center md:text-left">
                           <p className="font-bold text-lg text-white">{t.name}</p>
                           <p className="text-xs text-red-500 uppercase font-bold tracking-wider bg-red-500/10 inline-block px-2 py-1 rounded mt-1 mb-2">NOW WORKING AT: {t.role}</p>
                           <p className="text-xs text-slate-500">{t.uni}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 7: BOOK OFFICE APPOINTMENT
         -------------------------------------------------------------------------------- */}
      <div className="py-16 lg:py-24 bg-orange-50">
         <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left w-full">
               <span className="bg-white text-orange-600 font-bold px-4 py-1 rounded-full text-xs shadow-sm uppercase tracking-wide">In-Person Consultation</span>
               <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mt-4 mb-6">Visit Our Office</h2>
               <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  Parents love our transparency. Come meet us in Roma Park, Lusaka.
                  We will walk you through the budget, safety, and curriculum face-to-face.
               </p>
               <div className="space-y-6 bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-orange-100 text-left">
                  <div className="flex items-center text-slate-800"><MapPin className="w-6 h-6 mr-4 text-orange-500 flex-shrink-0"/> <div><span className="font-bold block">Location</span>231 Kasangula Road, Roma, Lusaka, Zambia</div></div>
                  <div className="flex items-center text-slate-800"><Phone className="w-6 h-6 mr-4 text-orange-500 flex-shrink-0"/> <div><span className="font-bold block">Call Us</span>+260 762 523 854</div></div>
                  <div className="flex items-center text-slate-800"><Calendar className="w-6 h-6 mr-4 text-orange-500 flex-shrink-0"/> <div><span className="font-bold block">Working Hours</span>Mon - Fri, 08:00 - 17:00</div></div>
                  
                  {/* Added Directions Button */}
                  <a href="https://www.google.com/maps/place/231+Kasangula+Road,+Roma,+Lusaka,+Zambia" target="_blank" rel="noopener noreferrer" className="block w-full bg-slate-900 text-white text-center py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center">
                     <Map className="w-4 h-4 mr-2"/> Get Directions
                  </a>
                  
                  {/* Virtual Meeting Button */}
                  <button onClick={() => setShowVirtualModal(true)} className="block w-full bg-orange-600 text-white text-center py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center">
                     <Video className="w-4 h-4 mr-2"/> Book Virtual Meeting
                  </button>
               </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
               <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border-4 border-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                     <Calendar className="w-32 h-32 text-orange-500"/>
                  </div>
                  
                  {/* WhatsApp Support Button */}
                  <a href="https://wa.me/15557824998" target="_blank" rel="noopener noreferrer" className="absolute -top-6 -right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition border-4 border-white flex items-center justify-center z-20">
                     <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                     </svg>
                  </a>

                  <h3 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">Request Appointment</h3>
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 p-4 rounded-2xl mb-8 shadow-inner flex items-start gap-3">
                     <span className="text-2xl">🎓</span>
                     <p className="text-sm text-emerald-800 font-bold leading-relaxed">
                        Saturday 9AM – Student & Parent Fair. We strongly encourage students and parents to attend for direct guidance and application assistance.
                     </p>
                  </div>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('Appointment requested successfully! Redirecting to Contact page...');
                      onNavigate(PublicView.CONTACT);
                    }}
                    className="space-y-5 relative z-10"
                  >
                     <div className="group">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider group-focus-within:text-orange-500 transition-colors">Parent Name</label>
                        <div className="relative">
                          <input required type="text" className="w-full p-4 pl-5 border-2 border-slate-100 rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all text-slate-700 font-medium" placeholder="e.g. Mrs. Phiri" />
                        </div>
                     </div>
                     <div className="group">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider group-focus-within:text-orange-500 transition-colors">Phone Number</label>
                        <div className="relative">
                          <input required type="tel" className="w-full p-4 pl-5 border-2 border-slate-100 rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all text-slate-700 font-medium" placeholder="+260..." />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-5">
                        <div className="group">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider group-focus-within:text-orange-500 transition-colors">Preferred Day</label>
                           <select 
                             required
                             className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                             value={selectedDay}
                             onChange={(e) => setSelectedDay(e.target.value)}
                           >
                              <option value="">Select Day</option>
                              <option value="Monday">Monday</option>
                              <option disabled className="text-slate-400 bg-slate-50">Tuesday (Fully Booked)</option>
                              <option disabled className="text-slate-400 bg-slate-50">Wednesday (Fully Booked)</option>
                              <option value="Thursday">Thursday</option>
                              <option disabled className="text-slate-400 bg-slate-50">Friday (Fully Booked)</option>
                              <option value="Saturday">Saturday</option>
                              <option disabled className="text-slate-400 bg-slate-50">Sunday (Closed)</option>
                           </select>
                        </div>
                        <div className="group">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider group-focus-within:text-orange-500 transition-colors">Time Slot</label>
                           <select required className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all text-slate-700 font-medium appearance-none cursor-pointer">
                              <option value="">Select Time</option>
                              <option value="10:00">10:00 hrs</option>
                              <option value="14:00">14:00 hrs</option>
                              <option disabled className="text-slate-400 bg-slate-50">08:00 (Fully Booked)</option>
                              <option disabled className="text-slate-400 bg-slate-50">12:00 (Fully Booked)</option>
                              <option disabled className="text-slate-400 bg-slate-50">16:00 (Fully Booked)</option>
                           </select>
                        </div>
                     </div>

                     <button type="submit" className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-black py-5 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] mt-6 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group/btn border border-slate-700">
                        Confirm Booking
                        <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 8: DON'T GO ALONE (REFERRAL)
         -------------------------------------------------------------------------------- */}
      <div className="py-16 lg:py-24 bg-white text-center">
         <div className="max-w-4xl mx-auto px-4">
            <div className="inline-block p-6 rounded-full bg-green-50 mb-6">
               <Users className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Don't Go Alone</h2>
            <p className="text-xl lg:text-2xl text-slate-600 mb-10 font-light max-w-2xl mx-auto">
               "Travel with your best friend and shape your futures together. <br/>
               <span className="font-bold text-green-600">Sharing increases scholarship chances.</span>"
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={handleShareWhatsApp} className="flex items-center justify-center bg-[#25D366] text-white px-10 py-4 rounded-full font-bold hover:bg-[#128C7E] shadow-xl transition transform hover:scale-105 active:scale-95">
                  <Share2 className="w-5 h-5 mr-3" /> Share via WhatsApp
               </button>
               <a href="https://whatsapp.com/channel/0029Vb8BtpAJUM2fxPWINE40" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 border border-emerald-400">
                  <MessageCircle className="w-5 h-5 mr-3" /> Follow Our WhatsApp Channel
               </a>
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 9: OUR GLOBAL SERVICES HUB
         -------------------------------------------------------------------------------- */}
      <div className="py-20 bg-slate-900 text-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Expansion 2025</span>
               <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6">Our Global Services Hub</h2>
               <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Beyond education. We are now bridging Zambia and India across 6 key sectors.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Card 1: Medical */}
               <div onClick={() => onNavigate(PublicView.MEDICAL_HUB)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-700 hover:border-red-500 transition-all duration-500">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2028&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                     <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <HeartPulse className="w-6 h-6 text-white"/>
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Medical Treatment</h3>
                     <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Access world-class healthcare. Surgery, Oncology, Transplants.
                     </p>
                  </div>
               </div>

               {/* Card 2: Tourism */}
               <div onClick={() => onNavigate(PublicView.TOURISM_HUB)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-700 hover:border-orange-500 transition-all duration-500">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                     <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <Plane className="w-6 h-6 text-white"/>
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Tourism & Culture</h3>
                     <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Taj Mahal tours, group trips, and cultural exchange programs.
                     </p>
                  </div>
               </div>

               {/* Card 3: Work */}
               <div onClick={() => onNavigate(PublicView.WORK_HUB)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-700 hover:border-blue-500 transition-all duration-500">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                     <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <Briefcase className="w-6 h-6 text-white"/>
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Jobs & Recruitment</h3>
                     <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        International job placements, internships, and skilled migration.
                     </p>
                  </div>
               </div>

               {/* Card 4: Invest */}
               <div onClick={() => onNavigate(PublicView.INVEST_HUB)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-700 hover:border-emerald-500 transition-all duration-500">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                     <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <TrendingUp className="w-6 h-6 text-white"/>
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Invest & Business</h3>
                     <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        High-yield investment opportunities in India and Zambia.
                     </p>
                  </div>
               </div>

               {/* Card 5: Import */}
               <div onClick={() => onNavigate(PublicView.IMPORT_HUB)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-700 hover:border-purple-500 transition-all duration-500">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                     <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <ShoppingBag className="w-6 h-6 text-white"/>
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Import & Shopping</h3>
                     <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        We buy and ship global brands to your doorstep in Zambia.
                     </p>
                  </div>
               </div>

               {/* Card 6: Money */}
               <div onClick={() => onNavigate(PublicView.MONEY_HUB)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-700 hover:border-cyan-500 transition-all duration-500">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                     <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <DollarSign className="w-6 h-6 text-white"/>
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Money Transfer</h3>
                     <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Secure, instant, and low-cost remittances.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 10: BLOG / NEWS SECTION (NEW)
         -------------------------------------------------------------------------------- */}
      <div className="py-20 bg-slate-50">
         <div className="max-w-5xl mx-auto px-4">
             <div className="flex items-center justify-center mb-10">
                 <Newspaper className="w-8 h-8 text-orange-500 mr-3" />
                 <h2 className="text-3xl font-extrabold text-slate-900 text-center">Latest News & Updates</h2>
             </div>
             
             <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                 <div className="flex flex-col md:flex-row">
                     <div className="md:w-1/3 bg-emerald-900 text-white p-8 flex flex-col justify-center text-center md:text-left relative overflow-hidden">
                         <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                         <span className="relative z-10 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-4 mx-auto md:mx-0">FEATURED STORY</span>
                         <h3 className="relative z-10 text-2xl font-bold mb-4">1,000 Scholarships for 2026</h3>
                         <p className="relative z-10 text-emerald-100 text-sm mb-6">Celebrating 10 Years of a Glorious Partnership between CT UNIVERSITY and Zambians In India.</p>
                         <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="relative z-10 bg-white text-emerald-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-50 transition self-center md:self-start">Read More</button>
                     </div>
                     <div className="md:w-2/3 p-8 md:p-12">
                         <p className="text-slate-600 mb-4 leading-relaxed">
                            For the past 10 years, Zambians In India (ZII) has stood as a trusted bridge between Zambia and India, empowering thousands of students to access world-class education at affordable costs. What started as a small community initiative has grown into a nationally recognized platform connecting Zambian students with top Indian universities.
                         </p>
                         <p className="text-slate-600 mb-4 leading-relaxed">
                            In celebration of this milestone, ZII is proud to announce <strong>1,000 scholarship opportunities for the 2026 intake</strong>, covering a wide range of academic disciplines including medicine, engineering, ICT, business, agriculture, and health sciences. These scholarships are designed to reduce financial barriers while maintaining high academic standards.
                         </p>
                         <p className="text-slate-600 mb-4 leading-relaxed hidden md:block">
                            India remains one of the most competitive yet affordable study destinations globally, offering internationally recognized qualifications, modern campuses, and multicultural exposure. Through ZII’s direct partnerships with Indian universities, students benefit from transparent processes, official offer letters, and step-by-step guidance from application to graduation.
                         </p>
                         <p className="text-slate-600 mb-4 leading-relaxed hidden md:block">
                            Over the last decade, ZII alumni have gone on to serve Zambia in critical sectors such as healthcare, aviation, education, technology, and public service. Parents and guardians continue to trust ZII because of its community-driven, not-for-profit approach led by Zambians, for Zambians.
                         </p>
                         <p className="text-slate-800 font-bold italic border-l-4 border-orange-500 pl-4 mt-6">
                            "As we look ahead to 2026, ZII remains committed to transforming lives through education, strengthening Zambia–India relations, and creating opportunities for future generations."
                         </p>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 11: 100% FULL SCHOLARSHIP EXAM
         -------------------------------------------------------------------------------- */}
      <div className="py-24 bg-slate-900 relative overflow-hidden">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/50"></div>
         
         <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-white">
               <div className="inline-flex items-center bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-xl animate-pulse tracking-wider">
                  <Award className="w-4 h-4 mr-2" /> LIMITED TIME OFFER
               </div>
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                  100% Full <br/> Scholarship Exam
               </h2>
               <p className="text-xl md:text-2xl text-orange-400 font-medium mb-6">
                  Your Opportunity to Study in India – Fully Sponsored
               </p>
               
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center text-slate-300">
                     <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" /> 100% Tuition
                  </div>
                  <div className="flex items-center text-slate-300">
                     <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" /> Accommodation
                  </div>
                  <div className="flex items-center text-slate-300">
                     <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" /> Visa Assistance
                  </div>
                  <div className="flex items-center text-slate-300">
                     <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" /> Flight Support
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                     onClick={() => onNavigate(PublicView.SCHOLARSHIP_EXAM)}
                     className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform active:scale-95 text-lg text-center"
                  >
                     Register Now
                  </button>
                  <button 
                     onClick={() => onNavigate(PublicView.SCHOLARSHIP_EXAM)}
                     className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform active:scale-95 text-lg text-center"
                  >
                     Learn More
                  </button>
               </div>
            </div>

            <div className="lg:w-1/2 w-full">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-2">Registration Closes In:</h3>
                  <p className="text-emerald-400 font-medium mb-8">Deadline: 30th March</p>
                  
                  <div className="grid grid-cols-4 gap-4">
                     <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                        <div className="text-3xl md:text-5xl font-bold text-white mb-1">{timeLeft.days}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Days</div>
                     </div>
                     <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                        <div className="text-3xl md:text-5xl font-bold text-white mb-1">{timeLeft.hours}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Hours</div>
                     </div>
                     <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                        <div className="text-3xl md:text-5xl font-bold text-white mb-1">{timeLeft.minutes}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Mins</div>
                     </div>
                     <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                        <div className="text-3xl md:text-5xl font-bold text-white mb-1">{timeLeft.seconds}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Secs</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* WhatsApp Funnel Integration */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <WhatsAppFunnel 
          title="Join the ZII WhatsApp Community"
          context="Connect with over 6,500+ Zambians in India. Get real-time updates, scholarship alerts, and student support."
        />
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 12: FOOTER
         -------------------------------------------------------------------------------- */}
      <Footer onNavigate={onNavigate} />

    </div>
  );
};

export default LandingPage;
