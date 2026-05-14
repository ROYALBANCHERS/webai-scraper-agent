import React, { useEffect } from 'react';
import { AdSpace } from '../AdSpace';

export const Pricing: React.FC = () => {
  useEffect(() => {
    document.title = "Pricing - Webai Auditor";
  }, []);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Choose the perfect plan for your website optimization needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Starter Plan - 15 Pages */}
        <div className="p-8 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Starter</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold tracking-tight text-gray-900">Free</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Perfect for personal websites and small projects.</p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Optimize <strong>15 pages</strong>
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Basic Error Detection
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              UI/UX Suggestions
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Standard Support
            </li>
          </ul>

          <button className="w-full py-3 px-4 border border-black text-black rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Get Started
          </button>
        </div>

        {/* Pro Plan - 70+ Pages */}
        <div className="relative p-8 border-2 border-blue-200 rounded-2xl bg-gradient-to-b from-blue-50 to-white shadow-lg">
          <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Best Value
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold tracking-tight text-gray-900">$3</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">For growing businesses and content creators.</p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Optimize <strong>70+ pages</strong>
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Advanced Error Detection & Fixing
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              All UI/UX Suggestions
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Performance Reports
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Priority Support
            </li>
          </ul>

          <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg">
            Get Pro Plan
          </button>
        </div>

        {/* Agency Plan - 150 Pages */}
        <div className="relative p-8 border border-purple-200 rounded-2xl bg-gradient-to-b from-purple-50 to-white shadow-xl shadow-purple-100/20">
          <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Premium
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Agency</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold tracking-tight text-gray-900">$9</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">For agencies, enterprises, and large websites.</p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Optimize <strong>150 pages</strong>
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Complete Error Detection & Auto-Fix
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              All Suggestions & Recommendations
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Deep Code Analysis
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Weekly Performance Reports
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              24/7 Priority Support
            </li>
            <li className="flex items-center text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              API Access
            </li>
          </ul>

          <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg">
            Get Agency Plan
          </button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-400 text-sm">Secure payment via Stripe. Cancel anytime.</p>
      </div>

      <AdSpace />
    </div>
  );
};
