import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Lock, Unlock, ArrowRight, Bell, Users, 
  ExternalLink, Globe, MapPin, CheckCircle2, AlertCircle,
  Facebook, Instagram, Youtube, Linkedin, X
} from 'lucide-react';

interface WhatsAppGroup {
  id: number;
  name: string;
  link: string;
  number: string;
  isLocked?: boolean;
}

interface WhatsAppFunnelProps {
  title: string;
  groups?: WhatsAppGroup[];
  context?: string;
}

const DEFAULT_GROUPS: WhatsAppGroup[] = [
  { id: 1, name: "ZII Official Group 1", link: "https://chat.whatsapp.com/EdxWjp14zgK51vx9O9fMRk?mode=gi_t", number: "1024/1024", isLocked: false },
  { id: 2, name: "ZII Official Group 2", link: "https://chat.whatsapp.com/ECYz3m6HdP53DnuW5dOqqI?mode=gi_t", number: "985/1024", isLocked: false },
  { id: 3, name: "ZII Official Group 3", link: "https://chat.whatsapp.com/LHgVNYYUTQS7IWJvaTAWnj?mode=gi_t", number: "120/1024", isLocked: false }
];

const WhatsAppFunnel: React.FC<WhatsAppFunnelProps> = ({ title, groups = DEFAULT_GROUPS, context = 'default' }) => {
  const [clickCounts, setClickCounts] = useState<Record<number, number>>({});
  const [unlockedGroups, setUnlockedGroups] = useState<number[]>(groups.map(g => g.id));

  useEffect(() => {
    if (!groups) return;
    
    // Load click counts from localStorage
    const savedCounts = localStorage.getItem(`wa_funnel_clicks_${context}`);
    const allGroupIds = groups.map(g => g.id);
    if (savedCounts) {
      const parsed = JSON.parse(savedCounts);
      setClickCounts(parsed);
      setUnlockedGroups(allGroupIds);
    } else {
      // Initial state: some random progress for realism
      const initial: Record<number, number> = {
        1: 1024,
        2: 985,
        3: 120
      };
      setClickCounts(initial);
      localStorage.setItem(`wa_funnel_clicks_${context}`, JSON.stringify(initial));
      setUnlockedGroups(allGroupIds);
    }
  }, [context, groups]);

  const handleGroupClick = (group: WhatsAppGroup) => {
    if (!unlockedGroups.includes(group.id)) return;
    if (group.id === 1) {
      alert("Group 1 is currently full. Please join Group 2.");
      return;
    }

    const newCounts = { ...clickCounts, [group.id]: (clickCounts[group.id] || 0) + 1 };
    setClickCounts(newCounts);
    localStorage.setItem(`wa_funnel_clicks_${context}`, JSON.stringify(newCounts));

    // Check if next group should unlock
    const nextGroupIndex = (groups || []).findIndex(g => g.id === group.id) + 1;
    if (nextGroupIndex < (groups || []).length) {
      const nextGroup = (groups || [])[nextGroupIndex];
      if (newCounts[group.id] >= 1024 && !unlockedGroups.includes(nextGroup.id)) {
        setUnlockedGroups([...unlockedGroups, nextGroup.id]);
      }
    }

    window.open(group.link, '_blank');
  };

  return (
    <>
      <section className="relative py-24 overflow-hidden bg-slate-950">
        {/* AI Generated Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="/assets/images/landing/whatsapp-funnel-bg.png" 
            alt="Global Education Network" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920";
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
        </div>

        {/* Futuristic Overlay Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-widest uppercase mb-6">
                <MessageCircle className="w-4 h-4 mr-2" />
                Recruitment Funnel
              </span>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                {title}
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Join our official communication channels to receive real-time updates, 
                connect with fellow students, and get direct support from our team in India.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {(groups || []).map((group, index) => {
              const isUnlocked = unlockedGroups.includes(group.id);
              const isFirst = index === 0;
              const prevGroup = index > 0 ? (groups || [])[index - 1] : null;
              const progress = prevGroup ? Math.min(Math.round(((clickCounts[prevGroup.id] || 0) / 1024) * 100), 100) : 100;

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Glassmorphism Card */}
                  <div className={`
                    relative h-full p-8 rounded-3xl border transition-all duration-500
                    ${isUnlocked 
                      ? 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10 backdrop-blur-xl' 
                      : 'bg-slate-900/50 border-slate-800/50 grayscale'
                    }
                  `}>
                    {/* Blinking Indicators */}
                    {group.id === 2 && isUnlocked && (
                      <div className="absolute -top-3 -right-3 z-20">
                        <span className="relative flex h-6 w-6">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                            <AlertCircle className="w-4 h-4 text-white" />
                          </span>
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className={`
                          w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110
                          ${group.id === 1 ? 'bg-red-500/20 border border-red-500/30' : isUnlocked ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-800'}
                        `}>
                          {group.id === 1 ? (
                            <CheckCircle2 className="w-8 h-8 text-red-400" />
                          ) : isUnlocked ? (
                            <MessageCircle className="w-8 h-8 text-white" />
                          ) : (
                            <Lock className="w-8 h-8 text-slate-500" />
                          )}
                        </div>
                        <div className="text-right">
                          <span className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Group</span>
                          <span className="text-2xl font-black text-white">#{group.number}</span>
                        </div>
                      </div>

                      <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        {group.name}
                      </h3>

                      {group.id === 2 && isUnlocked && (
                        <div className="mb-4">
                          <span className="inline-flex items-center text-orange-400 text-xs font-bold animate-pulse bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-ping" />
                            ⚠ Group filling fast
                          </span>
                        </div>
                      )}

                      <div className="mt-auto space-y-3">
                        {isUnlocked ? (
                          <>
                            {group.id === 1 ? (
                              <button
                                disabled
                                className="w-full py-4 rounded-2xl bg-red-500/20 text-red-400 font-bold flex items-center justify-center border border-red-500/30 cursor-not-allowed"
                              >
                                <Lock className="w-5 h-5 mr-2" /> Group Full
                              </button>
                            ) : (
                              <button
                                onClick={() => handleGroupClick(group)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black transition-all duration-300 flex items-center justify-center group/btn shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
                              >
                                Join WhatsApp Group
                                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            )}
                            <a 
                              href="https://whatsapp.com/channel/0029Vb8BtpAJUM2fxPWINE40"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition-all duration-300 flex items-center justify-center group/channel"
                            >
                              <Bell className="w-4 h-4 mr-2 text-emerald-400 group-hover/channel:rotate-12 transition-transform" />
                              Follow Official Channel
                            </a>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                              <span className="flex items-center"><Lock className="w-3 h-3 mr-1" /> Locked</span>
                              <span>{progress}% Capacity</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${progress}%` }}
                                className="h-full bg-slate-600"
                              />
                            </div>
                            <p className="text-[10px] text-slate-600 text-center font-medium">
                              {prevGroup ? `${clickCounts[prevGroup.id] || 0} / 1024 students joined previous group to unlock` : 'Waiting for activation'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Channel & Support */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
            <a 
              href="https://whatsapp.com/channel/0029Vb8BtpAJUM2fxPWINE40" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all duration-300 group"
            >
              <Bell className="w-5 h-5 mr-3 text-emerald-400 group-hover:rotate-12 transition-transform" />
              Follow Official WhatsApp Channel
              <ExternalLink className="w-4 h-4 ml-3 opacity-50" />
            </a>
          </div>

          {/* Social Footer */}
          <div className="pt-16 border-t border-white/5">
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: 'Facebook', icon: Facebook, color: 'hover:text-blue-500' },
                { name: 'Instagram', icon: Instagram, color: 'hover:text-pink-500' },
                { name: 'TikTok', icon: MessageCircle, color: 'hover:text-white' },
                { name: 'YouTube', icon: Youtube, color: 'hover:text-red-500' },
                { name: 'LinkedIn', icon: Linkedin, color: 'hover:text-blue-400' },
                { name: 'X', icon: X, color: 'hover:text-slate-200' }
              ].map((social) => (
                <button 
                  key={social.name}
                  className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 ${social.color} hover:bg-white/10 hover:border-white/20 transition-all duration-300`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const WhatsAppSupportWidget: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-[100] group"
    >
      <a 
        href="https://wa.me/15557824998" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-emerald-500 text-slate-950 p-2 pr-6 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:scale-105 transition-transform duration-300 border-2 border-white/20"
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center relative">
          <MessageCircle className="w-6 h-6 text-emerald-500" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-tighter leading-none opacity-70">Support</span>
          <span className="text-sm font-black leading-none">24/7 WhatsApp</span>
        </div>
      </a>
    </motion.div>
  );
};

export default WhatsAppFunnel;

