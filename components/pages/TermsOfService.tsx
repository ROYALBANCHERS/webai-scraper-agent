import React, { useEffect } from 'react';
import { Page } from '../../types';

interface PageProps {
  setPage: (page: Page) => void;
}

export const TermsOfService: React.FC<PageProps> = ({ setPage }) => {
  useEffect(() => {
    document.title = "Terms of Service - Webai Auditor";
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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none text-gray-600 font-light leading-relaxed space-y-6">
        <p>
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Webai Auditor website (the "Service") operated by Webai Auditor Inc ("us", "we", or "our").
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">1. Conditions of Use</h3>
        <p>
          By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly. Webai Auditor only grants use and access of this website, its products, and its services to those who have accepted its terms.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">2. Intellectual Property</h3>
        <p>
          You agree that all materials, products, and services provided on this website are the property of Webai Auditor, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property. You also agree that you will not reproduce or redistribute the Webai Auditor’s intellectual property in any way, including electronic, digital, or new trademark registrations.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">3. User Accounts</h3>
        <p>
          As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information. You are also responsible for all activities that occur under your account or password.
        </p>
      </div>
    </div>
  );
};