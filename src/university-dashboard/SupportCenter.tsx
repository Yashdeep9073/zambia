
import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Search, ExternalLink, Download } from 'lucide-react';

const FAQS = [
  {
    question: "How do I upload leads in bulk?",
    answer: "Go to the 'Leads Management' tab and use the CSV upload tool. Ensure your CSV has at least 'fullName' and 'email' columns. You can download a template from the upload area."
  },
  {
    question: "What are the monetization streams?",
    answer: "We offer several ways to boost your visibility: Featured Listings, Career Fairs, Email/WhatsApp campaigns, and Homepage placements. You can purchase these directly from the 'Marketing Hub'."
  },
  {
    question: "How are student applications processed?",
    answer: "Students apply through the ZII portal. Our counselors pre-screen them for academic and financial readiness. Once verified, they appear in your 'Applications' tab for your final review and offer issuance."
  },
  {
    question: "How do I book a booth for the Education Fair?",
    answer: "Navigate to the 'Exhibition' tab. You can choose from Silver, Gold, or Platinum packages. Clicking 'Book Now' will initiate the payment process."
  },
  {
    question: "Who can I contact for technical support?",
    answer: "You can reach our technical team at support@zambiansinindia.com or via the WhatsApp support link in your dashboard."
  }
];

const SupportCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold mb-2">Support & Help Center</h2>
            <p className="text-slate-400">Everything you need to know about the ZII University Partner Portal.</p>
          </div>
          <div className="flex space-x-4">
            <a href="mailto:support@zambiansinindia.com" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition backdrop-blur-sm border border-white/10 flex flex-col items-center w-32">
              <Mail className="w-6 h-6 mb-2 text-amber-400"/>
              <span className="text-xs font-bold uppercase">Email</span>
            </a>
            <a href="https://wa.me/260970000000" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition backdrop-blur-sm border border-white/10 flex flex-col items-center w-32">
              <MessageSquare className="w-6 h-6 mb-2 text-green-400"/>
              <span className="text-xs font-bold uppercase">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-xl flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-blue-600"/> Frequently Asked Questions
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                  type="text" 
                  placeholder="Search FAQs..." 
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-slate-700">{faq.question}</span>
                    {openIndex === index ? <ChevronUp className="w-5 h-5 text-slate-400"/> : <ChevronDown className="w-5 h-5 text-slate-400"/>}
                  </button>
                  {openIndex === index && (
                    <div className="p-5 bg-slate-50 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">
                  No FAQs found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resources & Contact */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Quick Resources</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition group">
                <span className="text-sm font-bold">Partner Handbook</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600"/>
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition group">
                <span className="text-sm font-bold">CSV Lead Template</span>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600"/>
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition group">
                <span className="text-sm font-bold">Marketing Guidelines</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600"/>
              </a>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 opacity-20">
              <Phone className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-bold mb-2">Need direct help?</h3>
            <p className="text-blue-100 text-sm mb-6">Our partner success managers are available Mon-Fri, 9am - 5pm CAT.</p>
            <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition">
              Request a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
