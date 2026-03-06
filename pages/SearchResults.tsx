import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { Search, BookOpen, Award, HeartPulse, Map, Briefcase, TrendingUp, ShoppingCart } from 'lucide-react';

interface SearchResultsProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const mockResults = [
  { id: 1, title: 'B.Tech Computer Science', desc: 'Top-rated engineering program at SRM University.', tag: 'Courses', icon: BookOpen },
  { id: 2, title: '100% Full Scholarship Exam', desc: 'Register for the national merit exam to win a full scholarship.', tag: 'Scholarships', icon: Award },
  { id: 3, title: 'Apollo Hospitals - Cardiology', desc: 'Advanced heart care and surgeries in India.', tag: 'Medical', icon: HeartPulse },
  { id: 4, title: 'Taj Mahal Tour Package', desc: 'Experience the beauty of India with our guided tours.', tag: 'Tourism', icon: Map },
  { id: 5, title: 'Software Engineer - Remote', desc: 'Work remotely for top Indian tech companies.', tag: 'Jobs', icon: Briefcase },
  { id: 6, title: 'Tech Startup Investment', desc: 'Invest in high-growth Indian startups.', tag: 'Investment', icon: TrendingUp },
  { id: 7, title: 'Wholesale Electronics', desc: 'Import electronics directly from Indian manufacturers.', tag: 'Buy & Sell', icon: ShoppingCart },
];

const tabs = ['All', 'Courses', 'Scholarships', 'Medical', 'Tourism', 'Jobs', 'Investment', 'Buy & Sell'];

const SearchResults: React.FC<SearchResultsProps> = ({ onNavigate, onLogin }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('India');

  const filteredResults = activeTab === 'All' 
    ? mockResults 
    : mockResults.filter(r => r.tag === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-20">
      {/* Hero Mini-Header */}
      <div className="bg-slate-900 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            Search Results for: <span className="text-orange-400">"{searchQuery}"</span>
          </h1>
          <div className="relative max-w-2xl mx-auto mt-8">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {filteredResults.map(result => (
            <div key={result.id} className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-6 shadow-inner border border-orange-200/50 group-hover:scale-110 transition-transform">
                <result.icon className="w-8 h-8 text-orange-500" />
              </div>
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full mb-4">
                {result.tag}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{result.title}</h3>
              <p className="text-slate-600 mb-6 line-clamp-2">{result.desc}</p>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-500 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
        
        {filteredResults.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default SearchResults;
