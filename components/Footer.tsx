
import React from 'react';
import { PublicView } from '../types';
import { Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Lock, Award, Mail, Phone, MapPin } from 'lucide-react';

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
            The official bridge between Zambian students and Indian education. Trusted by government, parents, and over 6,500 students.
          </p>
          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 text-slate-400 hover:text-blue-500 cursor-pointer transition" />
            <Twitter className="w-5 h-5 text-slate-400 hover:text-blue-400 cursor-pointer transition" />
            <Instagram className="w-5 h-5 text-slate-400 hover:text-pink-500 cursor-pointer transition" />
            <Linkedin className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white border-b border-slate-800 pb-2 inline-block">Platform</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><button onClick={() => onNavigate(PublicView.HOME)} className="hover:text-orange-400 transition flex items-center">Home</button></li>
            <li><button onClick={() => onNavigate(PublicView.ABOUT)} className="hover:text-orange-400 transition">About Us</button></li>
            <li><button onClick={() => onNavigate(PublicView.COURSES)} className="hover:text-orange-400 transition">Courses & Programs</button></li>
            <li><button onClick={() => onNavigate(PublicView.STUDENT_CENTRE)} className="hover:text-orange-400 transition">Student Centre</button></li>
            <li><button onClick={() => onNavigate(PublicView.PORTAL_LOGIN)} className="hover:text-orange-400 transition">Portal Login</button></li>
            <li><button onClick={() => onNavigate(PublicView.CONTACT)} className="hover:text-orange-400 transition">Contact Support</button></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white border-b border-slate-800 pb-2 inline-block">Contact</h4>
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
               <span>admissions@zii.org.zm</span>
            </li>
          </ul>
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
        <p>© 2025 Zambians In India. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
           <span>Privacy Policy</span>
           <span>Terms of Service</span>
           <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
