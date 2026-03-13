import React, { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Smartphone, Lock, ShieldCheck, Download, Loader, AlertTriangle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  amount: number;
  currency: string;
  onSuccess: (transactionId: string) => void;
  studentName?: string;
  studentId?: string;
}

type PaymentMethod = 'airtel' | 'mtn' | 'zed' | 'card';

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, onClose, serviceName, amount, currency, onSuccess, studentName, studentId 
}) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMethod(null);
      setPhone('');
      setIsProcessing(false);
      setError('');
      setTransactionId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = () => {
    if (!method) {
      setError('Please select a payment method');
      return;
    }
    if ((method === 'airtel' || method === 'mtn' || method === 'zed') && !phone) {
      setError('Please enter your mobile money number');
      return;
    }

    setIsProcessing(true);
    setError('');

    // SIMULATE ZYNLE PAYMENT GATEWAY
    setTimeout(() => {
      // Demo Mode: 90% success rate
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const tid = `ZYN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        setTransactionId(tid);
        setStep(3);
        setIsProcessing(false);

        // Save to LocalStorage for Admin Dashboard Simulation
        const newTransaction = {
            id: tid,
            studentName: studentName || "Current User",
            studentId: studentId || "N/A",
            service: serviceName,
            amount: amount,
            currency: currency,
            status: "Success",
            date: new Date().toISOString().split('T')[0],
            method: method
        };
        
        try {
            const existing = JSON.parse(localStorage.getItem('zii_transactions') || '[]');
            localStorage.setItem('zii_transactions', JSON.stringify([newTransaction, ...existing]));
        } catch (e) {
            console.error("Failed to save transaction", e);
        }

        // Trigger success callback after a short delay to allow user to see success screen
        setTimeout(() => onSuccess(tid), 2000); 
      } else {
        setError('Transaction failed. Please try again or check your balance.');
        setIsProcessing(false);
      }
    }, 3000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Order Summary</h4>
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-slate-800">{serviceName}</span>
          <span className="font-bold text-slate-900">{currency} {amount?.toLocaleString() || '0'}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>Processing Fee</span>
          <span>{currency} 0.00</span>
        </div>
        <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center font-extrabold text-lg text-slate-900">
          <span>Total</span>
          <span>{currency} {amount?.toLocaleString() || '0'}</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-700 mb-3">Select Payment Method</h4>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => { setMethod('airtel'); setError(''); }}
            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${method === 'airtel' ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <div className="w-8 h-8 bg-red-600 rounded-full mb-2"></div>
            <span className="text-xs font-bold">Airtel Money</span>
          </button>
          <button 
            onClick={() => { setMethod('mtn'); setError(''); }}
            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${method === 'mtn' ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <div className="w-8 h-8 bg-yellow-400 rounded-full mb-2"></div>
            <span className="text-xs font-bold">MTN Money</span>
          </button>
          <button 
            onClick={() => { setMethod('zed'); setError(''); }}
            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${method === 'zed' ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <div className="w-8 h-8 bg-green-600 rounded-full mb-2"></div>
            <span className="text-xs font-bold">Zed Mobile</span>
          </button>
          <button 
            onClick={() => { setMethod('card'); setError(''); }}
            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <CreditCard className="w-8 h-8 text-blue-600 mb-2"/>
            <span className="text-xs font-bold">Card Payment</span>
          </button>
        </div>
      </div>

      {(method === 'airtel' || method === 'mtn' || method === 'zed') && (
        <div className="animate-fade-in">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 w-5 h-5 text-slate-400"/>
            <input 
              type="tel" 
              placeholder="097xxxxxxx" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">You will receive a prompt on your phone to approve the transaction.</p>
        </div>
      )}

      {method === 'card' && (
        <div className="animate-fade-in bg-slate-50 p-4 rounded-xl text-center text-slate-500 text-sm">
          <Lock className="w-6 h-6 mx-auto mb-2"/>
          Card payments are securely processed by Zynle. You will be redirected to a secure page.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2"/> {error}
        </div>
      )}

      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin"/> Processing...
          </>
        ) : (
          <>
            Pay {currency} {amount?.toLocaleString() || '0'}
          </>
        )}
      </button>

      <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400">
        <ShieldCheck className="w-3 h-3"/>
        <span>Secured by Zynle Technologies</span>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center py-8 animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
      <p className="text-slate-500 mb-6">Your transaction has been confirmed.</p>
      
      <div className="bg-slate-50 p-6 rounded-xl max-w-xs mx-auto mb-8 text-left border border-slate-200">
        <div className="mb-2 flex justify-between">
          <span className="text-xs text-slate-500">Transaction ID</span>
          <span className="text-xs font-mono font-bold text-slate-900">{transactionId}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="text-xs text-slate-500">Amount</span>
          <span className="text-xs font-bold text-slate-900">{currency} {amount?.toLocaleString() || '0'}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="text-xs text-slate-500">Service</span>
          <span className="text-xs font-bold text-slate-900">{serviceName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-slate-500">Date</span>
          <span className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => {
            const content = `RECEIPT\nTransaction ID: ${transactionId}\nService: ${serviceName}\nAmount: ${currency} ${amount}\nDate: ${new Date().toLocaleString()}\nStatus: Paid`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Receipt-${transactionId}.txt`;
            a.click();
          }}
          className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-200"
        >
          <Download className="w-4 h-4 mr-2"/> Download Receipt
        </button>
        <button 
          onClick={onClose}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center">
            <Lock className="w-4 h-4 mr-2 text-emerald-500"/> Secure Payment
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {step === 1 && renderStep1()}
          {step === 3 && renderStep3()}
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400">
                Payments on our platform are safe and secure and instant. Pay using mobile money (Airtel, MTN, Zed Mobile).
            </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
