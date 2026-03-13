import React from 'react';
import { 
  ArrowRight, CheckCircle, Search, ShieldCheck, Handshake, 
  Scale, TrendingUp, Globe, Award, Building, Play, Upload, 
  Clock, Eye, Mail, Plane, Users, Calendar, Rocket, Check, Smile, Coffee
} from 'lucide-react';
import { PublicView } from '../../types';
import Footer from '../../components/Footer';

interface AboutPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
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
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" alt="Students" className="w-full h-full object-cover" referrerPolicy="no-referrer"/>
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
};

export default AboutPage;
