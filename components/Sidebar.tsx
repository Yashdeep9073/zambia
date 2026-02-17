import React from 'react';
import { AppPhase, UserRole } from '../types';
import { 
  CheckCircle, FileText, DollarSign, Plane, Home, GraduationCap, 
  Briefcase, Award, Book, Users, Shield, BarChart, Settings, Zap, 
  Activity, Globe, MessageSquare, Map, X
} from 'lucide-react';

interface SidebarProps {
  currentPhase: AppPhase;
  onPhaseChange: (phase: AppPhase) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPhase, onPhaseChange, userRole, isOpen, onClose }) => {
  const studentSteps = [
    { phase: AppPhase.MARKETING_LEAD, label: 'Start Here', icon: Book },
    { phase: AppPhase.APPLICATION_ENTRY, label: 'Application', icon: FileText },
    // AI Selection phase removed
    { phase: AppPhase.OFFER_MANAGEMENT, label: 'Offer Letter', icon: CheckCircle },
    { phase: AppPhase.PRE_DEPARTURE, label: 'Pre-Departure Guide', icon: Map },
    { phase: AppPhase.VISA_PROCESS, label: 'Visa Process', icon: Shield },
    { phase: AppPhase.TRAVEL_ARRIVAL, label: 'Travel', icon: Plane },
    { phase: AppPhase.SETTLEMENT, label: 'Virtual Campus', icon: Globe },
    { phase: AppPhase.COMMUNITY, label: 'Community', icon: Users },
    { phase: AppPhase.GRADUATION, label: 'Graduation', icon: GraduationCap },
    { phase: AppPhase.EMPLOYMENT, label: 'Career Hub', icon: Briefcase },
  ];

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
              studentSteps.map((step) => (
                <button
                  key={step.phase}
                  onClick={() => {
                    onPhaseChange(step.phase);
                    onClose(); // Close on mobile selection
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 lg:py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPhase === step.phase
                      ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <step.icon className={`h-5 w-5 ${currentPhase === step.phase ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <span>{step.label}</span>
                </button>
              ))
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

export default Sidebar;