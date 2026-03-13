import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Clock, Award, Video, Info, FileText, CheckCircle, 
  Users, Share2, Camera, AlertTriangle, Zap, X, ChevronRight,
  Calculator, Globe, Star, PenTool, MessageSquare, ChevronDown, ChevronUp,
  HelpCircle, RefreshCw, Facebook, Copy, Youtube, GraduationCap, Play,
  Mic, StopCircle, Save, Image as ImageIcon, Download, MonitorPlay,
  User, Loader, Unlock, MapPin, ExternalLink, Briefcase, Key, Circle, Wand2, Upload,
  CreditCard, ShieldCheck, Mail, Trophy, Send, Smartphone, Instagram, Linkedin,
  ArrowRight, Sparkles, Gift, Check, Building, Plane, Activity, BookOpen, DollarSign,
  School, MessageCircle, Home, Heart
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { AppPhase, PublicView } from '../types';
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
  data?: any;
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
  isOffer1Opened: boolean;
  isOffer2Unlocked: boolean;
  isOffer3Unlocked: boolean;
  isOffer4Unlocked: boolean;
  isFinalOfferUnlocked: boolean;
  finalOfferPasskey: string;
  isActionRequiredExpanded: boolean;
  groupClicks: Record<number, number>;
}

interface WaitingRoomProps {
  onPhaseComplete: (phase: AppPhase) => void;
  onNavigate: (view: PublicView) => void;
}

// --- DATA ---
const WHATSAPP_GROUPS = [
  { name: "Group 1", url: "https://chat.whatsapp.com/EdxWjp14zgK51vx9O9fMRk?mode=gi_t" },
  { name: "Group 2", url: "https://chat.whatsapp.com/ECYz3m6HdP53DnuW5dOqqI?mode=gi_t" },
  { name: "Group 3", url: "https://chat.whatsapp.com/LHgVNYYUTQS7IWJvaTAWnj?mode=gi_t" },
  { name: "Group 4", url: "https://chat.whatsapp.com/EfgaeIqkA0zHY7UedljP3G?mode=gi_t" },
  { name: "Group 5", url: "https://chat.whatsapp.com/CMUCTIu4jqA2q97XSCQGFK?mode=gi_t" },
];

const APPLICATION_STAGES = [
  { id: 1, title: "Application Submitted", desc: "Your initial details have been received.", icon: FileText },
  { id: 2, title: "Document Verification", desc: "Our team is checking your uploaded results.", icon: ShieldCheck },
  { id: 3, title: "University Review", desc: "Partner universities are assessing your profile.", icon: Building },
  { id: 4, title: "Scholarship Evaluation", desc: "Determining the best scholarship percentage for you.", icon: Award },
  { id: 5, title: "Offer Released", desc: "Your official offer letter is generated.", icon: Mail },
  { id: 6, title: "Visa Processing", desc: "Guidance for your Indian student visa application.", icon: Globe },
  { id: 7, title: "Travel Preparation", desc: "Booking flights and packing for your journey.", icon: Plane },
];

