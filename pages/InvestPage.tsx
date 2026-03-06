import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { 
  TrendingUp, PieChart, Shield, ArrowRight, 
  CheckCircle, Star, Building, Globe, DollarSign, Briefcase, BarChart,
  FileText, Search, Users
} from 'lucide-react';

interface InvestPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const InvestPage: React.FC<InvestPageProps> = ({ onNavigate, onLogin }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in-down">
               <span className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-emerald-500 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Investment & Business Setup
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
               Grow Your Wealth <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">In Emerging Markets.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
               Secure, high-yield investment opportunities in India and Zambia. <br/>
               <span className="text-emerald-400 font-bold">Real Estate. Tech Startups. Manufacturing.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={() => setShowWizard(true)} className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-emerald-500">
                  View Portfolio
               </button>
               <button onClick={() => onNavigate(PublicView.CONTACT)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                  Consult an Advisor
               </button>
            </div>
         </div>
      </div>

      {/* 2. INVESTMENT SECTORS */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">High-Growth Sectors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Real Estate", roi: "12-15% Annual", icon: Building, desc: "Commercial & Residential properties in prime locations." },
                    { title: "Tech Startups", roi: "20%+ Potential", icon: Globe, desc: "Early-stage funding for scalable tech ventures." },
                    { title: "Agro-Processing", roi: "18% Annual", icon: PieChart, desc: "Value addition for export markets." }
                ].map((sector, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition text-center group">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition">
                            <sector.icon className="w-8 h-8 text-emerald-600"/>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{sector.title}</h3>
                        <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">{sector.roi}</p>
                        <p className="text-slate-500">{sector.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 3. SERVICES GRID */}
      <div className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif font-bold text-slate-900">Business Services</h2>
               <p className="text-slate-500 mt-4 text-lg">End-to-end support for investors and entrepreneurs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Company Registration", icon: FileText, desc: "Incorporation in India & Zambia." },
                  { title: "Market Research", icon: Search, desc: "Feasibility studies & data analysis." },
                  { title: "Legal Compliance", icon: Shield, desc: "Tax, labor, and regulatory advisory." },
                  { title: "Joint Ventures", icon: Users, desc: "Connecting local partners with global capital." },
                  { title: "Supply Chain", icon: Globe, desc: "Logistics and distribution networks." },
                  { title: "Financial Modeling", icon: BarChart, desc: "Projections and valuation services." }
               ].map((service, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
                     <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition">
                        <service.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition"/>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                     <p className="text-slate-500 mb-6">{service.desc}</p>
                     <button className="text-emerald-600 font-bold text-sm flex items-center hover:underline">
                        Consult Now <ArrowRight className="w-4 h-4 ml-1"/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. WHY INVEST WITH ZII */}
      <div className="py-24 bg-slate-900 text-white">
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl font-serif font-bold mb-6">Why Invest Through Us?</h2>
               <ul className="space-y-6">
                  {[
                     "Vetted Opportunities: We do the due diligence so you don't have to.",
                     "Local Expertise: Deep understanding of both Indian and Zambian markets.",
                     "End-to-End Support: From legal setup to operational launch.",
                     "Network Access: Connect with government bodies and industry leaders.",
                     "Transparent Reporting: Real-time updates on your investment performance."
                  ].map((item, i) => (
                     <li key={i} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0"/>
                        <span className="text-lg text-slate-300">{item}</span>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="relative">
               <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-10 text-white shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6">Investment Calculator</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold mb-2">Investment Amount ($)</label>
                          <input type="number" className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50" placeholder="10,000"/>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2">Duration (Years)</label>
                          <input type="number" className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50" placeholder="5"/>
                      </div>
                      <div className="pt-4">
                          <p className="text-sm opacity-80">Estimated Returns</p>
                          <p className="text-4xl font-bold">$18,500</p>
                          <p className="text-xs opacity-60">*Based on 13% avg. annual growth</p>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* INVESTMENT INQUIRY WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
                <button onClick={() => setShowWizard(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Investment Inquiry</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                            <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Company (Optional)</label>
                            <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input type="email" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Interested Sector</label>
                        <select className="w-full p-3 border border-slate-300 rounded-xl">
                            <option>Real Estate</option>
                            <option>Technology</option>
                            <option>Agriculture</option>
                            <option>Manufacturing</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Investment Range</label>
                        <select className="w-full p-3 border border-slate-300 rounded-xl">
                            <option>$5,000 - $20,000</option>
                            <option>$20,000 - $100,000</option>
                            <option>$100,000+</option>
                        </select>
                    </div>
                    <button type="button" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition">
                        Request Prospectus
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default InvestPage;
