import React, { useEffect } from 'react';
import { Page } from '../../types';

interface HelpCenterProps {
  setPage: (page: Page) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ setPage }) => {
  useEffect(() => {
    document.title = "Help Center - Webai Auditor";
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: "How accurate is the AI audit?",
      a: "Our Gemini-powered engine is trained on thousands of high-performing websites. While it provides excellent heuristic analysis and code patterns, we always recommend a manual review for critical business logic."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, you can cancel your Premium subscription at any time from your account settings. You will retain access until the end of your billing period."
    },
    {
      q: "Do you store the audited data?",
      a: "We transiently process the URL to generate the report. We do not store the content of your website permanently, but we do save the generated report in your history for your convenience."
    },
    {
      q: "Why is my score different from Lighthouse?",
      a: "Lighthouse focuses heavily on performance metrics (Time to Interactive, LCP). Webai Auditor focuses on practical UX logic—UX feel, visual hierarchy, and code best practices that affect maintainability and user trust."
    }
  ];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => setPage(Page.HOME)}
        className="mb-8 flex items-center text-gray-500 hover:text-black transition-colors text-sm"
      >
        ← Back to Home
      </button>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-light text-gray-900 mb-6">How can we help?</h1>
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-colors"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div onClick={() => setPage(Page.CONTACT)} className="p-6 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
          <span className="text-2xl mb-3 block">👋</span>
          <h3 className="font-semibold text-gray-900 mb-1">Contact Support</h3>
          <p className="text-sm text-gray-500">Get in touch with our team.</p>
        </div>
        <div onClick={() => setPage(Page.API_DOCS)} className="p-6 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer">
          <span className="text-2xl mb-3 block">⚡</span>
          <h3 className="font-semibold text-gray-900 mb-1">API Documentation</h3>
          <p className="text-sm text-gray-500">Integration guides for devs.</p>
        </div>
      </div>

      <h2 className="text-2xl font-light text-gray-900 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqs.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{item.q}</h3>
            <p className="text-gray-600 font-light leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};