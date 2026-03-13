
import React, { useState } from 'react';
import { 
  ArrowLeft, X, Users, Lock, Heart, Building, GraduationCap, 
  Eye, EyeOff, AlertTriangle, LogIn, Loader 
} from 'lucide-react';
import { PublicView, UserRole } from '../../types';
import Footer from '../../components/Footer';

interface PortalLoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: PublicView) => void;
}

const PortalLoginPage: React.FC<PortalLoginPageProps> = ({ onLogin, onNavigate }) => {
  const [activePortal, setActivePortal] = useState<'STUDENT' | 'ADMIN' | 'PARENT' | 'UNIVERSITY'>('STUDENT');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      if (activePortal === 'STUDENT') {
        onLogin(UserRole.CURRENT_STUDENT);
      } else if (activePortal === 'ADMIN') {
        onLogin(UserRole.ADMIN_CONSULTANT);
      } else if (activePortal === 'PARENT') {
        onLogin(UserRole.PARENT);
      } else if (activePortal === 'UNIVERSITY') {
        onLogin(UserRole.PARTNER_UNIVERSITY);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(error.message || "Incorrect username or password. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Password reset link sent to ${forgotPasswordEmail}`);
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="absolute top-4 left-4 z-50">
        <button onClick={() => window.history.back()} className="p-2 bg-white/80 rounded-full shadow-sm hover:bg-white text-slate-600">
          <ArrowLeft className="w-6 h-6"/>
        </button>
      </div>
      <div className="absolute top-4 right-4 z-50 hidden md:block">
        <button onClick={() => onNavigate(PublicView.HOME)} className="p-2 bg-white/80 rounded-full shadow-sm hover:bg-white text-slate-600">
          <X className="w-6 h-6"/>
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-slate-700 uppercase tracking-widest mb-4">Choose the Portal for You</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100">
              {[
                { id: 'STUDENT', label: 'Student', icon: <Users/> },
                { id: 'ADMIN', label: 'Admin', icon: <Lock/> },
                { id: 'PARENT', label: 'Parent', icon: <Heart/> },
                { id: 'UNIVERSITY', label: 'Uni', icon: <Building/> }
              ].map((role: any) => (
                <button
                  key={role.id}
                  onClick={() => { setActivePortal(role.id); setLoginUsername(''); setLoginPassword(''); setLoginError(''); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                    activePortal === role.id 
                    ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 mb-1 ${activePortal === role.id ? 'text-white' : 'text-slate-400'}`}>{role.icon}</div>
                  <span className="text-[10px] font-bold uppercase">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-orange-500"></div>
            
            <button onClick={() => onNavigate(PublicView.HOME)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 md:hidden z-20">
              <X className="w-6 h-6"/>
            </button>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                {activePortal === 'STUDENT' && <GraduationCap className="h-8 w-8 text-emerald-600" />}
                {activePortal === 'ADMIN' && <Lock className="h-8 w-8 text-emerald-600" />}
                {activePortal === 'PARENT' && <Users className="h-8 w-8 text-emerald-600" />}
                {activePortal === 'UNIVERSITY' && <Building className="h-8 w-8 text-emerald-600" />}
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{activePortal === 'UNIVERSITY' ? 'University' : activePortal.charAt(0) + activePortal.slice(1).toLowerCase()} Login</h2>
              <p className="mt-2 text-sm text-slate-600">Secure access to your ZII dashboard.</p>
            </div>

            {!showForgotPassword ? (
              <form className="mt-8 space-y-6" onSubmit={handlePortalLogin}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Username / ZII Number</label>
                    <input
                      type="text"
                      required
                      className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-slate-50"
                      placeholder="Enter your ID"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-slate-50 pr-10"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-slate-900">
                      Remember Password
                    </label>
                  </div>
                  <div className="text-right">
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="block font-medium text-orange-600 hover:text-orange-500 mb-1">
                      Forgot Password?
                    </button>
                    <button type="button" onClick={() => alert("Please contact support to recover your ZII ID.")} className="block font-medium text-slate-400 hover:text-slate-600 text-xs">
                      Forgot ZII Number?
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 font-bold">{loginError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center">
                        <Loader className="h-5 w-5 mr-2 animate-spin" /> Verifying...
                      </span>
                    ) : (
                      <>
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <LogIn className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" aria-hidden="true" />
                        </span>
                        Sign In
                      </>
                    )}
                  </button>
                  {activePortal === 'STUDENT' && (
                    <button
                      type="button"
                      onClick={() => onNavigate(PublicView.APPLY_ONLINE)}
                      className="w-full flex justify-center py-3 px-4 border-2 border-slate-200 text-sm font-bold rounded-xl text-slate-600 bg-white hover:bg-slate-50 focus:outline-none transition active:scale-95"
                    >
                      Register
                    </button>
                  )}
                </div>
                
                <div className="text-[10px] text-slate-400 text-center leading-tight mt-4">
                  By continuing, the user fully authorizes the upload, storage, and use of submitted documents strictly for educational application, admission, and compliance purposes only.
                </div>
              </form>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Enter your Registered Email</label>
                  <input
                    type="email"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-slate-50"
                    placeholder="student@example.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none shadow-lg"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700"
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
          
          <div className="flex justify-center space-x-6 text-sm font-bold text-slate-500">
            <button onClick={() => onNavigate(PublicView.CONTACT)} className="hover:text-emerald-600">FAQ</button>
            <button onClick={() => onNavigate(PublicView.CONTACT)} className="hover:text-emerald-600">Contact Us</button>
          </div>

        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default PortalLoginPage;
