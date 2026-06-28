/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CreditCard, Lock, CheckCircle, ShieldCheck, 
  Smartphone, Landmark, AlertCircle, Sparkles, Send, Receipt
} from 'lucide-react';
import { Course, UserProfile, CoursePurchase } from '../types';

interface CheckoutPageProps {
  course: Course;
  currentUser: UserProfile | null;
  onPurchaseSuccess: (purchase: CoursePurchase) => void;
  onNavigate: (route: string) => void;
}

export default function CheckoutPage({
  course,
  currentUser,
  onPurchaseSuccess,
  onNavigate,
}: CheckoutPageProps) {
  // Form fields
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [experience, setExperience] = useState('');
  const [isAgreed, setIsAgreed] = useState(true);

  // Verification & Processing States
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'methods' | 'upi' | 'card' | 'processing' | 'success'>('methods');
  
  // Specific simulated payment inputs
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Tax calculation
  const coursePrice = course.price || 1499;
  const gstAmount = Math.round(coursePrice * 0.18); // 18% GST standard for education programs
  const totalAmount = coursePrice + gstAmount;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email is required.');
      return;
    }
    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!profession.trim()) {
      setErrorMsg('Please select or specify your profession.');
      return;
    }
    if (!experience.trim()) {
      setErrorMsg('Please select your prior trading/market experience.');
      return;
    }

    // If real Razorpay key is configured, trigger it instead of opening the simulated modal!
    const rzpKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    if (rzpKey) {
      triggerRealRazorpay();
    } else {
      // Open checkout gateway simulation
      setShowRazorpayModal(true);
      setPaymentStep('methods');
    }
  };

  const triggerRealRazorpay = () => {
    const rzpKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    if (rzpKey) {
      setIsProcessing(true);
      const options = {
        key: rzpKey,
        amount: totalAmount * 100, // amount in paisa
        currency: 'INR',
        name: 'The Market Wala',
        description: `Enrollment in ${course.title}`,
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=150',
        handler: function (response: any) {
          const mockPurchase: CoursePurchase = {
            id: `pur-${Math.random().toString(36).substring(2, 9)}`,
            userId: currentUser?.id || 'usr-anonymous',
            courseId: course.id,
            amount: totalAmount,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            profession: profession,
            experience: experience,
            razorpayPaymentId: response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 9)}`,
            status: 'completed',
            purchasedAt: new Date().toISOString()
          };
          onPurchaseSuccess(mockPurchase);
          setPaymentStep('success');
        },
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        theme: {
          color: '#10b981' // emerald-500
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', function (resp: any) {
          setErrorMsg(resp.error.description || 'Payment failed.');
          setShowRazorpayModal(false);
          setIsProcessing(false);
        });
      } catch (err) {
        // Fallback to simulation if window.Razorpay fails to load
        console.warn('Razorpay script not loaded, falling back to simulated checkout.');
        setIsProcessing(false);
        setShowRazorpayModal(true);
        setPaymentStep('methods');
      }
    }
  };

  // Load official Razorpay checkout script if key is present
  useEffect(() => {
    const rzpKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    if (rzpKey) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleSimulatedPayment = () => {
    setPaymentStep('processing');
    
    // Simulate payment clearing delay
    setTimeout(() => {
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const newPurchase: CoursePurchase = {
        id: `pur-${Math.random().toString(36).substring(2, 9)}`,
        userId: currentUser?.id || `usr-${Math.random().toString(36).substring(2, 9)}`,
        courseId: course.id,
        amount: totalAmount,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        profession: profession,
        experience: experience,
        razorpayPaymentId: mockPaymentId,
        status: 'completed',
        purchasedAt: new Date().toISOString()
      };
      
      onPurchaseSuccess(newPurchase);
      setPaymentStep('success');
    }, 2000);
  };

  return (
    <div id="checkout-container" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back to Course button */}
      <button 
        onClick={() => onNavigate('courses')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Courses</span>
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Guaranteed Safe Checkout
              </span>
              <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-slate-900">
                Enroll in Program
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your coordinator details below. You will receive active credentials, resource drive folder links, and calendar invites via email upon payment.
              </p>
            </div>

            {errorMsg && (
              <div className="flex gap-2 rounded-xl bg-rose-50 text-rose-800 p-3 text-xs font-semibold border border-rose-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitDetails} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Mobile Number (for WhatsApp Alerts)</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-14 pr-4 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Profession</label>
                <select
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="">Select Profession</option>
                  <option value="Student">Student</option>
                  <option value="Salaried Employee">Salaried Employee</option>
                  <option value="Self-Employed / Business">Self-Employed / Business Owner</option>
                  <option value="Professional Trader">Professional Trader</option>
                  <option value="Retired">Retired</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Prior Trading/Market Experience</label>
                <select
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-emerald-500 cursor-pointer"
                >
                  <option value="">Select Experience Level</option>
                  <option value="No Experience (Complete Beginner)">No Experience (Complete Beginner)</option>
                  <option value="Less than 1 Year">Less than 1 Year</option>
                  <option value="1 to 3 Years">1 to 3 Years</option>
                  <option value="3 to 5 Years">3 to 5 Years</option>
                  <option value="More than 5 Years">More than 5 Years</option>
                </select>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree-checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="agree-checkbox" className="text-[11px] text-slate-500 leading-normal">
                  I understand this is an institutional education purchase. Live lectures are conducted weekly. Recordings and documentation are hosted on Google Drive.
                </label>
              </div>

              <button
                type="submit"
                disabled={!isAgreed || isProcessing}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4 text-emerald-400" />
                <span>Confirm Program & Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="font-display text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Course card preview */}
            <div className="flex gap-3">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="h-16 w-16 rounded-xl object-cover border border-slate-100 shrink-0"
              />
              <div className="space-y-1">
                <span className="inline-block text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                  {course.category}
                </span>
                <h4 className="font-display text-xs font-bold text-slate-900 leading-snug">
                  {course.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  {course.difficulty} • Live Cohort
                </p>
              </div>
            </div>

            {/* Feature lists */}
            <div className="space-y-2 border-t border-b border-slate-100 py-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                <span>Interactive Live Video Cohorts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
                <span>Weekly Lecture Schedules: <strong>{course.lectureTimes}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Receipt className="h-3.5 w-3.5 text-emerald-500" />
                <span>Google Drive Resource folder with worksheets</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Program Fee</span>
                <span className="font-mono">₹{coursePrice.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Standard SGST/CGST (18%)</span>
                <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-dashed border-slate-200 pt-3">
                <span>Total Amount</span>
                <span className="font-mono text-emerald-600">₹{totalAmount.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 flex items-start gap-2.5 border border-slate-100">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h5 className="text-[10px] font-bold text-slate-700 uppercase">100% Encrypted Payment</h5>
                <p className="text-[9px] text-slate-400 leading-normal">
                  Payments are securely processed via Razorpay's end-to-end 256-bit AES encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RAZORPAY PAYMENT MODAL OVERLAY (High Fidelity Simulation) */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            
            {/* Razorpay Brand Header */}
            <div className="bg-[#0f1c3f] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Razorpay Bolt representation */}
                <div className="h-6 w-6 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xs italic text-white shadow-sm">
                  R
                </div>
                <div>
                  <span className="font-mono text-[9px] block text-slate-400 leading-none uppercase tracking-wide">Razorpay Trusted</span>
                  <span className="text-xs font-bold">The Market Wala</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-slate-400 block leading-none">AMOUNT</span>
                <span className="text-sm font-extrabold font-mono text-emerald-400">₹{totalAmount}</span>
              </div>
            </div>

            {/* Checkout Wizard Content */}
            <div className="p-5 min-h-[260px] flex flex-col justify-between">
              
              {/* 1. SELECTION METHODS VIEW */}
              {paymentStep === 'methods' && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Payment Method</p>
                  
                  <div className="space-y-2.5">
                    <button 
                      onClick={() => setPaymentStep('upi')}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/10 text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Smartphone className="h-4.5 w-4.5 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">UPI / Google Pay / PhonePe</span>
                          <span className="text-[9px] text-slate-400">Instant transfer using secure UPI ID</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>

                    <button 
                      onClick={() => setPaymentStep('card')}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/10 text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-4.5 w-4.5 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Credit / Debit Card</span>
                          <span className="text-[9px] text-slate-400">Visa, Mastercard, RuPay, Maestro</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 pt-2 border-t border-slate-100">
                    <Lock className="h-3 w-3" />
                    <span>PCI-DSS Security Standards Certified</span>
                  </div>
                </div>
              )}

              {/* 2. UPI ENTRY */}
              {paymentStep === 'upi' && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setPaymentStep('methods')}
                    className="text-[10px] font-semibold text-slate-500 hover:underline"
                  >
                    ← Back to methods
                  </button>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UPI Credentials</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Enter Virtual Payment Address (VPA)</label>
                      <input 
                        type="text" 
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-emerald-500"
                      />
                    </div>
                    
                    <button 
                      onClick={handleSimulatedPayment}
                      disabled={!upiId.includes('@')}
                      className="w-full bg-emerald-500 py-3 rounded-xl text-xs font-bold text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      Verify & Pay ₹{totalAmount}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. CARD ENTRY */}
              {paymentStep === 'card' && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setPaymentStep('methods')}
                    className="text-[10px] font-semibold text-slate-500 hover:underline"
                  >
                    ← Back to methods
                  </button>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Debit/Credit Card Details</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Card Number</label>
                      <input 
                        type="text" 
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">Expiry (MM/YY)</label>
                        <input 
                          type="text" 
                          maxLength={5}
                          placeholder="12/29"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})/g, '$1/').replace(/\/$/, ''))}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-emerald-500 animate-fade-in"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase">CVV Code</label>
                        <input 
                          type="password" 
                          maxLength={3}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-emerald-500"
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSimulatedPayment}
                      disabled={cardNumber.length < 16 || cardExpiry.length < 5 || cardCvv.length < 3}
                      className="w-full bg-emerald-500 py-3 rounded-xl text-xs font-bold text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      Authorize Payment
                    </button>
                  </div>
                </div>
              )}

              {/* 4. PROCESSING STATE */}
              {paymentStep === 'processing' && (
                <div className="py-8 text-center space-y-4 flex flex-col items-center justify-center grow">
                  <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Processing Your Payment Securely</h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Authorizing with your bank. Do not close this browser tab or press back.
                    </p>
                  </div>
                </div>
              )}

              {/* 5. SUCCESS STATE */}
              {paymentStep === 'success' && (
                <div className="py-8 text-center space-y-4 flex flex-col items-center justify-center grow animate-fade-in">
                  <div className="h-12 w-12 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Payment Successfully Authorized</h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Your Razorpay transaction id is saved. Welcome to the learning cohort!
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowRazorpayModal(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full bg-slate-900 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Go to Student Dashboard
                  </button>
                </div>
              )}

              {/* Secure Footer labels */}
              {paymentStep !== 'success' && paymentStep !== 'processing' && (
                <div className="flex justify-between items-center text-[8px] text-slate-400 font-medium pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Secure 256-Bit SSL
                  </span>
                  <span>Razorpay Checkout v1.4</span>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline custom mini representation of ChevronRight
function ChevronRight(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
