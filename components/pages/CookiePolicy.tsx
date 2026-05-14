import React, { useEffect } from 'react';
import { Page } from '../../types';

interface PageProps {
  setPage: (page: Page) => void;
}

export const CookiePolicy: React.FC<PageProps> = ({ setPage }) => {
  useEffect(() => {
    document.title = "Cookie Policy - Webai Auditor";
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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      
      <div className="prose prose-gray max-w-none text-gray-600 font-light leading-relaxed space-y-6">
        <p>
          This Cookie Policy explains how Webai Auditor ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website at [Website URL]. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">What are cookies?</h3>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">Why do we use cookies?</h3>
        <p>
          We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
        </p>
        
        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">How can I control cookies?</h3>
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
        </p>
      </div>
    </div>
  );
};