import React, { useState, useEffect, useRef } from 'react';
import { UserRole, AppPhase, PublicView } from './types';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import PublicPages from './pages/PublicPages';
import DashboardFlow from './pages/DashboardFlow';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import ChatBot from './components/ChatBot';
import { MessageSquare, Phone, Mic, X, Loader, Wifi, Volume2, ExternalLink, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPhase, setCurrentPhase] = useState<AppPhase>(AppPhase.MARKETING_LEAD);
  const [currentView, setCurrentView] = useState<PublicView>(PublicView.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Call Modal State
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<'searching' | 'connecting' | 'failed'>('searching');
  const [countdown, setCountdown] = useState(20);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    // Start at the beginning of the lifecycle for comprehensive lead qualification
    setCurrentPhase(AppPhase.MARKETING_LEAD);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPhase(AppPhase.MARKETING_LEAD);
    setCurrentView(PublicView.HOME);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleViewChange = (view: PublicView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        {/* 3. WhatsApp (Top) */}
        <a href="https://wa.me/260762523854?text=Hello,%20I%20need%20assistance%20from%20Zambians%20In%20India." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group cursor-pointer" title="Chat on WhatsApp">
            <div className="bg-[#25D366] hover:bg-[#20bd5a] p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center relative overflow-hidden border-4 border-white">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            </div>
        </a>

        {/* 2. Students Office (ChatBot Button) */}
        <ChatBot />

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
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Navigation 
        currentRole={userRole} 
        onRoleChange={userRole ? setUserRole : handleLogin} 
        onLogout={handleLogout} 
        onViewChange={handleViewChange}
        currentView={currentView}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
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
            />
            <main className="flex-1 overflow-y-auto w-full">
            <DashboardFlow 
                currentPhase={currentPhase} 
                onPhaseComplete={setCurrentPhase} 
                userRole={userRole} 
                onNavigate={handleViewChange}
            />
            </main>
        </div>
      )}
      
      {/* GLOBAL WIDGETS (Only for students/public) */}
      {userRole !== UserRole.ADMIN_CONSULTANT && userRole !== UserRole.PARTNER_UNIVERSITY && (
        <GlobalWidgets />
      )}
    </div>
  );
};

export default App;