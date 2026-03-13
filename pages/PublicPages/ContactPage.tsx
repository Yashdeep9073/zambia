import React, { useState } from 'react';
import { 
  LifeBuoy, Bot, ArrowRight, HelpCircle, ChevronUp, ChevronDown, 
  MapPin, Wifi, CheckCircle, Paperclip, Loader, Youtube, Play, 
  Mic, FileText, Zap, UserCheck, Building, AlertOctagon, X, PenTool, Clock, Award, Plane, Handshake
} from 'lucide-react';
import { PublicView } from '../../types';
import Footer from '../../components/Footer';

const STUCK_SCENARIOS = [
  { id: 1, q: "I cannot upload my Grade 12 results.", a: "Ensure file is PDF/JPG under 5MB. Try using Chrome browser on a laptop if mobile fails.", action: "Retry Upload" },
  { id: 2, q: "My internet disconnected mid-application.", a: "Don't panic. Our system auto-saves every 30 seconds. Log back in to resume.", action: "Login" },
  { id: 3, q: "I forgot my password.", a: "Use the 'Forgot Password' link on the login page to reset via email.", action: "Reset Pass" },
  { id: 4, q: "My waiting room task shows incomplete.", a: "Tasks take up to 2 minutes to sync. Refresh the page or re-upload the proof.", action: "Refresh" },
  { id: 5, q: "I submitted but did not receive confirmation.", a: "Check your spam folder. If empty, your dashboard status is the source of truth.", action: "Check Status" },
  { id: 6, q: "My documents were rejected.", a: "Read the rejection reason (usually blurriness). Re-scan and re-upload.", action: "Re-Upload" },
  { id: 7, q: "I selected the wrong course.", a: "You can edit your course preference in the Waiting Room before the Offer Letter is issued.", action: "Edit Profile" },
  { id: 8, q: "My payment is not reflecting.", a: "Bank transfers take 24-48 hours. Upload your POP receipt to speed it up.", action: "Upload POP" },
  { id: 9, q: "I do not understand the waiting room.", a: "It's a gamified holding area. Complete tasks to increase your scholarship chances.", action: "Watch Video" },
  { id: 10, q: "My offer letter is locked.", a: "You must complete all mandatory Waiting Room tasks to unlock it.", action: "Go to Room" },
  { id: 11, q: "I uploaded the wrong file.", a: "Go to 'My Documents' in the dashboard and click 'Replace' next to the file.", action: "Manage Docs" },
  { id: 12, q: "I cannot select a dropdown option.", a: "Refresh your browser. Ensure Javascript is enabled.", action: "Reload" },
  { id: 13, q: "The red boxes are not responding.", a: "Ensure you are clicking inside the box. Try a different browser.", action: "Try Chrome" },
  { id: 14, q: "My parent needs guidance.", a: "Book a Virtual Meeting for you and your parent with our counselors.", action: "Book Meeting" },
  { id: 15, q: "I need help from my province.", a: "Check our 'Mobile Support Agents' section for a partner near you.", action: "Find Agent" },
  { id: 16, q: "I do not have a scanner.", a: "Use a scanning app like CamScanner on your phone. Ensure good lighting.", action: "Scan Guide" },
  { id: 17, q: "I do not have stable internet.", a: "Visit a local internet cafe or ZII partner agent. Do not apply on unstable data.", action: "Find Cafe" },
  { id: 18, q: "My email is not verified.", a: "Click 'Resend Verification' on your dashboard. Check Spam.", action: "Resend" },
  { id: 19, q: "I need urgent manual review.", a: "Use the 'Escalate' button in your dashboard (Premium feature) or use Chat.", action: "Open Chat" },
  { id: 20, q: "I want to change my university.", a: "Contact Student Affairs immediately via the Chatbot.", action: "Chat Now" },
];

