import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import WhatsAppFunnel from '../components/WhatsAppFunnel';
import { Search, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchResultsProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const mockResults = [
  { id: 1, title: 'B.Tech Computer Science', desc: 'Top-rated engineering program at SRM University with 100% placement assistance.', tag: 'Courses', iconUrl: 'https://img.icons8.com/3d-fluency/94/laptop.png', view: PublicView.APPLY_ONLINE },
  { id: 2, title: '100% Full Scholarship Exam', desc: 'Register for the national merit exam to win a full scholarship.', tag: 'Scholarships', iconUrl: 'https://img.icons8.com/3d-fluency/94/star.png', view: PublicView.SCHOLARSHIP_EXAM },
  { id: 3, title: 'Apollo Hospitals - Cardiology', desc: 'Advanced heart care and surgeries in India.', tag: 'Medical', iconUrl: 'https://img.icons8.com/3d-fluency/94/heart-with-pulse.png', view: PublicView.MEDICAL_HUB },
  { id: 4, title: 'Taj Mahal Tour Package', desc: 'Experience the beauty of India with our guided tours.', tag: 'Tourism', iconUrl: 'https://img.icons8.com/3d-fluency/94/globe.png', view: PublicView.TOURISM_HUB },
  { id: 5, title: 'Software Engineer - Remote', desc: 'Work remotely for top Indian tech companies.', tag: 'Jobs', iconUrl: 'https://img.icons8.com/3d-fluency/94/briefcase.png', view: PublicView.WORK_HUB },
  { id: 6, title: 'Tech Startup Investment', desc: 'Invest in high-growth Indian startups.', tag: 'Investment', iconUrl: 'https://img.icons8.com/3d-fluency/94/money-bag.png', view: PublicView.INVEST_HUB },
  { id: 7, title: 'Wholesale Electronics', desc: 'Import electronics directly from Indian manufacturers.', tag: 'Buy & Sell', iconUrl: 'https://img.icons8.com/3d-fluency/94/shopping-cart.png', view: PublicView.IMPORT_HUB },
];

const tabs = ['All', 'Courses', 'Scholarships', 'Medical', 'Tourism', 'Jobs', 'Investment', 'Buy & Sell'];

const SearchResults: React.FC<SearchResultsProps> = ({ onNavigate, onLogin }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('zii_search_query') || 'India';
  });

  const filteredResults = activeTab === 'All' 
    ? mockResults 
    : mockResults.filter(r => r.tag === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-20">
      {/* Hero Mini-Header */}
      <div className="bg-slate-900 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Search Results for: <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">"{searchQuery}"</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto mt-8"
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-lg transition-all"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-400 w-6 h-6" />
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)] border-transparent transform -translate-y-1' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-orange-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredResults.map((result, index) => {
            const isFirst = index === 0 && activeTab === 'All';
            
            if (isFirst) {
              return (
                <motion.div 
                  key={result.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-700 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 relative z-10 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <img src={result.iconUrl} alt={result.title} className="w-full h-full object-contain drop-shadow-2xl" />
                  </div>
                  
                  <div className="flex-1 relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
                      <Star className="w-3 h-3 mr-2 fill-current" /> Top Match
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">{result.title}</h3>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl">{result.desc}</p>
                    
                    <button 
                      onClick={() => onNavigate(result.view)}
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.6)] transition-all transform hover:-translate-y-1 text-lg group/btn"
                    >
                      Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div 
                key={result.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 transition-colors group-hover:bg-orange-50/50"></div>
                
                <div className="w-20 h-20 mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <img src={result.iconUrl} alt={result.title} className="w-full h-full object-contain drop-shadow-lg" />
                </div>
                
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                  {result.tag}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">{result.title}</h3>
                <p className="text-slate-500 mb-8 line-clamp-2">{result.desc}</p>
                
                <button 
                  onClick={() => onNavigate(result.view)}
                  className="w-full py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors flex items-center justify-center group/btn"
                >
                  View Details <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                </button>
              </motion.div>
            );
          })}
        </div>
        
        {filteredResults.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 opacity-50 grayscale">
              <img src="https://img.icons8.com/3d-fluency/94/search.png" alt="Search" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3">No results found</h3>
            <p className="text-slate-500 text-lg">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* WhatsApp Funnel Integration */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <WhatsAppFunnel 
          title="Join Our WhatsApp Group"
          context="Connect with over 6,500+ Zambians in India. Get real-time updates, scholarship alerts, and student support."
        />
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default SearchResults;
