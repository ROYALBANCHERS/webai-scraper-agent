import React, { useEffect } from 'react';
import { AdSpace } from '../AdSpace';
import { Page } from '../../types';

interface ApiDocsProps {
  setPage: (page: Page) => void;
}

export const ApiDocs: React.FC<ApiDocsProps> = ({ setPage }) => {
  useEffect(() => {
    document.title = "API Documentation - Webai Auditor";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => setPage(Page.HOME)}
        className="mb-8 flex items-center text-gray-500 hover:text-black transition-colors text-sm"
      >
        ← Back to Home
      </button>

      <div className="border-b border-gray-100 pb-8 mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">API Documentation</h1>
        <p className="text-xl text-gray-500 font-light">
          Integrate Webai Auditor's powerful analysis engine directly into your CI/CD pipeline or custom applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block col-span-1 space-y-4 text-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
          <ul className="space-y-3 text-gray-500">
            <li className="text-blue-600 font-medium cursor-pointer">Introduction</li>
            <li className="hover:text-black cursor-pointer">Authentication</li>
            <li className="hover:text-black cursor-pointer">Rate Limits</li>
          </ul>
          <h3 className="font-semibold text-gray-900 mb-2 mt-6">Endpoints</h3>
          <ul className="space-y-3 text-gray-500">
            <li className="hover:text-black cursor-pointer">POST /audit</li>
            <li className="hover:text-black cursor-pointer">GET /audit/{'{id}'}</li>
            <li className="hover:text-black cursor-pointer">GET /history</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-3 space-y-16">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              The Webai Auditor API allows you to programmatically submit URLs for analysis and retrieve structured JSON reports containing UI/UX scores, code quality issues, and accessibility data. 
              This is the same engine that powers our web interface.
            </p>
            <div className="bg-gray-50 p-4 border-l-4 border-blue-600 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> API access requires a Premium subscription plan.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Authenticate your requests by including your API key in the header of your request. You can manage your API keys in your dashboard.
            </p>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <code className="text-green-400 font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Submit an Audit</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Endpoint to trigger a new analysis.
            </p>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold font-mono">POST</span>
                <span className="font-mono text-gray-600 text-sm">https://api.webaiauditor.com/v1/audit</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body</h4>
              <pre className="bg-white p-4 rounded border border-gray-100 text-sm font-mono text-gray-700 overflow-x-auto">
{`{
  "url": "https://example.com",
  "device": "mobile",
  "check_accessibility": true
}`}
              </pre>
            </div>
          </section>

          <AdSpace />
        </div>
      </div>
    </div>
  );
};