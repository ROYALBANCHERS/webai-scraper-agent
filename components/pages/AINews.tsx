import React, { useEffect } from 'react';

export const AINews: React.FC = () => {
  useEffect(() => {
    document.title = "AI News - Future of Web";
  }, []);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <span className="text-purple-600 font-semibold tracking-wider uppercase text-xs">The Future is Here</span>
        <h1 className="text-4xl font-light text-gray-900 mt-2">AI in Web Development</h1>
      </div>

      <div className="space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-gray-100 pb-12">
          <div className="w-full md:w-1/3 bg-gray-200 h-64 rounded-xl"></div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Generative AI is changing how we code</h2>
            <p className="text-gray-600 font-light mb-4">
              Tools like Gemini and Github Copilot are not just completing lines of code; they are architecting entire solutions. 
              Find out how this impacts your job as a frontend developer.
            </p>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Trending</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-gray-100 pb-12">
          <div className="w-full md:w-1/3 bg-gray-200 h-64 rounded-xl"></div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Automated Accessibility Audits</h2>
            <p className="text-gray-600 font-light mb-4">
              New AI models can now navigate websites using screen readers virtually, identifying accessibility issues with 95% accuracy compared to human auditors.
            </p>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">New Tech</span>
          </div>
        </div>
      </div>
    </div>
  );
};