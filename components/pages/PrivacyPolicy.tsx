import React, { useEffect } from 'react';
import { Page } from '../../types';

interface PageProps {
  setPage: (page: Page) => void;
}

export const PrivacyPolicy: React.FC<PageProps> = ({ setPage }) => {
  useEffect(() => {
    document.title = "Privacy Policy - Webai Auditor";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <button 
        onClick={() => setPage(Page.HOME)}
        className="mb-8 flex items-center text-gray-500 hover:text-black transition-colors text-sm"
      >
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none text-gray-600 font-light leading-relaxed space-y-6">
        <p>Last updated: October 2023</p>
        <p>
          At Webai Auditor, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">1. Information We Collect</h3>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number that you voluntarily give to us when you register.</li>
          <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">2. Use of Your Information</h3>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Create and manage your account.</li>
          <li>Email you regarding your account or order.</li>
          <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">3. Disclosure of Your Information</h3>
        <p>
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        <p>
          <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
        </p>
      </div>
    </div>
  );
};