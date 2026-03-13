import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { 
  HeartPulse, ShieldCheck, Calendar, FileText, ArrowRight, 
  CheckCircle, Star, MapPin, Phone, Mail, Globe, Clock, 
  Activity, Stethoscope, Hospital, Ambulance
} from 'lucide-react';

interface MedicalPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const MedicalPage: React.FC<MedicalPageProps> = ({ onNavigate, onLogin }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2028&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in-down">
               <span className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-red-500 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" /> Medical Treatment & Health Travel
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
               World-Class Healthcare <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">Within Your Reach.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
               Access India's top hospitals for specialized treatments. <br/>
               <span className="text-red-400 font-bold">Verified Doctors. Transparent Costs. Full Support.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={() => setShowWizard(true)} className="px-10 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-red-500">
                  Book Consultation
               </button>
               <button onClick={() => onNavigate(PublicView.CONTACT)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                  Talk to a Doctor
               </button>
            </div>
         </div>
      </div>

      {/* 2. TRUSTED HOSPITALS */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Partnered with India's Best</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for Hospital Logos */}
                <div className="h-20 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">Apollo Hospitals</div>
                <div className="h-20 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">Fortis Healthcare</div>
                <div className="h-20 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">Medanta</div>
                <div className="h-20 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">Max Healthcare</div>
            </div>
        </div>
      </div>

      {/* 3. SERVICES GRID */}
      <div className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif font-bold text-slate-900">Our Medical Services</h2>
               <p className="text-slate-500 mt-4 text-lg">Comprehensive care packages tailored for international patients.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Cardiac Surgery", icon: HeartPulse, desc: "Bypass, Valve Replacement, Pediatric Cardiac Care." },
                  { title: "Oncology (Cancer)", icon: Activity, desc: "Chemotherapy, Radiation, Surgical Oncology." },
                  { title: "Organ Transplant", icon: Stethoscope, desc: "Liver, Kidney, Bone Marrow Transplants." },
                  { title: "Orthopedics", icon: Activity, desc: "Joint Replacement, Spine Surgery, Sports Medicine." },
                  { title: "Neurology", icon: Activity, desc: "Brain Surgery, Stroke Management, Epilepsy." },
                  { title: "Fertility (IVF)", icon: Activity, desc: "Advanced IVF, IUI, Surrogacy Support." }
               ].map((service, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
                     <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-600 transition">
                        <service.icon className="w-8 h-8 text-red-600 group-hover:text-white transition"/>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                     <p className="text-slate-500 mb-6">{service.desc}</p>
                     <button className="text-red-600 font-bold text-sm flex items-center hover:underline">
                        Learn More <ArrowRight className="w-4 h-4 ml-1"/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. PROCESS SECTION */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 text-center mb-16">Your Journey to Recovery</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
               <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-100 -z-0"></div>
               {[
                  { step: 1, title: "Consultation", desc: "Upload reports & get a free opinion." },
                  { step: 2, title: "Treatment Plan", desc: "Receive cost estimate & doctor profile." },
                  { step: 3, title: "Visa & Travel", desc: "We handle your medical visa & flights." },
                  { step: 4, title: "Recovery", desc: "Airport pickup, surgery & post-op care." }
               ].map((s, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-white border-4 border-red-100 rounded-full flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-red-600">
                        {s.step}
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                     <p className="text-slate-500 text-sm">{s.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 5. WHY CHOOSE INDIA */}
      <div className="py-24 bg-slate-900 text-white">
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl font-serif font-bold mb-6">Why Choose India for Medical Treatment?</h2>
               <ul className="space-y-6">
                  {[
                     "Cost-effective treatments (60-80% less than US/UK).",
                     "JCI Accredited Hospitals meeting global standards.",
                     "Highly skilled doctors with international experience.",
                     "Zero waiting time for surgeries.",
                     "English-speaking medical staff."
                  ].map((item, i) => (
                     <li key={i} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0"/>
                        <span className="text-lg text-slate-300">{item}</span>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1516549655169-df83a092fc5b?q=80&w=2070&auto=format&fit=crop" alt="Surgery" className="rounded-3xl shadow-2xl border-4 border-slate-700"/>
               <div className="absolute -bottom-6 -left-6 bg-red-600 p-6 rounded-2xl shadow-xl">
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-xs text-red-100 uppercase font-bold">Success Rate</p>
               </div>
            </div>
         </div>
      </div>

      {/* 6. TESTIMONIALS */}
      <div className="py-24 bg-red-50">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12">Patient Stories</h2>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100 relative">
               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
                  <Star className="w-6 h-6 fill-current"/>
               </div>
               <p className="text-xl text-slate-600 italic mb-6">"I was diagnosed with a complex heart condition. ZII helped me get to Apollo Hospital in Delhi within 5 days. The surgery was successful and I am back home with my family. Thank you for saving my life."</p>
               <h4 className="font-bold text-slate-900">Mr. Banda</h4>
               <p className="text-sm text-slate-500">Lusaka, Zambia</p>
            </div>
         </div>
      </div>

      {/* 7. FAQ SECTION */}
      <div className="py-24 bg-white">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
            <div className="space-y-4">
               {[
                  { q: "How do I get a medical visa?", a: "We provide an invitation letter from the hospital which you use to apply at the Indian High Commission." },
                  { q: "Can I bring a family member?", a: "Yes, one attendant is allowed to travel with the patient on a medical attendant visa." },
                  { q: "How do I pay?", a: "Payments are made directly to the hospital. We do not handle medical fees." }
               ].map((item, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-6 hover:bg-slate-50 transition">
                     <h4 className="font-bold text-slate-900 mb-2">{item.q}</h4>
                     <p className="text-slate-600 text-sm">{item.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 8. CTA SECTION */}
      <div className="py-24 bg-gradient-to-r from-red-600 to-pink-600 text-white text-center">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Prioritize Your Health Today.</h2>
            <p className="text-xl text-red-100 mb-10">Get a free second opinion from a top Indian specialist.</p>
            <button onClick={() => setShowWizard(true)} className="bg-white text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-2xl">
               Start Free Assessment
            </button>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* BOOKING WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
                <button onClick={() => setShowWizard(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Medical Consultation Request</h2>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Patient Name</label>
                        <input type="text" className="w-full p-3 border border-slate-300 rounded-xl" placeholder="Full Name"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Condition / Symptoms</label>
                        <textarea className="w-full p-3 border border-slate-300 rounded-xl" rows={4} placeholder="Describe the medical issue..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Upload Medical Reports (Optional)</label>
                        <input type="file" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <button type="button" className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default MedicalPage;
