import React, { useEffect, useState } from 'react';
import { AdSpace } from '../AdSpace';

export const Contact: React.FC = () => {
  useEffect(() => {
    document.title = "Contact Us - Webai Auditor";
  }, []);

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-500">
            Have questions about the Premium plan or need custom enterprise auditing? We are here to help.
          </p>
        </div>

        {formStatus === 'success' ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600">We'll get back to you within 24 hours.</p>
            <button 
              onClick={() => setFormStatus('idle')}
              className="mt-6 text-sm text-gray-500 underline hover:text-black"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="john@company.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="How can we help you today?"></textarea>
            </div>

            <button 
              type="submit" 
              disabled={formStatus === 'submitting'}
              className="w-full py-4 bg-black text-white rounded-xl font-medium text-lg hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>

      <div className="mt-20">
        <AdSpace />
      </div>
    </div>
  );
};