// src/university-dashboard/UniversityProfilePanel.tsx
import React from 'react';
import { Building, Globe, Mail, Phone, MapPin, Award, ShieldCheck } from 'lucide-react';

interface UniversityProfilePanelProps {
  profile: any;
}

const UniversityProfilePanel: React.FC<UniversityProfilePanelProps> = ({ profile }) => {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
        <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No university data available yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 font-bold text-2xl">
            {profile.universityName?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.universityName}</h2>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Partner ID: {profile.university_id}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <Globe className="w-5 h-5 text-slate-400" />
            <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-amber-600 transition-colors">
              {profile.websiteUrl}
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-5 h-5 text-slate-400" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-5 h-5 text-slate-400" />
            <span>{profile.phone}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <Award className="w-5 h-5 text-slate-400" />
            <span>NAAC Grade: <span className="font-bold text-slate-900">{profile.naacGrade || 'N/A'}</span></span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <span>NIRF Ranking: <span className="font-bold text-slate-900">{profile.nirfRanking || 'N/A'}</span></span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <MapPin className="w-5 h-5 text-slate-400" />
            <span>Status: <span className="capitalize font-bold text-amber-600">{profile.status?.replace('_', ' ')}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfilePanel;

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);
