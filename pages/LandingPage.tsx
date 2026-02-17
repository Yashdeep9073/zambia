
import React, { useState } from 'react';
import { UserRole, PublicView } from '../types';
import { 
  ArrowRight, Check, MapPin, ShieldCheck, Users, 
  Calendar, Video, PlayCircle, Plane, DollarSign, Phone, Star, 
  Award, Share2, MessageCircle, Download, LogIn, Play, Map,
  Globe, TrendingUp, FileText, Newspaper
} from 'lucide-react';
import Footer from '../components/Footer';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: PublicView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onNavigate }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showToast, setShowToast] = useState(false);
  
  // Office Appointment State
  const [selectedDay, setSelectedDay] = useState('');

  const testimonials = [
    { name: "Daniel Mwale", role: "Zambia Police Headquarters", text: "ZII handled everything. I just packed my bags. The campus at CT University is amazing and I'm already interning.", img: "https://randomuser.me/api/portraits/men/32.jpg", uni: "CT University" },
    { name: "Micheal Matambo", role: "Zambia Airforce", text: "The community support is real. I found my roommate through the portal before even flying.", img: "https://randomuser.me/api/portraits/men/45.jpg", uni: "CT University" },
    { name: "Yvette Mbewe", role: "Mandela Washington Fellow - USA", text: "My parents were worried, but the parent portal kept them updated every week. Best decision ever.", img: "https://randomuser.me/api/portraits/women/44.jpg", uni: "Lovely Professional University" }
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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-fade-in-up text-sm font-bold flex items-center">
          <Check className="w-4 h-4 mr-2 text-green-400"/> Message copied to clipboard, paste anywhere
        </div>
      )}

      {/* --------------------------------------------------------------------------------
         SECTION 1: HERO BANNER
         -------------------------------------------------------------------------------- */}
      <div className="relative bg-emerald-900 text-white overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-emerald-900/40 to-emerald-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 pt-24 pb-12">
          <div className="inline-flex items-center bg-orange-500 text-white text-[10px] lg:text-xs font-bold px-4 py-1.5 lg:px-6 lg:py-2 rounded-full mb-6 lg:mb-8 shadow-xl animate-pulse tracking-wider">
            <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-2 fill-current" /> TRUSTED BY PARENTS & GOVT
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 lg:mb-6 leading-tight max-w-5xl">
            Welcome to the Official home of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">'ZAMBIANS IN INDIA'</span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-emerald-100 mb-8 max-w-3xl font-light px-2 sm:px-4 leading-relaxed">
             Gain unlimited access to the over <strong className="text-white">6500+ Zambians</strong> currently living and studying in India.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mb-8 lg:mb-12 text-[10px] sm:text-xs lg:text-base font-bold tracking-wide">
             <span className="bg-black/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded backdrop-blur-sm border border-white/20 whitespace-nowrap">GOVERNMENT APPROVED</span>
             <span className="bg-black/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded backdrop-blur-sm border border-white/20 whitespace-nowrap">NO AGENT FEE</span>
             <span className="bg-black/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded backdrop-blur-sm border border-white/20 whitespace-nowrap">TRUSTED BY PARENTS</span>
          </div>
          
          <div className="flex flex-col w-full max-w-md sm:w-auto sm:max-w-none sm:flex-row gap-4 lg:gap-6 px-4 sm:px-0">
            <button 
              onClick={() => onNavigate(PublicView.APPLY_ONLINE)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 border-2 border-orange-500 text-lg lg:text-xl font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 hover:border-orange-600 transition shadow-2xl transform active:scale-95"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            
            <button 
              onClick={() => alert("Downloading forms... (Simulation)")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 border-2 border-white text-lg lg:text-xl font-bold rounded-full text-white hover:bg-white hover:text-emerald-900 transition shadow-lg backdrop-blur-sm bg-white/10 active:scale-95"
            >
              <Download className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
              Download Forms
            </button>

            <button 
              onClick={() => onNavigate(PublicView.PORTAL_LOGIN)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 border-2 border-emerald-400 text-lg lg:text-xl font-bold rounded-full text-emerald-100 hover:bg-emerald-800 transition shadow-lg backdrop-blur-sm bg-emerald-900/50 active:scale-95"
            >
              <LogIn className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
              Login
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 2: WHY INDIA IS #1 CHOICE
         -------------------------------------------------------------------------------- */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4">Why India is the #1 Choice</h2>
              <p className="text-lg lg:text-xl text-orange-600 font-medium px-4">
                 "We dont just send you to school, we connect your future to the worlds fastest growing economy" <span className="font-bold text-slate-900">#INDIA</span>
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
              {[
                { title: "World-Class Education", icon: <Award className="w-8 h-8 lg:w-10 lg:h-10 text-white"/>, desc: "Globally accredited degrees recognized by ZAQA." },
                { title: "Cheaper than Zambia", icon: <DollarSign className="w-8 h-8 lg:w-10 lg:h-10 text-white"/>, desc: "Tuition & living costs lower than private local unis." },
                { title: "Global Connection", icon: <Globe className="w-8 h-8 lg:w-10 lg:h-10 text-white"/>, desc: "Network with students from 50+ countries." },
                { title: "Top Scholarships", icon: <Star className="w-8 h-8 lg:w-10 lg:h-10 text-white"/>, desc: "Access to Top Scholarships & Financial Aid." },
                { title: "High Career Ops", icon: <TrendingUp className="w-8 h-8 lg:w-10 lg:h-10 text-white"/>, desc: "High Career & Internship Opportunities." },
              ].map((item, i) => (
                <div key={i} className="p-6 lg:p-8 bg-slate-50 rounded-2xl hover:shadow-2xl transition border border-slate-100 group hover:-translate-y-2 duration-300">
                   <div className="bg-emerald-600 p-4 rounded-2xl inline-block mb-4 lg:mb-6 shadow-lg group-hover:bg-orange-500 transition">{item.icon}</div>
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
      <div className="bg-slate-900 text-white py-16 lg:py-24">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-12 w-full text-center md:text-left">
               <h2 className="text-3xl lg:text-5xl font-extrabold mb-8 lg:mb-10 text-white">The <span className="text-orange-500">ZII</span> Advantage</h2>
               <div className="space-y-6 lg:space-y-8 pl-0 lg:pl-0 inline-block text-left">
                  <div className="flex items-center group">
                     <div className="bg-red-600 p-2 lg:p-3 rounded-full mr-4 lg:mr-6 group-hover:scale-110 transition flex-shrink-0"><Check className="w-5 h-5 lg:w-8 lg:h-8 text-white"/></div>
                     <span className="text-lg lg:text-3xl font-bold tracking-tight">NO HIDDEN FEES</span>
                  </div>
                  <div className="flex items-center group">
                     <div className="bg-red-600 p-2 lg:p-3 rounded-full mr-4 lg:mr-6 group-hover:scale-110 transition flex-shrink-0"><Check className="w-5 h-5 lg:w-8 lg:h-8 text-white"/></div>
                     <span className="text-lg lg:text-3xl font-bold tracking-tight">NO AGENTS</span>
                  </div>
                  <div className="flex items-center group">
                     <div className="bg-green-600 p-2 lg:p-3 rounded-full mr-4 lg:mr-6 group-hover:scale-110 transition flex-shrink-0"><Check className="w-5 h-5 lg:w-8 lg:h-8 text-white"/></div>
                     <span className="text-lg lg:text-3xl font-bold tracking-tight">GOVERNMENT APPROVED</span>
                  </div>
                  <div className="flex items-center group">
                     <div className="bg-green-600 p-2 lg:p-3 rounded-full mr-4 lg:mr-6 group-hover:scale-110 transition flex-shrink-0"><Users className="w-5 h-5 lg:w-8 lg:h-8 text-white"/></div>
                     <span className="text-lg lg:text-3xl font-bold tracking-tight">6500+ Alumni & Graduates</span>
                  </div>
               </div>
            </div>
            <div className="md:w-1/2 relative w-full px-4">
               <div className="absolute inset-0 bg-orange-500 rounded-3xl transform rotate-6 opacity-20 hidden md:block"></div>
               <div className="bg-white text-slate-900 p-6 lg:p-10 rounded-3xl shadow-2xl relative z-10">
                  <div className="border-4 border-dashed border-emerald-900 p-6 lg:p-8 h-64 lg:h-80 flex flex-col items-center justify-center text-center bg-slate-50">
                     <ShieldCheck className="w-16 h-16 lg:w-24 lg:h-24 text-emerald-900 mb-4 lg:mb-6" />
                     <h3 className="font-serif text-xl lg:text-3xl font-bold text-emerald-900">CERTIFICATE OF RECOGNITION</h3>
                     <p className="text-sm lg:text-base mt-2 lg:mt-4 font-medium text-slate-600">Endorsed by India-Zambia Education Council</p>
                     <div className="mt-4 lg:mt-6 w-24 lg:w-32 h-1 bg-orange-500"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 4: YOUR JOURNEY (6 STEPS)
         -------------------------------------------------------------------------------- */}
      <div id="how-it-works" className="py-16 lg:py-24 bg-emerald-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 lg:mb-20">
               <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900">Your Journey</h2>
               <p className="text-lg lg:text-xl text-slate-600 mt-4 max-w-2xl mx-auto">6 Simple Steps from Lusaka to Campus. Guided by AI and Alumni.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
               {[
                  { step: 1, title: "Apply Online", icon: <FileText/> },
                  { step: 2, title: "Eligibility Verification", icon: <Video/> },
                  { step: 3, title: "Offer Letter", icon: <Award/> },
                  { step: 4, title: "Acceptance", icon: <Check/> },
                  { step: 5, title: "VISA", icon: <FileText/> },
                  { step: 6, title: "Fly to India", icon: <Plane/> },
               ].map((s) => (
                  <button 
                     key={s.step} 
                     onClick={() => onNavigate(PublicView.APPLY_ONLINE)}
                     className="bg-white p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition flex flex-col items-center text-center group border border-emerald-100 hover:border-orange-500 relative overflow-hidden active:scale-95"
                  >
                     <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-bl-xl">STEP {s.step}</div>
                     <div className="bg-emerald-50 text-emerald-700 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-orange-500 group-hover:text-white transition duration-300 shadow-inner">
                        <div className="scale-125 lg:scale-150">{s.icon}</div>
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
                  <div key={i} className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-orange-500 transition relative group mt-6 md:mt-0">
                     <div className="absolute -top-6 left-8">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-800 overflow-hidden shadow-lg">
                           <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                     </div>
                     <div className="mt-8">
                        <div className="flex text-orange-500 mb-4">
                           {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                        <div className="border-t border-slate-700 pt-4">
                           <p className="font-bold text-lg text-white">{t.name}</p>
                           <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider">{t.role}</p>
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
                  Parents love our transparency. Come meet us in Rhodes Park, Lusaka.
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
               </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
               <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border-4 border-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                     <Calendar className="w-32 h-32 text-orange-500"/>
                  </div>
                  
                  {/* WhatsApp Support Button */}
                  <a href="https://wa.me/260762523854" target="_blank" rel="noopener noreferrer" className="absolute -top-6 -right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition border-4 border-white flex items-center justify-center z-20">
                     <MessageCircle className="w-8 h-8"/>
                  </a>

                  <h3 className="text-2xl font-bold mb-6 text-slate-900">Request Appointment</h3>
                  <form className="space-y-4 relative z-10">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parent Name</label>
                        <input type="text" className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Mrs. Phiri" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                        <input type="tel" className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="+260..." />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preferred Day</label>
                           <select 
                             className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                             value={selectedDay}
                             onChange={(e) => setSelectedDay(e.target.value)}
                           >
                              <option value="">Select Day</option>
                              <option value="Monday">Monday</option>
                              <option disabled className="text-slate-300 bg-slate-100">Tuesday (Closed)</option>
                              <option disabled className="text-slate-300 bg-slate-100">Wednesday (Closed)</option>
                              <option value="Thursday">Thursday</option>
                              <option disabled className="text-slate-300 bg-slate-100">Friday (Closed)</option>
                              <option value="Saturday">Saturday</option>
                              <option disabled className="text-slate-300 bg-slate-100">Sunday (Closed)</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Slot</label>
                           <select className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500">
                              <option value="">Select Time</option>
                              <option value="10:00">10:00 hrs</option>
                              <option value="14:00">14:00 hrs</option>
                              <option disabled className="text-slate-300 bg-slate-100">08:00 (Fully Booked)</option>
                              <option disabled className="text-slate-300 bg-slate-100">12:00 (Fully Booked)</option>
                              <option disabled className="text-slate-300 bg-slate-100">16:00 (Fully Booked)</option>
                           </select>
                        </div>
                     </div>

                     <button type="button" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 shadow-lg mt-4 transition transform active:scale-95">
                        Confirm Booking
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
               <button onClick={handleCopyLink} className="flex items-center justify-center border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition active:scale-95">
                  Copy Referral Link
               </button>
            </div>
         </div>
      </div>

      {/* --------------------------------------------------------------------------------
         SECTION 9: VIRTUAL CAMPUS TEASER
         -------------------------------------------------------------------------------- */}
      <div className="py-16 lg:py-24 bg-black text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop" alt="Campus" className="w-full h-full object-cover" loading="lazy" />
         </div>
         <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            <PlayCircle className="w-20 h-20 lg:w-24 lg:h-24 text-white opacity-80 mb-8 hover:scale-110 transition cursor-pointer" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Experience Campus Life</h2>
            <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-2xl">
               Take a virtual walk through the engineering labs, hostels, and sports complex before you even apply.
            </p>
            <button className="bg-white text-black px-12 py-4 rounded-full font-bold hover:bg-orange-500 hover:text-white transition shadow-2xl active:scale-95">
               Start Virtual Tour
            </button>
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
                 <div className="md:flex">
                     <div className="md:w-1/3 bg-emerald-900 text-white p-8 flex flex-col justify-center text-center md:text-left relative overflow-hidden">
                         <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070')] bg-cover bg-center"></div>
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
         SECTION 11: FOOTER
         -------------------------------------------------------------------------------- */}
      <Footer onNavigate={onNavigate} />

    </div>
  );
};

export default LandingPage;
