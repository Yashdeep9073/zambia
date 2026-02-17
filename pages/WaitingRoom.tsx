
import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Clock, Award, Video, Info, FileText, CheckCircle, 
  Users, MapPin, Target, HelpCircle, Share2, Camera, 
  Download, AlertTriangle, Shield, Zap, X, ChevronRight,
  Calculator, Globe, Heart, ThumbsUp, Smile, Star, PenTool,
  Upload, MessageSquare
} from 'lucide-react';

// --- TYPES ---
interface ActivityData {
  id: string;
  status: 'locked' | 'pending' | 'completed';
  data?: any; // Store form data, scores, etc.
}

interface WaitingRoomState {
  activities: Record<string, ActivityData>;
  engagementScore: number;
}

// --- MOCK DATA & CONFIG ---
const QUIZ_QUESTIONS = [
  { q: "What is the currency of India?", options: ["Rupee", "Dollar", "Kwacha", "Yen"], a: "Rupee" },
  { q: "Which city is known as the Silicon Valley of India?", options: ["New Delhi", "Mumbai", "Bangalore", "Chennai"], a: "Bangalore" },
  { q: "What is the main season for university intake in India?", options: ["January", "April", "July/August", "December"], a: "July/August" },
  { q: "True or False: Ragging (Bullying) is strictly banned in Indian universities.", options: ["True", "False"], a: "True" },
  { q: "What document is mandatory for the Visa interview?", options: ["Offer Letter", "Driving License", "Voters Card", "Gym Membership"], a: "Offer Letter" },
];

const ALUMNI_STORIES = [
  { id: 1, name: "Grace M.", course: "B.Pharmacy", uni: "CT University", img: "https://randomuser.me/api/portraits/women/44.jpg", quote: "The labs are world-class." },
  { id: 2, name: "John P.", course: "Civil Eng", uni: "LPU", img: "https://randomuser.me/api/portraits/men/32.jpg", quote: "ZII helped me settle in 2 days." },
  { id: 3, name: "Sarah K.", course: "MBA", uni: "Sharda", img: "https://randomuser.me/api/portraits/women/68.jpg", quote: "My internship led to a job." },
];

