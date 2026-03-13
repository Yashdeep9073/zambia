import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { 
  DollarSign, RefreshCw, ShieldCheck, ArrowRight, 
  CheckCircle, Star, Globe, Smartphone, CreditCard, Lock, Zap,
  Users, Briefcase, TrendingUp
} from 'lucide-react';

interface MoneyTransferPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const MoneyTransferPage: React.FC<MoneyTransferPageProps> = ({ onNavigate, onLogin }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in-down">
               <span className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-emerald-500 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Secure Money Transfer
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
               Send Money Home. <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Instantly. Securely.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
               The trusted way to send funds between Zambia and India. <br/>
               <span className="text-emerald-400 font-bold">Best Rates. Zero Hidden Fees. 24/7 Support.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={() => setShowWizard(true)} className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-emerald-500">
                  Send Money Now
               </button>
               <button onClick={() => onNavigate(PublicView.CONTACT)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                  Check Rates
               </button>
            </div>
         </div>
      </div>

      {/* 2. LIVE RATES (SIMULATED) */}
      <div className="py-12 bg-white -mt-20 relative z-20 max-w-4xl mx-auto rounded-3xl shadow-2xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-8 text-center">
                <p className="text-sm font-bold text-slate-500 uppercase mb-2">You Send</p>
                <p className="text-3xl font-bold text-slate-900">1,000 ZMW</p>
            </div>
            <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <RefreshCw className="w-5 h-5 text-emerald-600"/>
                </div>
                <p className="text-xs font-bold text-emerald-600">Best Rate Guaranteed</p>
            </div>
            <div className="p-8 text-center">
                <p className="text-sm font-bold text-slate-500 uppercase mb-2">They Receive</p>
                <p className="text-3xl font-bold text-emerald-600">3,250 INR</p>
            </div>
        </div>
      </div>

      {/* 3. SERVICES GRID */}
      <div className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif font-bold text-slate-900">Transfer Services</h2>
               <p className="text-slate-500 mt-4 text-lg">Fast, reliable, and compliant financial solutions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Student Fees", icon: Globe, desc: "Direct payments to universities." },
                  { title: "Family Support", icon: Users, desc: "Instant cash for loved ones." },
                  { title: "Business Payments", icon: Briefcase, desc: "Pay suppliers in India/Zambia." },
                  { title: "Medical Bills", icon: ShieldCheck, desc: "Urgent transfers to hospitals." },
                  { title: "Travel Funds", icon: CreditCard, desc: "Top up travel cards instantly." },
                  { title: "Investment Capital", icon: TrendingUp, desc: "Secure large volume transfers." }
               ].map((service, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
                     <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition">
                        <service.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition"/>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                     <p className="text-slate-500 mb-6">{service.desc}</p>
                     <button className="text-emerald-600 font-bold text-sm flex items-center hover:underline">
                        Start Transfer <ArrowRight className="w-4 h-4 ml-1"/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. HOW IT WORKS */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 text-center mb-16">Send Money in 3 Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-100 -z-0"></div>
               {[
                  { step: 1, title: "Register", desc: "Create a free account in minutes." },
                  { step: 2, title: "Add Recipient", desc: "Enter bank details or mobile number." },
                  { step: 3, title: "Send", desc: "Pay via bank transfer or mobile money." }
               ].map((s, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-white border-4 border-emerald-100 rounded-full flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-emerald-600">
                        {s.step}
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                     <p className="text-slate-500 text-sm">{s.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 5. SECURITY FEATURES */}
      <div className="py-24 bg-slate-900 text-white">
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl font-serif font-bold mb-6">Bank-Grade Security</h2>
               <ul className="space-y-6">
                  {[
                     "Regulated by Central Banks in both regions.",
                     "256-bit SSL Encryption for all data.",
                     "Two-Factor Authentication (2FA) required.",
                     "Real-time fraud monitoring.",
                     "Instant transaction receipts."
                  ].map((item, i) => (
                     <li key={i} className="flex items-start">
                        <Lock className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0"/>
                        <span className="text-lg text-slate-300">{item}</span>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="relative">
               <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20">
                  <Smartphone className="w-20 h-20 text-emerald-400 mx-auto mb-6"/>
                  <h3 className="text-2xl font-bold text-center mb-4">Track Every Penny</h3>
                  <p className="text-center text-slate-300">
                      Get SMS and Email updates at every stage of your transfer. From 'Initiated' to 'Delivered'.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* TRANSFER WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
                <button onClick={() => setShowWizard(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Initiate Transfer</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Amount to Send</label>
                            <div className="relative">
                                <input type="number" className="w-full p-3 border border-slate-300 rounded-xl" placeholder="1000"/>
                                <span className="absolute right-4 top-3 text-slate-500 font-bold">ZMW</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Recipient Gets</label>
                            <div className="relative">
                                <input type="text" className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50" value="3,250" readOnly/>
                                <span className="absolute right-4 top-3 text-slate-500 font-bold">INR</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Recipient Name</label>
                        <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Bank Account / Mobile Number</label>
                        <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Purpose of Transfer</label>
                        <select className="w-full p-3 border border-slate-300 rounded-xl">
                            <option>Family Support</option>
                            <option>Education</option>
                            <option>Medical</option>
                            <option>Business</option>
                        </select>
                    </div>
                    <button type="button" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition">
                        Proceed to Payment
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default MoneyTransferPage;
