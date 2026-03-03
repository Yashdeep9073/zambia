
import React, { useEffect } from 'react';
import { Award, MapPin, CheckCircle, Download, Share2, Copy } from 'lucide-react';
import { AppPhase } from '../types';

interface OfferLetterPageProps {
  onPhaseComplete: (phase: AppPhase) => void;
  studentName?: string;
}

const OFFER_UNIVERSITIES = [
  {
    id: 'CTU',
    name: 'CT University',
    location: 'Ludhiana, Punjab',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop',
    scholarship: '30%',
    scholarshipDetail: '30% Tuition Reduction (Estimated)',
    desc: 'UGC-approved private university offering UG, PG, and doctoral programs with over 100 courses. Known for Engineering, Management, Law, and Allied Health.',
    features: ['Urban Campus', 'Research Labs', 'BOSCH Industry Lab', 'Zambian Community'],
    url: 'https://www.ctuniversity.in/',
    recommended: true,
    fees: {
      original: '$4,500',
      discounted: '$3,150',
      hostel: 'Included (4 Meals)',
    },
    amenities: ['Study Rooms', 'Gym', 'Laundry', 'Library', 'Sports Complex', 'Wi-Fi', '24/7 Security'],
    reassurance: 'Your academic results have been carefully reviewed and matched with CTU eligibility criteria.'
  },
  {
    id: 'GDG',
    name: 'GD Goenka University',
    location: 'Gurugram, Haryana',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
    scholarship: '30%',
    scholarshipDetail: '30% Tuition Reduction (Merit Based)',
    desc: 'UGC-approved private university with a strong multicultural campus. Programs in Engineering, Management, Law, Arts, and Health Sciences.',
    features: ['Multicultural', 'Modern Infrastructure', 'Global Faculty'],
    url: 'https://gdgoenkauniversity.com/',
    recommended: false,
    fees: {
      original: '$5,000',
      discounted: '$3,500',
      hostel: 'Included (3 Meals)',
    },
    amenities: ['AC Hostels', 'Swimming Pool', 'Cafeteria', 'Transport', 'Wi-Fi'],
    reassurance: 'Student results have been evaluated based on the highest standard of merit, application completeness and scholarship eligibility.'
  },
  {
    id: 'LPU',
    name: 'Lovely Professional University',
    location: 'Phagwara, Punjab',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1974&auto=format&fit=crop',
    scholarship: '50%',
    scholarshipDetail: '50% Tuition Reduction (Potential)',
    desc: 'UGC-recognised university with ranked programs in Engineering, Management, Arts, Law, Agriculture and more.',
    features: ['Massive Campus', 'Ranked Programs', 'Diverse Culture'],
    url: 'https://www.lpu.in/',
    recommended: false,
    fees: {
      original: '$4,000',
      discounted: '$2,000',
      hostel: 'Standard (Vegetarian)',
    },
    amenities: ['Shopping Mall', 'Hospital', 'Stadium', 'Bowling Alley', 'Wi-Fi'],
    reassurance: 'Your application has qualified for review by LPU’s scholarship committee.'
  }
];

