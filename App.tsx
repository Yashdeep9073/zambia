
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { UserRole, AppPhase, PublicView } from './types';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import SmartLoader from './components/SmartLoader'; // Import SmartLoader
import { MessageSquare, Phone, Mic, X, Loader, Wifi, Volume2, ExternalLink, AlertCircle, School, MessageCircle } from 'lucide-react';

import { AuthProvider } from './src/contexts/AuthContext';

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PublicPages = lazy(() => import('./pages/PublicPages'));
const DashboardFlow = lazy(() => import('./pages/DashboardFlow'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UniversityDashboard = lazy(() => import('./pages/UniversityDashboard'));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  // Initialize state from localStorage if available
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('zii_user_role');
    return saved ? (saved as UserRole) : null;
  });
  
  const [currentPhase, setCurrentPhase] = useState<AppPhase>(() => {
    const saved = localStorage.getItem('zii_current_phase');
    return saved ? parseInt(saved) : AppPhase.MARKETING_LEAD;
  });

  const [currentView, setCurrentView] = useState<PublicView>(() => {
    // Initialize view from URL if present
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    return (viewParam && Object.values(PublicView).includes(viewParam as PublicView)) 
      ? (viewParam as PublicView) 
      : PublicView.HOME;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Global Loading State
  
  // Call Modal State
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<'searching' | 'connecting' | 'failed'>('searching');
  const [countdown, setCountdown] = useState(20);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persistence Effects
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('zii_user_role', userRole);
    } else {
      localStorage.removeItem('zii_user_role');
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('zii_current_phase', currentPhase.toString());
    // Global Scroll to Top on Phase Change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPhase]);

  // Handle Browser Back/Forward Navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view');
        setCurrentView(
          (viewParam && Object.values(PublicView).includes(viewParam as PublicView))
            ? (viewParam as PublicView)
            : PublicView.HOME
        );
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initial Load Simulation
  useEffect(() => {
    // Simulate initial asset loading logic
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5s initial load (user won't see overlay unless it exceeds 2s)
    return () => clearTimeout(timer);
  }, []);

  const triggerSmartLoad = () => {
    setIsLoading(true);
    // Simulate route transition / data fetch time
    // If fast (<2s), overlay won't show. If slow (simulated here or real network lag), it will.
    // We add a minimal timeout to allow React to flush state updates if synchronous
    setTimeout(() => {
      setIsLoading(false);
    }, 500); 
  };

  const handleLogin = (role: UserRole) => {
    triggerSmartLoad();
    setUserRole(role);
    // Start at the beginning of the lifecycle for comprehensive lead qualification
    // Or resume if saved (handled by initial state, but here we might want to reset for explicit login)
    if (!localStorage.getItem('zii_current_phase')) {
        setCurrentPhase(AppPhase.MARKETING_LEAD);
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    triggerSmartLoad();
    setUserRole(null);
    setCurrentPhase(AppPhase.MARKETING_LEAD);
    setCurrentView(PublicView.HOME);
    setIsSidebarOpen(false);
    localStorage.removeItem('zii_user_role');
    localStorage.removeItem('zii_current_phase');
    localStorage.removeItem('zii_profile_data'); // Clear profile data on logout
    window.scrollTo(0, 0);
  };

  const handleViewChange = (view: PublicView) => {
    if (view !== currentView) {
      triggerSmartLoad();
      setCurrentView(view);
      // Global Scroll to Top on View Change
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update Browser History
      const url = new URL(window.location.href);
      if (view === PublicView.HOME) {
        url.searchParams.delete('view');
      } else {
        url.searchParams.set('view', view);
      }
      window.history.pushState({ view }, '', url.toString());
    }
  };

  const handleFreeCallClick = () => {
    setCallModalOpen(true);
    setCallStatus('searching');
    setCountdown(20);

    console.log("Event: FREE CALL button clicked");

    // Start Countdown Simulation
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCallStatus('connecting');
          
          // Execute Redirect Logic
          const agentUrl = "https://elevenlabs.io/app/talk-to?agent_id=agent_6801kgqxsbrmf7y9ycydz31tcwm0&branch_id=agtbrch_6601kgqxsdxsefxb7qxxgz2r9by7";
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

          console.log("Event: Device Detected", isMobile ? "Mobile" : "Desktop");
          console.log("Event: Countdown completed, attempting to open URL");

          try {
              // Attempt to open in new tab/browser
              const newTab = window.open(agentUrl, '_blank');
              
              if (newTab) {
                  console.log("Event: Eleven Labs URL opened successfully");
                  setCallModalOpen(false);
              } else {
                  console.warn("Event: Link load failed (Popup Blocked), showing fallback");
                  setCallStatus('failed');
              }
          } catch (e) {
              console.error("Event: Error opening link", e);
              setCallStatus('failed');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup timer on unmount or modal close
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // GLOBAL WIDGETS
  const GlobalWidgets = () => (
    <>
      {/* --- DESKTOP VIEW (Floating Bottom Right) --- */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col gap-4 items-end">
          {/* 3. WhatsApp (Top) */}
          <a href="https://wa.me/15557824998" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group cursor-pointer" title="Chat on WhatsApp">
              <div className="bg-[#25D366] hover:bg-[#20bd5a] p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center relative overflow-hidden border-4 border-white">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
              </div>
          </a>

          {/* 2. Students Office (ChatBot Button - Handled by ChatBot Component on Desktop) */}
          {/* Note: ChatBot component handles its own rendering and includes the button for desktop */}

          {/* 1. FREE CALL BUTTON (Bottom) */}
          <button 
              onClick={handleFreeCallClick}
              className="flex items-center gap-2 group cursor-pointer animate-bounce-slow"
              id="freeCallBtn"
              title="FREE CALL!!!"
          >
              <div className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center border-4 border-white">
                  <Phone className="w-6 h-6 animate-pulse" />
              </div>
          </button>
      </div>

      {/* --- MOBILE VIEW (Fixed Bottom Bar) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-around items-center py-2 px-2 pb-safe safe-area-bottom">
          {/* WhatsApp */}
          <a href="https://wa.me/15557824998" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 active:scale-95 transition">
             <div className="bg-[#25D366] p-2 rounded-full text-white shadow-sm border border-green-600">
               <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
               </svg>
             </div>
             <span className="text-[10px] font-bold text-slate-700">WhatsApp</span>
          </a>

          {/* Support Office (Priority Glow) */}
          <button 
             onClick={() => window.dispatchEvent(new Event('open-chat-bot'))} 
             className="flex flex-col items-center gap-1 -mt-6 active:scale-95 transition"
          >
             <div className="bg-orange-500 p-4 rounded-full text-white shadow-lg border-4 border-white animate-pulse relative">
                <School className="w-6 h-6"/>
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border border-orange-500"></span>
                </span>
             </div>
             <span className="text-[10px] font-bold text-slate-800">Support Office</span>
          </button>

          {/* Phone */}
          <button onClick={handleFreeCallClick} className="flex flex-col items-center gap-1 active:scale-95 transition">
             <div className="bg-red-600 p-2 rounded-full text-white shadow-sm border border-red-700">
               <Phone className="w-5 h-5"/>
             </div>
             <span className="text-[10px] font-bold text-slate-700">Phone</span>
          </button>

          {/* Login */}
          <button onClick={() => handleViewChange(PublicView.PORTAL_LOGIN)} className="flex flex-col items-center gap-1 active:scale-95 transition">
             <div className="bg-slate-900 p-2 rounded-full text-white shadow-sm border border-slate-700">
               <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
               </svg>
             </div>
             <span className="text-[10px] font-bold text-slate-700">Login</span>
          </button>
      </div>
    </>
  );

  // --- SPECIAL ADMIN ROUTES ---
  if (currentView === PublicView.ADMIN_LOGIN && !userRole) {
    return <AdminLogin onLogin={handleLogin} onNavigate={handleViewChange} />;
  }

  if (userRole === UserRole.ADMIN_CONSULTANT) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // --- UNIVERSITY PARTNER ROUTE ---
  if (userRole === UserRole.PARTNER_UNIVERSITY) {
    return <UniversityDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative pb-20 lg:pb-0">
      {/* GLOBAL LOADING OVERLAY */}
      <SmartLoader loading={isLoading} />

      <Navigation 
        currentRole={userRole} 
        onRoleChange={userRole ? setUserRole : handleLogin} 
        onLogout={handleLogout} 
        onViewChange={handleViewChange}
        currentView={currentView}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <Suspense fallback={<SmartLoader loading={true} />}>
      {/* FREE CALL MODAL */}
      {callModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-fade-in">
            {/* Styles for the 3D dots animation */}
            <style>{`
                .dot {
                    height: 15px;
                    width: 15px;
                    margin: 0 5px;
                    background-color: #f97316; /* orange-500 */
                    border-radius: 50%;
                    display: inline-block;
                    animation: bounce 1.2s infinite ease-in-out;
                }
                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                }
            `}</style>

            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative border-4 border-orange-500 shadow-2xl overflow-hidden">
                <button 
                    onClick={() => { setCallModalOpen(false); if (timerRef.current) clearInterval(timerRef.current); }}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition z-10"
                >
                    <X className="w-5 h-5 text-slate-500"/>
                </button>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-6 mt-2">
                    {callStatus === 'searching' ? 'Connecting...' : callStatus === 'failed' ? 'Connection Error' : 'Agent Found!'}
                </h3>
                
                <div className="text-slate-600 font-medium mb-6 leading-relaxed">
                    {callStatus === 'searching' 
                        ? (
                          <div className="space-y-6">
                             <p className="text-sm">Searching for a Zambian student in India who is online to attend to you. Please note, you may be prompted to allow microphone access.</p>
                             
                             <div className="text-4xl font-bold text-slate-900 font-mono">
                                 {countdown}
                                 <span className="text-sm text-slate-400 font-sans ml-2">seconds</span>
                             </div>

                             {/* 3D Animated Dots */}
                             <div className="h-8 flex items-center justify-center">
                                 <span className="dot"></span>
                                 <span className="dot"></span>
                                 <span className="dot"></span>
                             </div>

                             {/* Progress Bar */}
                             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                 <div 
                                    className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
                                    style={{ width: `${((20 - countdown) / 20) * 100}%` }}
                                 ></div>
                             </div>

                             <p className="text-xs font-bold text-emerald-600 animate-pulse">
                                Your call is being connected. Please ensure your microphone is enabled.
                             </p>
                          </div>
                        )
                        : callStatus === 'failed'
                        ? (
                            <div className="space-y-6">
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                                <p className="text-sm text-slate-600">The connection was blocked by your browser. Please click the button below to start the call manually.</p>
                                <a 
                                    href="https://elevenlabs.io/app/talk-to?agent_id=agent_6801kgqxsbrmf7y9ycydz31tcwm0&branch_id=agtbrch_6601kgqxsdxsefxb7qxxgz2r9by7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full bg-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg"
                                >
                                    Open Agent Manually <ExternalLink className="w-5 h-5 ml-2"/>
                                </a>
                            </div>
                        )
                        : (
                          <div className="space-y-4">
                             <div className="flex justify-center">
                                <Loader className="w-12 h-12 text-green-600 animate-spin" />
                             </div>
                             <p className="text-green-600 font-bold">Redirecting to secure line...</p>
                          </div>
                        )
                    }
                </div>
            </div>
        </div>
      )}

      {/* Global ChatBot Component (Must be rendered to receive events) */}
      <ChatBot />

      {!userRole ? (
        <>
            {currentView === PublicView.HOME ? (
            <LandingPage onLogin={handleLogin} onNavigate={handleViewChange} />
            ) : (
            <PublicPages view={currentView} onLogin={handleLogin} onNavigate={handleViewChange} />
            )}
        </>
      ) : (
        <div className="flex flex-1 max-w-7xl mx-auto w-full relative">
            <Sidebar 
            currentPhase={currentPhase} 
            onPhaseChange={setCurrentPhase} 
            userRole={userRole} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onNavigate={handleViewChange}
            />
            <main className="flex-1 overflow-y-auto w-full">
            <DashboardFlow 
                currentPhase={currentPhase} 
                onPhaseComplete={setCurrentPhase} 
                userRole={userRole} 
                onNavigate={handleViewChange}
                onRoleChange={setUserRole}
                currentView={currentView}
                onLogout={handleLogout}
            />
            </main>
        </div>
      )}
      
      </Suspense>
      
      {/* GLOBAL WIDGETS (Only for students/public) */}
      {userRole !== UserRole.ADMIN_CONSULTANT && userRole !== UserRole.PARTNER_UNIVERSITY && (
        <GlobalWidgets />
      )}
    </div>
  );
};

export default App;
