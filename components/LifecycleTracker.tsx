
import React from 'react';
import { AppPhase } from '../types';
import { Map, FileText, Clock, Award, Plane, CheckCircle, Lock, Shield } from 'lucide-react';

interface LifecycleTrackerProps {
  currentPhase: AppPhase;
  isProspective?: boolean;
}

const STAGES = [
  { phase: AppPhase.MARKETING_LEAD, label: "Explore", icon: Map, step: 1 },
  { phase: AppPhase.APPLICATION_ENTRY, label: "Apply", icon: FileText, step: 2 },
  { phase: AppPhase.OFFER_MANAGEMENT, label: "Review", icon: Clock, step: 3 },
  { phase: AppPhase.OFFER_LETTER, label: "Offer", icon: Award, step: 4 },
  { phase: AppPhase.PRE_DEPARTURE, label: "Pre-Depart", icon: Shield, step: 5 },
  { phase: AppPhase.TRAVEL_ARRIVAL, label: "Travel", icon: Plane, step: 6 },
];

const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({ currentPhase, isProspective = false }) => {
  
  // Helper to determine active step index based on non-linear enum values
  const getActiveStepIndex = (phase: AppPhase) => {
    // Map phase to index in STAGES array
    const index = STAGES.findIndex(s => s.phase === phase);
    if (index !== -1) return index;
    
    // Fallback logic for phases not explicitly in top-level bar
    if (phase === AppPhase.VISA_PROCESS) return 4; // Map Visa to Pre-Depart bucket
    if (phase > AppPhase.TRAVEL_ARRIVAL) return 5; // Max out at Travel
    return 0;
  };

  const activeIndex = getActiveStepIndex(currentPhase);

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header Label */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {isProspective ? "Your Roadmap to India" : `STUDENT LIFECYCLE STAGE: ${STAGES[activeIndex]?.label.toUpperCase()}`}
          </h2>
          <span className="text-[10px] font-mono text-slate-400">
            {isProspective ? "Preview Mode" : `Phase ${currentPhase}`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isLocked = idx > activeIndex;

              return (
                <div key={stage.step} className="flex flex-col items-center group">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                      isCurrent ? 'bg-white border-orange-500 text-orange-500 scale-110 shadow-lg' :
                      'bg-slate-50 border-slate-200 text-slate-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : 
                     isLocked && !isProspective ? <Lock className="w-3 h-3" /> : 
                     <stage.icon className="w-4 h-4" />}
                  </div>
                  <span 
                    className={`mt-2 text-[10px] font-bold uppercase hidden md:block transition-colors ${
                      isCurrent ? 'text-orange-600' : 
                      isCompleted ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifecycleTracker;