const FAQ_ITEMS = [
  { q: "How do I start my application?", a: "Visit www.zambiansinindia.com → Click “Apply Now” → Fill the “Start Here” registration." },
  { q: "What is a ZII Number?", a: "A unique student ID generated during registration; required for tracking applications." },
  { q: "How long will the review take?", a: "48–72 hours from submission; universities manually review each application." },
  { q: "Can I apply for a scholarship?", a: "Yes, based on academic merit. Scholarships are automatically considered." },
  { q: "What documents are required?", a: "Grade 12 results, NRC/passport, personal essay, photo." },
  { q: "Can my parents track my app?", a: "Yes, once logged in, parent dashboard shows application progress." },
];

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            rotate: 0,
            scale: 0
          }}
          animate={{ 
            top: '110%', 
            rotate: 360,
            scale: [0, 1, 1, 0],
            left: `${Math.random() * 100}%`
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            ease: "linear",
            repeat: 0
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ 
            backgroundColor: ['#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)] 
          }}
        />
      ))}
    </div>
  );
};

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onPhaseComplete, onNavigate }) => {
  const { currentUser } = useAuth();
  const profile = currentUser || { name: 'Student', programInterest: '' };
  
  const [hasSeenSubmissionMessage, setHasSeenSubmissionMessage] = useState(false);
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
    isOffer1Opened: false,
    isOffer2Unlocked: false,
    isOffer3Unlocked: false,
    isOffer4Unlocked: false,
    isFinalOfferUnlocked: false,
    finalOfferPasskey: '',
    isActionRequiredExpanded: false,
    groupClicks: { 1: 950, 2: 820, 3: 450, 4: 0, 5: 0 },
  });

  const [timeLeft, setTimeLeft] = useState({ h: 72, m: 0, s: 0 });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentService, setPaymentService] = useState<{name: string, amount: number, id: string} | null>(null);
  const [isUniversityPopupOpen, setIsUniversityPopupOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState({ name: 'CT University', scholarship: '30%', website: 'https://ctuniversity.in' });
  const [isAcceptPromptOpen, setIsAcceptPromptOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showOffer2ShareModal, setShowOffer2ShareModal] = useState(false);

  // Scroll Progress for Graduation Cap
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const capTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);

  const handleGroupClick = (groupIndex: number, url: string) => {
    setState(prev => ({
      ...prev,
      groupClicks: {
        ...prev.groupClicks,
        [groupIndex]: (prev.groupClicks[groupIndex] || 0) + 1
      }
    }));
    window.open(url, '_blank');
  };

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.h === 0 && prev.m === 0 && prev.s === 0) return prev;
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tasksCompleted = Object.values(state.activities).filter((a: ActivityData) => a.status === 'completed').length;
  const totalTasks = 12;

  const handlePaymentSuccess = async (tid: string) => {
    setPaymentModalOpen(false);
    if (currentUser && paymentService) {
      await initiatePayment(currentUser.uid, paymentService.amount, paymentService.id);
      if (paymentService.id === 'fast_track') {
        setState(prev => ({ ...prev, hasPaidFastTrack: true }));
        completeTask('fast_track');
      }
    }
  };

  const completeTask = (id: string) => {
    setState(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [id]: { id, status: 'completed' }
      }
    }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleOffer2Share = (platform: string) => {
    const shareUrl = `https://www.zambiansinindia.com/apply?ref=${profile?.studentNumber || 'student123'}`;
    
    let intentUrl = '';
    if (platform === 'whatsapp') intentUrl = `https://api.whatsapp.com/send?text=Check out these scholarships! ${shareUrl}`;
    if (platform === 'facebook') intentUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    if (platform === 'linkedin') intentUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    if (platform === 'sms') intentUrl = `sms:?body=Check out these scholarships! ${shareUrl}`;
    
    // Open share link
    window.open(intentUrl, '_blank');

    // Trigger local success event & unlock flow
    setTimeout(() => {
      setShowOffer2ShareModal(false);
      setState(prev => ({ ...prev, isOffer2Unlocked: true }));
      completeTask('share_offer_2');
      
      // Display Aditya University popup
      setSelectedUni({ name: 'Aditya University', scholarship: '50%', website: 'https://aditya.ac.in' });
      setIsUniversityPopupOpen(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 1500);
  };

  const handleShare = (offerId: number) => {
    // Simulate sharing
    if (offerId === 2) setState(prev => ({ ...prev, isOffer2Unlocked: true }));
    if (offerId === 3) setState(prev => ({ ...prev, isOffer3Unlocked: true }));
    completeTask(`share_offer_${offerId}`);
  };

  const OfferCard = ({ 
    university, 
    scholarship, 
    requirement, 
    isUnlocked, 
    isOpened,
    onClick,
    onLockedClick,
    image,
    rating = 5,
    showRibbon = false,
    ribbonText = "Recommended",
    ribbonColor = "bg-orange-500 text-white",
    buttonText = "Click Me To See Offer",
    lockedButtonText = "Offer Locked",
    lockedButtonClass = "bg-slate-100 text-slate-400 cursor-not-allowed"
  }: { 
    university: string, 
    scholarship: string, 
    requirement: string,
    isUnlocked: boolean,
    isOpened: boolean,
    onClick: () => void,
    onLockedClick?: () => void,
    image: string,
    rating?: number,
    showRibbon?: boolean,
    ribbonText?: string,
    ribbonColor?: string,
    buttonText?: string,
    lockedButtonText?: string,
    lockedButtonClass?: string
  }) => (
    <div className="relative group h-full">
      <div className={`bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200 h-full flex flex-col transition-all duration-500 ${!isUnlocked && !onLockedClick ? 'grayscale opacity-75' : 'hover:shadow-2xl hover:-translate-y-2'}`}>
        {/* Ribbon */}
        {showRibbon && (
          <div className={`absolute top-6 -left-10 ${ribbonColor} px-12 py-1 font-black text-[10px] uppercase tracking-widest -rotate-45 z-20 shadow-lg`}>
            {ribbonText}
          </div>
        )}

        {/* University Photo */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={university} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Requirement Badge if Locked */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
              <div className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                <Lock className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase">{requirement}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1 text-center">
          <h3 className="text-xl font-black text-slate-900 mb-1 line-clamp-1">{university}</h3>
          <p className="text-emerald-600 font-bold mb-2">{scholarship} Scholarship</p>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>

          <div className="mt-auto">
            <button 
              onClick={isUnlocked ? onClick : (onLockedClick || undefined)}
              disabled={!isUnlocked && !onLockedClick}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition transform active:scale-95 flex items-center justify-center gap-2 ${isUnlocked ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg' : lockedButtonClass}`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-4 h-4" /> {buttonText}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> {lockedButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const openPayment = (service: string, amount: number, id: string) => {
    setPaymentService({ name: service, amount, id });
    setPaymentModalOpen(true);
  };

  return (
    <>
      {!hasSeenSubmissionMessage ? (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 md:p-12 text-center border-4 border-emerald-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Your application has been submitted to our Top 100 Universities list.
            </h2>
            <p className="text-lg text-slate-600 mb-10 font-bold whitespace-pre-line">
              5 universities have responded so far. View their offers in the Waiting Room.
            </p>
            <button 
              onClick={() => setHasSeenSubmissionMessage(true)} 
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg"
            >
              Enter Waiting Room
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden pb-20">
          {showConfetti && <Confetti />}

      {/* BLOCK 2 — APPLICATION STATUS (MOVED TO TOP) */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 overflow-hidden">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Activity className="w-5 h-5 text-red-600" /> Application Journey
          </h2>
          <div className="flex overflow-x-auto pb-4 gap-8 scrollbar-hide snap-x">
            {APPLICATION_STAGES.map((stage, i) => (
              <motion.div 
                key={stage.id} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModal(`stage_${stage.id}`)}
                className="flex-shrink-0 w-48 snap-center cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-500 ${i < 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <stage.icon className="w-8 h-8" />
                </div>
                <h3 className={`font-bold text-sm mb-1 ${i < 3 ? 'text-slate-900' : 'text-slate-400'}`}>{stage.title}</h3>
                <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{stage.desc}</p>
                {i === 2 && (
                  <div className="mt-2 bg-orange-100 text-orange-600 text-[8px] font-bold px-2 py-0.5 rounded-full inline-block animate-pulse">
                    CURRENT STAGE
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTION REQUIRED PANEL */}
      <section className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-center mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setState(prev => ({ ...prev, isActionRequiredExpanded: !prev.isActionRequiredExpanded }))}
            className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20 relative"
          >
            {state.isActionRequiredExpanded ? <ChevronUp className="w-6 h-6" /> : <Zap className="w-6 h-6 animate-pulse" />}
            {!state.isActionRequiredExpanded && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {state.isActionRequiredExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-orange-500 overflow-hidden"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-500" /> Action Required
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">Upload Passport Copy</p>
                    <p className="text-xs text-slate-500">Required for visa processing.</p>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Upload</button>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">Pay Registration Fee</p>
                    <p className="text-xs text-slate-500">Secure your application slot.</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Pay Now</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* HERO SECTION */}
      <section className="relative bg-slate-900 text-white pt-12 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-red-600 text-[10px] font-bold tracking-widest uppercase mb-4"
          >
            Mission: Study in India
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">WAITING ROOM</h1>
          <p className="text-slate-400 text-sm md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Universities are currently reviewing your application. 
            Complete the tasks below to unlock scholarship opportunities and increase your chances of studying in India.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Tasks Metric */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Tasks Completed</span>
                <span className="text-2xl font-black text-emerald-400">{tasksCompleted} / {totalTasks}</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(tasksCompleted / totalTasks) * 100}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                />
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Application Review Window</span>
              <div className="flex justify-center gap-4 font-mono text-3xl font-black text-orange-400">
                <div className="flex flex-col">
                  <span>{String(timeLeft.h).padStart(2, '0')}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Hrs</span>
                </div>
                <span>:</span>
                <div className="flex flex-col">
                  <span>{String(timeLeft.m).padStart(2, '0')}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Min</span>
                </div>
                <span>:</span>
                <div className="flex flex-col">
                  <span>{String(timeLeft.s).padStart(2, '0')}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Sec</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMPT 1 */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 animate-pulse">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-wider">Full list of all the scholarships you are eligible for below</span>
        </div>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Congratulations Header */}
        <div className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3"
          >
            Congratulations on your 1st Offer
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-slate-500 font-bold"
          >
            3 universities have responded so far!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* BLOCK 1 — OFFER 1 */}
          <div className="lg:col-span-1">
            <OfferCard 
              university="CT University" 
              scholarship="30%" 
              requirement="Application Submitted"
              isUnlocked={true}
              isOpened={state.isOffer1Opened}
              image="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
              rating={5}
              showRibbon={true}
              ribbonText="No1 Trusted Partner"
              buttonText="Click me to unlock"
              onClick={() => {
                if (!state.isOffer1Opened) {
                  setState(prev => ({ ...prev, isOffer1Opened: true }));
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 5000);
                }
                setSelectedUni({ name: 'CT University', scholarship: '30%', website: 'https://ctuniversity.in' });
                setIsUniversityPopupOpen(true);
              }} 
            />
          </div>

          {/* PROMPT 2 */}
          <div className="flex items-center justify-center p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 text-sm font-bold italic">
              “Universities are still reviewing your application. Don't only read one offer and give up”
            </p>
          </div>

          {/* BLOCK 3 — OFFER 2 */}
          <div id="offer-2">
            <OfferCard 
              university="Aditya University" 
              scholarship="50%" 
              requirement="Share to Unlock"
              isUnlocked={state.isOffer2Unlocked}
              isOpened={false}
              image="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
              rating={4}
              showRibbon={true}
              ribbonText="Parents Top Choice"
              ribbonColor="bg-amber-400 text-slate-900"
              buttonText="Click here to see offer"
              lockedButtonText="Click me to unlock"
              lockedButtonClass="bg-red-600 text-white shadow-[0_4px_0_rgb(185,28,28)] hover:bg-red-700 hover:shadow-[0_2px_0_rgb(185,28,28)] hover:translate-y-[2px] transition-all"
              onLockedClick={() => setShowOffer2ShareModal(true)}
              onClick={() => {
                setSelectedUni({ name: 'Aditya University', scholarship: '50%', website: 'https://aditya.ac.in' });
                setIsUniversityPopupOpen(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              }} 
            />
          </div>

          {/* BLOCK 4 — WHATSAPP COMMUNITY */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-[#25D366]/20">
              {/* Futuristic Network Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#075E54]/40 to-slate-900"></div>
                
                {/* Abstract Zambia Map / Network Nodes */}
                <svg className="absolute w-full h-full opacity-40" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#25D366" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#128C7E" stopOpacity="0.1" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Connection Lines */}
                  <g stroke="url(#lineGrad)" strokeWidth="2" fill="none" filter="url(#glow)">
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      d="M200,150 L350,100 L500,80 L600,150 L550,250 L450,200 L400,280 L350,320 L250,250 Z" 
                    />
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                      d="M350,100 L450,200 M600,150 L450,200 M250,250 L400,280 M550,250 L400,280" 
                    />
                  </g>

                  {/* Location Dots */}
                  {[
                    { cx: 200, cy: 150 }, { cx: 350, cy: 100 }, { cx: 500, cy: 80 },
                    { cx: 600, cy: 150 }, { cx: 550, cy: 250 }, { cx: 450, cy: 200 },
                    { cx: 400, cy: 280 }, { cx: 350, cy: 320 }, { cx: 250, cy: 250 }
                  ].map((dot, i) => (
                    <motion.circle 
                      key={i}
                      cx={dot.cx} cy={dot.cy} r="5" 
                      fill="#25D366"
                      filter="url(#glow)"
                      animate={{ 
                        r: [4, 8, 4],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </svg>
                
                {/* Overlay Image of African Students */}
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop" 
                  alt="African Students Connected" 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop'; e.currentTarget.onerror = null; }}
                />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10 text-center md:text-left">
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 bg-gradient-to-b from-[#4FCE5D] to-[#128C7E] rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4),inset_0_2px_0_rgba(255,255,255,0.4),inset_0_-4px_0_rgba(0,0,0,0.2)] border border-white/10"
                  >
                    <MessageCircle className="w-12 h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#25D366]">
                      Join the WhatsApp Waiting Room Community
                    </h2>
                    <p className="text-slate-300 font-medium text-lg">Thousands of Zambian students connected across the country.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {WHATSAPP_GROUPS.map((group, i) => {
                    const id = i + 1;
                    const isLocked = id > 3 && (state.groupClicks[1] < 1000 || state.groupClicks[2] < 1000 || state.groupClicks[3] < 1000);
                    const isAlmostFull = id === 1;
                    
                    return (
                      <motion.button 
                        key={i} 
                        disabled={isLocked}
                        onClick={() => handleGroupClick(id, group.url)}
                        whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
                        whileTap={!isLocked ? { scale: 0.98 } : {}}
                        className={`relative p-6 rounded-3xl flex items-center justify-between transition-all duration-300 group overflow-hidden ${isLocked ? 'bg-slate-800/50 cursor-not-allowed border border-slate-700' : 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.2)]'}`}
                      >
                        {/* Glass reflection */}
                        {!isLocked && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        )}

                        {isAlmostFull && !isLocked && (
                          <div className="absolute top-3 right-4 bg-amber-500 text-slate-900 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse"></span>
                            Almost Full
                          </div>
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                          <motion.div 
                            animate={!isLocked ? { y: [-2, 2, -2] } : {}}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center relative ${isLocked ? 'bg-slate-700 shadow-inner' : 'bg-gradient-to-b from-[#4FCE5D] to-[#128C7E] shadow-[0_10px_20px_rgba(37,211,102,0.4),inset_0_2px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.2)]'}`}
                          >
                            {isLocked ? <Lock className="w-7 h-7 text-slate-400" /> : <MessageCircle className="w-7 h-7 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />}
                          </motion.div>
                          <div className="text-left">
                            <span className={`block font-black text-xl ${isLocked ? 'text-slate-400' : 'text-white'}`}>{group.name}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isLocked ? 'text-slate-500' : 'text-[#25D366]'}`}>
                              {isLocked ? 'Locked' : `${state.groupClicks[id] || 0} Clicks`}
                            </span>
                          </div>
                        </div>
                        {!isLocked && <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition relative z-10" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 5 — 100% SCHOLARSHIP EXAM */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2.5rem] p-10 text-center text-white shadow-2xl border-4 border-amber-400 relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent animate-pulse"></div>
              <div className="relative z-10">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mb-6 inline-block"
                >
                  <div className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.5)]">
                    <Trophy className="w-12 h-12 text-slate-900" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-black mb-4 tracking-tight uppercase">100% Scholarship Exam</h2>
                <p className="text-lg text-amber-400 font-bold mb-6 italic">
                  “Writing the scholarship exam is the ONLY way to unlock the 100% full scholarship offer.”
                </p>
                <button 
                  onClick={() => onNavigate(PublicView.SCHOLARSHIP_EXAM)}
                  className="bg-amber-400 text-slate-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-amber-300 transition shadow-[0_8px_0_rgb(180,130,0)] active:translate-y-1 active:shadow-none"
                >
                  Take Scholarship Exam
                </button>
              </div>
            </div>
          </div>

          {/* BLOCK 6.5 — OFFER 3 (UNLOCKED BY PHOTO CHALLENGE) */}
          <div>
            <OfferCard 
              university="Lovely Professional University" 
              scholarship="50%" 
              requirement="Complete Photo Challenge"
              isUnlocked={state.isOffer3Unlocked}
              isOpened={false}
              image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
              rating={5}
              showRibbon={true}
              ribbonText="Students Top Choice"
              buttonText="Click here to see offer"
              onClick={() => {
                if (!state.isOffer3Unlocked) {
                  setActiveModal('challenge_3');
                  return;
                }
                setSelectedUni({ name: 'Lovely Professional University', scholarship: '50%', website: 'https://lpu.in' });
                setIsUniversityPopupOpen(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              }} 
            />
          </div>

          {/* BLOCK 7 — FAST TRACK APPLICATION */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl border border-slate-800 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 bg-red-600 px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">Fast Track</div>
              <h2 className="text-2xl font-black mb-4">Fast Track Application</h2>
              <p className="text-slate-400 text-sm mb-8">Get your application reviewed in under 12 hours for only K750.</p>
              
              <div className="mt-auto space-y-6">
                <div className="flex gap-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Airtel_logo.svg/1200px-Airtel_logo.svg.png" alt="Airtel" className="h-8 object-contain grayscale opacity-50" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/1200px-MTN_Logo.svg.png" alt="MTN" className="h-8 object-contain grayscale opacity-50" />
                </div>
                <button 
                  onClick={() => openPayment('Fast Track Review', 750, 'fast_track')}
                  className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg"
                >
                  Pay K750 Now
                </button>
              </div>
            </div>
          </div>

          {/* BLOCK 8 — OFFER 4 (UNLOCKED BY VIDEO CHALLENGE) */}
          <div>
            <OfferCard 
              university="LTSU" 
              scholarship="75%" 
              requirement="Complete Video Challenge"
              isUnlocked={state.isOffer4Unlocked}
              isOpened={false}
              image="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
              rating={4}
              showRibbon={true}
              ribbonText="Cheapest"
              buttonText="Click here to see offer"
              onClick={() => {
                if (!state.isOffer4Unlocked) {
                  setActiveModal('challenge_4');
                  return;
                }
                setSelectedUni({ name: 'LTSU', scholarship: '75%', website: 'https://ltsu.ac.in' });
                setIsUniversityPopupOpen(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              }} 
            />
          </div>

          {/* BLOCK 9 — 100% SCHOLARSHIP AD */}
          <div>
            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white text-center shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative z-10">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-400 animate-bounce" />
                <h2 className="text-2xl font-black mb-4 uppercase">Unlock Your Future</h2>
                <p className="text-white/80 mb-6 text-sm font-medium">Don't miss out on the 100% scholarship exam. It's your ticket to India!</p>
                <button onClick={() => {
                  const el = document.getElementById('scholarship-exam');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-slate-100 transition shadow-lg text-xs">Learn More</button>
              </div>
            </div>
          </div>

          {/* BLOCK 10 — FINAL LOCKED OFFER */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className={`bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl border-4 transition-all duration-500 ${state.isFinalOfferUnlocked ? 'border-emerald-500' : 'border-slate-700'}`}>
              {!state.isFinalOfferUnlocked ? (
                <div className="text-center py-8">
                  <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter">Final Offer – 100% Scholarship</h2>
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Lock className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 font-bold mb-8">Please enter the passkey from your exam portal.</p>
                  <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      placeholder="Enter Passkey" 
                      value={state.finalOfferPasskey}
                      onChange={(e) => setState(prev => ({ ...prev, finalOfferPasskey: e.target.value }))}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-center font-mono text-xl focus:outline-none focus:border-emerald-500"
                    />
                    <button 
                      onClick={() => {
                        if (state.finalOfferPasskey.toUpperCase() === 'ZII100') {
                          setState(prev => ({ ...prev, isFinalOfferUnlocked: true }));
                          setShowConfetti(true);
                        } else {
                          alert('Invalid Passkey. Please check your exam portal.');
                        }
                      }}
                      className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition shadow-lg"
                    >
                      Unlock
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <OfferCard 
                    university="IMI" 
                    scholarship="100%" 
                    requirement="Scholarship Exam Passed"
                    isUnlocked={true}
                    isOpened={false}
                    image="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop"
                    rating={5}
                    onClick={() => {
                      setSelectedUni({ name: 'IMI', scholarship: '100%', website: 'https://imi.edu' });
                      setIsUniversityPopupOpen(true);
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 3000);
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* ADDITIONAL TASKS SECTION */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "financial_calculator", title: "Financial Calculator", icon: Calculator, color: "text-blue-500", bg: "bg-blue-50" },
                { id: "parent_pack", title: "Parent Pack", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
                { id: "faqs", title: "Most Asked Questions", icon: HelpCircle, color: "text-orange-500", bg: "bg-orange-50" },
                { id: "india_quiz", title: "About India Quiz", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((task, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveModal(task.id)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-xl transition cursor-pointer group"
                >
                  <div className={`w-12 h-12 ${task.bg} ${task.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition`}>
                    <task.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 leading-tight">{task.title}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* ADDITIONAL INFORMATION SECTION */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-100">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Everything You Need to Know</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Detailed guidance for your journey from Zambia to India.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Globe className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Studying in India Overview</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">India is a global education hub with world-class universities and a rich cultural heritage. Thousands of Zambian students have successfully graduated.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Award className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Benefits of Indian Universities</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">High-quality education, globally recognized degrees, and affordable living costs compared to Western countries.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <ShieldCheck className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Safety & Student Support</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Our partner universities provide 24/7 security and dedicated international student offices for Zambians.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Plane className="w-7 h-7 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Visa & Travel Guidance</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">We provide full support for your student visa application and help you book the most affordable flights.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <AnimatePresence>
        {activeModal?.startsWith('challenge_') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition">
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Offer Locked</h2>
                <p className="text-slate-500 font-bold">
                  {activeModal === 'challenge_3' 
                    ? "Complete the Photo Challenge to unlock this offer."
                    : "Complete the Video Challenge to unlock this offer."}
                </p>
              </div>

              {activeModal === 'challenge_3' ? (
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                  <div className="flex flex-col gap-6 items-center">
                    <div className="w-full">
                      <div className="aspect-square bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-slate-50 transition">
                        <Camera className="w-12 h-12 text-slate-400 mb-2 group-hover:scale-110 transition" />
                        <p className="text-sm font-bold text-slate-600">Upload Photo</p>
                        <p className="text-[10px] text-slate-400">Add ZII Frame</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-black text-slate-900 mb-2">Future Global Student Challenge</h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Upload a photo of yourself, add the Zambians In India frame, and share it to unlock a 60% scholarship opportunity from GD Goenka University.
                      </p>
                      <button onClick={() => {
                        handleShare(3);
                        setActiveModal(null);
                      }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" /> Share & Unlock Offer 3
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                  <div className="text-center">
                    <h3 className="text-xl font-black text-slate-900 mb-2">Video Challenge</h3>
                    <p className="text-slate-500 text-sm mb-8">Record a short video introducing yourself. Reward: 75% Scholarship from LTSU.</p>
                    
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 group cursor-pointer hover:bg-slate-100 transition mb-6">
                      <Video className="w-16 h-16 text-slate-300 mx-auto mb-4 group-hover:text-red-500 transition" />
                      <p className="font-bold text-slate-600">Click to record or upload video</p>
                    </div>
                    <button 
                      onClick={() => {
                        setState(prev => ({ ...prev, isOffer4Unlocked: true }));
                        completeTask('video_challenge');
                        setActiveModal(null);
                      }} 
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg"
                    >
                      Submit Video Challenge
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINANCIAL ESTIMATOR POPUP */}
      <AnimatePresence>
        {activeModal === 'financial_calculator' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 md:p-12 shadow-2xl relative"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Calculator className="w-8 h-8 text-blue-600" /> Financial Estimator
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  { label: "Indian Student Visa Application", cost: "K1,350" },
                  { label: "Passport (If applicable)", cost: "K320" },
                  { label: "Medical Certificates", cost: "K350" },
                  { label: "Yellow Fever Vaccination", cost: "K800" },
                  { label: "Documents Verification", cost: "K350" },
                  { label: "Airticket (Group Flight — Kenya Airways)", cost: "92 seats left", highlight: true },
                  { label: "Students Farewell Dinner", cost: "K500" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">{item.label}</span>
                    <span className={`font-bold ${item.highlight ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>{item.cost}</span>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Total Estimated Journey Cost</p>
                <p className="text-4xl font-black text-emerald-700">K4,170</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE DETAIL POPUP */}
      <AnimatePresence>
        {activeModal?.startsWith('stage_') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] max-w-md w-full p-8 text-center shadow-2xl relative"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition">
                <X className="w-6 h-6" />
              </button>
              {(() => {
                const stageId = parseInt(activeModal.split('_')[1]);
                const stage = APPLICATION_STAGES.find(s => s.id === stageId);
                if (!stage) return null;
                return (
                  <>
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <stage.icon className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">{stage.title}</h2>
                    <p className="text-slate-500 leading-relaxed mb-8">{stage.desc}</p>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Close Details</button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUniversityPopupOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] max-w-4xl w-full shadow-2xl relative overflow-hidden my-8"
            >
              <div className="absolute top-0 left-0 w-full h-4 bg-emerald-600"></div>
              <button 
                onClick={() => setIsUniversityPopupOpen(false)} 
                className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition z-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 md:p-12">
                {/* Scholarship Badge */}
                <div className="flex justify-center mb-8">
                  <div className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-2xl shadow-xl animate-bounce">
                    {selectedUni.scholarship} Scholarship
                  </div>
                </div>

                {/* 1. University Description */}
                <div className="mb-12">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">{selectedUni.name}</h2>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {selectedUni.name} is a premier institution in India, recognized globally for its academic excellence, innovative research, and vibrant campus life. With state-of-the-art facilities and a diverse community of students from over 50 countries, it provides an ideal environment for Zambian students to excel and build global careers.
                  </p>
                </div>

                {/* 2. Video Section */}
                <div className="mb-12">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <MonitorPlay className="w-6 h-6 text-red-600" /> University Tour
                  </h3>
                  <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative group cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop`} alt="Video Placeholder" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Campus Life Photo Gallery */}
                <div className="mb-12">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-blue-600" /> Campus Life Gallery
                  </h3>
                  <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
                    {[
                      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1562774053-701939374585&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1498243639159-414ccead3c30&auto=format&fit=crop"
                    ].map((url, i) => (
                      <div key={i} className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden snap-center shadow-lg">
                        <img src={`${url}?q=80&w=800&auto=format&fit=crop`} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Audio Voice Note */}
                <div className="mb-12 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Mic className="w-6 h-6 text-emerald-600" /> Offer Explanation
                  </h3>
                  <div className="flex items-center gap-4">
                    <button className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition">
                      <Play className="w-6 h-6 fill-current" />
                    </button>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-emerald-500"></div>
                    </div>
                    <button className="bg-slate-200 text-slate-700 p-3 rounded-xl hover:bg-slate-300 transition">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 5. Minimum Amount Needed */}
                <div className="mb-12 bg-orange-50 p-8 rounded-[2.5rem] border-4 border-orange-200">
                  <h3 className="text-2xl font-black text-orange-900 mb-6">Minimum Amount Needed To Travel</h3>
                  <div className="text-center">
                    <p className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-2">Total Estimated Journey Cost</p>
                    <p className="text-6xl font-black text-orange-600 mb-4">K4,170</p>
                    <p className="text-slate-600 text-sm italic">“This is the only amount needed to start your journey. No hidden fees.”</p>
                  </div>
                </div>

                {/* 6. 5 Key Advantages */}
                <div className="mb-12">
                  <h3 className="text-xl font-black text-slate-900 mb-6">5 Key Advantages of Accepting</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Globally Recognized Degree',
                      '100% Placement Assistance',
                      'Modern International Hostels',
                      'Vibrant Cultural Diversity',
                      'Affordable Living Costs'
                    ].map((adv, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{i+1}</div>
                        <span className="font-bold text-slate-800">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. High-Impact Call to Action */}
                <div className="mb-12 bg-slate-900 text-white p-8 rounded-[2.5rem] text-center">
                  <h3 className="text-2xl font-black mb-4">Secure Your Future Today</h3>
                  <div className="space-y-2 mb-8 text-slate-400 font-medium">
                    <p>• Tuition fees can be paid in instalments</p>
                    <p>• Payments begin after arrival on campus</p>
                    <p className="text-emerald-400 font-bold">Confirm your seat early to guarantee your scholarship!</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsUniversityPopupOpen(false);
                      setIsAcceptPromptOpen(true);
                    }}
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition shadow-2xl"
                  >
                    I Accept the Offer
                  </button>
                </div>

                {/* 8. Explore More Button */}
                <div className="mb-12 text-center">
                  <a 
                    href={selectedUni.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition underline underline-offset-4"
                  >
                    Explore More on Official Website <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* ACTION BUTTONS (BOTTOM OF POP-UP) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-12 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setIsUniversityPopupOpen(false);
                      setIsAcceptPromptOpen(true);
                    }}
                    className="bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition"
                  >
                    I Accept the Offer
                  </button>
                  <button className="bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" /> Ask / Forward to Parents
                  </button>
                  <button 
                    onClick={() => setIsUniversityPopupOpen(false)}
                    className="bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition"
                  >
                    I Cannot Afford
                  </button>
                  <button 
                    onClick={() => {
                      setIsUniversityPopupOpen(false);
                      onNavigate(PublicView.SCHOLARSHIP_EXAM);
                    }}
                    className="bg-amber-500 text-white py-4 rounded-xl font-bold"
                  >
                    Apply for Education Loan
                  </button>
                  <button 
                    onClick={() => {
                      setIsUniversityPopupOpen(false);
                      onNavigate(PublicView.SCHOLARSHIP_EXAM);
                    }}
                    className="bg-amber-600 text-white py-4 rounded-xl font-bold"
                  >
                    Apply for Bursary
                  </button>
                  <button 
                    onClick={() => {
                      setIsUniversityPopupOpen(false);
                      onNavigate(PublicView.SCHOLARSHIP_EXAM);
                    }}
                    className="bg-slate-900 text-white py-4 rounded-xl font-bold text-xs"
                  >
                    I Cannot Afford – Explore Funding
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACCEPT PROMPT */}
      <AnimatePresence>
        {isAcceptPromptOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Confirm Acceptance</h2>
              <p className="text-slate-500 mb-8">
                Have you fully read the offer and understand the terms and amounts after scholarship? 
                <br /><br />
                <span className="font-bold text-slate-900">Note: No fees are to be paid immediately.</span>
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsAcceptPromptOpen(false);
                    onPhaseComplete(AppPhase.OFFER_LETTER);
                  }}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg"
                >
                  Yes, I Understand & Accept
                </button>
                <button onClick={() => setIsAcceptPromptOpen(false)} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
                  Go Back & Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OFFER 2 SHARE MODAL */}
      <AnimatePresence>
        {showOffer2ShareModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowOffer2ShareModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Share2 className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-center text-slate-900 mb-4 tracking-tight">Unlock Offer</h3>
              <p className="text-center text-slate-600 mb-8 font-medium leading-relaxed">
                Help one friend apply to university by sharing this platform in one group to unlock this offer.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleOffer2Share('whatsapp')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition active:scale-95">
                  <MessageSquare className="w-8 h-8" />
                  <span className="font-bold text-sm">WhatsApp</span>
                </button>
                <button onClick={() => handleOffer2Share('facebook')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition active:scale-95">
                  <Facebook className="w-8 h-8" />
                  <span className="font-bold text-sm">Facebook</span>
                </button>
                <button onClick={() => handleOffer2Share('linkedin')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition active:scale-95">
                  <Linkedin className="w-8 h-8" />
                  <span className="font-bold text-sm">LinkedIn</span>
                </button>
                <button onClick={() => handleOffer2Share('sms')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95">
                  <MessageCircle className="w-8 h-8" />
                  <span className="font-bold text-sm">SMS</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      )}
    </>
  );
};

export default WaitingRoom;
