
import React, { useState, useEffect } from 'react';
import { UserRole, PublicView } from '../types';
import { Shield, LogOut, Bell, Search, Menu, X, User, ArrowUp, Lock, Sparkles, Building } from 'lucide-react';

interface NavigationProps {
  currentRole: UserRole | null;
  onRoleChange: (role: UserRole | null) => void;
  onLogout: () => void;
  onViewChange: (view: PublicView) => void;
  currentView: PublicView;
  onToggleSidebar?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentRole, onRoleChange, onLogout, onViewChange, currentView, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMenuTooltip, setShowMenuTooltip] = useState(true);

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowMenuTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { label: 'Home', view: PublicView.HOME },
    { label: 'Courses', view: PublicView.COURSES },
    { label: 'About Us', view: PublicView.ABOUT },
    { label: 'Contact', view: PublicView.CONTACT }, // Reordered as requested
    { label: 'Student Centre', view: PublicView.STUDENT_CENTRE },
  ];

  return (
    <nav className="bg-emerald-900 text-white shadow-xl sticky top-0 z-50 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onViewChange(PublicView.HOME)}>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 lg:p-2.5 rounded-full shadow-lg group-hover:scale-110 transition duration-300">
              <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl lg:text-2xl tracking-tighter block leading-none">ZII</span>
              <span className="text-[9px] lg:text-[10px] text-orange-300 uppercase tracking-widest block leading-none mt-1 font-semibold group-hover:text-white transition">Zambians In India</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1 items-center">
             {!currentRole ? (
               <>
                 {navItems.map((item) => (
                   <button 
                     key={item.label}
                     onClick={() => onViewChange(item.view)}
                     className={`px-3 py-2 text-sm font-bold transition rounded-full ${
                       currentView === item.view 
                         ? 'bg-white text-emerald-900 shadow-md' 
                         : 'text-emerald-100 hover:text-white hover:bg-emerald-800'
                     }`}
                   >
                     {item.label}
                   </button>
                 ))}

                 {/* For Universities Button */}
                 <button 
                    onClick={() => onViewChange(PublicView.FOR_UNIVERSITIES)}
                    className={`px-3 py-2 text-sm font-bold transition rounded-full flex items-center ${
                       currentView === PublicView.FOR_UNIVERSITIES
                         ? 'bg-white text-emerald-900 shadow-md' 
                         : 'text-amber-400 hover:text-white hover:bg-emerald-800'
                     }`}
                 >
                    <Building className="w-4 h-4 mr-1.5" />
                    For Universities
                 </button>
                 
                 <div className="h-6 w-px bg-emerald-700 mx-2"></div>

                 <button 
                    onClick={() => onViewChange(PublicView.APPLY_ONLINE)}
                    className="flex items-center bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 px-5 py-2 rounded-full font-bold shadow-sm transition transform hover:-translate-y-0.5 mr-2"
                 >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Apply Online
                 </button>

                 <button 
                    onClick={() => onViewChange(PublicView.PORTAL_LOGIN)} 
                    className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition transform hover:-translate-y-0.5"
                 >
                    <User className="h-4 w-4 mr-2" />
                    Login
                 </button>
               </>
             ) : (
               /* Logged In State */
               <div className="flex items-center space-x-6">
                <div className="relative">
                   <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1 hover:text-orange-400 transition">
                      <Bell className="h-6 w-6" />
                      <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-emerald-900 bg-red-500 transform translate-x-1/2 -translate-y-1/2 animate-pulse"></span>
                   </button>
                   {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100 text-gray-800 animate-fade-in-down">
                         <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 font-bold text-sm">Notifications</div>
                         <div className="max-h-64 overflow-y-auto">
                            <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                               <p className="text-xs font-bold text-blue-600">Exam Alert</p>
                               <p className="text-sm">IELTS date approaching in Lusaka (25th Aug).</p>
                            </div>
                         </div>
                      </div>
                   )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right hidden md:block">
                     <p className="text-xs text-emerald-300 uppercase font-bold">Logged In As</p>
                     <p className="text-sm font-bold text-white">{currentRole.replace('_', ' ')}</p>
                  </div>
                  <button onClick={onLogout} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-white font-bold transition text-xs uppercase tracking-wide">
                    <LogOut className="h-4 w-4" />
                    <span>Exit</span>
                  </button>
                </div>
              </div>
             )}
          </div>

          {/* Mobile Menu Button & Search */}
          <div className="lg:hidden flex items-center gap-2 relative">
            <button 
               onClick={() => onViewChange(PublicView.SEARCH)}
               className="p-2 text-white hover:text-orange-400 active:scale-95 transition"
            >
               <Search className="h-6 w-6" />
            </button>
            
            {currentRole && (
               <button onClick={onLogout} className="text-white hover:text-red-400">
                  <LogOut className="h-6 w-6" />
               </button>
            )}
            
            <div className="relative">
                {/* Tooltip for Mobile Menu */}
                {showMenuTooltip && !currentRole && (
                    <div className="absolute top-10 right-0 w-32 bg-orange-600 text-white text-[10px] font-bold p-2 rounded-lg shadow-xl animate-bounce z-50 text-center">
                        <div className="absolute -top-1 right-3 w-2 h-2 bg-orange-600 transform rotate-45"></div>
                        Click here for menu
                    </div>
                )}
                <button 
                   onClick={() => currentRole && onToggleSidebar ? onToggleSidebar() : setMobileMenuOpen(!mobileMenuOpen)} 
                   className="text-white hover:text-orange-400 p-1"
                >
                   {mobileMenuOpen && !currentRole ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && !currentRole && (
        <div className="lg:hidden bg-emerald-800 border-t border-emerald-700 animate-slide-down shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
             <button 
               onClick={() => { onViewChange(PublicView.APPLY_ONLINE); setMobileMenuOpen(false); }}
               className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold bg-white text-orange-600 shadow-sm mb-4 active:scale-95 transition flex items-center justify-center border-2 border-orange-500"
             >
               <Sparkles className="w-5 h-5 mr-2" />
               Apply Online
             </button>

             {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { onViewChange(item.view); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-bold transition ${currentView === item.view ? 'bg-white text-emerald-900' : 'text-emerald-100 hover:text-white hover:bg-emerald-700'}`}
                >
                  {item.label}
                </button>
             ))}
             
             <button
                onClick={() => { onViewChange(PublicView.FOR_UNIVERSITIES); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-bold transition flex items-center ${currentView === PublicView.FOR_UNIVERSITIES ? 'bg-white text-emerald-900' : 'text-amber-400 hover:text-white hover:bg-emerald-700'}`}
             >
                <Building className="w-5 h-5 mr-3" />
                For Universities
             </button>

             <button 
                onClick={() => { onViewChange(PublicView.PORTAL_LOGIN); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-emerald-100 hover:text-white hover:bg-emerald-700"
             >
                Portal Login
             </button>
             <button 
                onClick={() => { onViewChange(PublicView.ADMIN_LOGIN); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-emerald-100 hover:text-white hover:bg-emerald-700"
             >
                Admin Access
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
