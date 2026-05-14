/**
 * Python Bridge - Interface to Python scraping service
 *
 * Provides a fallback to Playwright if Python service is unavailable
 */

import axios from 'axios';

// Simple logger for python-bridge
const logger = {
  info: (message, ...args) => console.log(`[INFO] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[WARN] ${message}`, ...args),
  error: (message, ...args) => console.error(`[ERROR] ${message}`, ...args),
  debug: (message, ...args) => {
    if (process.env.DEBUG === 'true') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

// Python service URL (configurable via environment)
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// Request timeout
const TIMEOUT = parseInt(process.env.PYTHON_SERVICE_TIMEOUT || '60000');

/**
 * Create axios instance for Python service
 */
const pythonClient = axios.create({
  baseURL: PYTHON_SERVICE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Check if Python service is available
 */
async function isPythonServiceAvailable() {
  try {
    const response = await pythonClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    logger.warn('Python service unavailable:', error.message);
    return false;
  }
}

/**
 * Scrape URL using Python service
 */
async function scrape(options) {
  const {
    url,
    strategy = 'auto',
    schemaType = 'generic',
    selectors,
    proxy,
    cacheTtl = 3600,
    waitForSelector,
    screenshot = false,
    timeout = 30000
  } = options;

  try {
    const response = await pythonClient.post('/scrape', {
      url,
      strategy,
      schema_type: schemaType,
      selectors,
      proxy,
      cache_ttl: cacheTtl,
      wait_for_selector: waitForSelector,
      screenshot,
      timeout
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Python service error: ${error.response.data.error || error.message}`);
    }
    throw error;
  }
}

/**
 * Batch scrape multiple URLs
 */
async function scrapeBatch(urls, options = {}) {
  const {
    concurrency = 5,
    strategy = 'auto',
    schemaType = 'generic',
    proxy,
    cacheTtl = 3600
  } = options;

  try {
    const response = await pythonClient.post('/scrape/batch', {
      urls,
      concurrency,
      strategy,
      schema_type: schemaType,
      proxy,
      cache_ttl: cacheTtl
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Python service error: ${error.response.data.error || error.message}`);
    }
    throw error;
  }
}

/**
 * Get batch job status
 */
async function getJobStatus(jobId) {
  try {
    const response = await pythonClient.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Detect if URL requires authentication
 */
async function detectAuth(url, options = {}) {
  const { proxy } = options;

  try {
    const response = await pythonClient.post('/auth/detect', {
      url,
      proxy
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Auth detection error: ${error.response.data.error || error.message}`);
    }
    throw error;
  }
}

/**
 * Authenticate and scrape
 */
async function authAndScrape(options) {
  const {
    url,
    username,
    password,
    proxy,
    schemaType = 'generic',
    screenshot = false
  } = options;

  try {
    const response = await pythonClient.post('/auth/scrape', {
      url,
      username,
      password,
      proxy,
      schema_type: schemaType,
      screenshot
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Auth scrape error: ${error.response.data.error || error.message}`);
    }
    throw error;
  }
}

/**
 * Login to URL and return session info
 */
async function login(url, username, password, options = {}) {
  const { proxy } = options;

  try {
    const response = await pythonClient.post('/auth/login', {
      url,
      username,
      password,
      proxy
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Login error: ${error.response.data.error || error.message}`);
    }
    throw error;
  }
}

/**
 * Get available schemas
 */
async function getSchemas() {
  try {
    const response = await pythonClient.get('/schemas');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get service configuration
 */
async function getConfig() {
  try {
    const response = await pythonClient.get('/config');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get agent capabilities
 */
async function getCapabilities() {
  try {
    const response = await pythonClient.get('/capabilities');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fallback to Node.js Playwright if Python unavailable
 */
async function fallbackScrape(options) {
  logger.info('Using Node.js Playwright fallback');

  const { realUserAuditor } = require('./realUserAuditor');

  try {
    // Use existing auditor
    const result = await realUserAuditor.auditWebsite(options.url, {
      screenshots: options.screenshot || false,
      maxPages: 1
    });

    return {
      success: true,
      data: result,
      metadata: {
        url: options.url,
        strategy: 'nodejs-playwright-fallback',
        using_fallback: true
      },
      timing: {
        total_ms: result.auditTime || 0
      }
    };
  } catch (error) {
    logger.error('Playwright fallback failed:', error);
    return {
      success: false,
      error: error.message,
      metadata: {
        url: options.url,
        strategy: 'nodejs-playwright-fallback'
      }
    };
  }
}

/**
 * Main scrape function with automatic fallback
 */
async function scrapeWithFallback(options) {
  // Check if Python service is available
  const pythonAvailable = await isPythonServiceAvailable();

  if (pythonAvailable) {
    try {
      return await scrape(options);
    } catch (error) {
      logger.warn('Python service failed, using fallback:', error.message);
      return await fallbackScrape(options);
    }
  } else {
    return await fallbackScrape(options);
  }
}

// Create default export object with all functions
const pythonBridge = {
  isPythonServiceAvailable,
  scrape,
  scrapeBatch,
  getJobStatus,
  detectAuth,
  authAndScrape,
  login,
  getSchemas,
  getConfig,
  getCapabilities,
  scrapeWithFallback,
  fallbackScrape
};

export default pythonBridge;
