import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Loader } from './components/Loader';
import { Results } from './components/Results';
import { LoginPage } from './components/pages/LoginPage';
import { Services } from './components/pages/Services';
import { Blogs } from './components/pages/Blogs';
import { BlogPost } from './components/pages/BlogPost';
import { AINews } from './components/pages/AINews';
import { HowItWorks } from './components/pages/HowItWorks';
import { Contact } from './components/pages/Contact';
import { Pricing } from './components/pages/Pricings';
import { ApiDocs } from './components/pages/ApiDocs';
import { HelpCenter } from './components/pages/HelpCenter';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfService } from './components/pages/TermsOfService';
import { CookiePolicy } from './components/pages/CookiePolicy';
import { AppState, Page } from './types';
import { scrapeWebsite, checkBackendHealth } from './services/geminiService';

const App: React.FC = () => {
  // Initialize page from URL hash
  const getPageFromHash = (): Page => {
    const hash = window.location.hash.slice(1); // Remove the #
    const pageKey = hash.toUpperCase().replace(/-/g, '_');
    return Object.values(Page).includes(pageKey as Page) ? (pageKey as Page) : Page.HOME;
  };

  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash());
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scrapingUrl, setScrapingUrl] = useState<string>('');
  const [backendAvailable, setBackendAvailable] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then(available => {
      setBackendAvailable(available);
    });
  }, []);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Function to set page and update URL hash
  const setPageWithHash = useCallback((page: Page) => {
    const pageName = page.toLowerCase().replace(/_/g, '-');
    window.location.hash = pageName;
    setCurrentPage(page);
  }, []);

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleScrape = useCallback(async (url: string, credentials?: { username: string; password: string }, cookies?: any[]) => {
    setAppState(AppState.LOADING);
    setPageWithHash(Page.HOME);
    setError(null);
    setScrapingUrl(url);
    setElapsedSeconds(0);

    try {
      const data = await scrapeWebsite(url, credentials, 'en', cookies);
      setResult(data);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong while scraping the site. Try again?");
      setAppState(AppState.ERROR);
    }
  }, [setPageWithHash]);

  useEffect(() => {
    if (appState !== AppState.LOADING) return;
    const id = window.setInterval(() => setElapsedSeconds((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [appState]);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
    setPageWithHash(Page.HOME);
    setScrapingUrl('');
  }, [setPageWithHash]);

  const renderContent = () => {
    switch (currentPage) {
      case Page.SERVICES: return <Services />;
      case Page.BLOGS: return <Blogs setPage={setPageWithHash} />;
      case Page.BLOG_POST: return <BlogPost setPage={setPageWithHash} />;
      case Page.AI_NEWS: return <AINews />;
      case Page.HOW_IT_WORKS: return <HowItWorks />;
      case Page.CONTACT: return <Contact />;
      case Page.PRICING: return <Pricing />;
      case Page.API_DOCS: return <ApiDocs setPage={setPageWithHash} />;
      case Page.HELP_CENTER: return <HelpCenter setPage={setPageWithHash} />;
      case Page.PRIVACY: return <PrivacyPolicy setPage={setPageWithHash} />;
      case Page.TERMS: return <TermsOfService setPage={setPageWithHash} />;
      case Page.COOKIES: return <CookiePolicy setPage={setPageWithHash} />;
      case Page.LOGIN: return <LoginPage />;
      case Page.HOME:
      default:
        if (appState === AppState.LOADING) {
          return (
            <div className="py-12">
              <Loader />
              <p className="text-center text-gray-500 mt-4">
                Scraping: {scrapingUrl} • Elapsed: {elapsedSeconds}s
              </p>
              {!backendAvailable && (
                <p className="text-center text-orange-500 text-sm mt-2">
                  ⚠️ Backend unavailable - showing demo results
                </p>
              )}
            </div>
          );
        }
        if (appState === AppState.RESULTS && result) {
          return <Results result={result} onReset={handleReset} />;
        }
        if (appState === AppState.ERROR) {
          return (
            <div className="text-center py-32 animate-fade-in">
              <div className="text-6xl mb-6">😔</div>
              <h2 className="text-2xl font-medium text-gray-900 mb-2">Scraping Failed</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          );
        }
        return <Home onScrape={handleScrape} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setPage={setPageWithHash}>
      {renderContent()}
    </Layout>
  );
};

export default App;
