import React, { useState, useEffect } from 'react';
import { 
  Lock, Clock, Award, Video, Info, FileText, CheckCircle, 
  Users, Share2, Camera, AlertTriangle, Zap, X, ChevronRight,
  Calculator, Globe, Star, PenTool, MessageSquare, ChevronDown, ChevronUp,
  HelpCircle, RefreshCw, Facebook, Copy, Youtube, GraduationCap, Play,
  Mic, StopCircle, Save, Image as ImageIcon, Download, MonitorPlay,
  User, Loader, Unlock, MapPin, ExternalLink, Briefcase, Key, Circle, Wand2, Upload,
  CreditCard, ShieldCheck
} from 'lucide-react';
import { AppPhase } from '../types';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../src/contexts/AuthContext';
import { 
  updateWaitingRoomStatus, 
  recordExamAttempt, 
  initiatePayment 
} from '../src/services/dbService';

// --- TYPES ---
interface ActivityData {
  id: string;
  status: 'locked' | 'pending' | 'viewed' | 'completed';
  score?: number;
  data?: any; // Store user inputs like financial estimates
}

interface WaitingRoomState {
  activities: Record<string, ActivityData>;
  points: number;
  referrals: number;
  hasShared: boolean;
  viewedFaqIndices: number[]; 
  unlockTime: number; 
  isPriority: boolean;
  hasPaidExam: boolean;
  hasPaidFastTrack: boolean;
}

interface WaitingRoomProps {
  onPhaseComplete: (phase: AppPhase) => void;
}

// --- CONFIG & DATA ---
const REQUIRED_REFERRALS = 3;

