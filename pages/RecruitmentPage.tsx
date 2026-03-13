import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { 
  Briefcase, Search, FileText, UserCheck, ArrowRight, 
  CheckCircle, Star, Building, Globe, Users, TrendingUp, Award
} from 'lucide-react';

interface RecruitmentPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const RecruitmentPage: React.FC<RecruitmentPageProps> = ({ onNavigate, onLogin }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in-down">
               <span className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-emerald-500 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Global Talent Acquisition
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
               Hire Top Zambian Talent <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">For Your Global Team.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
               Connecting international employers with skilled, educated, and driven professionals from Zambia. <br/>
               <span className="text-emerald-400 font-bold">Tech. Healthcare. Engineering. Finance.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={() => setShowWizard(true)} className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-emerald-500">
                  Post a Job
               </button>
               <button onClick={() => onNavigate(PublicView.CONTACT)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                  Contact Sales
               </button>
            </div>
         </div>
      </div>

      {/* 2. SERVICES GRID */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif font-bold text-slate-900">Our Recruitment Solutions</h2>
               <p className="text-slate-500 mt-4 text-lg">Comprehensive hiring services tailored to your needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Executive Search", icon: Star, desc: "Find C-level and senior leadership talent." },
                  { title: "Volume Hiring", icon: Users, desc: "Scale your team quickly with qualified candidates." },
                  { title: "Remote Teams", icon: Globe, desc: "Build dedicated remote teams in Zambia." },
                  { title: "Skills Assessment", icon: Award, desc: "Rigorous technical and cultural fit testing." },
                  { title: "Visa & Relocation", icon: Briefcase, desc: "End-to-end support for international hires." },
                  { title: "Payroll & Compliance", icon: FileText, desc: "Manage local compliance and payroll seamlessly." }
               ].map((service, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
                     <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition">
                        <service.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition"/>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                     <p className="text-slate-500 mb-6">{service.desc}</p>
                     <button className="text-emerald-600 font-bold text-sm flex items-center hover:underline">
                        Learn More <ArrowRight className="w-4 h-4 ml-1"/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* JOB POSTING WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
                <button onClick={() => setShowWizard(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Post a Job Opening</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                            <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Name</label>
                            <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input type="email" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                        <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Job Description</label>
                         <textarea className="w-full p-3 border border-slate-300 rounded-xl h-32"></textarea>
                    </div>
                    <button type="button" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition">
                        Submit Job Post
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentPage;
