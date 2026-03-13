import React, { useState } from 'react';
import { 
  CheckCircle, FileText, Plane, DollarSign, Activity, Shield, 
  MapPin, Clock, AlertTriangle, Download, Upload, Video, 
  HelpCircle, ChevronDown, ChevronUp, Play, Printer, ExternalLink,
  Heart, Info, Bus, ArrowRight, User, ChevronRight, Star, Briefcase,
  Headphones, FileCheck, Syringe, Car
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import WhatsAppFunnel from '../components/WhatsAppFunnel';

const STAGES = [
  { id: 1, label: "Passport", icon: FileText },
  { id: 2, label: "Visa Docs", icon: Shield },
  { id: 3, label: "Financial", icon: DollarSign },
  { id: 4, label: "Medical", icon: Activity },
  { id: 5, label: "Submission", icon: MapPin },
  { id: 6, label: "Collection", icon: CheckCircle },
];

const PreDepartureGuide = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  
  // Generator States
  const [sponsorForm, setSponsorForm] = useState({ name: '', nrc: '', student: '', passport: '', relation: 'Parent' });
  const [generatedSponsorLetter, setGeneratedSponsorLetter] = useState(false);
  
  const [visaLetterForm, setVisaLetterForm] = useState({ name: '', passport: '', university: 'CT University', course: '' });
  const [generatedVisaLetter, setGeneratedVisaLetter] = useState(false);

  // Payment State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentService, setPaymentService] = useState<{name: string, amount: number, id: string} | null>(null);
  const [paidServices, setPaidServices] = useState<string[]>([]);

  const markComplete = (stageId: number) => {
    if (!completedStages.includes(stageId)) {
      setCompletedStages([...completedStages, stageId]);
      if (stageId < 6) setCurrentStage(stageId + 1);
    }
  };

  const progress = (completedStages.length / 6) * 100;

  const openPayment = (service: string, amount: number, id: string) => {
    setPaymentService({ name: service, amount, id });
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (tid: string) => {
    setPaymentModalOpen(false);
    if (paymentService) {
      setPaidServices(prev => [...prev, paymentService.id]);
      alert(`Payment Successful! Transaction ID: ${tid}. A consultant will contact you shortly.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 overflow-x-hidden">
      {/* HEADER */}
      <div className="bg-emerald-900 text-white pt-10 pb-20 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">You Are One Step Away From India 🇮🇳</h1>
            <p className="text-emerald-100 text-lg">Official Pre-Departure & Visa Guide</p>
         </div>
      </div>

      {/* MASTER PROGRESS BAR */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 mb-12">
         <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
            {/* Desktop Horizontal */}
            <div className="hidden md:flex justify-between items-center relative">
               <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-0"></div>
               <div className="absolute left-0 top-1/2 h-1 bg-green-500 -z-0 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
               {STAGES.map((stage) => (
                  <button 
                    key={stage.id}
                    onClick={() => setCurrentStage(stage.id)}
                    className={`relative z-10 flex flex-col items-center group ${currentStage === stage.id ? 'scale-110' : ''}`}
                  >
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        completedStages.includes(stage.id) 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : currentStage === stage.id 
                           ? 'bg-white border-orange-500 text-orange-500 shadow-lg' 
                           : 'bg-white border-slate-200 text-slate-300'
                     }`}>
                        <stage.icon className="w-5 h-5" />
                     </div>
                     <span className={`mt-2 text-xs font-bold uppercase ${currentStage === stage.id ? 'text-slate-800' : 'text-slate-400'}`}>{stage.label}</span>
                  </button>
               ))}
            </div>
            
            {/* Mobile Vertical Picker */}
            <div className="md:hidden">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Your Progress</span>
                  <span className="text-green-600 font-bold">{Math.round(progress)}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }}></div>
               </div>
               <select 
                  value={currentStage} 
                  onChange={(e) => setCurrentStage(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
               >
                  {STAGES.map(s => <option key={s.id} value={s.id}>Stage {s.id}: {s.label}</option>)}
               </select>
            </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
         
         {/* STAGE 1: PASSPORT */}
         {currentStage === 1 && (
            <div className="space-y-8 animate-fade-in-up">
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-l-8 border-blue-600">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center"><FileText className="w-6 h-6 mr-3 text-blue-600"/> Passport Application</h2>
                  <p className="text-slate-500 text-sm">If you already have a passport with 6+ months validity, you can skip this.</p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Fee & Requirements</h3>
                        <div className="text-3xl font-extrabold text-slate-900 mb-2">ZMW 520</div>
                        <p className="text-xs text-slate-500 mb-4">Paid at any Indo Zambia Bank branch.</p>
                        <ul className="space-y-2 text-sm text-slate-600">
                           <li className="flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div> 48-Page Passport Required</li>
                           <li className="flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div> Original NRC + Certified Copy</li>
                           <li className="flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div> Birth Certificate Copy</li>
                           <li className="flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div> 2 Passport Photos</li>
                        </ul>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-xs text-orange-800">
                           <p className="font-bold mb-1">Tip:</p>
                           Apply online first to save time at the office. Processing takes approx 3 weeks.
                        </div>
                        <a href="https://eservices.gov.zm/" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-slate-900 text-white text-center rounded-xl font-bold hover:bg-slate-800 transition">
                           Open e-Passport Portal
                        </a>
                        <div className="text-center">
                           <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Available At</p>
                           <p className="text-xs text-slate-600 font-medium">Lusaka • Ndola • Livingstone • Chipata • Kasama • Solwezi • Mongu • Mansa • Kabwe • Chinsali</p>
                        </div>
                     </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                     <button onClick={() => markComplete(1)} className="flex items-center text-green-600 font-bold hover:text-green-700">
                        I have my passport <ChevronRight className="w-5 h-5 ml-1"/>
                     </button>
                  </div>
               </div>
               <p className="text-center text-slate-400 text-sm italic">“Your passport is your first international identity. This is the beginning of your global journey.”</p>
            </div>
         )}

         {/* STAGE 2: VISA DOCS */}
         {currentStage === 2 && (
            <div className="space-y-8 animate-fade-in-up">
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-l-8 border-orange-500">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><Shield className="w-6 h-6 mr-3 text-orange-500"/> Visa Documentation</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Fee (Cash Only)</div>
                        <div className="text-2xl font-black text-slate-800">~ ZMW 1,350</div>
                        <div className="text-[10px] text-red-500 font-bold mt-1">NO MOBILE MONEY</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Processing</div>
                        <div className="text-2xl font-black text-slate-800">2-5 Days</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1">WORKING DAYS</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Venue</div>
                        <div className="text-lg font-black text-slate-800 leading-tight">Indian High Commission</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1">LUSAKA</div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {/* Step 1: Online Form */}
                     <div className="border border-slate-200 rounded-2xl p-6">
                        <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">STEP 1</span>
                        <h3 className="text-lg font-bold text-slate-800 mt-3 mb-2">Online Visa Application</h3>
                        <p className="text-sm text-slate-600 mb-4">You must complete the form online, print it, and sign it.</p>
                        <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 mb-4 space-y-1 font-mono">
                           <p><strong>Mission:</strong> ZAMBIA - LUSAKA</p>
                           <p><strong>Visa Type:</strong> STUDENT VISA</p>
                           <p><strong>Purpose:</strong> EDUCATION/STUDY</p>
                        </div>
                        <a href="https://indianvisaonline.gov.in/visa/Registration" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-orange-600 font-bold text-sm hover:underline">
                           Go to Official Visa Portal <ExternalLink className="w-4 h-4 ml-1"/>
                        </a>
                     </div>

                     {/* Step 2: Auto Generators */}
                     <div className="border border-slate-200 rounded-2xl p-6">
                        <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">STEP 2</span>
                        <h3 className="text-lg font-bold text-slate-800 mt-3 mb-4">Required Letters (Auto-Generate)</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* Sponsor Letter */}
                           <div className={`p-4 rounded-xl border-2 transition ${generatedSponsorLetter ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                              <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center">
                                 {generatedSponsorLetter && <CheckCircle className="w-4 h-4 text-green-600 mr-2"/>} Parent/Sponsor Letter
                              </h4>
                              {!generatedSponsorLetter ? (
                                 <div className="space-y-2">
                                    <input className="input-field text-xs p-2" placeholder="Parent Name" value={sponsorForm.name} onChange={e=>setSponsorForm({...sponsorForm, name:e.target.value})}/>
                                    <input className="input-field text-xs p-2" placeholder="Relationship" value={sponsorForm.relation} onChange={e=>setSponsorForm({...sponsorForm, relation:e.target.value})}/>
                                    <button onClick={()=>setGeneratedSponsorLetter(true)} className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold">Generate PDF</button>
                                 </div>
                              ) : (
                                 <button className="w-full bg-white border border-green-500 text-green-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center">
                                    <Download className="w-4 h-4 mr-2"/> Download Again
                                 </button>
                              )}
                           </div>

                           {/* Student Application Letter */}
                           <div className={`p-4 rounded-xl border-2 transition ${generatedVisaLetter ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                              <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center">
                                 {generatedVisaLetter && <CheckCircle className="w-4 h-4 text-green-600 mr-2"/>} Student Application Letter
                              </h4>
                              {!generatedVisaLetter ? (
                                 <div className="space-y-2">
                                    <input className="input-field text-xs p-2" placeholder="Student Name" value={visaLetterForm.name} onChange={e=>setVisaLetterForm({...visaLetterForm, name:e.target.value})}/>
                                    <input className="input-field text-xs p-2" placeholder="Course" value={visaLetterForm.course} onChange={e=>setVisaLetterForm({...visaLetterForm, course:e.target.value})}/>
                                    <button onClick={()=>setGeneratedVisaLetter(true)} className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold">Generate PDF</button>
                                 </div>
                              ) : (
                                 <button className="w-full bg-white border border-green-500 text-green-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center">
                                    <Download className="w-4 h-4 mr-2"/> Download Again
                                 </button>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Step 3: Checklist */}
                     <div className="border border-slate-200 rounded-2xl p-6">
                        <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">STEP 3</span>
                        <h3 className="text-lg font-bold text-slate-800 mt-3 mb-4">Compile Your Pack</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                           {['Original Passport', '2x Photos (51x51mm)', 'Offer Letter', 'Yellow Fever Card', 'Bank Statements ($2k)', 'Intro Letters (Above)', 'Online Form Printout', 'Receipts'].map(item => (
                              <li key={item} className="flex items-center"><div className="w-4 h-4 rounded-full border-2 border-slate-300 mr-3"></div> {item}</li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                     <button onClick={() => markComplete(2)} className="flex items-center text-orange-600 font-bold hover:text-orange-700">
                        My documents are ready <ChevronRight className="w-5 h-5 ml-1"/>
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* STAGE 3: FINANCIAL */}
         {currentStage === 3 && (
            <div className="space-y-8 animate-fade-in-up">
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-l-8 border-green-600">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><DollarSign className="w-6 h-6 mr-3 text-green-600"/> Financial Requirement</h2>
                  
                  <div className="bg-slate-900 text-white p-6 rounded-2xl text-center mb-8">
                     <p className="text-sm font-bold uppercase text-slate-400 tracking-widest mb-2">Minimum Closing Balance</p>
                     <p className="text-4xl font-extrabold text-green-400">$2,000 USD</p>
                     <p className="text-xs text-slate-400 mt-2">Or equivalent in ZMW. Must be reflected on the last 3 months bank statement.</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-start mb-6">
                     <CheckCircle className="w-6 h-6 text-green-600 mr-4 flex-shrink-0"/>
                     <div>
                        <h4 className="font-bold text-green-800">Agency Fee Waived!</h4>
                        <p className="text-sm text-green-700 mt-1">
                           Thanks to government support, the standard $100 visa processing fee has been removed for ZII students. Your visa preparation support is FREE.
                        </p>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                     <button onClick={() => markComplete(3)} className="flex items-center text-slate-700 font-bold hover:text-green-600">
                        Requirements Met <ChevronRight className="w-5 h-5 ml-1"/>
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* STAGE 4: MEDICAL */}
         {currentStage === 4 && (
            <div className="space-y-8 animate-fade-in-up">
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-l-8 border-yellow-500">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><Activity className="w-6 h-6 mr-3 text-yellow-500"/> Yellow Fever Vaccination</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                           <span className="font-bold text-slate-700">Cost</span>
                           <span className="font-bold text-slate-900 bg-white px-3 py-1 rounded shadow-sm">ZMW 250 - 350</span>
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 mb-3">Recommended Hospitals</h4>
                           <div className="space-y-2">
                              <div className="p-3 border border-slate-200 rounded-lg flex items-center hover:bg-slate-50">
                                 <MapPin className="w-4 h-4 text-red-500 mr-3"/>
                                 <span className="text-sm">University Teaching Hospital (UTH) - Lusaka</span>
                              </div>
                              <div className="p-3 border border-slate-200 rounded-lg flex items-center hover:bg-slate-50">
                                 <MapPin className="w-4 h-4 text-red-500 mr-3"/>
                                 <span className="text-sm">Levy Mwanawasa Hospital - Lusaka</span>
                              </div>
                           </div>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600">
                           <strong className="block text-slate-800 mb-1 flex items-center"><Bus className="w-3 h-3 mr-1"/> Transport Tip:</strong>
                           Use Yango or Ulendo for convenience. Search "UTH Lusaka". Local buses from town center available.
                        </div>
                     </div>
                     
                     <div className="bg-slate-900 rounded-2xl overflow-hidden relative group cursor-pointer h-48 md:h-auto border-4 border-white shadow-lg">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                           <Play className="w-12 h-12 mb-2 fill-current"/>
                           <span className="font-bold text-sm uppercase tracking-widest">Must Watch Guide</span>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                     <button onClick={() => markComplete(4)} className="flex items-center text-slate-700 font-bold hover:text-yellow-600">
                        Vaccination Done <ChevronRight className="w-5 h-5 ml-1"/>
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* STAGE 5: SUBMISSION */}
         {currentStage === 5 && (
            <div className="space-y-8 animate-fade-in-up">
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-l-8 border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><MapPin className="w-6 h-6 mr-3 text-slate-800"/> Submission Day</h2>
                  
                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-8">
                     <h3 className="font-bold text-orange-900 mb-2 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> Before You Leave Home</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                           <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-1"/>
                           <span className="text-xs font-bold text-slate-600">Cash Only</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                           <User className="w-6 h-6 mx-auto text-blue-600 mb-1"/>
                           <span className="text-xs font-bold text-slate-600">Smart Dress</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                           <Clock className="w-6 h-6 mx-auto text-orange-600 mb-1"/>
                           <span className="text-xs font-bold text-slate-600">08:00 - 11:00</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                           <FileText className="w-6 h-6 mx-auto text-purple-600 mb-1"/>
                           <span className="text-xs font-bold text-slate-600">Complete Pack</span>
                        </div>
                     </div>
                  </div>

                  <p className="text-center text-slate-500 italic mb-6">“You are walking into your future today. Be confident.”</p>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                     <button onClick={() => markComplete(5)} className="flex items-center text-slate-700 font-bold hover:text-slate-900">
                        I have submitted <ChevronRight className="w-5 h-5 ml-1"/>
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* STAGE 6: COLLECTION */}
         {currentStage === 6 && (
            <div className="space-y-8 animate-fade-in-up">
               {progress < 100 ? (
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-l-8 border-green-500">
                     <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><CheckCircle className="w-6 h-6 mr-3 text-green-500"/> Collection & Upload</h2>
                     <p className="text-slate-600 mb-6">Once you collect your passport with the visa sticker (usually 2-5 days later), upload a clear photo of the visa page here to unlock your Travel Guide.</p>
                     
                     <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition cursor-pointer group">
                        <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-green-500 transition"/>
                        <p className="font-bold text-slate-700">Upload Visa Page Scan</p>
                        <p className="text-xs text-slate-400 mt-2">JPG, PNG or PDF</p>
                     </div>

                     <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button onClick={() => markComplete(6)} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg">
                           Complete Process
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="bg-green-600 text-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                     <div className="relative z-10">
                        <div className="w-24 h-24 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                           <Plane className="w-12 h-12"/>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4">Visa Pack Complete! 🎉</h2>
                        <p className="text-lg text-green-100 mb-8 max-w-xl mx-auto">You are ready to fly. Your travel dashboard is now being prepared by the university.</p>
                        <button className="bg-white text-green-800 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-50 transition">
                           View Flight Deals
                        </button>
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* PREMIUM ASSISTANCE SERVICES */}
         <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-4 py-1 rounded-bl-xl z-10">
               OPTIONAL UPGRADES
            </div>
            <div className="relative z-10">
               <h3 className="text-2xl font-bold mb-2 flex items-center"><Star className="w-6 h-6 mr-3 text-amber-400"/> Premium Visa Assistance</h3>
               <p className="text-slate-400 mb-8 max-w-2xl">Need extra help? Get professional support to ensure your visa process is smooth and stress-free.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Service 1 */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                     <Briefcase className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition"/>
                     <h4 className="font-bold text-lg mb-1">Visa Interview Prep</h4>
                     <p className="text-xs text-slate-400 mb-4">Mock interview session with former students.</p>
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">K250</span>
                        {paidServices.includes('visa_prep') ? (
                           <span className="text-xs font-bold text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Paid</span>
                        ) : (
                           <button onClick={() => openPayment('Visa Interview Prep', 250, 'visa_prep')} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">Get Help</button>
                        )}
                     </div>
                  </div>

                  {/* Service 2 */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                     <FileCheck className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition"/>
                     <h4 className="font-bold text-lg mb-1">Document Review</h4>
                     <p className="text-xs text-slate-400 mb-4">Expert verification of your entire file.</p>
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">K150</span>
                        {paidServices.includes('doc_review') ? (
                           <span className="text-xs font-bold text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Paid</span>
                        ) : (
                           <button onClick={() => openPayment('Document Review', 150, 'doc_review')} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">Review Me</button>
                        )}
                     </div>
                  </div>

                  {/* Service 3 */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                     <Shield className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition"/>
                     <h4 className="font-bold text-lg mb-1">Full File Audit</h4>
                     <p className="text-xs text-slate-400 mb-4">Comprehensive audit by a graduate.</p>
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">K300</span>
                        {paidServices.includes('file_audit') ? (
                           <span className="text-xs font-bold text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Paid</span>
                        ) : (
                           <button onClick={() => openPayment('Full File Audit', 300, 'file_audit')} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">Audit Now</button>
                        )}
                     </div>
                  </div>

                  {/* Service 4 */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                     <Syringe className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition"/>
                     <h4 className="font-bold text-lg mb-1">Yellow Fever Assist</h4>
                     <p className="text-xs text-slate-400 mb-4">Fast-track guidance for vaccination.</p>
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">K100</span>
                        {paidServices.includes('yf_assist') ? (
                           <span className="text-xs font-bold text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Paid</span>
                        ) : (
                           <button onClick={() => openPayment('Yellow Fever Assist', 100, 'yf_assist')} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">Get Assist</button>
                        )}
                     </div>
                  </div>

                  {/* Service 5 */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group">
                     <Car className="w-8 h-8 text-red-400 mb-4 group-hover:scale-110 transition"/>
                     <h4 className="font-bold text-lg mb-1">Airport Coordination</h4>
                     <p className="text-xs text-slate-400 mb-4">Transport & check-in support.</p>
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-400">K300</span>
                        {paidServices.includes('airport_coord') ? (
                           <span className="text-xs font-bold text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Paid</span>
                        ) : (
                           <button onClick={() => openPayment('Airport Coordination', 300, 'airport_coord')} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">Book Now</button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* COMMON CHALLENGES */}
         <div className="mt-16 bg-white p-6 md:p-8 rounded-3xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-red-500"/> Common Challenges & Solutions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                  { p: "Bank balance too low", s: "Add a joint sponsor (e.g. Uncle/Aunt)" },
                  { p: "Incorrect photo size", s: "Must be 51x51mm (Square)" },
                  { p: "Missing university email", s: "Contact ZII Support immediately" },
                  { p: "NRC not certified", s: "Visit Commissioner of Oaths (Civic Centre)" },
                  { p: "Passport expiring", s: "Renew if <6 months validity" },
                  { p: "Wrong cash amount", s: "Carry extra change, cash only" }
               ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                     <span className="font-bold text-red-500">{item.p}</span>
                     <ArrowRight className="w-4 h-4 text-slate-300"/>
                     <span className="font-bold text-green-600">{item.s}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* FAQ */}
         <div className="mt-8 space-y-2">
            {[
               { q: "Where do I get Yellow Fever shot?", a: "UTH or Levy Hospital in Lusaka. District hospitals in other towns." },
               { q: "Can I use mobile money at the Embassy?", a: "No. Cash only. Withdraw before you go." },
               { q: "What if I am self-sponsoring?", a: "You need your own bank statement with $2000 equivalent." },
               { q: "How long does the visa take?", a: "Usually 2-5 working days." }
            ].map((faq, i) => (
               <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button onClick={() => setActiveFAQ(activeFAQ === i ? null : i)} className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-700 hover:bg-slate-50">
                     <span className="flex items-center"><HelpCircle className="w-4 h-4 mr-3 text-slate-400"/> {faq.q}</span>
                     {activeFAQ === i ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                  </button>
                  {activeFAQ === i && <div className="p-4 pt-0 text-slate-500 text-sm">{faq.a}</div>}
               </div>
            ))}
         </div>

         {/* EMOTIONAL SUPPORT */}
         <div className="mt-12 text-center py-8">
            <Heart className="w-10 h-10 text-pink-400 mx-auto mb-4 animate-pulse"/>
            <p className="text-slate-600 max-w-2xl mx-auto italic">
               "Students often feel overwhelmed at this stage. That is normal. Every challenge you overcome now builds resilience for your international journey."
            </p>
            <button className="mt-4 text-orange-600 font-bold text-sm hover:underline">Need Help? Contact ZII Office</button>
         </div>

         {/* WhatsApp Funnel Integration */}
         <div className="mt-16">
            <WhatsAppFunnel 
               title="Visa & Travel Support Groups"
               context="Join our specialized groups for visa documentation assistance and flight coordination."
            />
         </div>

      </div>

      {/* PAYMENT MODAL */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        serviceName={paymentService?.name || ''}
        amount={paymentService?.amount || 0}
        currency="ZMW"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PreDepartureGuide;
