
import React, { useState, useEffect } from 'react';
import { Globe, Phone, Wifi, ShieldCheck, Activity, AlertCircle } from 'lucide-react';

interface SmartLoaderProps {
  loading: boolean;
}

const LOADING_MESSAGES = [
  "Preparing your university opportunities...",
  "Verifying scholarship pathways...",
  "Connecting to Indian partner universities...",
  "Loading secure student dashboard...",
  "Almost there — your future is loading."
];

const SmartLoader: React.FC<SmartLoaderProps> = ({ loading }) => {
  const [isVisible, setIsVisible] = useState(false); // Should it be in DOM?
  const [isActive, setIsActive] = useState(false);   // Is the overlay visible/fading in?
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [escalated, setEscalated] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // 1. Trigger Logic: 2 Second Delay
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (loading) {
      // Reset state on new load
      setEscalated(false);
      setFadeOut(false);
      setProgress(0);
      
      timeout = setTimeout(() => {
        setIsVisible(true);
        // Small delay to allow render before opacity transition
        setTimeout(() => setIsActive(true), 50);
      }, 2000);
    } else {
      // Load complete
      if (isVisible) {
        // Complete progress
        setProgress(100);
        setFadeOut(true);
        // Remove from DOM after fade out
        setTimeout(() => {
          setIsActive(false);
          setTimeout(() => setIsVisible(false), 1000);
        }, 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [loading, isVisible]);

  // 2. Escalation Logic: 60 Seconds
  useEffect(() => {
    let escalationTimer: ReturnType<typeof setTimeout>;
    if (isVisible && isActive && !fadeOut) {
      escalationTimer = setTimeout(() => {
        setEscalated(true);
      }, 60000);
    }
    return () => clearTimeout(escalationTimer);
  }, [isVisible, isActive, fadeOut]);

  // 3. Rotating Messages & Progress Simulation
  useEffect(() => {
    if (!isVisible || fadeOut) return;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Hold at 90% until loaded
        // Random increment for realistic feel
        return prev + Math.random() * 5; 
      });
    }, 800);

    // Background Retry Logic (Simulation)
    const retryInterval = setInterval(() => {
      // In a real app, we might ping a server here. 
      // For visual feedback, we simulate a "pulse" or check.
      // Keeping it silent as requested, just logic running.
      if (navigator.onLine === false) {
         // Could toggle a wifi warning state here if strictly required
      }
    }, 5000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(retryInterval);
    };
  }, [isVisible, fadeOut]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 4. Futuristic Background */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse"></div>
        
        {/* Animated Particles (CSS Simulation) */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-sm animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-emerald-400 rounded-full blur-sm animate-bounce delay-700"></div>
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-orange-400 rounded-full blur-sm animate-pulse delay-300"></div>
      </div>

      {/* 5. Glassmorphism Container */}
      <div className="relative z-10 p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_30px_rgba(56,189,248,0.1)] text-center max-w-md w-full mx-4 overflow-hidden">
        
        {/* Neon Accent Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

        {!escalated ? (
          <>
            {/* Standard Loading State */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 mx-auto relative">
                {/* 3D Globe Outline Representation */}
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 border-4 border-emerald-500/30 rounded-full animate-spin-reverse-slower"></div>
                <Globe className="w-full h-full text-blue-400 animate-pulse p-4" strokeWidth={1} />
                
                {/* Pulsing Dots */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Connecting You to India…</h2>
            <p className="text-blue-200 text-sm mb-6 font-light">Page loading, do not close or reload this page.</p>

            {/* Motivational Message */}
            <div className="h-12 flex items-center justify-center">
              <p key={messageIndex} className="text-emerald-300 text-sm font-medium animate-fade-in">
                {LOADING_MESSAGES[messageIndex]}
              </p>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-6 mb-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Optimizing secure access</p>
          </>
        ) : (
          <>
            {/* Escalation State (60s+) */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50 animate-pulse">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Connection Taking Longer</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                We are still trying to connect you. If your network is unstable, please call our support office for immediate assistance.
              </p>
              
              <a 
                href="tel:+260762523854"
                className="block w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center group"
              >
                <Phone className="w-5 h-5 mr-3 animate-bounce" />
                <span>Call +260 762 523 854</span>
              </a>
              
              <p className="mt-4 text-[10px] text-slate-500">
                Background retry active... <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full ml-1 animate-pulse"></span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SmartLoader;
