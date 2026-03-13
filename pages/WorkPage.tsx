import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { 
  Briefcase, Search, FileText, UserCheck, ArrowRight, 
  CheckCircle, Star, Building, Globe, Users, TrendingUp, Award
} from 'lucide-react';

interface WorkPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const WorkPage: React.FC<WorkPageProps> = ({ onNavigate, onLogin }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in-down">
               <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-blue-500 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Global Recruitment & Jobs
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
               Launch Your Career <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">On The Global Stage.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
               Connecting Zambian talent with international employers. <br/>
               <span className="text-blue-400 font-bold">Remote Work. Internships. Skilled Migration.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={() => setShowWizard(true)} className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-blue-500">
                  Upload Resume
               </button>
               <button onClick={() => onNavigate(PublicView.CONTACT)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                  For Employers
               </button>
            </div>
         </div>
      </div>

      {/* 2. JOB CATEGORIES */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Trending Opportunities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { title: "Tech & IT", count: "120+ Jobs", icon: Globe },
                    { title: "Healthcare", count: "85+ Jobs", icon: Users },
                    { title: "Engineering", count: "50+ Jobs", icon: Building },
                    { title: "Remote Sales", count: "200+ Jobs", icon: TrendingUp }
                ].map((cat, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-blue-500 hover:shadow-md transition cursor-pointer group text-center">
                        <cat.icon className="w-10 h-10 mx-auto mb-4 text-slate-400 group-hover:text-blue-600 transition"/>
                        <h3 className="font-bold text-slate-900 text-lg">{cat.title}</h3>
                        <p className="text-sm text-slate-500">{cat.count}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 3. SERVICES GRID */}
      <div className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif font-bold text-slate-900">Career Services</h2>
               <p className="text-slate-500 mt-4 text-lg">We don't just find you a job; we build your career.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Resume Optimization", icon: FileText, desc: "ATS-friendly CV rewriting." },
                  { title: "Interview Prep", icon: UserCheck, desc: "Mock interviews with HR experts." },
                  { title: "Skill Assessment", icon: Award, desc: "Certified technical testing." },
                  { title: "Visa Sponsorship", icon: Globe, desc: "Guidance on work permits." },
                  { title: "LinkedIn Branding", icon: Users, desc: "Profile makeover for visibility." },
                  { title: "Salary Negotiation", icon: TrendingUp, desc: "Get paid what you're worth." }
               ].map((service, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
                     <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition">
                        <service.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition"/>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                     <p className="text-slate-500 mb-6">{service.desc}</p>
                     <button className="text-blue-600 font-bold text-sm flex items-center hover:underline">
                        Get Started <ArrowRight className="w-4 h-4 ml-1"/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. FEATURED EMPLOYERS */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-16">Trusted By Global Companies</h2>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Logos would go here */}
               <div className="text-2xl font-bold text-slate-400">Microsoft</div>
               <div className="text-2xl font-bold text-slate-400">Google</div>
               <div className="text-2xl font-bold text-slate-400">Amazon</div>
               <div className="text-2xl font-bold text-slate-400">Infosys</div>
               <div className="text-2xl font-bold text-slate-400">TCS</div>
            </div>
         </div>
      </div>

      {/* 5. SUCCESS STORIES */}
      <div className="py-24 bg-blue-50">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12">Success Stories</h2>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 relative">
               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Star className="w-6 h-6 fill-current"/>
               </div>
               <p className="text-xl text-slate-600 italic mb-6">"I landed a remote software engineering role with a US startup through ZII's recruitment drive. The interview prep was a game changer."</p>
               <h4 className="font-bold text-slate-900">Chanda M.</h4>
               <p className="text-sm text-slate-500">Software Engineer, Lusaka</p>
            </div>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* JOB APPLICATION WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
                <button onClick={() => setShowWizard(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Submit Your Profile</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                            <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                            <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input type="email" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Upload Resume (PDF)</label>
                        <input type="file" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn Profile URL</label>
                         <input type="url" className="w-full p-3 border border-slate-300 rounded-xl" placeholder="https://linkedin.com/in/..."/>
                    </div>
                    <button type="button" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default WorkPage;
