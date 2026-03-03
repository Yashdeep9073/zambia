
import React from 'react';
import { AppPhase, UserRole, PublicView } from '../types';
import { 
  CheckCircle, FileText, DollarSign, Plane, Home, GraduationCap, 
  Briefcase, Award, Book, Users, Shield, BarChart, Settings, Zap, 
  Activity, Globe, MessageSquare, Map, X, Lock, LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  currentPhase: AppPhase;
  onPhaseChange: (phase: AppPhase) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: PublicView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPhase, onPhaseChange, userRole, isOpen, onClose, onNavigate }) => {
  
  // Define steps in logical order. 
  // We use the mapping from DashboardFlow to determine "unlocked" status.
  const studentSteps = [
    { phase: AppPhase.MARKETING_LEAD, label: 'Start Here', icon: Book },
    { phase: AppPhase.APPLICATION_ENTRY, label: 'Application', icon: FileText },
    { phase: AppPhase.OFFER_MANAGEMENT, label: 'Waiting Room', icon: ClockIcon },
    { phase: AppPhase.OFFER_LETTER, label: 'Offer Letter', icon: CheckCircle },
    { phase: AppPhase.PRE_DEPARTURE, label: 'Pre-Departure Guide', icon: Map },
    { phase: AppPhase.VISA_PROCESS, label: 'Visa Process', icon: Shield },
    { phase: AppPhase.TRAVEL_ARRIVAL, label: 'Travel', icon: Plane },
    { phase: AppPhase.SETTLEMENT, label: 'Virtual Campus', icon: Globe },
    { phase: AppPhase.COMMUNITY, label: 'Community', icon: Users },
    { phase: AppPhase.GRADUATION, label: 'Graduation', icon: GraduationCap },
    { phase: AppPhase.EMPLOYMENT, label: 'Career Hub', icon: Briefcase },
  ];

  // Helper to check if a step is accessible based on current phase
  const isStepLocked = (stepPhase: AppPhase) => {
    // Basic logic: You can't jump ahead. 
    // We treat phase numbers as sequential for this simple check, 
    // but handle the specific jump from 4 to 11 manually.
    
    if (stepPhase === AppPhase.MARKETING_LEAD) return false; // Always open
    
    // If current is 1, everything else locked
    // Note: We already know stepPhase is not MARKETING_LEAD from the check above.
    if (currentPhase === AppPhase.MARKETING_LEAD) return true;

    // Standard progression check
    // Special handling for Pre-Departure (11) which comes after Offer Letter (4)
    if (stepPhase === AppPhase.PRE_DEPARTURE) return currentPhase < AppPhase.OFFER_LETTER;
    
    // General numeric check for others (assuming enum values somewhat align or we rely on exact state)
    // For strictly linear flow: locked if stepPhase > currentPhase (with Pre-Depart exception)
    if (currentPhase === AppPhase.PRE_DEPARTURE && stepPhase < AppPhase.PRE_DEPARTURE) return false; // Can go back
    
    return stepPhase > currentPhase; 
  };

  // For Admin simulation, we keep the phase state but render different content
  const adminModules = [
    { id: 'ops', label: 'Platform Ops', icon: Activity },
    { id: 'leads', label: 'Lead Scoring AI', icon: Zap },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart },
    { id: 'finance', label: 'Fin. Orchestration', icon: DollarSign },
    { id: 'settings', label: 'System Config', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] lg:overflow-y-auto lg:sticky lg:top-16
      `}>
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100">
          <span className="font-bold text-slate-800">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 hidden lg:block">
            {userRole === UserRole.ADMIN_CONSULTANT ? 'ZII Admin Console' : 'Student Lifecycle'}
          </h2>
          
          <div className="space-y-1">
            {userRole === UserRole.ADMIN_CONSULTANT ? (
               adminModules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => {}} // Placeholder for admin navigation
                    className="w-full flex items-center space-x-3 px-3 py-3 lg:py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <mod.icon className="h-5 w-5 text-gray-400" />
                    <span>{mod.label}</span>
                  </button>
               ))
            ) : (
              <>
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(PublicView.FULL_DASHBOARD);
                      onClose();
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 lg:py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-50 mb-2"
                >
                  <div className="flex items-center space-x-3">
                    <LayoutDashboard className="h-5 w-5 text-gray-400" />
                    <span>Full Dashboard</span>
                  </div>
                </button>
                {studentSteps.map((step) => {
                  const locked = isStepLocked(step.phase);
                  return (
                    <button
                      key={step.phase}
                      disabled={locked}
                      onClick={() => {
                        if (!locked) {
                          onPhaseChange(step.phase);
                          onClose();
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 lg:py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPhase === step.phase
                          ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-700'
                          : locked ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <step.icon className={`h-5 w-5 ${currentPhase === step.phase ? 'text-emerald-700' : 'text-gray-400'}`} />
                        <span>{step.label}</span>
                      </div>
                      {locked && <Lock className="w-3 h-3 text-slate-300" />}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 mt-auto">
           <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h4 className="text-sm font-semibold text-orange-800 mb-1 flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" /> AI Support
              </h4>
              <p className="text-xs text-orange-600 mb-3 leading-relaxed">
                {userRole === UserRole.ADMIN_CONSULTANT ? 'System Analysis Active' : 'Contact your assigned ZII consultant.'}
              </p>
              <button className="w-full bg-orange-500 text-white text-xs py-2 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm">
                {userRole === UserRole.ADMIN_CONSULTANT ? 'View Logs' : 'Open Chat'}
              </button>
           </div>
        </div>
      </div>
    </>
  );
};

// Helper icon
const ClockIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default Sidebar;