const OfferLetterPage: React.FC<OfferLetterPageProps> = ({ onPhaseComplete, studentName }) => {
  
  useEffect(() => {
    console.log("OfferLetterPage Mounted");
  }, []);

  const handleAcceptOffer = () => {
    // Transition to Pre-Departure Phase
    onPhaseComplete(AppPhase.PRE_DEPARTURE);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 overflow-x-hidden">
       {/* HEADER */}
       <div className="bg-gradient-to-r from-emerald-900 to-green-800 text-white pt-10 pb-8 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 animate-pulse"></div>
         <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-4 text-center">
               🎉 Offer Letters Unlocked!
            </h1>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
               <p className="text-lg md:text-xl font-light">
                  "Your future starts now. Review your offers below{studentName ? `, ${studentName}` : ''}."
               </p>
            </div>
         </div>
      </div>

      <div className="animate-fade-in-up pb-12 mt-8">
         <div className="text-center mb-10 px-4">
            <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4 shadow-lg animate-bounce">
               <Award className="w-12 h-12 text-yellow-600"/>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Congratulations!</h2>
            <p className="text-lg text-slate-600">Your Offer Letters Are Ready!</p>
            <div className="mt-4 bg-emerald-50 text-emerald-800 px-6 py-2 rounded-full inline-block font-bold text-sm border border-emerald-200">
               Total universities reviewed: 12 • Shortlisted: 3
            </div>
         </div>

         <div className="max-w-5xl mx-auto space-y-8 px-4">
            {OFFER_UNIVERSITIES.map((uni) => (
               <div key={uni.id} className={`bg-white rounded-3xl overflow-hidden shadow-xl border-2 relative flex flex-col md:block ${uni.recommended ? 'border-orange-500 ring-4 ring-orange-100' : 'border-slate-200'}`}>
                  {uni.recommended && (
                     <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl z-10 shadow-md">
                        #1 RECOMMENDED CHOICE
                     </div>
                  )}
                  
                  <div className="grid md:grid-cols-3">
                     <div className="h-48 md:h-auto relative w-full">
                        <img src={uni.logo} className="w-full h-full object-cover" alt={uni.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                           <div className="text-white">
                              <h3 className="font-bold text-xl leading-tight">{uni.name}</h3>
                              <p className="text-xs opacity-90 flex items-center mt-1"><MapPin className="w-3 h-3 mr-1"/> {uni.location}</p>
                           </div>
                        </div>
                     </div>
                     
                     <div className="col-span-2 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                           <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">{uni.scholarship} Scholarship</span>
                              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{uni.fees.hostel}</span>
                           </div>
                           <p className="text-slate-600 text-sm mb-4 leading-relaxed">{uni.desc}</p>
                           <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 mb-6">
                              <div>
                                 <p className="text-xs text-slate-400 uppercase font-bold">Tuition (Yearly)</p>
                                 <p className="font-bold line-through text-red-400 text-xs">{uni.fees.original}</p>
                                 <p className="font-extrabold text-emerald-600 text-lg">{uni.fees.discounted}</p>
                              </div>
                              <div>
                                 <p className="text-xs text-slate-400 uppercase font-bold">Offer Valid Until</p>
                                 <p className="font-bold">30 August 2025</p>
                              </div>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 mb-6 flex items-start">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5"/>
                              {uni.reassurance}
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                           <button onClick={handleAcceptOffer} className="col-span-1 sm:col-span-2 md:col-span-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-emerald-700 shadow-md">I Accept Offer</button>
                           <button className="bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-xs hover:bg-slate-200">Book Visit</button>
                           <button className="bg-white border border-slate-300 text-slate-600 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 flex items-center justify-center"><Download className="w-4 h-4 mr-1"/> PDF</button>
                           <button className="bg-[#25D366] text-white py-3 rounded-xl font-bold text-xs hover:opacity-90 flex items-center justify-center"><Share2 className="w-4 h-4 mr-1"/> Share</button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         <div className="max-w-4xl mx-auto mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center mx-4">
            <h4 className="text-blue-800 font-bold mb-2">Instructions for Parents / Sponsors</h4>
            <p className="text-sm text-blue-600 mb-4">Share the offer letter directly via WhatsApp to discuss next steps.</p>
            <button className="bg-white text-blue-600 border border-blue-200 px-6 py-2 rounded-full text-xs font-bold hover:bg-blue-100 flex items-center mx-auto">
               <Copy className="w-4 h-4 mr-2"/> Copy Parent Link
            </button>
         </div>

         <div className="text-center mt-12 space-y-4 px-4">
            <p className="text-xs text-slate-400">Can't afford tuition? <span className="text-orange-500 font-bold cursor-pointer hover:underline">Check 100% Online Scholarships</span></p>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
               <span>Verified Sources</span>
               <span>•</span>
               <span>Official Partners</span>
               <span>•</span>
               <span>Secure</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OfferLetterPage;
