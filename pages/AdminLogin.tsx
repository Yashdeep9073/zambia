import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import { Shield, Lock, AlertTriangle, ChevronRight, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: PublicView) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === '12345') {
        onLogin(UserRole.ADMIN_CONSULTANT);
      } else {
        setError('Incorrect username or password. Please try again.');
        setLoading(false);
      }
    }, 1000); // Simulate verification delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/40"></div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        
        {/* Left Side: Brand & Mission */}
        <div className="bg-emerald-900/90 backdrop-blur-md p-12 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-64 h-64" />
          </div>
          
          <div>
            <div className="flex items-center space-x-3 mb-8">
               <div className="bg-orange-500 p-2 rounded-lg shadow-lg">
                 <Shield className="w-8 h-8 text-white"/>
               </div>
               <div>
                 <h1 className="text-2xl font-extrabold tracking-tight">ZII ADMIN</h1>
                 <p className="text-[10px] text-orange-300 font-bold uppercase tracking-widest">Command Center</p>
               </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Enterprise Admissions Control
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed mb-8">
              Authorized access only. Monitor applications, manage scholarships, and oversee the entire student recruitment lifecycle from a single secured dashboard.
            </p>
          </div>

          <div className="space-y-4">
             <div className="flex items-center text-sm text-emerald-200">
               <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
               System Status: Operational
             </div>
             <div className="flex items-center text-sm text-emerald-200">
               <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
               Database Connection: Secure (256-bit SSL)
             </div>
             <p className="text-xs text-emerald-400 mt-8">© 2025 Zambians In India. Internal Use Only.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="bg-white p-12 flex flex-col justify-center relative">
          <button 
             onClick={() => onNavigate(PublicView.HOME)} 
             className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center"
          >
             Exit <ChevronRight className="w-4 h-4 ml-1"/>
          </button>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Super Admin Login</h3>
            <p className="text-slate-500">Please enter your master credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admin Username</label>
               <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-300"/>
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-slate-50 font-bold text-slate-700"
                    placeholder="Enter admin ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
               </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Secure Password</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-300"/>
                  <input 
                    type="password" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-slate-50 font-bold text-slate-700"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center font-bold">
                 <AlertTriangle className="w-4 h-4 mr-2"/> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg transform active:scale-95 flex items-center justify-center"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
               <p className="text-xs text-slate-400 font-bold uppercase mb-1">Demo Credentials</p>
               <p className="text-sm font-mono text-slate-600">Username: admin</p>
               <p className="text-sm font-mono text-slate-600">Password: 12345</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;