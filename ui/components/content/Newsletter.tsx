import React, { useState } from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export type NewsletterProps = ComponentProps<{
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}>;

/**
 * Newsletter Component
 * 
 * A newsletter signup component with email input and submit button.
 * Features a modern design with gradient background and animations.
 * 
 * Features:
 * - Email validation
 * - Success/error states
 * - Responsive design
 * - Animated gradient background
 * - Privacy-focused messaging
 * 
 * Use Cases:
 * - Email capture
 * - Newsletter signups
 * - Travel deal alerts
 * - Content subscriptions
 */
export const Newsletter: React.FC<NewsletterProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className={`py-24 md:py-32 px-6 relative overflow-hidden ${className}`}>
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100" />
      
      <div className="max-w-5xl mx-auto relative">
        {/* Luxury Card */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="relative bg-white rounded-3xl p-12 md:p-16 shadow-2xl border border-slate-100">
            {/* Premium Icon */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl shadow-xl">
                <EnvelopeIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Premium Title */}
            <UniformText 
              parameterId="title" 
              placeholder="Add newsletter title" 
              as="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 text-center mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-serif, Georgia), serif' }}
            />
            
            {/* Refined Description */}
            <UniformText 
              parameterId="description" 
              placeholder="Add newsletter description" 
              as="p"
              className="text-xl text-slate-600 text-center mb-10 max-w-3xl mx-auto font-light leading-relaxed"
            />
            
            {/* Premium Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-7 py-4 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 shadow-sm hover:border-slate-300 font-light text-lg"
                    disabled={status === 'loading' || status === 'success'}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-semibold text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 disabled:hover:scale-100 active:scale-95"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subscribing
                    </span>
                  ) : status === 'success' ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Subscribed
                    </span>
                  ) : (
                    <span>
                      <UniformText parameterId="buttonText" placeholder="Join Now" as="span" />
                    </span>
                  )}
                </button>
              </div>
              
              {status === 'error' && (
                <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-center font-medium">
                    Please enter a valid email address
                  </p>
                </div>
              )}
              
              {status === 'success' && (
                <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
                  <p className="text-emerald-700 text-center font-medium">
                    Welcome aboard! Check your inbox for exclusive offers.
                  </p>
                </div>
              )}
            </form>
            
            {/* Premium Privacy note */}
            <div className="flex items-center justify-center gap-2 mt-8 text-slate-500 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-light">Your privacy is our priority • Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// UNIFORM REGISTRATION
registerUniformComponent({
  type: 'newsletter',
  component: Newsletter,
});

export default Newsletter;
