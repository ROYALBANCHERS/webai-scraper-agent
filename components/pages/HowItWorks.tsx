import React, { useEffect } from 'react';
import { AdSpace } from '../AdSpace';

export const HowItWorks: React.FC = () => {
  useEffect(() => {
    document.title = "How It Works - Webai Auditor";
  }, []);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-light text-gray-900 mb-8 text-center">How It Works</h1>
      
      <div className="space-y-16 relative">
        {/* Connector Line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-100 hidden md:block"></div>

        <div className="relative pl-0 md:pl-24">
          <div className="hidden md:flex absolute left-4 w-8 h-8 bg-black text-white rounded-full items-center justify-center font-bold -translate-x-1/2">1</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Enter URL</h3>
          <p className="text-gray-600 font-light">
            You simply provide the website address you want to audit. We don't need access to your analytics or backend code.
          </p>
        </div>

        <div className="relative pl-0 md:pl-24">
          <div className="hidden md:flex absolute left-4 w-8 h-8 bg-black text-white rounded-full items-center justify-center font-bold -translate-x-1/2">2</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h3>
          <p className="text-gray-600 font-light">
            Our Gemini-powered AI simulates a user visit. It looks for visual bugs, checks for standard code compliance (HTML5, Meta tags), and identifies UX friction points.
          </p>
        </div>

        <div className="relative pl-0 md:pl-24">
           <div className="hidden md:flex absolute left-4 w-8 h-8 bg-black text-white rounded-full items-center justify-center font-bold -translate-x-1/2">3</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Report</h3>
          <p className="text-gray-600 font-light">
            We generate a clean, "clear and practical" report that tells you exactly what to fix. From broken buttons to missing SEO tags.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-black text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-light mb-4">Ready to improve your site?</h2>
        <p className="text-gray-400 mb-6">Join thousands of developers using Webai Auditor.</p>
        <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Audit Now
        </button>
      </div>

      <AdSpace />
    </div>
  );
};