const WaitingRoom = () => {
  // --- STATE MANAGEMENT ---
  const [state, setState] = useState<WaitingRoomState>({
    activities: {},
    engagementScore: 0
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  
  // Specific Form States (Transient)
  const [essayForm, setEssayForm] = useState({ about: '', scholarship: '', contribution: '' });
  const [financialInputs, setFinancialInputs] = useState({ duration: 3, lifestyle: 'Moderate', accommodation: 'Campus' });
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [activeQuizQ, setActiveQuizQ] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // Load from LocalStorage on Mount
  useEffect(() => {
    const saved = localStorage.getItem('zii_waiting_room_data');
    if (saved) {
      setState(JSON.parse(saved));
    } else {
      // Initialize default state
      const initialActivities: Record<string, ActivityData> = {};
      ALL_ACTIVITIES.forEach(a => {
        initialActivities[a.id] = { id: a.id, status: a.locked ? 'locked' : 'pending' };
      });
      setState({ activities: initialActivities, engagementScore: 0 });
    }
  }, []);

  // Save to LocalStorage on Change
  useEffect(() => {
    if (Object.keys(state.activities).length > 0) {
      localStorage.setItem('zii_waiting_room_data', JSON.stringify(state));
    }
  }, [state]);

  const markComplete = (id: string, data?: any) => {
    setState(prev => {
      const updated = { ...prev.activities, [id]: { ...prev.activities[id], status: 'completed' as const, data } };
      // Recalculate score
      const total = Object.keys(updated).length;
      const completed = Object.values(updated).filter(a => a.status === 'completed').length;
      const score = Math.round((completed / total) * 100);
      return { activities: updated, engagementScore: score };
    });
    // Close modal if open
    // setActiveModal(null); // Optional: keep open for feedback
  };

  const openActivity = (activity: any) => {
    // Explicitly cast to ActivityData | undefined to handle potential 'unknown' inference
    const activityData = state.activities[activity.id] as ActivityData | undefined;
    if (activityData?.status === 'locked') return;
    setModalTitle(activity.title);
    setActiveModal(activity.id);
  };

  // --- COMPONENT HELPERS ---

  const ProfileTransformer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImage(event.target?.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    };

    const processImage = () => {
      if (!uploadedImage || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = uploadedImage;
      img.onload = () => {
        canvas.width = 500;
        canvas.height = 500;
        // Draw Image
        ctx?.drawImage(img, 0, 0, 500, 500);
        // Draw Overlay
        if (ctx) {
          ctx.fillStyle = 'rgba(234, 88, 12, 0.8)'; // Orange overlay bottom
          ctx.fillRect(0, 400, 500, 100);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 30px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText("I'M GOING TO INDIA", 250, 440);
          ctx.font = '20px sans-serif';
          ctx.fillText("Applied via Zambians In India", 250, 470);
          // Add Badge
          ctx.beginPath();
          ctx.arc(450, 50, 40, 0, 2 * Math.PI);
          ctx.fillStyle = '#059669'; // Emerald
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText("ZII", 450, 55);
        }
        setProcessedImage(canvas.toDataURL());
        markComplete('profile_pic', { processed: true });
      };
    };

    return (
      <div className="space-y-4 text-center">
        <canvas ref={canvasRef} className="hidden" />
        {!processedImage ? (
          <div className="space-y-4">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Preview" className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-slate-200" />
            ) : (
              <div className="w-48 h-48 rounded-full bg-slate-100 flex items-center justify-center mx-auto border-2 border-dashed border-slate-300">
                <Camera className="w-12 h-12 text-slate-400" />
              </div>
            )}
            <div className="flex justify-center gap-2">
              <label className="btn-secondary cursor-pointer">
                Upload Photo <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              {uploadedImage && <button onClick={processImage} className="btn-primary">Apply Badge</button>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <img src={processedImage} alt="Processed" className="w-48 h-48 rounded-full object-cover mx-auto shadow-xl border-4 border-orange-500" />
            <a href={processedImage} download="zii-profile.png" className="btn-primary inline-flex items-center">
              <Download className="w-4 h-4 mr-2" /> Download & Share
            </a>
          </div>
        )}
      </div>
    );
  };

  // --- RENDER MODAL CONTENT ---
  const renderModalContent = () => {
    switch (activeModal) {
      case 'status_tracker':
        return (
          <div className="space-y-6">
            <p className="text-slate-600">Your application has been successfully submitted and is currently under institutional review. Our academic partners typically take 7–21 working days to issue formal decisions.</p>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
              <div className="flex flex-col items-center text-emerald-600"><CheckCircle className="w-8 h-8 mb-2"/><span className="bg-emerald-100 px-2 py-1 rounded">Submitted</span></div>
              <div className="h-1 flex-1 bg-emerald-500 mx-2"></div>
              <div className="flex flex-col items-center text-orange-600 animate-pulse"><Clock className="w-8 h-8 mb-2"/><span className="bg-orange-100 px-2 py-1 rounded">In Review</span></div>
              <div className="h-1 flex-1 bg-slate-200 mx-2"></div>
              <div className="flex flex-col items-center"><Award className="w-8 h-8 mb-2"/><span className="bg-slate-100 px-2 py-1 rounded">Decision</span></div>
            </div>
          </div>
        );
      case 'personal_essay':
        return (
          <div className="space-y-4">
            <div>
              <label className="label">1. Tell us about yourself (Interests, Hobbies)</label>
              <textarea className="input-field h-24" value={essayForm.about} onChange={e => setEssayForm({...essayForm, about: e.target.value})} placeholder="I am passionate about..." />
            </div>
            <div>
              <label className="label">2. Why do you deserve a full scholarship?</label>
              <textarea className="input-field h-24" value={essayForm.scholarship} onChange={e => setEssayForm({...essayForm, scholarship: e.target.value})} placeholder="I have consistently performed well..." />
            </div>
            <div>
              <label className="label">3. Contribution to Zambia after graduation?</label>
              <textarea className="input-field h-24" value={essayForm.contribution} onChange={e => setEssayForm({...essayForm, contribution: e.target.value})} placeholder="I plan to..." />
            </div>
            <button 
              onClick={() => markComplete('personal_essay', essayForm)}
              disabled={!essayForm.about || !essayForm.scholarship}
              className="btn-primary w-full"
            >
              Submit Essays
            </button>
          </div>
        );
      case 'about_india_quiz':
        return (
          <div className="text-center">
            {quizScore === null ? (
              <div className="space-y-6">
                <p className="text-sm font-bold text-slate-500 uppercase">Question {activeQuizQ + 1} of {QUIZ_QUESTIONS.length}</p>
                <h3 className="text-xl font-bold text-slate-800">{QUIZ_QUESTIONS[activeQuizQ].q}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {QUIZ_QUESTIONS[activeQuizQ].options.map(opt => (
                    <button key={opt} onClick={() => {
                      if (activeQuizQ < QUIZ_QUESTIONS.length - 1) {
                        setActiveQuizQ(prev => prev + 1);
                      } else {
                        setQuizScore(100); // Mock perfect score for demo
                        markComplete('about_india_quiz', { score: 100 });
                      }
                    }} className="p-4 border-2 border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 font-bold text-slate-600 transition">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><Award className="w-12 h-12"/></div>
                <h3 className="text-2xl font-bold text-slate-900">Quiz Completed!</h3>
                <p className="text-slate-600">You scored {quizScore}%</p>
              </div>
            )}
          </div>
        );
      case 'financial_estimator':
        const total = (financialInputs.duration * 12 * (financialInputs.lifestyle === 'High' ? 400 : 250)) + 1500; // Mock calc
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Course Duration (Years)</label><input type="number" className="input-field" value={financialInputs.duration} onChange={e => setFinancialInputs({...financialInputs, duration: parseInt(e.target.value)})} /></div>
              <div><label className="label">Lifestyle</label><select className="input-field" value={financialInputs.lifestyle} onChange={e => setFinancialInputs({...financialInputs, lifestyle: e.target.value})}><option>Moderate</option><option>High</option><option>Frugal</option></select></div>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Estimated Monthly Living Cost</p>
              <p className="text-4xl font-extrabold my-2">${financialInputs.lifestyle === 'High' ? '400' : '250'}</p>
              <p className="text-[10px] text-slate-500">*Excluding Tuition. Includes Food & Accommodation.</p>
            </div>
            <button onClick={() => markComplete('financial_estimator')} className="btn-primary w-full">Save Estimate</button>
          </div>
        );
      case 'profile_pic':
        return <ProfileTransformer />;
      case 'video_intro':
        return (
          <div className="text-center space-y-6">
            <div className="bg-slate-100 rounded-2xl h-48 flex items-center justify-center border-2 border-dashed border-slate-300">
              <Video className="w-12 h-12 text-slate-400"/>
            </div>
            <p className="text-sm text-slate-600">Record a 2-minute video telling us why you want to study in India.</p>
            <div className="flex gap-4 justify-center">
              <button className="btn-secondary"><Camera className="w-4 h-4 mr-2"/> Record</button>
              <button className="btn-secondary"><Upload className="w-4 h-4 mr-2"/> Upload</button>
            </div>
            <button onClick={() => markComplete('video_intro')} className="btn-primary w-full">Submit Video</button>
          </div>
        );
      case 'share_platform':
        return (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => markComplete('share_platform')} className="p-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center hover:opacity-90"><MessageSquare className="w-5 h-5 mr-2"/> WhatsApp</button>
            <button onClick={() => markComplete('share_platform')} className="p-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center hover:opacity-90"><Share2 className="w-5 h-5 mr-2"/> Facebook</button>
            <button onClick={() => markComplete('share_platform')} className="p-4 bg-pink-600 text-white rounded-xl font-bold flex items-center justify-center hover:opacity-90"><Camera className="w-5 h-5 mr-2"/> Instagram</button>
            <button onClick={() => markComplete('share_platform')} className="p-4 bg-black text-white rounded-xl font-bold flex items-center justify-center hover:opacity-90"><X className="w-5 h-5 mr-2"/> X (Twitter)</button>
          </div>
        );
      case 'alumni_stories':
        return (
          <div className="space-y-4">
            {ALUMNI_STORIES.map(story => (
              <div key={story.id} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <img src={story.img} className="w-12 h-12 rounded-full mr-4" alt={story.name} />
                <div>
                  <h4 className="font-bold text-slate-900">{story.name}</h4>
                  <p className="text-xs text-slate-500">{story.course} @ {story.uni}</p>
                  <p className="text-xs italic text-emerald-600 mt-1">"{story.quote}"</p>
                </div>
              </div>
            ))}
            <button onClick={() => markComplete('alumni_stories')} className="btn-primary w-full">I feel motivated!</button>
          </div>
        );
      case 'parent_info':
        return (
          <div className="text-center space-y-6">
            <FileText className="w-16 h-16 text-blue-500 mx-auto"/>
            <h3 className="font-bold text-lg">Parent Information Pack</h3>
            <p className="text-sm text-slate-600">A complete guide for your guardians about safety, costs, and contacts in India.</p>
            <button onClick={() => markComplete('parent_info')} className="btn-primary w-full"><Download className="w-4 h-4 mr-2"/> Download PDF</button>
          </div>
        );
      default:
        // Generic completion for read-only items
        return (
          <div className="text-center py-8">
            <Info className="w-12 h-12 text-blue-500 mx-auto mb-4"/>
            <p className="text-slate-600 mb-6">Review the information provided in this section to ensure you are fully prepared.</p>
            <button onClick={() => markComplete(activeModal!)} className="btn-primary w-full">Mark as Read / Completed</button>
          </div>
        );
    }
  };

  // --- ACTIVITY DEFINITIONS ---
  const ALL_ACTIVITIES = [
    // Section A: Core
    { id: 'status_tracker', title: "Application Status", type: 'core', icon: ActivityIcon },
    { id: 'alumni_stories', title: "Alumni Success Stories", type: 'core', icon: Video },
    { id: 'personal_essay', title: "Personal Essay", type: 'core', icon: PenTool },
    { id: 'video_intro', title: "Video Introduction", type: 'core', icon: Video },
    { id: 'about_india_quiz', title: "About India Quiz", type: 'core', icon: HelpCircle },
    { id: 'share_platform', title: "Share Platform", type: 'core', icon: Share2 },
    { id: 'profile_pic', title: "Profile Transformation", type: 'core', icon: Camera },
    // Section B: Preparation
    { id: 'offer_readiness', title: "Offer Readiness Checklist", type: 'preparation', icon: CheckCircle },
    { id: 'career_alignment', title: "Course & Career Alignment", type: 'preparation', icon: Target },
    { id: 'uni_overview', title: "University Overview", type: 'preparation', icon: Users },
    { id: 'scholarship_info', title: "Scholarship Awareness", type: 'preparation', icon: Award },
    { id: 'financial_estimator', title: "Financial Estimator", type: 'preparation', icon: Calculator },
    { id: 'parent_info', title: "Parent Info Pack", type: 'preparation', icon: FileText },
    { id: 'acceptance_quiz', title: "Acceptance Readiness", type: 'preparation', icon: Star },
    { id: 'visa_guide', title: "Visa Awareness Guide", type: 'preparation', icon: Shield },
    { id: 'peer_visibility', title: "Future Classmates", type: 'preparation', icon: Globe },
    { id: 'commitment', title: "Commitment Level", type: 'preparation', icon: Heart },
    { id: 'offer_letter_lock', title: "Offer Letter", type: 'preparation', icon: Lock, locked: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* HEADER / DASHBOARD */}
      <div className="bg-slate-900 text-white pt-8 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Application Submitted</span>
              <h1 className="text-3xl md:text-4xl font-extrabold">Student Waiting Room</h1>
              <p className="text-emerald-300 mt-1">Your application is safe. Use this time to prepare.</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-4xl font-bold text-white">{state.engagementScore}%</div>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Readiness Score</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-slate-700">
            <div className="bg-gradient-to-r from-orange-500 to-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${state.engagementScore}%` }}></div>
          </div>
          <p className="text-xs text-slate-400">Complete activities to unlock priority processing status.</p>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 pb-20">
        
        {/* Modal Overlay */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">{modalTitle}</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {renderModalContent()}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-10">
          
          {/* SECTION A: CORE */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Zap className="w-5 h-5 mr-2 text-orange-500"/> Core Activities (Required)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_ACTIVITIES.filter(a => a.type === 'core').map(activity => {
                const activityState = state.activities[activity.id] || { status: 'pending' };
                const isCompleted = activityState.status === 'completed';
                
                return (
                  <div 
                    key={activity.id}
                    onClick={() => openActivity(activity)}
                    className={`bg-white p-5 rounded-xl border-2 transition cursor-pointer relative overflow-hidden group hover:-translate-y-1 shadow-sm hover:shadow-md ${isCompleted ? 'border-emerald-500' : 'border-slate-100 hover:border-orange-300'}`}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 p-1 rounded-full"><CheckCircle className="w-4 h-4"/></div>
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 group-hover:bg-orange-50 group-hover:text-orange-500'}`}>
                      <activity.icon className="w-5 h-5"/>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{activity.title}</h3>
                    <p className="text-xs text-slate-500">{isCompleted ? 'Completed' : 'Tap to start'}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION B: PREPARATION */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-blue-500"/> Preparation & Bonus</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_ACTIVITIES.filter(a => a.type === 'preparation').map(activity => {
                const activityState = state.activities[activity.id] || { status: 'pending' };
                const isCompleted = activityState.status === 'completed';
                const isLocked = activity.locked;

                return (
                  <div 
                    key={activity.id}
                    onClick={() => openActivity(activity)}
                    className={`bg-white p-5 rounded-xl border border-slate-100 transition relative overflow-hidden ${isLocked ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:shadow-lg hover:border-blue-200'}`}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 z-10">
                        <Lock className="w-6 h-6 text-slate-400"/>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle className="w-4 h-4"/></div>
                    )}
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                      <activity.icon className="w-5 h-5"/>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{activity.title}</h3>
                    <p className="text-xs text-slate-500">{isLocked ? 'Available later' : (isCompleted ? 'Done' : 'Explore')}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- HELPER ICONS (If missing in lucide-react export) ---
const ActivityIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;

export default WaitingRoom;
