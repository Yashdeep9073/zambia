
import React, { useState, useEffect } from 'react';
import { UserRole, PublicView, AppPhase } from '../types';
import { 
  CheckCircle, FileText, ArrowRight, ShieldCheck, Plane, Download, 
  AlertTriangle, DollarSign, HelpCircle, ChevronDown, ChevronUp, 
  Play, Upload, BookOpen, Users, Star, Lock, Calendar, Globe, 
  Smartphone, CreditCard, Award, Heart, Briefcase, MapPin, Phone, Monitor, Store,
  AlertOctagon, Info, ArrowDown
} from 'lucide-react';
import Footer from '../components/Footer';
import LifecycleTracker from '../components/LifecycleTracker';

interface ApplyPageProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: PublicView) => void;
}

const ApplyPage: React.FC<ApplyPageProps> = ({ onLogin, onNavigate }) => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // --- SEO OPTIMIZATION ---
  useEffect(() => {
    document.title = "Apply Online | 2025 Intake Application Form | Zambians In India";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Start your application for top Indian universities. Verified admissions for Zambian students. Apply now for scholarships and rapid visa processing.");
    }
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const startApplication = () => {
    // Phase 1: Registration Entry (Start Here)
    onLogin(UserRole.PROSPECTIVE_STUDENT);
  };

  const openChat = () => {
    window.dispatchEvent(new Event('open-chat-bot'));
  };

  // --- REUSABLE COMPONENTS ---
  const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">{subtitle}</p>}
      <div className="h-1 w-24 bg-orange-500 mx-auto mt-4 rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* SECTION 1: REDESIGNED HERO */}
      <div className="bg-emerald-900 text-white pt-24 pb-16 relative overflow-hidden">
        {/* Full-width background image matching description: African student, certificate, classroom */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548325946-b8c7320076a5?q=80&w=2070')] bg-cover bg-center opacity-30"></div>
        {/* Darker overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 to-emerald-900/60"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">Official Application Portal</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Apply to Study in India
          </h1>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl mb-10 max-w-2xl mx-auto">
             <div className="flex justify-center mb-4"><Info className="w-10 h-10 text-orange-400"/></div>
             <p className="text-lg md:text-xl text-white font-light leading-relaxed">
               "We advise you to read through this short application guide before applying."
             </p>
          </div>
          
          {/* Mobile Scroll Notice */}
          <div className="flex flex-col items-center animate-bounce opacity-80 mt-12">
             <span className="text-xs uppercase font-bold text-emerald-300 mb-1">Scroll down to apply</span>
             <ArrowDown className="w-5 h-5 text-emerald-300"/>
          </div>
        </div>
      </div>

      {/* NEW: PROSPECTIVE STUDENT LIFECYCLE ROADMAP */}
      <div className="bg-white py-12 border-b border-slate-200 sticky top-16 z-30 shadow-md">
         <div className="max-w-7xl mx-auto px-4">
            <LifecycleTracker currentPhase={AppPhase.MARKETING_LEAD} isProspective={true} />
         </div>
      </div>

      {/* SECTION 2: WHO SHOULD APPLY? */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Who Should Apply Online?" subtitle="Our platform is designed for every Zambian dreamer." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: "All Grade 12 High School Leavers", desc: "Fresh out of school? Start your degree immediately.", icon: <BookOpen className="w-8 h-8"/>, highlight: true },
              { title: "Diploma Holders", desc: "Upgrade to a Bachelor's degree in less time.", icon: <Award className="w-8 h-8"/> },
              { title: "Mature Students", desc: "It's never too late to get your Masters or PhD.", icon: <Briefcase className="w-8 h-8"/> },
              { title: "Parents / Guardians", desc: "Apply safely on behalf of your child.", icon: <Users className="w-8 h-8"/> },
            ].map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl text-center hover:shadow-xl transition border group ${item.highlight ? 'bg-orange-50 border-orange-500 shadow-lg transform scale-105 ring-4 ring-orange-200' : 'bg-slate-50 border-slate-100 hover:border-orange-200'}`}>
                <div className={`${item.highlight ? 'bg-orange-600 text-white' : 'bg-emerald-100 text-emerald-800'} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 group-hover:text-white transition`}>
                  {item.icon}
                </div>
                <h3 className={`font-bold text-lg mb-2 ${item.highlight ? 'text-orange-700 text-xl' : ''}`}>{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-600 border border-orange-700 rounded-2xl p-8 text-center max-w-4xl mx-auto shadow-2xl">
            <h3 className="font-bold text-2xl text-white mb-4 uppercase tracking-wider">We Understand Your Fears</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-5 py-3 bg-white rounded-full text-sm font-bold shadow-md text-slate-900 flex items-center transform hover:scale-105 transition w-full md:w-auto justify-center"><AlertTriangle className="w-5 h-5 mr-2 text-red-600"/> Fear of Mistakes? We verify everything.</span>
              <span className="px-5 py-3 bg-white rounded-full text-sm font-bold shadow-md text-slate-900 flex items-center transform hover:scale-105 transition w-full md:w-auto justify-center"><AlertTriangle className="w-5 h-5 mr-2 text-red-600"/> Fear of Scams? We are Govt Approved.</span>
              <span className="px-5 py-3 bg-white rounded-full text-sm font-bold shadow-md text-slate-900 flex items-center transform hover:scale-105 transition w-full md:w-auto justify-center"><AlertTriangle className="w-5 h-5 mr-2 text-red-600"/> Fear of Costs? We find Scholarships.</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: FULL JOURNEY */}
      <div className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionTitle title="Your Application Journey" />
          {/* UPDATED: Support Message visibility (White & Bold) */}
          <p className="text-white font-bold text-center text-xl md:text-2xl mb-12 drop-shadow-md">
             You are supported at every step - no guesswork, no shortcuts
          </p>
          
          <div className="space-y-8 relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-emerald-800 transform md:-translate-x-1/2 hidden md:block"></div>
            
            {[
              { step: 1, title: "Course & University Selection", desc: "Choose from 100+ Top Indian Universities." },
              { step: 2, title: "Document Submission", desc: "Upload clear scans of your Grade 12 results." },
              { step: 3, title: "Application Review", desc: "Our team verifies your eligibility within 24hrs." },
              { step: 4, title: "Offer Letter Issued", desc: "Receive your official acceptance & scholarship." },
              { step: 5, title: "Fee Payment", desc: "DIRECTLY TO YOUR UNIVERSITY ACCOUNT." },
              { step: 6, title: "Visa Processing", desc: "Directly at the Indian High Commission in Lusaka." },
              { step: 7, title: "Travel & Arrival", desc: "We welcome you at the airport in India." },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 p-4"></div>
                <div className="relative z-10 bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-slate-900 shadow-xl mb-4 md:mb-0">
                  {s.step}
                </div>
                <div className={`md:w-1/2 p-4 text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-xl font-bold text-orange-400 mb-2">{s.title}</h3>
                  <p className="text-emerald-100">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
             <button 
               onClick={startApplication}
               className="bg-orange-600 text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-orange-700 transition shadow-xl transform hover:scale-105"
             >
                Apply Now
             </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: COURSE SELECTION (UPDATED WITH VIDEO) */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <SectionTitle title="Course & University Selection" subtitle="Only the best for our students." />
          
          <div className="max-w-4xl mx-auto">
             <p className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider animate-pulse">Click to watch the full application guide</p>
             
             <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border-4 border-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-orange-600 text-white p-5 rounded-full shadow-2xl group-hover:scale-110 transition transform">
                        <Play className="w-10 h-10 fill-current" />
                    </div>
                    <p className="text-white font-bold mt-4 text-lg drop-shadow-md">Play Video Guide</p>
                </div>
                <a href="https://www.youtube.com/watch?v=3sd1vQv6CAI" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" aria-label="Watch Video"></a>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: DOCUMENTS */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <SectionTitle title="Document Requirements" subtitle="What you need RIGHT NOW to apply." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-emerald-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><FileText className="w-6 h-6 mr-3 text-emerald-600"/> 1. School Certificate</h3>
              <p className="text-slate-600 mb-4 text-sm">Full Grade 12 O’Level Certificate. The better your results, the higher your scholarship.</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500"/> Ensure complete certificate</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500"/> Scan clearly (PDF/JPG)</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500"/> Names must match ID</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-orange-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><CreditCard className="w-6 h-6 mr-3 text-orange-600"/> 2. ID Document</h3>
              <p className="text-slate-600 mb-4 text-sm font-bold">Passport is NOT compulsory at this stage.</p>
              <p className="text-slate-500 text-sm mb-4">NRC or Driving License is acceptable for admission.</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-orange-500"/> Scan both sides</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-orange-500"/> Text must be readable</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-orange-500"/> No shadows or blur</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-4 rounded-xl text-center text-blue-800 text-sm">
            📌 <strong>Important:</strong> Medicals, Police Clearance, and other docs are ONLY required at the VISA stage.
          </div>
        </div>
      </div>

      {/* SECTION 16: FINAL CTA */}
      <div className="py-24 bg-orange-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-lg font-bold text-orange-200 mb-2 uppercase tracking-wide">Now you are ready to begin your application</p>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Your Future Starts With One Application</h2>
          <div className="bg-white/10 p-6 rounded-2xl mb-8 max-w-2xl mx-auto border border-white/20">
             <p className="text-white font-medium">Please read this entire page carefully and proceed to the next section until completion to maximize your application success.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button onClick={startApplication} className="px-10 py-5 bg-white text-orange-700 rounded-full font-bold text-xl shadow-2xl hover:bg-slate-100 transition transform hover:scale-105">
              Start Here (Register)
            </button>
            <button onClick={startApplication} className="px-10 py-5 border-2 border-white text-white rounded-full font-bold text-xl hover:bg-white/10 transition">
              Download Full Guide
            </button>
            <button onClick={openChat} className="px-10 py-5 border-2 border-white text-white rounded-full font-bold text-xl hover:bg-white/10 transition">
              Talk to Advisor
            </button>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title="Frequently Asked Questions" />
          <div className="space-y-4">
            {[
              { q: "Who can apply?", a: "Any eligible student who has completed secondary education or is in their final year awaiting results may apply. We welcome local and international applicants who meet university admission requirements. Each application is reviewed individually by university professionals." },
              { q: "Is a passport required?", a: "To apply for any university we only need your Full grade 12 school certificate and NRC / Passport (optional). You will need a passport only after you have passed eligibility verification." },
              { q: "Can parents apply for me?", a: "Yes, we encourage parents to apply and make use of our parent login portal." },
              { q: "How long does the process take?", a: "We have simplified the process. With AI assistance, you will complete your entire application within 24hrs." },
              { q: "How are scholarships awarded?", a: "Different universities offer different schemes. The better your results, the higher your chances." },
              { q: "Are Indian degrees recognized?", a: "Yes, all listed universities are globally recognized and by the Zambia Qualifications Authority (ZAQA)." },
              { q: "Can I change courses later?", a: "Yes, but we encourage using our guidance office to find the perfect match first." },
              { q: "What if I cannot afford?", a: "Visit our Scholarships board for details on full 100% scholarships." },
              { q: "Are fees paid to ZII?", a: "NO. All fees are paid directly to the university account. We never ask for mobile money." },
              { q: "Is accommodation guaranteed?", a: "Only for early registrations. Late registrations may have to live off-campus." },
              { q: "Can I work while studying?", a: "There are work-study programs available for students to earn while they learn." },
              { q: "What internet is required?", a: "For low bandwidth, download our application guide and apply offline if needed." },
              { q: "What happens after offer letter?", a: "You begin the visa application. Please see the visa page on your portal." },
              { q: "Can I defer my intake?", a: "We encourage applying now as scholarship percentages may change." },
              { q: "Is India safe?", a: "Yes, absolutely. Students also have access to their own churches and communities." },
              { q: "Are online programs available?", a: "Yes, fully accredited online degrees are available." },
              { q: "What is the next step after applying?", a: "You receive a personal Zambian student advisor based in India to guide you." },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition"
                >
                  <span className="flex items-center"><HelpCircle className="w-5 h-5 mr-3 text-emerald-500"/> {faq.q}</span>
                  {activeFAQ === i ? <ChevronUp className="w-5 h-5 text-slate-400"/> : <ChevronDown className="w-5 h-5 text-slate-400"/>}
                </button>
                {activeFAQ === i && (
                  <div className="p-5 pt-0 text-slate-600 text-sm border-t border-slate-100 mt-2 bg-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <button onClick={startApplication} className="bg-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-800 transition transform hover:scale-105">
                Apply Now
             </button>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default ApplyPage;