const SUPPORT_TABS: Record<string, any> = {
  BEFORE: { title: "Before Applying", icon: HelpCircle, items: [
    { q: "Do I qualify?", a: "Minimum 5 credits for Degree. Pass for Diploma." },
    { q: "How much does it cost?", a: "Application is free. Tuition varies by university." },
    { q: "Which intake is open?", a: "We are currently accepting for June 2026 intake." }
  ]},
  DURING: { title: "During Application", icon: PenTool, items: [
    { q: "Form stuck on Step 2?", a: "Ensure all required red fields are filled." },
    { q: "Can I save and exit?", a: "Yes, use the 'Save' icon at top right." },
    { q: "Photo upload failed?", a: "Ensure it is JPG/PNG and under 5MB." }
  ]},
  WAITING: { title: "Waiting Room", icon: Clock, items: [
    { q: "Why am I here?", a: "Universities are reviewing your file. Complete tasks meanwhile." },
    { q: "How to get points?", a: "Complete the Quiz, Video Challenge, and Essay." },
    { q: "How long is the wait?", a: "Typically 24-72 hours for Offer Letter generation." }
  ]},
  OFFER: { title: "Offer Letter", icon: Award, items: [
    { q: "How to accept?", a: "Click 'Accept' and sign digitally." },
    { q: "Is scholarship guaranteed?", a: "Yes, the offer letter states your final scholarship." },
    { q: "Can I defer?", a: "Yes, but scholarship % may change." }
  ]},
  VISA: { title: "Visa & Travel", icon: Plane, items: [
    { q: "Visa requirements?", a: "Check the Pre-Departure Guide in your dashboard." },
    { q: "Flight booking?", a: "We provide group booking links after visa approval." },
    { q: "Accommodation?", a: "Hostel is booked automatically upon fee payment." }
  ]},
  PARTNER: { title: "Partnerships", icon: Handshake, items: [
    { q: "How to partner?", a: "Visit the 'For Universities' page." },
    { q: "Agent commission?", a: "We work on official mandates, not ad-hoc commissions." }
  ]}
};

