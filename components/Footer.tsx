import React, { useState } from 'react';
import { Page } from '../types';

interface FooterProps {
  setPage: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const [currentLang, setCurrentLang] = useState('English');

  const languages = ['English', 'EU', 'Chinese', 'Japanese'];

  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
               <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
               Webai Auditor
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Professional AI-powered website analysis. We identify missing code, UX failures, and help you build better web experiences.
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Twitter</a>
            </div>
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Language:</span>
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 bg-black hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><button onClick={() => setPage(Page.HOW_IT_WORKS)} className="text-gray-300 hover:text-white text-sm text-left">About Us</button></li>
              <li><button onClick={() => setPage(Page.SERVICES)} className="text-gray-300 hover:text-white text-sm text-left">Services</button></li>
              <li><button onClick={() => setPage(Page.PRICING)} className="text-gray-300 hover:text-white text-sm text-left">Pricing</button></li>
              <li><button onClick={() => setPage(Page.CONTACT)} className="text-gray-300 hover:text-white text-sm text-left">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><button onClick={() => setPage(Page.BLOGS)} className="text-gray-300 hover:text-white text-sm text-left">Blog</button></li>
              <li><button onClick={() => setPage(Page.AI_NEWS)} className="text-gray-300 hover:text-white text-sm text-left">AI News</button></li>
              <li><button onClick={() => setPage(Page.HELP_CENTER)} className="text-gray-300 hover:text-white text-sm text-left">Help Center</button></li>
              <li><button onClick={() => setPage(Page.API_DOCS)} className="text-gray-300 hover:text-white text-sm text-left">API Docs</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><button onClick={() => setPage(Page.PRIVACY)} className="text-gray-300 hover:text-white text-sm text-left">Privacy Policy</button></li>
              <li><button onClick={() => setPage(Page.TERMS)} className="text-gray-300 hover:text-white text-sm text-left">Terms of Service</button></li>
              <li><button onClick={() => setPage(Page.COOKIES)} className="text-gray-300 hover:text-white text-sm text-left">Cookie Policy</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Webai Auditor. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2 md:mt-0">
            Powered by Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
};