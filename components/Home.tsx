import React, { useState, useEffect } from 'react';
import { AppState } from '../types';

interface HomeProps {
  onScrape: (url: string, credentials?: { username: string; password: string }, cookies?: any[]) => void;
}

export const Home: React.FC<HomeProps> = ({ onScrape }) => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookies] = useState('');
  const [useAuth, setUseAuth] = useState(false);
  const [useCookies, setUseCookies] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    document.title = "WebAI Scraper - Intelligent Web Scraping Agent";
  }, []);

  // Basic URL validation
  useEffect(() => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const isValidDomain = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    setIsValid(url.length > 3 && (urlPattern.test(url) || isValidDomain.test(url)));
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let credentials = undefined;
      let parsedCookies = undefined;

      // Use credentials if provided
      if (useAuth && username && password) {
        credentials = { username, password };
      }

      // Parse cookies if provided
      if (useCookies && cookies.trim()) {
        try {
          // Try to parse as JSON array first
          parsedCookies = JSON.parse(cookies.trim());
        } catch {
          // If not JSON, try to parse as Netscape cookie format
          try {
            parsedCookies = parseNetscapeCookies(cookies.trim());
          } catch {
            // Invalid format, send as-is
            parsedCookies = cookies.trim();
          }
        }
      }

      onScrape(url.trim(), credentials, parsedCookies);
    }
  };

  // Parse Netscape cookie format
  const parseNetscapeCookies = (cookieString: string) => {
    const lines = cookieString.split('\n');
    const parsedCookies: any[] = [];

    for (const line of lines) {
      if (line.trim().startsWith('#') || !line.trim()) continue;

      const parts = line.split('\t');
      if (parts.length >= 7) {
        parsedCookies.push({
          name: parts[5],
          value: parts[6],
          domain: parts[0],
          path: parts[2],
          expiration: parts[4]
        });
      }
    }

    return parsedCookies;
  };

  const exampleSites = [
    { url: 'github.com', name: 'GitHub' },
    { url: 'twitter.com', name: 'Twitter' },
    { url: 'amazon.com', name: 'Amazon' },
    { url: 'linkedin.com', name: 'LinkedIn' },
    { url: 'reddit.com', name: 'Reddit' },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
          <span className="text-2xl">🕷️</span>
          <span className="text-purple-600 text-sm font-semibold uppercase tracking-wider">
            AI-Powered Web Scraper
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight">
          Scrape Any Website
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Like a Real User
          </span>
        </h1>

        <p className="text-xl text-gray-500 font-light max-w-2xl mb-10 leading-relaxed">
          AI agent navigates websites, finds login forms, enters credentials,
          and extracts all data in structured JSON format. No blocking — real browser automation.
        </p>

        {/* URL Input Form */}
        <div className="w-full max-w-2xl">
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-xl shadow-gray-100/50 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* URL Input */}
              <div className="flex items-center px-4 bg-gray-50 rounded-xl border border-gray-200">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9 9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg"
                  required
                />
              </div>

              {/* Auth Toggle */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAuth}
                      onChange={(e) => {
                        setUseAuth(e.target.checked);
                        if (e.target.checked) setUseCookies(false);
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 font-medium">Username/Password</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCookies}
                      onChange={(e) => {
                        setUseCookies(e.target.checked);
                        if (e.target.checked) setUseAuth(false);
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">🍪 Browser Cookies</span>
                  </label>
                </div>
                {(useAuth || useCookies) && (
                  <span className="text-sm text-purple-600">
                    {useAuth ? '🔐 Credentials needed' : '🍪 Paste cookies'}
                  </span>
                )}
              </div>

              {/* Credentials Input */}
              {useAuth && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Username / Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              )}

              {/* Cookies Input */}
              {useCookies && (
                <div className="animate-fade-in space-y-2">
                  <textarea
                    placeholder='Paste your browser cookies here in JSON format or Netscape format&#10;Example: [{"name": "c_user", "value": "123", "domain": ".facebook.com"}]'
                    value={cookies}
                    onChange={(e) => setCookies(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-colors text-sm font-mono min-h-[100px]"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      <strong>Tip:</strong> Use "EditThisCookie" extension to export cookies from your browser
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        // Example Facebook cookies format
                        setCookies(JSON.stringify([
                          { name: "c_user", value: "YOUR_ID", domain: ".facebook.com" },
                          { name: "xs", value: "YOUR_TOKEN", domain: ".facebook.com" }
                        ], null, 2));
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      See format example
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || (useAuth && (!username || !password)) || (useCookies && !cookies.trim())}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isValid && (!useAuth || (username && password)) && (!useCookies || cookies.trim())
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {useCookies ? '🍪 Use Cookies & Scrape' : useAuth ? '🔐 Login & Scrape' : '🕷️ Start Scraping'}
              </button>
            </form>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Returns structured JSON data • Screenshot included • No signup required
          </p>
        </div>

        {/* Example Sites */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-3">Try with an example:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleSites.map((site) => (
              <button
                key={site.url}
                onClick={() => setUrl(site.url)}
                className="px-4 py-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Scraping Features
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Everything you need to extract data from any website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🔐
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Auto Login</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically detects login forms and enters credentials to access protected content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Structured JSON</h3>
              <p className="text-gray-600 leading-relaxed">
                Returns clean, structured JSON with all page data: forms, links, images, tables, text, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                📸
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Screenshots</h3>
              <p className="text-gray-600 leading-relaxed">
                Captures automatic screenshots before and after login for verification and debugging.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Form Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Detects all forms, input fields, and buttons with their properties for easy extraction.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🔗
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Link Extraction</h3>
              <p className="text-gray-600 leading-relaxed">
                Extracts all links with their text, URLs, and attributes for navigation and analysis.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Table Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Extracts data from HTML tables with proper row and cell structure preservation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Output Example */}
      <div className="bg-gray-900 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Clean JSON Output
            </h2>
            <p className="text-xl text-gray-400 font-light">
              Get structured data ready for your applications
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 overflow-x-auto">
            <pre className="text-sm text-gray-300">
<code>{`{
  "success": true,
  "auth": {
    "detected": true,
    "attempted": true,
    "loginUrl": "https://example.com/login"
  },
  "data": {
    "url": "https://example.com/dashboard",
    "title": "Dashboard",
    "forms": [...],
    "links": [...],
    "images": [...],
    "tables": [...],
    "text": "..."
  },
  "screenshots": ["base64..."]
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { step: '1', icon: '🔗', title: 'Enter URL & Credentials', desc: 'Provide the website URL and optional login credentials.' },
              { step: '2', icon: '🤖', title: 'Agent Navigates', desc: 'AI opens the site in a real browser and detects login forms.' },
              { step: '3', icon: '🔐', title: 'Auto Login', desc: 'Agent fills credentials and logs in automatically.' },
              { step: '4', icon: '📋', title: 'Extract Data', desc: 'All page data is extracted and returned as structured JSON.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Scrape?
        </h2>
        <p className="text-xl text-gray-500 mb-8">
          Start extracting data from any website in seconds.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-all"
        >
          Start Scraping Now
        </button>
      </div>
    </div>
  );
};
