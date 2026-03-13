import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { 
  MapPin, Calendar, Sun, Camera, ArrowRight, 
  CheckCircle, Star, Globe, Plane, Users, Music, Coffee,
  ShieldCheck
} from 'lucide-react';

interface TourismPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const TourismPage: React.FC<TourismPageProps> = ({ onNavigate, onLogin }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in-down">
               <span className="bg-orange-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-orange-500 flex items-center gap-2">
                  <Plane className="w-4 h-4" /> Tourism & Cultural Exchange
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
               Experience Incredible India. <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Beyond the Classroom.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
               Curated travel packages for students, families, and adventurers. <br/>
               <span className="text-orange-400 font-bold">Taj Mahal. Goa Beaches. Himalayan Treks.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={() => setShowWizard(true)} className="px-10 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-orange-500">
                  Plan Your Trip
               </button>
               <button onClick={() => onNavigate(PublicView.CONTACT)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                  Group Discounts
               </button>
            </div>
         </div>
      </div>

      {/* 2. POPULAR DESTINATIONS */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Trending Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "The Golden Triangle", img: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop", desc: "Delhi, Agra (Taj Mahal), Jaipur." },
                    { title: "Kerala Backwaters", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop", desc: "Houseboats, Ayurveda, Nature." },
                    { title: "Goa Beaches", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop", desc: "Sun, Sand, Seafood, Nightlife." }
                ].map((dest, i) => (
                    <div key={i} className="group relative rounded-2xl overflow-hidden shadow-lg h-80 cursor-pointer">
                        <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${dest.img})` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-1">{dest.title}</h3>
                            <p className="text-sm opacity-90">{dest.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 3. SERVICES GRID */}
      <div className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif font-bold text-slate-900">Travel Services</h2>
               <p className="text-slate-500 mt-4 text-lg">Everything you need for a hassle-free journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Visa Assistance", icon: Globe, desc: "Tourist & Business Visa guidance." },
                  { title: "Flight Bookings", icon: Plane, desc: "Exclusive student & group fares." },
                  { title: "Accommodation", icon: MapPin, desc: "Verified hotels, hostels & homestays." },
                  { title: "Local Transport", icon: MapPin, desc: "Airport transfers, cabs, train tickets." },
                  { title: "Guided Tours", icon: Camera, desc: "English-speaking guides for all sites." },
                  { title: "Travel Insurance", icon: ShieldCheck, desc: "Comprehensive medical & theft cover." }
               ].map((service, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
                     <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 transition">
                        <service.icon className="w-8 h-8 text-orange-600 group-hover:text-white transition"/>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                     <p className="text-slate-500 mb-6">{service.desc}</p>
                     <button className="text-orange-600 font-bold text-sm flex items-center hover:underline">
                        Book Now <ArrowRight className="w-4 h-4 ml-1"/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. UPCOMING GROUP TRIPS */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 text-center mb-16">Join Our Next Group Trip</h2>
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 md:w-1/2">
                    <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">December 2025</span>
                    <h2 className="text-3xl font-bold mb-4">The Winter Himalayan Expedition</h2>
                    <p className="text-slate-300 mb-6 text-lg">
                        10 Days. Manali, Shimla, Dharamshala. Snow, bonfires, and adventure. Open to all students and alumni.
                    </p>
                    <ul className="space-y-2 mb-8 text-sm text-slate-400">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-yellow-500 mr-2"/> All-inclusive (Food, Stay, Travel)</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-yellow-500 mr-2"/> Professional Photography</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-yellow-500 mr-2"/> ZII Guide Accompanied</li>
                    </ul>
                    <button onClick={() => setShowWizard(true)} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-lg">
                        Reserve Your Spot
                    </button>
                </div>
                <div className="relative z-10 md:w-1/2">
                    <img src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop" alt="Himalayas" className="rounded-2xl shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition duration-500"/>
                </div>
            </div>
         </div>
      </div>

      {/* 5. WHY TRAVEL WITH ZII */}
      <div className="py-24 bg-orange-50">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12">Why Travel With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               {[
                  { title: "Safety First", desc: "Verified hotels and transport partners only." },
                  { title: "Student Budget", desc: "Packages designed for student wallets." },
                  { title: "Cultural Immersion", desc: "Authentic experiences, not just sightseeing." }
               ].map((point, i) => (
                  <div key={i} className="p-6 bg-white rounded-xl border border-orange-100 shadow-sm">
                     <Star className="w-8 h-8 text-orange-500 mb-4"/>
                     <h3 className="font-bold text-slate-900 mb-2">{point.title}</h3>
                     <p className="text-slate-600 text-sm">{point.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* BOOKING WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
                <button onClick={() => setShowWizard(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Plan Your Trip</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
                            <select className="w-full p-3 border border-slate-300 rounded-xl">
                                <option>Golden Triangle</option>
                                <option>Goa</option>
                                <option>Kerala</option>
                                <option>Himalayas</option>
                                <option>Custom</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Travel Date</label>
                            <input type="date" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Number of Travelers</label>
                        <input type="number" className="w-full p-3 border border-slate-300 rounded-xl" min="1"/>
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Special Requests</label>
                         <textarea className="w-full p-3 border border-slate-300 rounded-xl" rows={3} placeholder="Dietary needs, accessibility, etc."></textarea>
                    </div>
                    <button type="button" className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition">
                        Get Quote
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default TourismPage;