// 1. QUIZ DATA (50 Questions)
const RAW_QUIZ_QUESTIONS = [
  { q: "India’s capital city", options: ["Mumbai", "New Delhi", "Kolkata", "Bangalore"], a: "New Delhi" },
  { q: "Official currency", options: ["Rupee", "Dollar", "Pound", "Euro"], a: "Rupee" },
  { q: "National language", options: ["Hindi", "English", "Bengali", "Tamil"], a: "Hindi" },
  { q: "Indian flag colors (bands)", options: ["2", "3", "4", "5"], a: "3" },
  { q: "Largest city", options: ["Chennai", "Delhi", "Mumbai", "Bangalore"], a: "Mumbai" },
  { q: "Taj Mahal location", options: ["Delhi", "Agra", "Jaipur", "Mumbai"], a: "Agra" },
  { q: "Independence year", options: ["1945", "1947", "1950", "1960"], a: "1947" },
  { q: "Longest river", options: ["Yamuna", "Godavari", "Ganges", "Krishna"], a: "Ganges" },
  { q: "National animal", options: ["Lion", "Tiger", "Elephant", "Peacock"], a: "Tiger" },
  { q: "Festival of lights", options: ["Holi", "Diwali", "Eid", "Navratri"], a: "Diwali" },
  { q: "Land of Rising Sun (Indian State)", options: ["Arunachal Pradesh", "Kerala", "Punjab", "Rajasthan"], a: "Arunachal Pradesh" },
  { q: "National flower", options: ["Rose", "Lotus", "Marigold", "Jasmine"], a: "Lotus" },
  { q: "Largest state by area", options: ["Rajasthan", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh"], a: "Rajasthan" },
  { q: "Currency symbol", options: ["₹", "$", "£", "€"], a: "₹" },
  { q: "International membership", options: ["EU", "UN", "NATO", "ASEAN"], a: "UN" },
  { q: "Silicon Valley of India", options: ["Bangalore", "Hyderabad", "Pune", "Chennai"], a: "Bangalore" },
  { q: "Current Prime Minister (2024)", options: ["Narendra Modi", "Rahul Gandhi", "Amit Shah", "Manmohan Singh"], a: "Narendra Modi" },
  { q: "National Bird", options: ["Peacock", "Parrot", "Eagle", "Swan"], a: "Peacock" },
  { q: "National Anthem", options: ["Vande Mataram", "Jana Gana Mana", "Sare Jahan Se Acha", "Maa Tujhe Salaam"], a: "Jana Gana Mana" },
  { q: "National Sport (De facto)", options: ["Cricket", "Hockey", "Football", "Kabaddi"], a: "Hockey" },
  { q: "Father of the Nation", options: ["Subhash Chandra Bose", "Mahatma Gandhi", "Bhagat Singh", "Sardar Patel"], a: "Mahatma Gandhi" },
  { q: "First Prime Minister", options: ["Jawaharlal Nehru", "Indira Gandhi", "Lal Bahadur Shastri", "Rajendra Prasad"], a: "Jawaharlal Nehru" },
  { q: "Space Agency", options: ["NASA", "ISRO", "ESA", "Roscosmos"], a: "ISRO" },
  { q: "Film Industry Hub", options: ["Tollywood", "Bollywood", "Kollywood", "Sandalwood"], a: "Bollywood" },
  { q: "Origin of Yoga", options: ["China", "India", "Nepal", "Thailand"], a: "India" },
  { q: "Invention of Zero", options: ["Aryabhata", "Brahmagupta", "Ramanujan", "Bhaskara"], a: "Aryabhata" },
  { q: "Origin of Chess", options: ["Persia", "India", "China", "Greece"], a: "India" },
  { q: "Spice Capital of India", options: ["Kerala", "Tamil Nadu", "Andhra Pradesh", "Karnataka"], a: "Kerala" },
  { q: "Pink City", options: ["Jodhpur", "Jaipur", "Udaipur", "Bikaner"], a: "Jaipur" },
  { q: "God's Own Country", options: ["Goa", "Kerala", "Himachal Pradesh", "Uttarakhand"], a: "Kerala" },
  { q: "Smallest State", options: ["Sikkim", "Goa", "Tripura", "Manipur"], a: "Goa" },
  { q: "Highest Mountain Peak", options: ["K2", "Kanchenjunga", "Nanda Devi", "Kamet"], a: "Kanchenjunga" },
  { q: "National Tree", options: ["Neem", "Banyan", "Peepal", "Mango"], a: "Banyan" },
  { q: "National Fruit", options: ["Banana", "Mango", "Apple", "Guava"], a: "Mango" },
  { q: "Constitution Length", options: ["Shortest", "Longest written", "Medium", "Unwritten"], a: "Longest written" },
  { q: "Republic Day", options: ["Aug 15", "Jan 26", "Oct 2", "Nov 14"], a: "Jan 26" },
  { q: "Population Rank", options: ["1st", "2nd", "3rd", "4th"], a: "1st" },
  { q: "Continent", options: ["Africa", "Europe", "Asia", "Australia"], a: "Asia" },
  { q: "Ocean to the South", options: ["Pacific", "Atlantic", "Indian", "Arctic"], a: "Indian" },
  { q: "Northern Neighbor", options: ["Sri Lanka", "China", "Maldives", "Thailand"], a: "China" },
  { q: "Western Neighbor", options: ["Bangladesh", "Myanmar", "Pakistan", "Nepal"], a: "Pakistan" },
  { q: "Major Religion", options: ["Hinduism", "Islam", "Christianity", "Sikhism"], a: "Hinduism" },
  { q: "Iron Man of India", options: ["Sardar Patel", "Nehru", "Gandhi", "Bose"], a: "Sardar Patel" },
  { q: "Missile Man of India", options: ["Homi Bhabha", "Vikram Sarabhai", "APJ Abdul Kalam", "CV Raman"], a: "APJ Abdul Kalam" },
  { q: "White Revolution related to", options: ["Milk", "Cotton", "Rice", "Eggs"], a: "Milk" },
  { q: "Green Revolution related to", options: ["Forests", "Agriculture", "Industry", "Energy"], a: "Agriculture" },
  { q: "IT Hub of India", options: ["Mumbai", "Delhi", "Hyderabad", "Kolkata"], a: "Hyderabad" },
  { q: "Financial Capital", options: ["Delhi", "Mumbai", "Chennai", "Bangalore"], a: "Mumbai" },
  { q: "Oldest Living City", options: ["Varanasi", "Patna", "Madurai", "Ujjain"], a: "Varanasi" },
  { q: "Tea Capital", options: ["Darjeeling", "Assam", "Ooty", "Munnar"], a: "Assam" }
];

// 3. FAQ DATA (30 Items)
const FAQ_ITEMS = [
  { q: "How do I start my application?", a: "Visit www.zambiansinindia.com → Click “Apply Now” → Fill the “Start Here” registration." },
  { q: "What is a ZII Number?", a: "A unique student ID generated during registration; required for tracking applications." },
  { q: "How long will the review take?", a: "48–72 hours from submission; universities manually review each application." },
  { q: "Can I apply for a scholarship?", a: "Yes, based on academic merit. Scholarships are automatically considered." },
  { q: "What documents are required?", a: "Grade 12 results, NRC/passport, personal essay, photo." },
  { q: "Can my parents track my app?", a: "Yes, once logged in, parent dashboard shows application progress." },
  { q: "How do I upload results?", a: "Upload all documents in one file or multiple files using the uploads section." },
  { q: "Is it safe to travel to India?", a: "Yes, ZII partners with accredited universities; predeparture guidance provided." },
  { q: "How do I accept an offer?", a: "Click the “Accept” button on the Offer Letter page." },
  { q: "How do I book my flight?", a: "Guidance and trusted travel links provided after visa approval." },
  { q: "Can I choose my university?", a: "You can select preferences, but final offers depend on university review." },
  { q: "What is 'Start Here'?", a: "The first stage of the student lifecycle to create your profile." },
  { q: "How are scholarships awarded?", a: "Based on merit and available funding." },
  { q: "Tuition payment options?", a: "Paid directly to the university; ZII does not collect tuition fees." },
  { q: "Who reviews my application?", a: "Partner universities manually review applications." },
  { q: "How do I change contact info?", a: "Update in profile settings; admin approval required." },
  { q: "Can I edit my essay?", a: "No; essays must be final upon submission." },
  { q: "Submission deadlines?", a: "Yes; each intake has a defined deadline on the website." },
  { q: "Track visa status?", a: "Yes, via your student dashboard once submitted." },
  { q: "Pre-departure guidance?", a: "Access guides in the Pre-departure section." },
  { q: "Failed the Quiz?", a: "Retry as many times as needed." },
  { q: "Share link multiple times?", a: "Yes, encourage 3 friends to complete applications." },
  { q: "How many friends to share?", a: "Minimum of 3 friends for full points." },
  { q: "Access Waiting Room?", a: "Automatically redirected after submission." },
  { q: "Data safety?", a: "Yes; fully encrypted and secured in ZII database." },
  { q: "Multiple courses?", a: "Yes, separate applications required." },
  { q: "Upload multiple results?", a: "Use the multi-file upload feature." },
  { q: "Parent unavailable?", a: "Alternative recommendation allowed." },
  { q: "Progress tracking?", a: "Progress bar shows completed tasks." },
  { q: "Total duration?", a: "Approx 3–6 months from application to departure." }
];

// --- ACTIVITY DEFINITIONS ---
const ALL_ACTIVITIES = [
  { id: 'status_tracker', title: "Application Status", desc: "Track live status", icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100', points: 10, mandatory: false },
  { id: 'about_india_quiz', title: "100% Scholarship Exam", desc: "Take the merit exam", icon: Award, color: 'text-blue-500', bg: 'bg-blue-100', points: 250, mandatory: true },
  { id: 'share_platform', title: "Help 3 Friends Apply", desc: "Share referral link", icon: Share2, color: 'text-green-500', bg: 'bg-green-100', points: 190, mandatory: true },
  { id: 'faq_section', title: "Most Asked Questions", desc: "Read student FAQs", icon: Info, color: 'text-purple-500', bg: 'bg-purple-100', points: 150, mandatory: true },
  { id: 'personal_essay', title: "Personal Essay", desc: "Tell your story", icon: PenTool, color: 'text-pink-500', bg: 'bg-pink-100', points: 15 },
  { id: 'video_intro', title: "Video Challenge", desc: "Introduce yourself", icon: Video, color: 'text-red-500', bg: 'bg-red-100', points: 15 },
  { id: 'profile_pic', title: "Photo Challenge", desc: "Upload clear photo", icon: Camera, color: 'text-indigo-500', bg: 'bg-indigo-100', points: 5 },
  { id: 'parent_info', title: "Parent / Sponsor Pack", desc: "Add guardian info", icon: Users, color: 'text-teal-500', bg: 'bg-teal-100', points: 5 },
  { id: 'financial_estimator', title: "Financial Estimator", desc: "Budget planner", icon: Calculator, color: 'text-yellow-500', bg: 'bg-yellow-100', points: 5 },
];

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onPhaseComplete }) => {
  const { currentUser } = useAuth();
  // --- STATE ---
  const [state, setState] = useState<WaitingRoomState>({
    activities: {},
    points: 0,
    referrals: 0,
    hasShared: false,
    viewedFaqIndices: [],
    unlockTime: Date.now() + (72 * 60 * 60 * 1000),
    isPriority: false,
    hasPaidExam: false,
    hasPaidFastTrack: false,
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentService, setPaymentService] = useState<{name: string, amount: number, id: string} | null>(null);
  
  // Transient Form States
  const [essayForm, setEssayForm] = useState({ about: '', scholarship: '', contribution: '' });
  const [timeLeft, setTimeLeft] = useState<{h:number, m:number, s:number}>({ h: 72, m: 0, s: 0 });
  
  // Quiz State
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [activeQuizQ, setActiveQuizQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);

  // FAQ State
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(null);

  // Financial State
  const [financeForm, setFinanceForm] = useState({ 
    passport: '320', 
    visa: '1350', 
    medical: '1000', 
    docCert: '250',
    yellowFever: '800',
    airTicket: '15000',
    regFee: '500',
    food: '150', 
    transport: '50',
    accom: '100', 
    books: '30',
    laundry: '20',
    internet: '20',
    allowance: '1000',
    tuition: '2500'
  });

  // New Challenge States
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [masterPasskey, setMasterPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.h === 0 && prev.m === 0 && prev.s === 0) {
            clearInterval(interval);
            onPhaseComplete(AppPhase.OFFER_LETTER);
            return prev;
        }
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onPhaseComplete]);

  // Initialize Quiz
  useEffect(() => {
    if (activeModal === 'about_india_quiz' && shuffledQuestions.length === 0) {
      setShuffledQuestions([...RAW_QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()));
      setActiveQuizQ(0);
      setQuizScore(0);
      setQuizFinished(false);
    }
  }, [activeModal]);

  const closeModal = () => {
    setActiveModal(null);
  };

  const completeActivity = async (id: string, points: number) => {
    setState(prev => {
      const isNew = !prev.activities[id]?.status || prev.activities[id].status !== 'completed';
      return {
        ...prev,
        points: isNew ? prev.points + points : prev.points,
        activities: {
          ...prev.activities,
          [id]: { id, status: 'completed', score: 100 }
        }
      };
    });
    
    if (currentUser) {
        await updateWaitingRoomStatus(currentUser.uid, `activities.${id}`, 'completed');
        // Ideally we should also update points in Firestore, but updateWaitingRoomStatus is generic.
        // For now, we assume the backend or a cloud function might recalculate points, 
        // or we extend updateWaitingRoomStatus to handle points.
        // Given the constraints, I'll just update the activity status.
    }
    closeModal();
  };

  const handlePaymentSuccess = async (tid: string) => {
    setPaymentModalOpen(false);
    
    if (currentUser && paymentService) {
        try {
            // Record Payment in Firestore
            await initiatePayment(currentUser.uid, paymentService.amount, paymentService.id);
            
            if (paymentService.id === 'priority_upgrade') {
                setState(prev => ({ ...prev, isPriority: true }));
                await updateWaitingRoomStatus(currentUser.uid, 'isPriority', 'true');
                // Unlock offer letter automatically
                onPhaseComplete(AppPhase.OFFER_LETTER);
            } else if (paymentService.id === 'scholarship_exam') {
                setState(prev => ({ ...prev, hasPaidExam: true }));
                await updateWaitingRoomStatus(currentUser.uid, 'hasPaidExam', 'true');
                // Open quiz modal
                setActiveModal('about_india_quiz');
                setModalTitle('100% Full Scholarship Exam');
            } else if (paymentService.id === 'fast_track') {
                setState(prev => ({ ...prev, hasPaidFastTrack: true }));
                await updateWaitingRoomStatus(currentUser.uid, 'hasPaidFastTrack', 'true');
            }
        } catch (e) {
            console.error("Error recording payment", e);
        }
    }

    alert(`Payment Successful! Transaction ID: ${tid}`);
  };

  const openPayment = (service: string, amount: number, id: string) => {
    setPaymentService({ name: service, amount, id });
    setPaymentModalOpen(true);
  };

  // --- RENDER HELPERS ---

  const renderQuiz = () => {
    if (!state.hasPaidExam) {
      return (
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">100% Full Scholarship Exam</h3>
          <p className="text-slate-600 mb-6">Take the ZII Scholarship Merit Exam to improve scholarship competitiveness. This is the test to guarantee a full 100% scholarship to go and study in India.</p>
          
          <div className="bg-slate-50 p-6 rounded-xl text-left space-y-3 mb-8 border border-slate-200">
            <h4 className="font-bold text-slate-800 border-b pb-2 mb-2">Exam Rules:</h4>
            <div className="flex items-center text-sm text-slate-600"><Clock className="w-4 h-4 mr-2 text-orange-500"/> 60-question timed exam</div>
            <div className="flex items-center text-sm text-slate-600"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Score certificate included</div>
            <div className="flex items-center text-sm text-slate-600"><AlertTriangle className="w-4 h-4 mr-2 text-red-500"/> Max 4 attempts allowed</div>
            <div className="flex items-center text-sm text-slate-600"><Zap className="w-4 h-4 mr-2 text-yellow-500"/> 60 seconds per question</div>
          </div>

          <button 
            onClick={() => { closeModal(); openPayment('100% Scholarship Exam', 250, 'scholarship_exam'); }}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg flex items-center justify-center"
          >
            Unlock Exam Now – K250
          </button>
          <p className="text-xs text-slate-400 mt-4">Unlocks Offer Letter automatically upon completion.</p>
        </div>
      );
    }

    if (quizFinished) {
      return (
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Exam Completed!</h3>
          <p className="text-slate-600 mb-6">You scored {quizScore} out of {shuffledQuestions.length}</p>
          <button 
            onClick={async () => {
              if (currentUser) {
                  await recordExamAttempt(currentUser.uid, 'scholarship_exam_2026', quizScore, {
                      correct: quizScore,
                      wrong: shuffledQuestions.length - quizScore,
                      timeTaken: 0, // Placeholder
                      startedAt: new Date() // Placeholder
                  });
                  await updateWaitingRoomStatus(currentUser.uid, 'examStatus', 'Completed');
              }
              completeActivity('about_india_quiz', 250);
              onPhaseComplete(AppPhase.OFFER_LETTER);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700"
          >
            Claim Certificate & Unlock Offer
          </button>
        </div>
      );
    }

    const q = shuffledQuestions[activeQuizQ];
    if (!q) return <div>Loading...</div>;

    return (
      <div className="p-4">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-4">
          <span>Question {activeQuizQ + 1} of {shuffledQuestions.length}</span>
          <span>Score: {quizScore}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-6">{q.q}</h3>
        <div className="space-y-3">
          {q.options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => {
                if (opt === q.a) setQuizScore(s => s + 1);
                if (activeQuizQ < shuffledQuestions.length - 1) {
                  setActiveQuizQ(q => q + 1);
                } else {
                  setQuizFinished(true);
                }
              }}
              className="w-full text-left p-4 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 font-medium transition"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFinancial = () => {
    const upfront = Number(financeForm.passport) + Number(financeForm.visa) + Number(financeForm.medical) + Number(financeForm.docCert) + Number(financeForm.yellowFever) + Number(financeForm.airTicket) + Number(financeForm.regFee);
    const monthlyLiving = Number(financeForm.food) + Number(financeForm.transport) + Number(financeForm.accom) + Number(financeForm.books) + Number(financeForm.laundry) + Number(financeForm.internet) + (Number(financeForm.allowance)/20); // Converting ZMW allowance to USD approx for total
    const totalYear1 = (Number(financeForm.tuition) * 20) + upfront + (monthlyLiving * 12 * 20); // Approx conversion for display

    return (
      <div className="p-4">
        <div className="bg-yellow-50 p-4 rounded-xl mb-6 text-sm text-yellow-800">
          <Info className="w-4 h-4 inline mr-2"/>
          Estimate your costs. Tuition is paid to university, not ZII.
        </div>
        
        <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Application Stage Costs (ZMW)</h4>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><label className="text-xs font-bold text-slate-500">Passport</label><input type="number" className="w-full p-2 border rounded" value={financeForm.passport} onChange={e => setFinanceForm({...financeForm, passport: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Visa</label><input type="number" className="w-full p-2 border rounded" value={financeForm.visa} onChange={e => setFinanceForm({...financeForm, visa: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Medical</label><input type="number" className="w-full p-2 border rounded" value={financeForm.medical} onChange={e => setFinanceForm({...financeForm, medical: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Doc Cert.</label><input type="number" className="w-full p-2 border rounded" value={financeForm.docCert} onChange={e => setFinanceForm({...financeForm, docCert: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Yellow Fever</label><input type="number" className="w-full p-2 border rounded" value={financeForm.yellowFever} onChange={e => setFinanceForm({...financeForm, yellowFever: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Air Ticket (Est)</label><input type="number" className="w-full p-2 border rounded" value={financeForm.airTicket} onChange={e => setFinanceForm({...financeForm, airTicket: e.target.value})} /></div>
        </div>

        <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Monthly India Stay (USD)</h4>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><label className="text-xs font-bold text-slate-500">Accomodation</label><input type="number" className="w-full p-2 border rounded" value={financeForm.accom} onChange={e => setFinanceForm({...financeForm, accom: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Food</label><input type="number" className="w-full p-2 border rounded" value={financeForm.food} onChange={e => setFinanceForm({...financeForm, food: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Transport</label><input type="number" className="w-full p-2 border rounded" value={financeForm.transport} onChange={e => setFinanceForm({...financeForm, transport: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Books/Misc</label><input type="number" className="w-full p-2 border rounded" value={financeForm.books} onChange={e => setFinanceForm({...financeForm, books: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Laundry</label><input type="number" className="w-full p-2 border rounded" value={financeForm.laundry} onChange={e => setFinanceForm({...financeForm, laundry: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-slate-500">Internet</label><input type="number" className="w-full p-2 border rounded" value={financeForm.internet} onChange={e => setFinanceForm({...financeForm, internet: e.target.value})} /></div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl text-center mb-6">
           <p className="text-xs uppercase text-slate-400">Total Upfront (ZMW)</p>
           <p className="text-xl font-bold mb-2">K{upfront.toLocaleString()}</p>
           <p className="text-xs uppercase text-slate-400">Est. Monthly Living (USD)</p>
           <p className="text-xl font-bold">${monthlyLiving.toFixed(2)}</p>
        </div>
        <button onClick={() => completeActivity('financial_estimator', 5)} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold">Save Estimate</button>
      </div>
    );
  };

  const renderStatus = () => (
    <div className="p-6 space-y-6">
      {[
        { label: "Registration Completed", status: "done" },
        { label: "Application Submitted", status: "done" },
        { label: "Waiting Room Active", status: "active" },
        { label: "Offer Letter Locked", status: "locked" },
        { label: "Pre-Departure", status: "pending" }
      ].map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
            step.status === 'done' ? 'bg-green-100 text-green-600' : 
            step.status === 'active' ? 'bg-orange-100 text-orange-600 animate-pulse' :
            step.status === 'locked' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'
          }`}>
            {step.status === 'done' ? <CheckCircle className="w-5 h-5"/> :
             step.status === 'active' ? <Clock className="w-5 h-5"/> :
             step.status === 'locked' ? <Lock className="w-4 h-4"/> : <Circle className="w-4 h-4"/>}
          </div>
          <div>
            <p className={`font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.label}</p>
            {step.status === 'active' && <p className="text-xs text-orange-500 font-bold">Current Stage</p>}
          </div>
        </div>
      ))}
      <button onClick={closeModal} className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold mt-4">Close Status</button>
    </div>
  );

  const renderVideo = () => (
    <div className="p-6 text-center">
      <div className="bg-red-50 p-6 rounded-2xl mb-6 border border-red-100">
        <Video className="w-12 h-12 text-red-500 mx-auto mb-4"/>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Introduce Yourself</h3>
        <p className="text-sm text-slate-600 mb-4">Record a 2-5 minute video on your phone explaining your academic goals, why you want to study in India, and how you will represent Zambia.</p>
        <ul className="text-xs text-left text-slate-500 space-y-2 mb-6 bg-white p-4 rounded-xl">
          <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Max size: 100MB</li>
          <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Formats: MP4, MOV, AVI</li>
          <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-500"/> Good lighting & clear audio</li>
        </ul>
        <div className="flex flex-col gap-3">
          <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center">
            <Camera className="w-5 h-5 mr-2"/> Record Camera
          </button>
          <button className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center">
            <Upload className="w-5 h-5 mr-2"/> Upload File
          </button>
        </div>
      </div>
      <button onClick={() => completeActivity('video_intro', 15)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Submit Video</button>
    </div>
  );

  const renderPhoto = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold">Creative Photo Challenge</h3>
        <p className="text-sm text-slate-500">Most creative submission wins a free air ticket!</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">AI Prompt Generator</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Zambian student graduating in India..."
              className="flex-1 p-3 border border-slate-200 rounded-lg text-sm"
            />
            <button 
              onClick={() => {
                setGeneratedImage("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070"); // Simulated AI generation
              }}
              className="bg-indigo-600 text-white p-3 rounded-lg"
            >
              <Wand2 className="w-5 h-5"/>
            </button>
          </div>
          {generatedImage && (
            <div className="mt-4 relative rounded-lg overflow-hidden group">
              <img src={generatedImage} alt="Generated" className="w-full h-48 object-cover"/>
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs p-2 text-center">
                www.zambiansinindia.com
              </div>
            </div>
          )}
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2"/>
          <p className="text-sm font-bold text-slate-600">Upload Your Photo</p>
          <p className="text-xs text-slate-400">JPG/PNG, Max 5MB</p>
        </div>
      </div>

      <button onClick={() => completeActivity('profile_pic', 5)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-6">Submit Entry</button>
    </div>
  );

  const renderEssay = () => (
    <div className="p-4 space-y-4">
       <textarea 
          className="w-full p-3 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-pink-500 outline-none" 
          placeholder="Tell us about yourself..."
          value={essayForm.about}
          onChange={e => setEssayForm({...essayForm, about: e.target.value})}
       ></textarea>
       <textarea 
          className="w-full p-3 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-pink-500 outline-none" 
          placeholder="Why do you deserve a scholarship?"
          value={essayForm.scholarship}
          onChange={e => setEssayForm({...essayForm, scholarship: e.target.value})}
       ></textarea>
       <button 
          onClick={() => completeActivity('personal_essay', 15)}
          disabled={!essayForm.about || !essayForm.scholarship}
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
       >
          Submit Essay
       </button>
    </div>
  );

  const renderContent = () => {
    switch(activeModal) {
      case 'status_tracker': return renderStatus();
      case 'about_india_quiz': return renderQuiz();
      case 'financial_estimator': return renderFinancial();
      case 'personal_essay': return renderEssay();
      case 'video_intro': return renderVideo();
      case 'profile_pic': return renderPhoto();
      case 'faq_section': return (
        <div className="p-4 h-[60vh] overflow-y-auto">
          {FAQ_ITEMS.map((faq, i) => (
             <div key={i} className="mb-2 border border-slate-100 rounded-xl overflow-hidden">
                <button onClick={() => setActiveFAQIndex(activeFAQIndex === i ? null : i)} className="w-full flex justify-between items-center p-3 text-left font-bold text-sm bg-slate-50 hover:bg-slate-100">
                   {faq.q}
                   {activeFAQIndex === i ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                </button>
                {activeFAQIndex === i && <div className="p-3 text-sm text-slate-600 bg-white">{faq.a}</div>}
             </div>
          ))}
          <button onClick={() => completeActivity('faq_section', 150)} className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl font-bold">I've Read The FAQs</button>
        </div>
      );
      case 'share_platform': return (
         <div className="p-8 text-center">
            <Share2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Invite 3 Friends</h3>
            <p className="text-slate-600 mb-6">Increase your scholarship chances by building your community.</p>
            <div className="flex justify-center gap-4 mb-8">
               <button className="bg-[#25D366] text-white p-3 rounded-full"><MessageSquare className="w-6 h-6"/></button>
               <button className="bg-[#1877F2] text-white p-3 rounded-full"><Facebook className="w-6 h-6"/></button>
               <button className="bg-slate-800 text-white p-3 rounded-full"><Copy className="w-6 h-6"/></button>
            </div>
            <button onClick={() => completeActivity('share_platform', 190)} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Verify Shares</button>
         </div>
      );
      default: return <div className="p-8 text-center text-slate-500">Activity content loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <div className="bg-slate-900 text-white p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                 <h1 className="text-3xl font-bold mb-2">Waiting Room</h1>
                 <p className="text-slate-400">Complete tasks while universities review your application.</p>
              </div>
              
              {/* PROGRESS BAR AT TOP */}
              <div className="w-full md:w-1/2">
                 <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{state.points} Points</span>
                 </div>
                 <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-1000" style={{ width: `${Math.min((state.points / 500) * 100, 100)}%` }}></div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center min-w-[100px]">
                    <p className="text-xs uppercase text-slate-400 font-bold mb-1">Your Score</p>
                    <p className="text-3xl font-extrabold text-amber-400">{state.points}</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center min-w-[120px]">
                    <p className="text-xs uppercase text-slate-400 font-bold mb-1">Estimated Wait</p>
                    <div className="flex justify-center items-center font-mono text-xl font-bold">
                       <span>{String(timeLeft.h).padStart(2,'0')}</span>:
                       <span>{String(timeLeft.m).padStart(2,'0')}</span>:
                       <span>{String(timeLeft.s).padStart(2,'0')}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* MONETIZATION CARDS */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Application Processing & Advisory Support */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-amber-400 relative overflow-hidden">
            {state.isPriority && (
              <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                ACTIVATED
              </div>
            )}
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Priority Application & Advisory</h3>
                <p className="text-xs text-slate-500 mt-1">Submit to ALL 100 Partner Universities + Professional Support</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-slate-600">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Full Application Review</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Scholarship Positioning Techniques</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Parent Advisory Pack</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Priority Support Queue</li>
            </ul>
            {state.isPriority ? (
              <button disabled className="w-full bg-green-100 text-green-700 py-3 rounded-xl font-bold flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2"/> Priority Status Active
              </button>
            ) : (
              <button 
                onClick={() => openPayment('Priority Application Upgrade', 150, 'priority_upgrade')}
                className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 shadow-lg transition transform hover:-translate-y-1"
              >
                Upgrade Now – K150
              </button>
            )}
          </div>

          {/* 3. Premium Fast Track */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              FAST TRACK
            </div>
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Premium Fast Track</h3>
                <p className="text-xs text-slate-400 mt-1">1-on-1 Dedicated Advisor & Visa Pre-Check</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-red-500"/> 1-on-1 Advisor Session</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-red-500"/> Essay Review & Optimization</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-red-500"/> Visa Pre-Check Service</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-red-500"/> Pre-Departure Consultation</li>
            </ul>
            {state.hasPaidFastTrack ? (
              <button disabled className="w-full bg-slate-800 text-slate-400 py-3 rounded-xl font-bold flex items-center justify-center border border-slate-700">
                <CheckCircle className="w-5 h-5 mr-2"/> Fast Track Active
              </button>
            ) : (
              <button 
                onClick={() => openPayment('Premium Fast Track', 750, 'fast_track')}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 shadow-lg transition transform hover:-translate-y-1"
              >
                Get Fast Track – K750
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVITIES GRID */}
      <div className="max-w-5xl mx-auto px-4 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_ACTIVITIES.map((activity) => {
               const isCompleted = state.activities[activity.id]?.status === 'completed';
               return (
                 <div 
                   key={activity.id}
                   onClick={() => !isCompleted && (() => { setActiveModal(activity.id); setModalTitle(activity.title); })()}
                   className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition cursor-pointer relative overflow-hidden group ${isCompleted ? 'border-emerald-500 opacity-80' : 'border-white hover:border-slate-200 hover:shadow-xl'}`}
                 >
                    {isCompleted && (
                       <div className="absolute inset-0 bg-emerald-50/80 flex items-center justify-center z-10 backdrop-blur-[1px]">
                          <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center text-emerald-600 font-bold text-sm">
                             <CheckCircle className="w-4 h-4 mr-2"/> Completed
                          </div>
                       </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${activity.bg} ${activity.color} shadow-sm`}>
                       <activity.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{activity.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{activity.desc}</p>
                    
                    <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-3">
                       <span className={`text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600`}>+{activity.points} Points</span>
                       <div className="flex items-center">
                          <span className={`text-xs font-bold uppercase mr-2 ${isCompleted ? 'text-green-500' : 'text-slate-300'}`}>
                             {isCompleted ? 'Complete' : 'Incomplete'}
                          </span>
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500"/> : <Circle className="w-4 h-4 text-slate-300"/>}
                       </div>
                    </div>
                 </div>
               );
            })}
         </div>

         {/* Offer Letter Unlock */}
         <div className="mt-12 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Offer Letter Locked</h3>
            <p className="text-slate-500 text-sm mb-6">Complete mandatory tasks or wait for the timer.</p>
            
            <div className="bg-slate-50 p-4 rounded-xl mb-6">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Master Unlock Field</label>
               <div className="flex gap-2">
                  <input 
                    type="password" 
                    placeholder="Enter Passkey"
                    value={masterPasskey}
                    onChange={(e) => { setMasterPasskey(e.target.value); setPasskeyError(false); }}
                    className={`flex-1 p-3 border rounded-lg text-center font-mono tracking-widest outline-none focus:ring-2 ${passkeyError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-emerald-500'}`}
                  />
                  <button 
                    onClick={() => {
                      if (masterPasskey === '1234567') {
                        onPhaseComplete(AppPhase.OFFER_LETTER);
                      } else {
                        setPasskeyError(true);
                      }
                    }}
                    className="bg-slate-900 text-white px-4 rounded-lg font-bold"
                  >
                    <Key className="w-4 h-4"/>
                  </button>
               </div>
               {passkeyError && <p className="text-xs text-red-500 font-bold mt-2">Invalid Passkey</p>}
            </div>

            <div className="flex items-center justify-center text-xs text-slate-400">
               <Clock className="w-3 h-3 mr-1"/> Auto-unlocks in {timeLeft.h}h {timeLeft.m}m
            </div>
         </div>
      </div>

      {/* MODAL */}
      {activeModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800">{modalTitle}</h3>
                  <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5"/></button>
               </div>
               <div className="overflow-y-auto flex-1">
                  {renderContent()}
               </div>
            </div>
         </div>
      )}

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

export default WaitingRoom;
