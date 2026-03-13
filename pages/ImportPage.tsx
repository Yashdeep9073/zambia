import React, { useState } from 'react';
import { PublicView, UserRole } from '../types';
import Footer from '../components/Footer';
import { 
  ShoppingBag, Truck, Package, ArrowRight, 
  CheckCircle, Star, Globe, Box, Search, ShieldCheck, DollarSign,
  FileText
} from 'lucide-react';

interface ImportPageProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const ImportPage: React.FC<ImportPageProps> = ({ onNavigate, onLogin }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 text-white min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
         
         <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 animate-fade-in-down">
               <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl border border-purple-500 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Import & Personal Shopping
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl">
               Shop Global Brands. <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Delivered to Zambia.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
               We buy and ship anything from India to your doorstep. <br/>
               <span className="text-purple-400 font-bold">Electronics. Fashion. Machinery. Spare Parts.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <button onClick={() => setShowWizard(true)} className="px-10 py-4 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-700 transition shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-purple-500">
                  Start an Order
               </button>
               <button onClick={() => onNavigate(PublicView.CONTACT)} className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-xl transform hover:scale-105 active:scale-95">
                  Track Shipment
               </button>
            </div>
         </div>
      </div>

      {/* 2. POPULAR CATEGORIES */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">What We Ship</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { title: "Electronics", icon: Globe, desc: "Laptops, Phones, Cameras." },
                    { title: "Fashion", icon: ShoppingBag, desc: "Clothing, Jewelry, Accessories." },
                    { title: "Auto Parts", icon: Truck, desc: "Genuine spares for all makes." },
                    { title: "Home Decor", icon: Box, desc: "Furniture, Textiles, Art." }
                ].map((cat, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-purple-500 hover:shadow-md transition cursor-pointer group text-center">
                        <cat.icon className="w-10 h-10 mx-auto mb-4 text-slate-400 group-hover:text-purple-600 transition"/>
                        <h3 className="font-bold text-slate-900 text-lg">{cat.title}</h3>
                        <p className="text-sm text-slate-500">{cat.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 3. SERVICES GRID */}
      <div className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-serif font-bold text-slate-900">Our Services</h2>
               <p className="text-slate-500 mt-4 text-lg">From sourcing to delivery, we handle it all.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Personal Shopping", icon: ShoppingBag, desc: "Tell us what you want, we buy it." },
                  { title: "Package Consolidation", icon: Box, desc: "Combine multiple orders to save shipping." },
                  { title: "Quality Check", icon: ShieldCheck, desc: "We inspect items before shipping." },
                  { title: "Customs Clearance", icon: FileText, desc: "Hassle-free import processing." },
                  { title: "Doorstep Delivery", icon: Truck, desc: "Reliable courier partners." },
                  { title: "Wholesale Sourcing", icon: Globe, desc: "Bulk buying for businesses." }
               ].map((service, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
                     <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 transition">
                        <service.icon className="w-8 h-8 text-purple-600 group-hover:text-white transition"/>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                     <p className="text-slate-500 mb-6">{service.desc}</p>
                     <button className="text-purple-600 font-bold text-sm flex items-center hover:underline">
                        Get Quote <ArrowRight className="w-4 h-4 ml-1"/>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. HOW IT WORKS */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 text-center mb-16">Simple 4-Step Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
               <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-100 -z-0"></div>
               {[
                  { step: 1, title: "Request", desc: "Send us a link or description." },
                  { step: 2, title: "Quote", desc: "Receive total cost including shipping." },
                  { step: 3, title: "Payment", desc: "Pay securely in Kwacha or USD." },
                  { step: 4, title: "Delivery", desc: "Receive your items in Zambia." }
               ].map((s, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-white border-4 border-purple-100 rounded-full flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-purple-600">
                        {s.step}
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                     <p className="text-slate-500 text-sm">{s.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 5. WHY SHOP WITH ZII */}
      <div className="py-24 bg-purple-50">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12">Why Use Our Service?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               {[
                  { title: "Authenticity Guaranteed", desc: "No fakes. We buy from official stores." },
                  { title: "Transparent Pricing", desc: "No hidden fees. What you see is what you pay." },
                  { title: "Fast Shipping", desc: "Air cargo weekly. Sea cargo monthly." }
               ].map((point, i) => (
                  <div key={i} className="p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                     <Star className="w-8 h-8 text-purple-500 mb-4"/>
                     <h3 className="font-bold text-slate-900 mb-2">{point.title}</h3>
                     <p className="text-slate-600 text-sm">{point.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* ORDER WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-fade-in-up">
                <button onClick={() => setShowWizard(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Start a Personal Shopping Order</h2>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">What do you want to buy?</label>
                        <textarea className="w-full p-3 border border-slate-300 rounded-xl" rows={3} placeholder="Describe the item or paste a link..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Value (USD)</label>
                        <input type="number" className="w-full p-3 border border-slate-300 rounded-xl" placeholder="100"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Upload Image (Optional)</label>
                        <input type="file" className="w-full p-3 border border-slate-300 rounded-xl"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                            <input type="text" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input type="tel" className="w-full p-3 border border-slate-300 rounded-xl"/>
                        </div>
                    </div>
                    <button type="button" className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition">
                        Get Free Quote
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
