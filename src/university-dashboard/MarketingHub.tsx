
import React, { useState, useEffect } from 'react';
import { Megaphone, Target, TrendingUp, DollarSign, Star, Globe, Mail, MessageSquare, Phone, Calendar, CheckCircle } from 'lucide-react';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import PaymentModal from '../../components/PaymentModal';

const MONETIZATION_STREAMS = [
  { 
    id: 'placement_commission', 
    title: 'Student Placement Commission', 
    fee: 1000, 
    currency: 'USD',
    description: 'Track per enrolled student. Negotiable based on volume.',
    icon: Target,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  { 
    id: 'featured_listing', 
    title: 'Featured University Listing', 
    fee: 700, 
    currency: 'USD',
    description: 'Appear in the Top 10 placement on our search results.',
    icon: Star,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  { 
    id: 'career_fair_standard', 
    title: 'Education Career Fair (Standard)', 
    fee: 1650, 
    currency: 'USD',
    description: 'Standard booth at our annual education fair.',
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  { 
    id: 'homepage_featured', 
    title: 'Homepage Featured Placement', 
    fee: 5000, 
    currency: 'USD',
    description: 'Premium banner placement on the ZII homepage.',
    icon: Globe,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  { 
    id: 'sponsored_profile', 
    title: 'Sponsored University Profile', 
    fee: 5000, 
    currency: 'USD',
    description: 'Enhanced profile with video & scholarship info.',
    icon: Megaphone,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  { 
    id: 'email_campaign', 
    title: 'Email Campaign Broadcast', 
    fee: 250, 
    currency: 'USD',
    description: 'Send targeted emails to segmented student database.',
    icon: Mail,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  { 
    id: 'whatsapp_campaign', 
    title: 'WhatsApp Campaign Broadcast', 
    fee: 1600, 
    currency: 'USD',
    description: 'Direct WhatsApp broadcast to segmented database.',
    icon: MessageSquare,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  { 
    id: 'sms_campaign', 
    title: 'SMS Campaign Broadcast', 
    fee: 1650, 
    currency: 'USD',
    description: 'Bulk SMS campaign via Twilio/MessageBird.',
    icon: Phone,
    color: 'text-slate-600',
    bg: 'bg-slate-50'
  }
];

const MarketingHub: React.FC<{ universityProfile: any }> = ({ universityProfile }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<any>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'campaign_transactions'),
      where('universityId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handlePurchase = (stream: any) => {
    setSelectedStream(stream);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (tid: string) => {
    const user = auth.currentUser;
    if (!user || !selectedStream) return;

    try {
      await addDoc(collection(db, 'campaign_transactions'), {
        universityId: user.uid,
        streamType: selectedStream.id,
        streamTitle: selectedStream.title,
        amount: selectedStream.fee,
        currency: selectedStream.currency,
        status: 'completed',
        transactionId: tid,
        createdAt: serverTimestamp()
      });

      // Trigger notification
      await addDoc(collection(db, 'mail'), {
        to: ['zambiansinindia@gmail.com', 'maorderzambia@gmail.com'],
        message: {
          subject: `New Campaign Purchase - ${universityProfile?.universityName}`,
          text: `University ${universityProfile?.universityName} has purchased ${selectedStream.title}.`,
          html: `<p>University <b>${universityProfile?.universityName}</b> has purchased <b>${selectedStream.title}</b> for $${selectedStream.fee}.</p>`
        },
        createdAt: serverTimestamp()
      });

      // Track notification
      await addDoc(collection(db, 'analytics_notifications'), {
        universityId: user.uid,
        type: 'campaign_purchase',
        recipient: 'admin',
        status: 'sent',
        timestamp: serverTimestamp()
      });

      alert(`Purchase successful! Your ${selectedStream.title} is now active.`);
      setPaymentModalOpen(false);
    } catch (error) {
      console.error("Error recording transaction:", error);
    }
  };

  const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-extrabold mb-2">Marketing Hub</h2>
              <p className="text-orange-100">Boost your university's visibility and student recruitment.</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Megaphone className="w-8 h-8 text-white"/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs uppercase font-bold text-orange-200 mb-1">Total Ad Spend</p>
              <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs uppercase font-bold text-orange-200 mb-1">Active Campaigns</p>
              <p className="text-2xl font-bold">{transactions.filter(t => t.status === 'completed').length}</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs uppercase font-bold text-orange-200 mb-1">Est. Reach</p>
              <p className="text-2xl font-bold">1.2M+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monetization Streams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MONETIZATION_STREAMS.map((stream) => {
          const isPurchased = transactions.some(t => t.streamType === stream.id);
          return (
            <div key={stream.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl transition ${stream.bg} ${stream.color}`}>
                  <stream.icon className="w-6 h-6"/>
                </div>
                {isPurchased && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1"/> Active
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{stream.title}</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">{stream.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="text-xl font-black text-slate-900">
                  ${stream.fee.toLocaleString()}
                </div>
                <button 
                  onClick={() => handlePurchase(stream)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition ${
                    isPurchased 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                  }`}
                  disabled={isPurchased}
                >
                  {isPurchased ? 'Purchased' : 'Buy Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">Campaign History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{t.streamTitle}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{t.transactionId}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${t.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {t.createdAt?.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded-full">
                      {t.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No campaigns purchased yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal Integration */}
      {selectedStream && (
        <PaymentModal 
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          serviceName={selectedStream.title}
          amount={selectedStream.fee * 25} // Approx conversion for demo
          currency="ZMW"
          onSuccess={handlePaymentSuccess}
          studentName={universityProfile?.universityName || 'University'}
          studentId={universityProfile?.university_id || ''}
        />
      )}
    </div>
  );
};

export default MarketingHub;