interface ContactPageProps {
  onNavigate: (view: PublicView) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [activeSupportTab, setActiveSupportTab] = useState('BEFORE');
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    subject: 'General Inquiry', 
    message: '', 
    department: 'Student Applications', 
    priority: 'Medium' 
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setContactForm(prev => ({ ...prev, name: '', email: '', subject: 'General Inquiry', message: '' }));
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  const openChatBot = () => {
    window.dispatchEvent(new Event('open-chat-bot'));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
        {/* 1. HERO SECTION */}
        <div className="bg-slate-900 text-white pt-24 pb-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900/60"></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1 text-blue-300 font-bold text-xs uppercase tracking-widest mb-6">
                   <LifeBuoy className="w-3 h-3 mr-2" /> Student Support Center
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                    Need Help? <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">You’re in the Right Place.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light">
                    From application to offer letter — every question answered here. 
                    Our autonomous system is designed to get you unstuck immediately.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={openChatBot} className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 mr-2"/> Ask Student Affairs AI
                    </button>
                    <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-lg flex items-center justify-center">
                        Start Official Application
                    </button>
                    <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-300 rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center">
                        Book Virtual Meeting
                    </button>
                </div>
            </div>
        </div>

        {/* 2. SUPPORT TABS */}
        <div className="max-w-6xl mx-auto px-4 py-12 -mt-10 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-slate-100 p-2 gap-2 bg-slate-50">
                    {Object.entries(SUPPORT_TABS).map(([key, tab]) => (
                        <button
                            key={key}
                            onClick={() => { setActiveSupportTab(key); setActiveFAQIndex(null); }}
                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeSupportTab === key ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <tab.icon className={`w-4 h-4 mr-2 ${activeSupportTab === key ? 'text-blue-500' : 'text-slate-400'}`}/>
                            {tab.title}
                        </button>
                    ))}
                </div>
                
                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                <HelpCircle className="w-5 h-5 mr-3 text-orange-500"/> Frequently Asked Questions
                            </h3>
                            <div className="space-y-3">
                                {SUPPORT_TABS[activeSupportTab].items.map((item: any, idx: number) => (
                                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                                        <button 
                                            onClick={() => setActiveFAQIndex(activeFAQIndex === idx ? null : idx)}
                                            className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-700 hover:bg-slate-50 transition"
                                        >
                                            {item.q}
                                            {activeFAQIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                                        </button>
                                        {activeFAQIndex === idx && (
                                            <div className="p-4 pt-0 text-sm text-slate-600 bg-slate-50 border-t border-slate-100">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 flex flex-col justify-center text-center">
                            <Bot className="w-16 h-16 text-blue-500 mx-auto mb-4"/>
                            <h4 className="text-lg font-bold text-blue-900 mb-2">Still have questions?</h4>
                            <p className="text-blue-700 text-sm mb-6">Our AI agent is trained on thousands of student scenarios just like yours.</p>
                            <button onClick={openChatBot} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
                                Ask AI Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. STUCK SCENARIOS GRID */}
        <div className="py-16 bg-slate-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">If You’re Stuck, Check Here First</h2>
                    <p className="text-slate-600">Common issues and their immediate solutions.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STUCK_SCENARIOS.map((scenario) => (
                        <div key={scenario.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group">
                            <div className="flex items-start mb-3">
                                <div className="bg-red-50 text-red-500 p-2 rounded-lg mr-3 font-bold text-xs shrink-0 mt-1">#{scenario.id}</div>
                                <h4 className="font-bold text-slate-800 text-sm leading-tight">{scenario.q}</h4>
                            </div>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed pl-11">{scenario.a}</p>
                            <div className="pl-11">
                                <button className="text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline flex items-center">
                                    {scenario.action} <ArrowRight className="w-3 h-3 ml-1"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 5. MOBILE SUPPORT AGENTS */}
        <div className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 md:w-1/2">
                        <span className="bg-orange-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Offline Support</span>
                        <h2 className="text-3xl font-bold mb-4">No Internet? No Problem.</h2>
                        <p className="text-slate-300 mb-6 text-lg">
                            Visit any of our registered partner agents across Zambia for assistance with uploading documents and completing your application.
                        </p>
                        <ul className="space-y-2 mb-8 text-sm text-slate-400">
                            <li className="flex items-center"><MapPin className="w-4 h-4 text-orange-500 mr-2"/> Internet Cafés</li>
                            <li className="flex items-center"><MapPin className="w-4 h-4 text-orange-500 mr-2"/> Mobile Money Booths</li>
                            <li className="flex items-center"><MapPin className="w-4 h-4 text-orange-500 mr-2"/> Government Youth Centers</li>
                        </ul>
                        <button onClick={() => window.open('https://www.zambiansinindia.com/partners', '_blank')} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition shadow-lg">
                            Find a Local Partner
                        </button>
                    </div>
                    <div className="relative z-10 md:w-1/2 flex justify-center">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-sm">
                            <div className="flex items-center mb-4">
                                <Wifi className="w-8 h-8 text-red-400 mr-4"/>
                                <div>
                                    <h4 className="font-bold text-white">Connection Lost?</h4>
                                    <p className="text-xs text-slate-300">Our system auto-saves your progress.</p>
                                </div>
                            </div>
                            <div className="h-1 bg-white/20 rounded-full w-full mb-2">
                                <div className="h-full bg-green-500 w-3/4 rounded-full"></div>
                            </div>
                            <p className="text-xs text-right text-green-400 font-mono">Last saved: 2 mins ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 6. SUPPORT TICKET FORM */}
        <div className="py-16 bg-slate-50" id="support-form">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Submit a Support Ticket</h2>
                    <p className="text-slate-500 mt-2">Direct line to specific departments. 24-hour response time.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    {formStatus === 'success' ? (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600"/>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ticket #8842 Created</h3>
                            <p className="text-slate-600 mb-8">
                                Your request has been routed to the {contactForm.department}. You will receive an email update shortly.
                            </p>
                            <button onClick={() => setFormStatus('idle')} className="text-blue-600 font-bold hover:underline">Submit another ticket</button>
                        </div>
                    ) : (
                        <div className="p-8">
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                                        <select 
                                            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={contactForm.department}
                                            onChange={(e) => setContactForm({...contactForm, department: e.target.value})}
                                        >
                                            <option>Student Applications Department</option>
                                            <option>University Onboarding Department</option>
                                            <option>Technical Support Department</option>
                                            <option>Student Affairs Office</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Priority Level</label>
                                        <select 
                                            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={contactForm.priority}
                                            onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                            <option>Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                        <input 
                                            type="text" required 
                                            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" required 
                                            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Issue Description</label>
                                    <textarea 
                                        rows={4} required 
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Describe your issue in detail..."
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Attachment (Optional)</label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition">
                                        <Paperclip className="w-5 h-5 mx-auto text-slate-400 mb-2"/>
                                        <span className="text-xs text-slate-500">Click to upload screenshot or document</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={formStatus === 'submitting'}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center"
                                >
                                    {formStatus === 'submitting' ? <Loader className="w-5 h-5 animate-spin mr-2"/> : 'Submit Ticket'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* 8. MULTIMEDIA SUPPORT */}
        <div className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Visual & Audio Guides</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition">
                        <div className="aspect-video bg-slate-900 rounded-xl mb-4 relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-50 group-hover:opacity-70 transition"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="w-12 h-12 text-white fill-current"/>
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center"><Youtube className="w-4 h-4 text-red-600 mr-2"/> Application Walkthrough</h4>
                        <p className="text-xs text-slate-500">Step-by-step video guide on how to complete the application form correctly.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition">
                        <div className="h-40 bg-orange-100 rounded-xl mb-4 flex items-center justify-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                                <Mic className="w-8 h-8"/>
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Audio Guide</h4>
                        <p className="text-xs text-slate-500">Listen to the application instructions (Low Data usage).</p>
                        <button className="mt-3 text-orange-600 text-xs font-bold uppercase tracking-wide hover:underline">Play Now</button>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition">
                        <div className="h-40 bg-blue-100 rounded-xl mb-4 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-blue-500"/>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Download PDF Manual</h4>
                        <p className="text-xs text-slate-500">Offline readable guide for when you have no internet.</p>
                        <button className="mt-3 text-blue-600 text-xs font-bold uppercase tracking-wide hover:underline">Download (2MB)</button>
                    </div>
                </div>
            </div>
        </div>

        {/* 10. ESCALATION POLICY */}
        <div className="py-12 bg-slate-900 text-white text-center">
            <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-xl font-bold mb-8">Expected Response Times</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                        <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3"/>
                        <h4 className="font-bold text-lg">Instant</h4>
                        <p className="text-sm text-slate-300">AI Agent Support</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                        <UserCheck className="w-8 h-8 text-blue-400 mx-auto mb-3"/>
                        <h4 className="font-bold text-lg">2 - 6 Hours</h4>
                        <p className="text-sm text-slate-300">Human Support Review</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                        <Building className="w-8 h-8 text-emerald-400 mx-auto mb-3"/>
                        <h4 className="font-bold text-lg">24 - 78 Hours</h4>
                        <p className="text-sm text-slate-300">University Manual Review</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 11. FINAL AUTONOMOUS CTA */}
        <div className="py-24 bg-white text-center">
            <div className="max-w-3xl mx-auto px-4">
                <AlertOctagon className="w-16 h-16 text-blue-600 mx-auto mb-6"/>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Every Question Has an Answer Here.</h2>
                <p className="text-xl text-slate-600 mb-10 font-light">
                    Before you wait, search above or ask the Student Affairs Office AI for immediate assistance.
                </p>
                <div className="flex justify-center gap-6">
                    <button onClick={openChatBot} className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-xl transform hover:scale-105">
                        Ask AI Now
                    </button>
                    <button onClick={() => document.getElementById('support-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-slate-100 text-slate-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition shadow-sm border border-slate-300">
                        Submit Support Ticket
                    </button>
                </div>
            </div>
        </div>

        <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default ContactPage;
