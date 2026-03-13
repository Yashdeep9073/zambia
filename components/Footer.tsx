
import React from 'react';
import { PublicView } from '../types';
import { Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Lock, Award, Mail, Phone, MapPin, Building } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: PublicView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
             <div className="bg-orange-500 p-2 rounded-full">
                <ShieldCheck className="h-6 w-6 text-white" />
             </div>
             <div>
                <span className="font-extrabold text-2xl tracking-tighter block leading-none">ZII</span>
                <span className="text-[10px] text-orange-400 uppercase tracking-widest block leading-none">Official Portal</span>
             </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Zambians In India is an independent education facilitation platform and is not affiliated with the Government of India or the Government of Zambia.
          </p>
          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 text-slate-400 hover:text-blue-500 cursor-pointer transition" />
            <Twitter className="w-5 h-5 text-slate-400 hover:text-blue-400 cursor-pointer transition" />
            <Instagram className="w-5 h-5 text-slate-400 hover:text-pink-500 cursor-pointer transition" />
            <Linkedin className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white border-b border-slate-800 pb-2 inline-block">Quick Links</h4>
          <ul className="space-y-3 text-sm text-slate-300 mb-8">
            <li><button onClick={() => onNavigate(PublicView.LEGAL_STATUS)} className="hover:text-orange-400 transition">Legal Status</button></li>
            <li><button onClick={() => onNavigate(PublicView.PARTNER_UNIVERSITIES)} className="hover:text-orange-400 transition">Partner Universities</button></li>
            <li><button onClick={() => onNavigate(PublicView.VISA_DISCLAIMER)} className="hover:text-orange-400 transition">Visa Disclaimer</button></li>
            <li><button onClick={() => onNavigate(PublicView.PRIVACY_POLICY)} className="hover:text-orange-400 transition">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate(PublicView.TERMS_CONDITIONS)} className="hover:text-orange-400 transition">Terms & Conditions</button></li>
            <li><button onClick={() => onNavigate(PublicView.STUDENT_CENTRE)} className="hover:text-orange-400 transition">Students Centre</button></li>
            <li><button onClick={() => onNavigate(PublicView.ABOUT)} className="hover:text-orange-400 transition">About ZII</button></li>
          </ul>

          <h4 className="font-bold text-lg mb-4 text-white border-b border-slate-800 pb-2 inline-block">Services & Opportunities</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><button onClick={() => onNavigate(PublicView.MEDICAL_HUB)} className="hover:text-orange-400 transition">Medical Treatment</button></li>
            <li><button onClick={() => onNavigate(PublicView.TOURISM_HUB)} className="hover:text-orange-400 transition">Tourism & Culture</button></li>
            <li><button onClick={() => onNavigate(PublicView.WORK_HUB)} className="hover:text-orange-400 transition">Jobs & Recruitment</button></li>
            <li><button onClick={() => onNavigate(PublicView.INVEST_HUB)} className="hover:text-orange-400 transition">Invest & Business</button></li>
            <li><button onClick={() => onNavigate(PublicView.IMPORT_HUB)} className="hover:text-orange-400 transition">Import & Shopping</button></li>
            <li><button onClick={() => onNavigate(PublicView.MONEY_HUB)} className="hover:text-orange-400 transition">Money Transfer</button></li>
            <li><button onClick={() => onNavigate(PublicView.RECRUITMENT_HUB)} className="hover:text-orange-400 transition">Recruitment</button></li>
            <li className="pt-2 border-t border-slate-800">
              <button onClick={() => onNavigate(PublicView.SCHOLARSHIP_EXAM)} className="hover:text-orange-400 transition flex items-center font-bold text-yellow-400">
                <Award className="w-4 h-4 mr-2" /> Full Scholarship Exam
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Registered Office */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white border-b border-slate-800 pb-2 inline-block">Registered Office</h4>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-start">
               <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
               <span>231 Kasangula Road, Roma<br/>Lusaka, Zambia</span>
            </li>
            <li className="flex items-center">
               <Phone className="w-5 h-5 text-orange-500 mr-3" />
               <span>+260 762 523 854</span>
            </li>
            <li className="flex items-center">
               <Mail className="w-5 h-5 text-orange-500 mr-3" />
               <span>info@zambiansinindia.com</span>
            </li>
          </ul>
          <div className="mt-6 pt-4 border-t border-slate-800">
             <p className="text-xs text-slate-500">
                <strong>Visa Processing:</strong> All visas must be processed via the Indian High Commission. We ensure students are prepared for visa submission.
             </p>
          </div>
        </div>

        {/* Security */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white border-b border-slate-800 pb-2 inline-block">Trust & Security</h4>
          <div className="bg-slate-800 p-4 rounded-xl space-y-4 border border-slate-700">
             <div className="flex items-center text-xs text-slate-200">
                <Lock className="w-4 h-4 mr-3 text-emerald-400" />
                <div>
                   <span className="block font-bold">SSL Secure</span>
                   <span className="text-slate-500">256-bit Encryption</span>
                </div>
             </div>
             <div className="flex items-center text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 mr-3 text-blue-400" />
                <div>
                   <span className="block font-bold">Data Protection</span>
                   <span className="text-slate-500">GDPR/ZDPA Compliant</span>
                </div>
             </div>
             <div className="flex items-center text-xs text-slate-200">
                <Award className="w-4 h-4 mr-3 text-orange-400" />
                <div>
                   <span className="block font-bold">Verified</span>
                   <span className="text-slate-500">Official Education Partner</span>
                </div>
             </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <p>© 2025 Zambians In India. All rights reserved.</p>
          <span className="hidden md:inline text-slate-700">|</span>
          <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full" title="Optimized for 2G/3G and offline use">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            <span className="font-bold tracking-wider text-[10px] uppercase">Rural Zambia Ready — Offline & Ultra-Fast Mode Enabled</span>
          </div>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
           <button onClick={() => onNavigate(PublicView.PRIVACY_POLICY)} className="hover:text-orange-400">Privacy Policy</button>
           <button onClick={() => onNavigate(PublicView.TERMS_CONDITIONS)} className="hover:text-orange-400">Terms of Service</button>
           <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
