
import React, { useState, useEffect, useRef } from 'react';
import { 
  Building, CheckCircle, TrendingUp, Users, Shield, Globe, 
  BarChart, MapPin, Award, ChevronRight, FileText, Download, 
  Plane, Handshake, PenTool, Database, DollarSign, Activity, 
  UserCheck, Layers, BookOpen, Target, Phone, Mail, Upload
} from 'lucide-react';
import Footer from '../components/Footer';
import { PublicView, UserRole } from '../types';

interface ForUniversitiesProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const ForUniversities: React.FC<ForUniversitiesProps> = ({ onNavigate, onLogin }) => {
  // Calculator State
  const [calcTarget, setCalcTarget] = useState(50);
  const [calcBudget, setCalcBudget] = useState(5000);
  const [calcRate, setCalcRate] = useState(15);

  // Form State
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<{id: string, user: string, pass: string} | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // --- SEO OPTIMIZATION ---
  useEffect(() => {
    document.title = "Partner With Us | Indian University Recruitment | ZII";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Partner with Zambia's official student recruitment ecosystem. Direct access to qualified students, transparent processing, and high conversion rates.");
    }
  }, []);

  // Calculated Values
  const registrationsNeeded = Math.ceil(calcTarget / (calcRate / 100));
  const cpa = Math.round(calcBudget / registrationsNeeded);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate Backend Processing
    setTimeout(() => {
      const year = new Date().getFullYear();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const uniId = `UNI-${year}-${randomId}`;
      const password = Math.random().toString(36).slice(-8).toUpperCase();
      const email = emailRef.current?.value || "official@university.edu";

      const creds = {
        id: uniId,
        user: email,
        pass: password
      };

      setGeneratedCreds(creds);
      
      // Store in localStorage (Simulating DB)
      localStorage.setItem('uni_credentials', JSON.stringify(creds));
      
      setIsSubmitting(false);
      setFormSuccess(true);
    }, 2000);
  };

  const scrollToForm = () => {
    document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-amber-500/10 border border-amber-500/30 rounded-full px-6 py-2 text-amber-400 font-bold text-sm uppercase tracking-widest mb-8 animate-fade-in-up">
            <Building className="w-4 h-4 mr-2" /> For University Partners Only
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-8 leading-tight">
            Partner With The Fastest Growing <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Zambian Student Community</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            Recruit Zambia’s best students through a structured, premium digital recruitment system. We partner only with top 100 Indian universities committed to excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={scrollToForm} className="px-10 py-5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
              Partner With Us
            </button>
            <button className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-lg rounded-full backdrop-blur-md transition flex items-center justify-center">
              <Download className="w-5 h-5 mr-3" /> Partnership Prospectus
            </button>
          </div>
        </div>
      </div>

      {/* 2. WHO WE ARE */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h4 className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4">Premium Ecosystem</h4>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">We Are Not An Agency. <br/>We Are A Digital Ecosystem.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Zambians In India (ZII) is a structured digital student recruitment platform that eliminates the chaos of traditional agents. We guide students through a rigorous, transparent lifecycle:
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Application', 'Waiting Room', 'Offer Letter', 'Visa', 'Pre-Departure', 'Arrival'].map((step, i) => (
                <div key={i} className="flex items-center text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                  {step} {i < 5 && <ChevronRight className="w-4 h-4 ml-2 text-slate-400" />}
                </div>
              ))}
            </div>
            <p className="text-slate-600 font-medium">
              Manual review process. No AI automated admissions. <span className="text-slate-900 font-bold">High accountability. Quality over quantity.</span>
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
            <div className="absolute -top-6 -right-6 bg-amber-500 w-24 h-24 rounded-full opacity-20 blur-xl"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <Users className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold text-slate-900">6,500+</h3>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Community Members</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold text-slate-900">98%</h3>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Visa Success Rate</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <Building className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold text-slate-900">Top 100</h3>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Partner Focus</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <Globe className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold text-slate-900">100%</h3>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Digital Process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SELECTION PROCESS */}
      <div className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Rigorous Vetting Model</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We choose partners carefully because we protect our students carefully.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "NAAC Accreditation", desc: "A++ or A Grade preferred for partnership eligibility." },
              { title: "NIRF Ranking", desc: "Must be ranked within Top 100 in India." },
              { title: "Int'l Support Office", desc: "Dedicated staff for African student welfare." },
              { title: "Hostel Standards", desc: "Hygienic meals and secure accommodation mandatory." },
              { title: "Visa Support", desc: "Proven track record of timely paperwork." },
              { title: "Transparent Fees", desc: "No hidden charges. 100% clarity required." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition group">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl mb-6 group-hover:scale-110 transition">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-4 text-sm font-bold text-amber-400 uppercase tracking-widest">
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> Physical Inspections</span>
            <span className="w-2 h-2 rounded-full bg-slate-700 self-center"></span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> Background Verification</span>
            <span className="w-2 h-2 rounded-full bg-slate-700 self-center"></span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> Student Welfare Review</span>
          </div>
        </div>
      </div>

      {/* 4. DIGITAL SYSTEM */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-12">Our Digital Student Conversion System</h2>
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-600"></div>
            <div className="p-12 grid md:grid-cols-3 gap-12 text-left">
              <div>
                <Layers className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Structured Workflow</h3>
                <p className="text-slate-600 text-sm">Students move through locked stages. They cannot proceed to Visa without a verified Offer Letter.</p>
              </div>
              <div>
                <Activity className="w-10 h-10 text-amber-500 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Waiting Room Gamification</h3>
                <p className="text-slate-600 text-sm">While waiting for offers, students complete tasks (Passport, Budgeting) to increase readiness.</p>
              </div>
              <div>
                <Database className="w-10 h-10 text-emerald-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Dashboards</h3>
                <p className="text-slate-600 text-sm">Universities get a portal to view pre-screened leads, issue offers, and track arrivals.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-wrap justify-center gap-12">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-slate-900">45%</p>
                <p className="text-xs uppercase font-bold text-slate-500 mt-1">Conversion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-slate-900">7 Days</p>
                <p className="text-xs uppercase font-bold text-slate-500 mt-1">Avg. Processing</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-slate-900">92%</p>
                <p className="text-xs uppercase font-bold text-slate-500 mt-1">Offer Acceptance</p>
              </div>
            </div>
          </div>
          <p className="mt-8 text-slate-500 font-medium italic">"We don’t send inquiries. We send confirmed admissions."</p>
        </div>
      </div>

      {/* 5. LEAD CONVERSION SERVICE */}
      <div className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-serif font-bold mb-6">Send Us Your Leads. <br/><span className="text-amber-400">We Convert Them.</span></h2>
            <p className="text-blue-100 text-lg mb-6">
              Struggling to convert online inquiries from Zambia? Hand them over to our dedicated Lusaka-based conversion team.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "We call and counsel every lead.",
                "We qualify financial readiness.",
                "We collect documents.",
                "We guide them to YOUR portal.",
                "We ensure fee payment."
              ].map((item, i) => (
                <li key={i} className="flex items-center text-blue-50">
                  <CheckCircle className="w-5 h-5 text-amber-400 mr-3" /> {item}
                </li>
              ))}
            </ul>
            <button onClick={scrollToForm} className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-amber-50 transition">
              Start Lead Conversion Pilot
            </button>
          </div>
          <div className="md:w-1/2 bg-blue-800 p-8 rounded-3xl border border-blue-700 relative">
             <div className="absolute -top-4 -right-4 bg-amber-500 text-blue-900 font-bold px-4 py-1 rounded-full text-xs shadow-lg uppercase tracking-wide">
                Premium Service
             </div>
             <div className="space-y-6">
                <div className="flex items-center">
                   <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mr-4 font-bold text-xl">1</div>
                   <div>
                      <h4 className="font-bold text-white">Raw Data Input</h4>
                      <p className="text-xs text-blue-200">You provide Excel/CSV of leads.</p>
                   </div>
                </div>
                <div className="flex items-center">
                   <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mr-4 font-bold text-xl">2</div>
                   <div>
                      <h4 className="font-bold text-white">ZII Processing Center</h4>
                      <p className="text-xs text-blue-200">Our counselors engage families directly.</p>
                   </div>
                </div>
                <div className="flex items-center">
                   <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-xl">3</div>
                   <div>
                      <h4 className="font-bold text-white">Verified Admission</h4>
                      <p className="text-xs text-blue-200">You receive a complete, paid student.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 6. 10 DECISION FACTORS */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Why Top Universities Choose ZII</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: "Conversion Rate", icon: TrendingUp },
              { label: "Student Quality", icon: Award },
              { label: "Doc Authenticity", icon: Shield },
              { label: "Visa Success", icon: Plane },
              { label: "Market Reach", icon: Globe },
              { label: "Compliance", icon: FileText },
              { label: "Brand Safety", icon: CheckCircle },
              { label: "Retention", icon: UserCheck },
              { label: "Transparency", icon: UserCheck },
              { label: "Scalability", icon: BarChart },
            ].map((factor, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-xl text-center hover:bg-amber-50 hover:border-amber-200 border border-transparent transition group">
                <factor.icon className="w-8 h-8 mx-auto mb-4 text-slate-400 group-hover:text-amber-500 transition" />
                <h4 className="font-bold text-slate-700 text-sm group-hover:text-slate-900">{factor.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. EXHIBITION PLANNING CALCULATOR */}
      <div className="py-24 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-900 text-white p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4">Plan Your Fair</h3>
              <p className="text-slate-400 mb-8 text-sm">
                Thinking of hosting a recruitment drive in Zambia? Calculate your metrics instantly.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Intake (Students)</label>
                  <input 
                    type="number" 
                    value={calcTarget} 
                    onChange={(e) => setCalcTarget(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Marketing Budget ($)</label>
                  <input 
                    type="number" 
                    value={calcBudget} 
                    onChange={(e) => setCalcBudget(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Exp. Conversion Rate (%)</label>
                  <input 
                    type="range" min="5" max="50"
                    value={calcRate} 
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-right text-xs text-amber-400 font-bold mt-1">{calcRate}%</div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
               <h3 className="text-2xl font-bold text-slate-900 mb-8">Campaign Projections</h3>
               <div className="grid grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                     <p className="text-sm font-bold text-blue-800 uppercase mb-1">Registrations Needed</p>
                     <p className="text-4xl font-extrabold text-blue-900">{registrationsNeeded}</p>
                     <p className="text-xs text-blue-600 mt-2">Qualified leads to hit target</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                     <p className="text-sm font-bold text-emerald-800 uppercase mb-1">Cost Per Acquisition</p>
                     <p className="text-4xl font-extrabold text-emerald-900">${Math.round(calcBudget/calcTarget)}</p>
                     <p className="text-xs text-emerald-600 mt-2">Marketing spend per student</p>
                  </div>
               </div>
               <div className="mt-8 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start">
                  <Handshake className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-1"/>
                  <div>
                     <h4 className="font-bold text-amber-800 text-sm">ZII Recommendation</h4>
                     <p className="text-amber-700 text-xs mt-1">Based on these targets, we recommend a 3-city tour (Lusaka, Ndola, Kitwe) combined with a 4-week digital pre-campaign.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. MARKET INSIGHTS */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row items-end justify-between mb-12">
              <div>
                 <h2 className="text-3xl font-serif font-bold text-slate-900">Zambia Recruitment Advantage</h2>
                 <p className="text-slate-500 mt-2">Why you should focus on this emerging market.</p>
              </div>
              <button className="text-amber-600 font-bold hover:underline flex items-center mt-4 md:mt-0">
                 Download Full Market Report <Download className="w-4 h-4 ml-2"/>
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                 { label: "Growing Middle Class", val: "High", desc: "Rising disposable income for education." },
                 { label: "English Speaking", val: "100%", desc: "No foundation year needed." },
                 { label: "Visa Success", val: "Trending Up", desc: "India is a preferred destination." },
                 { label: "Govt Support", val: "Strong", desc: "Bilateral education agreements." }
              ].map((stat, i) => (
                 <div key={i} className="border-t-4 border-slate-900 pt-6">
                    <h3 className="text-xl font-bold text-slate-900">{stat.val}</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1 mb-2">{stat.label}</p>
                    <p className="text-xs text-slate-400">{stat.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* 9. QUALITY ASSURANCE */}
      <div className="py-24 bg-slate-900 text-white">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <Shield className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold mb-8">Student Quality Assurance</h2>
            <p className="text-lg text-slate-300 mb-12">"We filter unserious applicants before they reach you."</p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
               {[
                  "Academic Transcript Verification (ECZ)",
                  "Financial Capacity Screening",
                  "Commissioner of Oaths Verification",
                  "Parent Sponsor Validation",
                  "Waiting Room 'Seriousness' Filter",
                  "Pre-Departure Briefing Compliance"
               ].map((check, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl flex items-center border border-white/10">
                     <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                     <span className="font-medium">{check}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 13. APPLICATION FORM */}
      <div id="partner-form" className="py-24 bg-white relative">
         <div className="absolute top-0 left-0 w-full h-64 bg-slate-100 -z-0"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
               <div className="bg-slate-900 p-8 text-white text-center">
                  <h2 className="text-2xl font-bold">Become an Official Partner</h2>
                  <p className="text-slate-400 text-sm mt-2">Join the ZII network of elite institutions.</p>
               </div>
               
               {formSuccess && generatedCreds ? (
                  <div className="p-8 md:p-16 text-center">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-4">Profile Successfully Created</h3>
                     <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                        Your university dashboard has been automatically generated. Please save your credentials below to access your lead management portal.
                     </p>
                     
                     <div className="bg-slate-100 p-6 rounded-xl max-w-md mx-auto mb-8 text-left border border-slate-200">
                        <div className="mb-4 pb-4 border-b border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">University ID</p>
                            <p className="text-lg font-mono font-bold text-slate-900">{generatedCreds.id}</p>
                        </div>
                        <div className="mb-4 pb-4 border-b border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Username</p>
                            <p className="text-lg font-mono font-bold text-slate-900">{generatedCreds.user}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Temporary Password</p>
                            <p className="text-lg font-mono font-bold text-slate-900">{generatedCreds.pass}</p>
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => onLogin(UserRole.PARTNER_UNIVERSITY)} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition shadow-xl">
                            Login to Dashboard
                        </button>
                        <button onClick={() => {
                            const content = `University ID: ${generatedCreds.id}\nUsername: ${generatedCreds.user}\nPassword: ${generatedCreds.pass}`;
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'ZII_Credentials.txt';
                            a.click();
                        }} className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition shadow-sm flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2"/> Save Credentials
                        </button>
                     </div>
                  </div>
               ) : (
                  <form onSubmit={handleFormSubmit} className="p-8 md:p-12 space-y-8">
                     {/* Section 1: Basic Info */}
                     <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6">University Information</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div>
                              <label className="label">University Name</label>
                              <input required type="text" className="input-field" placeholder="e.g. Example University"/>
                           </div>
                           <div>
                              <label className="label">Website URL</label>
                              <input required type="url" className="input-field" placeholder="https://"/>
                           </div>
                           <div>
                              <label className="label">NAAC Grade</label>
                              <select className="input-field">
                                 <option>A++</option>
                                 <option>A+</option>
                                 <option>A</option>
                                 <option>B++</option>
                                 <option>Other</option>
                              </select>
                           </div>
                           <div>
                              <label className="label">NIRF Ranking (Approx)</label>
                              <input type="text" className="input-field" placeholder="e.g. Top 50"/>
                           </div>
                        </div>
                     </div>

                     {/* Section 2: Contact */}
                     <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6">Contact Person (Director/Dean)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div>
                              <label className="label">Full Name</label>
                              <input required type="text" className="input-field"/>
                           </div>
                           <div>
                              <label className="label">Official Email</label>
                              <input required type="email" className="input-field" ref={emailRef}/>
                           </div>
                           <div>
                              <label className="label">Direct Phone / WhatsApp</label>
                              <input required type="tel" className="input-field"/>
                           </div>
                           <div>
                              <label className="label">Office Address</label>
                              <input type="text" className="input-field"/>
                           </div>
                        </div>
                     </div>

                     {/* Section 3: Criteria Check */}
                     <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6">Partnership Criteria</h3>
                        <div className="space-y-4">
                           <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                              <input type="checkbox" required className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500" />
                              <span className="text-sm font-medium text-slate-700">We confirm we have a dedicated International Student Office.</span>
                           </label>
                           <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                              <input type="checkbox" required className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500" />
                              <span className="text-sm font-medium text-slate-700">We provide guaranteed accommodation and meals for international students.</span>
                           </label>
                           <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                              <input type="checkbox" className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500" />
                              <span className="text-sm font-medium text-slate-700">We are interested in hosting a recruitment fair in Zambia.</span>
                           </label>
                        </div>
                     </div>

                     <div className="pt-4">
                        <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center"
                        >
                           {isSubmitting ? 'Processing...' : 'Submit Partnership Application'}
                        </button>
                        <p className="text-xs text-center text-slate-400 mt-4">By submitting, you agree to our rigorous vetting process and ethical admissions code.</p>
                     </div>
                  </form>
               )}
            </div>
         </div>
      </div>

      {/* 14. CTA */}
      <div className="bg-amber-500 py-16 text-slate-900 text-center">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Partner With Zambia’s Most Structured Digital Platform</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={scrollToForm} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition shadow-xl">Apply Now</button>
               <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition shadow-xl">Book Strategy Call</button>
            </div>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default ForUniversities;
