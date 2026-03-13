import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle, Clock, BookOpen, Users, DollarSign, 
  HelpCircle, ArrowRight, Star, ShieldCheck, Zap, 
  GraduationCap, Play, FileText, AlertTriangle, ChevronDown, ChevronUp,
  Calendar, MapPin, Globe, Lock
} from 'lucide-react';
import { PublicView } from '../types';
import WhatsAppFunnel from '../components/WhatsAppFunnel';

interface ScholarshipExamPageProps {
  onNavigate: (view: PublicView) => void;
}

const ScholarshipExamPage: React.FC<ScholarshipExamPageProps> = ({ onNavigate }) => {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: "Is this exam mandatory for all students?",
      a: "No. This exam is specifically for students seeking 100% full sponsorship. If you are applying for partial scholarships (50-100%), you do not need to write this exam."
    },
    {
      q: "What happens if I fail the exam?",
      a: "There is no 'fail'. Your score determines your scholarship percentage. Even if you don't get 100%, you may still qualify for 100% or 50% awards based on your performance."
    },
    {
      q: "Can I write the exam from my phone?",
      a: "Yes. The exam platform is fully mobile-optimized. However, we recommend a laptop or tablet for the best experience during the essay section."
    },
    {
      q: "Is there a fee to write the exam?",
      a: "Yes. There is a nominal administrative fee of K150 to cover the proctoring system and platform costs. This is the only fee you will pay."
    },
    {
      q: "When will I get my results?",
      a: "Multiple choice results are instant. The essay section takes 48-72 hours for manual review by the scholarship committee."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-4 py-1 text-yellow-300 font-bold text-xs uppercase tracking-widest mb-8 animate-fade-in-down">
            <Award className="w-4 h-4" /> Official National Selection
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            The National Scholarship <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Full Scholarship Exam 2026</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light mb-10 leading-relaxed">
            Your only pathway to <span className="text-white font-bold">100% Full Sponsorship</span> at India's top universities. 
            Prove your potential. Earn your future.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <button onClick={() => onNavigate(PublicView.PORTAL_LOGIN)} className="group relative px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-orange-500/20 transform hover:scale-105 transition-all duration-300">
              <span className="flex items-center">
                Register for Exam <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition" />
              </span>
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                Limited Seats
              </div>
            </button>
            <button onClick={() => document.getElementById('exam-details')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-xl hover:bg-white/20 transition">
              View Syllabus
            </button>
          </div>

          {/* Countdown Timer */}
          <div className="inline-flex flex-wrap justify-center gap-4 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="text-center px-4 border-r border-white/10 last:border-0">
              <div className="text-3xl font-mono font-bold text-yellow-400">{timeLeft.days}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Days</div>
            </div>
            <div className="text-center px-4 border-r border-white/10 last:border-0">
              <div className="text-3xl font-mono font-bold text-yellow-400">{timeLeft.hours}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Hours</div>
            </div>
            <div className="text-center px-4 border-r border-white/10 last:border-0">
              <div className="text-3xl font-mono font-bold text-yellow-400">{timeLeft.minutes}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Mins</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-mono font-bold text-yellow-400">{timeLeft.seconds}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Secs</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-4">Until Registration Closes</p>
        </div>
      </div>

      {/* 2. WHAT IS THIS EXAM */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">What is the Full Scholarship Exam?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            The Full Scholarship Exam is a standardized online assessment designed to identify Zambia's brightest academic talents. Unlike standard university applications that rely solely on Grade 12 results, this exam gives you a second chance to prove your aptitude, critical thinking, and readiness for international education.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Fair & Unbiased</h3>
              <p className="text-sm text-slate-500">Purely merit-based. No connections needed. Your score dictates your award.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <Globe className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Internationally Recognized</h3>
              <p className="text-sm text-slate-500">Accepted by over 50+ partner universities in India as a primary selection criterion.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <Zap className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Instant Qualification</h3>
              <p className="text-sm text-slate-500">High scorers receive immediate provisional scholarship offer letters.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WHY THIS EXAM IS DIFFERENT */}
      <div className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why This Exam Is Different</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Standard Application</h3>
                    <p className="text-slate-500 text-sm">Competes with thousands. Relies only on past grades. Limited scholarship pool.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Full Scholarship Exam Route</h3>
                    <p className="text-slate-500 text-sm">Exclusive pool. Tests current potential. Unlocks 100% sponsorship tiers.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 text-center">Scholarship Distribution by Route</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Exam Takers</span>
                    <span className="text-emerald-600">90% Success Rate</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[90%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Standard Applicants</span>
                    <span className="text-slate-500">45% Success Rate</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 w-[45%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THE GUARANTEE */}
      <div className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <ShieldCheck className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Our Iron-Clad Guarantee</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            If you score above 85% on the Full Scholarship Exam and meet the basic university entry requirements, we <span className="text-yellow-400 font-bold">guarantee</span> you a minimum of 100% scholarship offer within 7 days.
          </p>
        </div>
      </div>

      {/* 5. MODE OF EXAM */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Fully Online. Secure. Accessible.</h2>
            <p className="text-slate-500 mt-2">Write from anywhere in Zambia.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Online</h3>
              <p className="text-sm text-slate-500">No travel required. Access the exam portal from your home or nearest internet café.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Proctoring</h3>
              <p className="text-sm text-slate-500">Advanced anti-cheat technology ensures fairness. Browser lockdown and webcam monitoring enabled.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Flexible Timing</h3>
              <p className="text-sm text-slate-500">Choose your slot. The exam window is open for 48 hours during the testing weekend.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. EXAM STRUCTURE */}
      <div id="exam-details" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Exam Structure</h2>
          <div className="space-y-4">
            {[
              { part: "Part 1", title: "Logical Reasoning & Aptitude", time: "30 Mins", qs: "25 Questions", desc: "Pattern recognition, critical thinking, and problem-solving scenarios." },
              { part: "Part 2", title: "English Proficiency", time: "20 Mins", qs: "20 Questions", desc: "Grammar, comprehension, and vocabulary usage." },
              { part: "Part 3", title: "General Knowledge (Global & Zambia)", time: "15 Mins", qs: "15 Questions", desc: "Current affairs, basic geography, and history." },
              { part: "Part 4", title: "Personal Statement Essay", time: "45 Mins", qs: "1 Essay", desc: "Topic: 'How I will contribute to Zambia's development after my studies.'" }
            ].map((section, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6 hover:border-emerald-500 transition cursor-default">
                <div className="bg-slate-900 text-white w-full md:w-32 py-4 rounded-lg text-center shrink-0">
                  <div className="text-xs font-bold uppercase opacity-70">{section.part}</div>
                  <div className="font-bold text-xl">{section.time}</div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-bold text-lg text-slate-900">{section.title}</h3>
                  <p className="text-sm text-slate-500">{section.desc}</p>
                </div>
                <div className="text-right shrink-0 font-bold text-slate-400 text-sm">
                  {section.qs}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. EXAM RULES */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" /> Important Exam Rules
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                "Webcam must be on at all times.",
                "No other tabs or windows allowed.",
                "Quiet room environment required.",
                "Stable internet connection is mandatory.",
                "Identity verification via ID/Passport before start.",
                "No headphones or earplugs allowed."
              ].map((rule, i) => (
                <li key={i} className="flex items-center text-red-700 font-medium">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 8. STUDY TIPS */}
      <div className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How to Prepare</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Practice Logic", desc: "Solve basic IQ and pattern puzzles online." },
              { title: "Read News", desc: "Brush up on major global and Zambian events of the last year." },
              { title: "Draft Essays", desc: "Practice writing 500-word essays on development topics." },
              { title: "Check Tech", desc: "Ensure your laptop and internet are reliable beforehand." }
            ].map((tip, i) => (
              <div key={i} className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="text-4xl font-bold text-white/20 mb-4">0{i+1}</div>
                <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                <p className="text-sm text-slate-300">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. WHO SHOULD WRITE THIS */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Who Should Write This Exam?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Grade 12 Leavers (2023-2025)",
              "Diploma Holders seeking Degrees",
              "Degree Holders seeking Masters",
              "Students with 15+ points seeking redemption",
              "High achievers aiming for Ivy League equivalents"
            ].map((item, i) => (
              <span key={i} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-full font-bold text-sm border border-slate-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 10. SPONSORSHIP BENEFITS */}
      <div className="py-20 bg-gradient-to-br from-emerald-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <DollarSign className="w-96 h-96" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Unlock 100% Sponsorship</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">Tuition Fee Waiver</h3>
              <p className="text-slate-200">Full coverage of all university tuition fees for the entire duration of your course.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">Accommodation</h3>
              <p className="text-slate-200">Subsidized or fully paid hostel accommodation within the university campus.</p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">Internship Priority</h3>
              <p className="text-slate-200">Exclusive access to paid internships and placement drives in India.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 11. EXAM FEE STRUCTURE */}
      <div className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Exam Fee</h2>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 inline-block w-full">
            <div className="text-5xl font-extrabold text-slate-900 mb-2">K150</div>
            <div className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-8">One-time Administrative Fee</div>
            <ul className="text-left space-y-3 mb-8 max-w-xs mx-auto">
              <li className="flex items-center text-slate-600 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2"/> Covers Proctoring System</li>
              <li className="flex items-center text-slate-600 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2"/> Exam Platform Access</li>
              <li className="flex items-center text-slate-600 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2"/> Result Certification</li>
            </ul>
            <button onClick={() => onNavigate(PublicView.PORTAL_LOGIN)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
              Register & Pay Now
            </button>
            <p className="text-xs text-slate-400 mt-4">Secure payment via Airtel/MTN Money or Card.</p>
          </div>
        </div>
      </div>

      {/* 12. HOW IT WORKS */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Your Path to Sponsorship</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: 1, title: "Register", desc: "Create account and pay exam fee." },
                { step: 2, title: "Prepare", desc: "Access study materials in dashboard." },
                { step: 3, title: "Write Exam", desc: "Complete the online assessment." },
                { step: 4, title: "Get Offer", desc: "Receive scholarship offer in 72hrs." }
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 13. TESTIMONIALS */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-12">Success Stories</h2>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
            <div className="text-4xl text-slate-300 absolute top-4 left-4">"</div>
            <p className="text-lg text-slate-600 italic mb-6 relative z-10">
              I had 18 points in Grade 12 and thought my dream was over. I wrote the Full Scholarship Exam, scored 88%, and got a 100% scholarship to Shoolini University. This exam changed my life.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
              <div className="text-left">
                <div className="font-bold text-slate-900">Chilufya M.</div>
                <div className="text-xs text-slate-500">B.Sc Biotechnology • 2nd Year</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 14. FAQ */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => setActiveFaqIndex(activeFaqIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-800 hover:bg-slate-50 transition"
                >
                  {item.q}
                  {activeFaqIndex === i ? <ChevronUp className="w-5 h-5 text-slate-400"/> : <ChevronDown className="w-5 h-5 text-slate-400"/>}
                </button>
                {activeFaqIndex === i && (
                  <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 15. FINAL CTA */}
      <div className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Don't Let Your Grades Define You.</h2>
          <p className="text-xl text-slate-300 mb-12 font-light">
            Take the exam. Prove your worth. Get the scholarship you deserve.
          </p>
          <button onClick={() => onNavigate(PublicView.PORTAL_LOGIN)} className="px-12 py-6 bg-emerald-600 text-white rounded-full font-bold text-2xl hover:bg-emerald-700 transition shadow-2xl transform hover:scale-105 active:scale-95">
            Start Exam Journey
          </button>
          <p className="mt-6 text-sm text-slate-500">Registration closes in {timeLeft.days} days.</p>
        </div>
      </div>

      {/* WhatsApp Funnel Integration */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <WhatsAppFunnel 
          title="Scholarship Exam Support"
          context="Join our exam preparation groups to get study materials, past papers, and technical support."
        />
      </div>

    </div>
  );
};

export default ScholarshipExamPage;
