import { AuditResult, AuditResultLegacy } from "../types";

// API base URL - connect to local backend or Render backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') ||
                         import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
                         'http://localhost:8787';

console.log('API Base URL:', API_BASE_URL || 'using relative path');

/**
 * Scrape website with optional login or cookies
 * Returns structured JSON with all page data
 */
export const scrapeWebsite = async (url: string, credentials?: { username: string; password: string }, language?: string, cookies?: any[]): Promise<any> => {
  // Normalize URL
  const normalizedUrl = url.trim();
  if (!normalizedUrl) {
    throw new Error('URL is required');
  }

  // Add protocol if missing
  let fullUrl = normalizedUrl;
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    fullUrl = `https://${normalizedUrl}`;
  }

  console.log(`Starting scrape for: ${fullUrl}`);
  console.log(`Credentials: ${credentials ? 'Yes' : 'No'}`);

  // Try backend API first
  try {
    const apiUrl = `${API_BASE_URL}/api/agent/scrape`;

    console.log(`Calling API: ${apiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: fullUrl,
        credentials: credentials,
        cookies: cookies,
        screenshots: true,
        timeout: 60000
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response received');

    return data;
  } catch (error: any) {
    console.error('API call failed:', error);

    // If it's an abort error, it's a timeout
    if (error.name === 'AbortError') {
      throw new Error('Scraping took too long. Please try again.');
    }

    throw error;
  }
};

export const auditWebsite = async (url: string, credentials?: { username: string; password: string }, language?: string): Promise<AuditResult> => {
  // Normalize URL
  const normalizedUrl = url.trim();
  if (!normalizedUrl) {
    throw new Error('URL is required');
  }

  // Add protocol if missing
  let fullUrl = normalizedUrl;
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    fullUrl = `https://${normalizedUrl}`;
  }

  console.log(`Starting audit for: ${fullUrl}`);
  console.log(`Language: ${language || 'en'}`);

  // Try backend API first
  if (API_BASE_URL || !import.meta.env.PROD) {
    try {
      const apiUrl = API_BASE_URL
        ? `${API_BASE_URL}/api/audit`
        : '/api/audit';

      console.log(`Calling API: ${apiUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fullUrl, username: credentials?.username, password: credentials?.password, language: language || 'en' }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);

      // Check if response has new format fields
      if ('techStack' in data || 'pageAudits' in data || 'authTests' in data || 'screenshots' in data) {
        // New format - already fully typed
        return data as AuditResult;
      }

      // Legacy format - convert to new format
      return {
        ...data,
        techStack: {
          frameworks: [],
          libraries: [],
          analytics: [],
          cms: [],
          ecommerce: [],
          fonts: []
        },
        pages: [],
        pageAudits: [],
        interactiveTests: {
          buttons: { total: 0, clickable: 0, working: 0, broken: 0, details: [] },
          forms: { total: 0, working: 0, broken: 0, details: [] },
          links: { total: 0, working: 0, broken: 0, details: [] },
          navigation: { hasNav: false, menuItems: 0, mobileMenuWorks: false, details: [] },
          modals: { found: 0, closable: 0, details: [] }
        },
        authTests: {
          hasLogin: false,
          hasSignup: false,
          loginPageAccessible: false,
          signupPageAccessible: false,
          socialLoginAvailable: false,
          issues: [],
          details: (data as AuditResultLegacy).technical_analysis || []
        },
        screenshots: {},
        goodPoints: (data as AuditResultLegacy).highlights || []
      };
    } catch (error: any) {
      console.error('API call failed:', error);

      // If it's an abort error, it's a timeout
      if (error.name === 'AbortError') {
        throw new Error('Website took too long to respond. The audit is still running in the background. Please check back in a minute.');
      }

      // For network errors in production, show helpful message
      if (import.meta.env.PROD && error.message?.includes('fetch')) {
        throw new Error('Backend service is currently unavailable. Please try again later.');
      }

      throw error;
    }
  }

  // Fallback for production without backend (show demo mode)
  return {
    url: fullUrl,
    auditDate: new Date().toISOString(),
    techStack: {
      frameworks: [],
      libraries: [],
      analytics: [],
      cms: [],
      ecommerce: [],
      fonts: []
    },
    pages: [],
    pageAudits: [],
    interactiveTests: {
      buttons: { total: 0, clickable: 0, working: 0, broken: 0, details: [] },
      forms: { total: 0, working: 0, broken: 0, details: [] },
      links: { total: 0, working: 0, broken: 0, details: [] },
      navigation: { hasNav: false, menuItems: 0, mobileMenuWorks: false, details: [] },
      modals: { found: 0, closable: 0, details: [] }
    },
    authTests: {
      hasLogin: false,
      hasSignup: false,
      loginPageAccessible: false,
      signupPageAccessible: false,
      socialLoginAvailable: false,
      issues: [],
      details: []
    },
    issues: [{
      title: 'Demo Mode',
      description: 'Backend server is not connected. Start the backend server to get real AI-powered audits.',
      severity: 'medium',
      category: 'Functionality'
    }],
    warnings: [],
    goodPoints: ['Frontend is working', 'Ready to connect to backend'],
    rating: 3.5,
    advice: 'Start the backend server with `npm run dev:backend` and run the audit again.',
    screenshots: {},
    loadTime: 0
  };
};

// Health check for backend
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const apiUrl = API_BASE_URL
      ? `${API_BASE_URL}/api/health`
      : '/api/health';

    const response = await fetch(apiUrl);
    return response.ok;
  } catch {
    return false;
  }
};

// Submit feedback for an audit
export const submitFeedback = async (auditId: string, url: string, rating: number, feedback: string): Promise<{ success: boolean; message: string }> => {
  try {
    const apiUrl = API_BASE_URL
      ? `${API_BASE_URL}/api/feedback`
      : '/api/feedback';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditId, url, rating, feedback }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Feedback submission error:', error);
    throw error;
  }
};

// Get feedback for an audit
export const getAuditFeedback = async (auditId: string): Promise<{ feedbacks: any[]; total: number }> => {
  try {
    const apiUrl = API_BASE_URL
      ? `${API_BASE_URL}/api/feedback/${auditId}`
      : `/api/feedback/${auditId}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Get feedback error:', error);
    throw error;
  }
};
