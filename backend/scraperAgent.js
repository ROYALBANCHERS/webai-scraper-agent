/**
 * WebAI Scraper Agent
 * A real browser agent that:
 * 1. Navigates to website
 * 2. Detects login/auth forms
 * 3. Enters credentials
 * 4. Logs in
 * 5. Scrapes all data
 * 6. Returns structured JSON
 */

import { chromium } from 'playwright';
import { createRequire } from 'module';

// Create require for ES modules
const require = createRequire(import.meta.url);

// Simple logger
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

// Regex patterns for detecting login forms
const LOGIN_PATTERNS = {
  username: /user|login|email|sign|account|identity/i,
  password: /pass|pwd|secret/i,
  submit: /login|sign|submit|enter|log.?in|go/i,
  loginUrl: /login|signin|auth|account|sign.?in/i
};

class ScraperAgent {
  constructor(options = {}) {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.screenshots = [];
    this.data = {};
    this.headless = options.headless !== false;
    this.timeout = options.timeout || 60000;
    this.cookies = options.cookies || null; // Store cookies for session reuse
    this.useExistingSession = options.useExistingSession || false;
    this.userDataDir = options.userDataDir || './browser-session'; // Persistent session directory
    this.sessionId = options.sessionId || 'default'; // Session ID for different users
  }

  /**
   * Get session file path
   */
  getSessionPath() {
    const path = require('path');
    const fs = require('fs');
    const sessionDir = path.join(this.userDataDir, this.sessionId);
    const sessionFile = path.join(sessionDir, 'storage-state.json');

    // Ensure directory exists
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    return sessionFile;
  }

  /**
   * Normalize cookies - ensure all required fields are present
   */
  normalizeCookies(cookies, url) {
    if (!Array.isArray(cookies)) {
      return [];
    }

    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    return cookies.map(cookie => {
      // If cookie already has all required fields, return as-is
      if (cookie.domain || cookie.url) {
        return cookie;
      }

      // Add missing fields
      return {
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain || domain,
        path: cookie.path || '/',
        url: cookie.url || url,
        httpOnly: cookie.httpOnly || false,
        secure: cookie.secure || true,
        sameSite: cookie.sameSite || 'Lax'
      };
    });
  }

  /**
   * Save session cookies to file
   */
  async saveSession() {
    try {
      const sessionPath = this.getSessionPath();
      const fs = require('fs');

      // Save storage state (cookies, localStorage, etc.)
      await this.context.storageState({ path: sessionPath });
      logger.info(`Session saved to: ${sessionPath}`);
    } catch (error) {
      logger.error(`Failed to save session: ${error.message}`);
    }
  }

  /**
   * Load session cookies from file
   */
  async loadSession() {
    const fs = require('fs');
    const sessionPath = this.getSessionPath();

    if (fs.existsSync(sessionPath)) {
      logger.info(`Found existing session: ${sessionPath}`);
      return sessionPath;
    }

    logger.info('No existing session found');
    return null;
  }

  /**
   * Initialize browser with persistent session
   */
  async init(url = null) {
    logger.info('Initializing Scraper Agent browser...');

    // Try to load existing session
    const existingSession = await this.loadSession();

    const launchOptions = {
      headless: this.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    // Launch browser
    this.browser = await chromium.launch(launchOptions);

    let contextOptions = {
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    // If existing session found, load it
    if (existingSession) {
      logger.info(`Loading existing session from: ${existingSession}`);
      contextOptions['storageState'] = existingSession;
    }
    // If cookies provided directly, normalize and use them
    else if (this.cookies && Array.isArray(this.cookies) && url) {
      const normalizedCookies = this.normalizeCookies(this.cookies, url);
      logger.info(`Loading ${normalizedCookies.length} normalized cookies for session reuse`);
      contextOptions['storageState'] = {
        cookies: normalizedCookies,
        origins: []
      };
    }

    this.context = await this.browser.newContext(contextOptions);

    // Add cookies after context creation if provided directly (not from file)
    if (this.cookies && Array.isArray(this.cookies) && !existingSession && url) {
      const normalizedCookies = this.normalizeCookies(this.cookies, url);
      await this.context.addCookies(normalizedCookies);
      logger.info('Normalized cookies added to browser context');
    }

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.timeout);

    // Flag to track if session was saved
    this._sessionSaved = false;

    logger.info('Browser initialized successfully');
    return existingSession !== null; // Return true if existing session was loaded
  }

  /**
   * Set cookies for session reuse
   */
  async setCookies(cookies) {
    this.cookies = cookies;
    if (this.context) {
      await this.context.addCookies(cookies);
      logger.info(`Added ${cookies.length} cookies to existing context`);
    }
  }

  /**
   * Get cookies from current session
   */
  async getCookies() {
    if (this.context) {
      return await this.context.cookies();
    }
    return [];
  }

  /**
   * Navigate to URL with redirect handling
   */
  async navigate(url) {
    const formattedUrl = this.formatUrl(url);
    logger.info(`Navigating to: ${formattedUrl}`);

    try {
      // Go to URL - Playwright handles redirects automatically
      // Use faster wait strategy with fallback
      const response = await this.page.goto(formattedUrl, {
        waitUntil: 'domcontentloaded',  // Faster than networkidle
        timeout: this.timeout
      }).catch(async (error) => {
        // If domcontentloaded fails, try with commit (page is loaded but might still be fetching resources)
        if (error.message.includes('Timeout')) {
          logger.info('domcontentloaded timeout, trying with commit...');
          return await this.page.goto(formattedUrl, {
            waitUntil: 'commit',
            timeout: 30000
          });
        }
        throw error;
      });

      // Log redirects if any
      const finalUrl = this.page.url();
      if (finalUrl !== formattedUrl) {
        logger.info(`Redirected to: ${finalUrl}`);
      }

      // Wait for page to stabilize
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {
        logger.info('Page loaded but still fetching resources - continuing anyway...');
      });

      // Get redirect chain from response
      if (response && response.request().redirectedFrom()) {
        const chain = [];
        let req = response.request().redirectedFrom();
        while (req) {
          chain.push(req.url());
          const redirect = req.redirectedFrom();
          if (!redirect) break;
          req = redirect;
        }
        if (chain.length > 0) {
          logger.info(`Redirect chain: ${chain.reverse().join(' -> ')}`);
        }
      }

      // Wait a bit for dynamic content
      await this.page.waitForTimeout(2000);

      logger.info(`Navigation successful. Final URL: ${this.page.url()}`);
      return true;
    } catch (error) {
      logger.error(`Navigation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Format URL (add https:// if needed)
   */
  formatUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  /**
   * Detect login form on page
   */
  async detectLoginForm() {
    logger.info('Detecting login form...');

    const authInfo = {
      hasLoginForm: false,
      loginUrl: this.page.url(),
      fields: {
        username: null,
        password: null,
        submit: null
      },
      socialLogins: [],
      registrationLink: null
    };

    // Check for password input fields
    const passwordInputs = await this.page.$$('[type="password"]');

    if (passwordInputs.length > 0) {
      authInfo.hasLoginForm = true;

      // Find username/email inputs - order matters for Facebook
      const usernameSelectors = [
        'input[type="email"]', // Facebook uses this
        'input[type="text"][name*="email" i]',
        'input[type="text"][id*="email" i]',
        'input[type="text"][placeholder*="email" i]',
        'input[type="text"][name*="user" i]',
        'input[type="text"][id*="user" i]',
        'input[type="text"][placeholder*="user" i]',
        'input[name*="login" i]'
      ];

      for (const selector of usernameSelectors) {
        const element = await this.page.$(selector);
        if (element) {
          const isVisible = await element.isVisible().catch(() => false);
          if (isVisible) {
            authInfo.fields.username = selector;
            break;
          }
        }
      }

      // Password field
      authInfo.fields.password = 'input[type="password"]';

      // 🎯 Submit button - use page evaluation to find ALL possible login buttons
      // This is more reliable than selector-based detection
      try {
        const submitButtonInfo = await this.page.evaluate(() => {
          // Text patterns that indicate login/submit buttons
          const loginTexts = ['log in', 'login', 'sign in', 'signin', 'continue', 'submit', 'enter', 'go'];

          // Find all clickable elements
          const clickables = Array.from(document.querySelectorAll(`
            button, [role="button"], input[type="submit"],
            input[type="button"], a[href*="login"], label[for]
          `));

          for (const el of clickables) {
            const text = (el.textContent || el.value || el.getAttribute('aria-label') || '').trim().toLowerCase();
            const id = (el.id || '').toLowerCase();
            const className = (el.className || '').toLowerCase();
            const name = (el.name || '').toLowerCase();

            // Check if this is a login button
            const isLoginButton = loginTexts.some(pattern =>
              text.includes(pattern) ||
              id.includes('login') ||
              id.includes('signin') ||
              id.includes('submit') ||
              name.includes('login') ||
              name.includes('signin') ||
              className.includes('login') ||
              className.includes('signin') ||
              className.includes('submit')
            );

            if (isLoginButton) {
              // Check if element is visible
              const style = window.getComputedStyle(el);
              const isVisible = style.display !== 'none' &&
                               style.visibility !== 'hidden' &&
                               style.opacity !== '0' &&
                               el.offsetParent !== null;

              if (isVisible) {
                // Generate a unique selector for this element
                let selector = el.tagName.toLowerCase();

                if (el.id) {
                  selector += `#${el.id}`;
                } else if (el.className) {
                  const classes = el.className.split(' ').filter(c => c).slice(0, 2);
                  if (classes.length > 0) {
                    selector += '.' + classes.join('.');
                  }
                } else if (el.type) {
                  selector += `[type="${el.type}"]`;
                }

                return {
                  selector: selector,
                  text: el.textContent?.trim().substring(0, 30) || '',
                  isVisible: true
                };
              }
            }
          }

          // Fallback: return input[type="submit"] if exists
          const submitInput = document.querySelector('input[type="submit"]');
          if (submitInput) {
            return {
              selector: 'input[type="submit"]',
              text: submitInput.value || 'Submit',
              isVisible: true
            };
          }

          return null;
        });

        if (submitButtonInfo && submitButtonInfo.isVisible) {
          authInfo.fields.submit = submitButtonInfo.selector;
          logger.info(`Found submit button: ${submitButtonInfo.text} (${submitButtonInfo.selector})`);
        }
      } catch (e) {
        logger.info(`Submit button detection failed: ${e.message.substring(0, 50)}`);
      }

      // Check for social login buttons
      const socialPatterns = [
        { name: 'Google', patterns: ['google', 'g-logo'] },
        { name: 'Facebook', patterns: ['facebook', 'fb-logo'] },
        { name: 'Apple', patterns: ['apple', 'sign-in-with-apple'] },
        { name: 'Microsoft', patterns: ['microsoft', 'windows'] }
      ];

      for (const social of socialPatterns) {
        const buttons = await this.page.$$(`button:visible, a:visible`);
        for (const button of buttons) {
          const text = await button.textContent();
          const className = await button.getAttribute('class') || '';
          const combined = (text || ' ' + className).toLowerCase();

          if (social.patterns.some(p => combined.includes(p))) {
            authInfo.socialLogins.push(social.name);
            break;
          }
        }
      }

      // Check for registration link
      const registerLinks = await this.page.$$('a:visible');
      for (const link of registerLinks) {
        const text = await link.textContent();
        if (text && /register|sign.?up|create.?account|join/i.test(text)) {
          authInfo.registrationLink = await link.getAttribute('href');
          break;
        }
      }
    }

    logger.info(`Login form detected: ${authInfo.hasLoginForm}`);
    return authInfo;
  }

  /**
   * Fill and submit login form
   */
  async login(username, password) {
    logger.info(`Attempting login for user: ${username}`);

    const authInfo = await this.detectLoginForm();
    const loginUrl = this.page.url();

    if (!authInfo.hasLoginForm) {
      throw new Error('No login form detected on this page');
    }

    try {
      // Fill username
      if (authInfo.fields.username) {
        await this.page.fill(authInfo.fields.username, username);
        logger.info('Username entered');
        // Small delay to simulate human typing
        await this.page.waitForTimeout(500);
      }

      // Fill password
      if (authInfo.fields.password) {
        await this.page.fill(authInfo.fields.password, password);
        logger.info('Password entered');
        // Small delay
        await this.page.waitForTimeout(500);
      }

      // Screenshot before submit
      await this.captureScreenshot('before-login');

      // 🎯 Use ROBUST button click method
      logger.info('🔍 Searching for login button using robust click method...');

      // Try the new robust click method with different button texts
      const buttonFound = await this.clickButton('Log In') ||
                          await this.clickButton('Login') ||
                          await this.clickButton('Sign In') ||
                          await this.clickButton('Continue') ||
                          await this.clickButton('button[type="submit"]');

      if (buttonFound) {
        logger.info('✅ Login button clicked successfully');
      } else {
        logger.warn('⚠️ Button click may have failed, waiting anyway...');
      }

      // Wait for navigation - extended timeout for login
      logger.info('Waiting for login to complete...');

      // Wait for either URL change or network idle
      try {
        await Promise.race([
          this.page.waitForURL(/.*/, { timeout: 30000 }),
          this.page.waitForLoadState('networkidle', { timeout: 30000 })
        ]);
      } catch (e) {
        logger.info('Navigation timeout, continuing anyway...');
      }

      // Extended wait for session to establish
      logger.info('Waiting for session to establish...');
      await this.page.waitForTimeout(5000);

      // Check for 2FA/OTP/security challenges
      const has2FA = await this.page.$('input[name*="code" i], input[name*="otp" i], input[placeholder*="code" i], input[id*="otp" i], input[id*="code" i]');
      const hasSecurityCheckpoint = await this.page.evaluate(() => {
        const bodyText = document.body.textContent || '';
        return bodyText.toLowerCase().includes('security checkpoint') ||
               bodyText.toLowerCase().includes('verify your identity') ||
               bodyText.toLowerCase().includes('suspicious activity');
      });

      // Check for error messages to determine why login failed
      let errorMessage = 'Login may have failed - still on login page';
      let errorType = 'unknown';

      const errorSelectors = [
        { selector: 'text=incorrect password', type: 'wrong_password' },
        { selector: 'text=wrong password', type: 'wrong_password' },
        { selector: 'text=invalid password', type: 'wrong_password' },
        { selector: 'text=invalid username', type: 'wrong_credentials' },
        { selector: 'text=invalid credentials', type: 'wrong_credentials' },
        { selector: '.error, .alert-danger, [role="alert"]', type: 'general_error' }
      ];

      for (const { selector, type } of errorSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            const text = await element.textContent();
            if (text && text.trim().length > 0) {
              if (type === 'wrong_password') {
                errorMessage = 'Wrong password! Please check your password and try again.';
                errorType = 'wrong_password';
                logger.warn(`Wrong password detected`);
                break;
              } else if (type === 'wrong_credentials') {
                errorMessage = 'Invalid credentials! Please check your username/password.';
                errorType = 'wrong_credentials';
                logger.warn(`Invalid credentials detected`);
                break;
              } else if (type === 'general_error') {
                const isVisible = await element.isVisible().catch(() => false);
                if (isVisible && /incorrect|wrong|invalid|error/i.test(text)) {
                  errorMessage = `Login error: ${text.trim().substring(0, 100)}`;
                  errorType = 'general_error';
                  logger.warn(`Login error detected: ${text.substring(0, 50)}`);
                  break;
                }
              }
            }
          }
        } catch (e) {
          // Continue
        }
      }

      // Save cookies after login
      const cookies = await this.context.cookies();
      logger.info(`Session cookies saved: ${cookies.length} cookies`);

      // Check if login was successful
      const loginSuccessful = await this.checkLoginSuccess(loginUrl);

      // Override error message if 2FA detected
      if (has2FA) {
        errorMessage = '2FA/OTP detected! Please enter the verification code manually or disable 2FA for this account.';
        errorType = '2fa_required';
        logger.warn('2FA/OTP detected');
      } else if (hasSecurityCheckpoint) {
        errorMessage = 'Security checkpoint detected! Facebook may need additional verification.';
        errorType = 'security_checkpoint';
        logger.warn('Security checkpoint detected');
      }

      if (loginSuccessful) {
        logger.info('Login appears successful!');
        errorMessage = 'Login successful';
      } else {
        logger.warn(`${errorMessage} (${errorType})`);
      }

      await this.captureScreenshot('after-login');

      return {
        success: loginSuccessful,
        currentUrl: this.page.url(),
        message: errorMessage,
        errorType: errorType,
        requires2FA: !!has2FA,
        requiresSecurityCheck: hasSecurityCheckpoint,
        cookies: cookies
      };

    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if login was successful
   */
  async checkLoginSuccess(originalLoginUrl) {
    const currentUrl = this.page.url();

    // If URL changed significantly, likely successful
    if (currentUrl !== originalLoginUrl && !currentUrl.includes('login')) {
      logger.info(`URL changed from ${originalLoginUrl} to ${currentUrl}`);
      return true;
    }

    // Check if password field still exists (if not, likely logged in)
    const hasPasswordInput = await this.page.$('[type="password"]');

    // Check for error messages
    const errorSelectors = [
      '.error',
      '.alert-danger',
      '.login-error',
      '[class*="error"]',
      '[id*="error"]',
      'div[role="alert"]'
    ];

    for (const selector of errorSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          const text = await element.textContent();
          if (text && /incorrect|invalid|wrong|failed|error/i.test(text)) {
            logger.info(`Login error detected: ${text.substring(0, 50)}`);
            return false;
          }
        }
      }
    }

    // If no password field visible, likely logged in
    if (!hasPasswordInput) {
      logger.info('No password field found - likely logged in');
      return true;
    }

    // Check if we're still on login page
    const authInfo = await this.detectLoginForm();

    // If no login form detected anymore, successful
    if (!authInfo.hasLoginForm) {
      logger.info('Login form no longer present - likely logged in');
      return true;
    }

    // Still on login page
    logger.info('Still on login page');
    return false;
  }

  /**
   * Scrape all data from current page - Website Content + Backend Data
   */
  async scrapePage(options = {}) {
    logger.info('Scraping page data...');

    const scrapedData = {
      // ========================================
      // 1. WEBSITE CONTENT (Pehle - Sabse Important)
      // ========================================
      websiteContent: {
        // Full page text content
        fullText: await this.page.evaluate(() => {
          return document.body.innerText;
        }),

        // All text as HTML
        htmlContent: await this.page.evaluate(() => {
          return document.body.innerHTML;
        }),

        // Text content by sections
        textContent: await this.scrapeText(),

        // All visible text (paragraphs, headings)
        visibleText: await this.page.evaluate(() => {
          const texts = [];
          document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, div, li, td, th').forEach(el => {
            if (el.textContent && el.textContent.trim().length > 0 && el.offsetParent !== null) {
              texts.push(el.textContent.trim());
            }
          });
          return [...new Set(texts)]; // Remove duplicates
        }),

        // All words from the page
        allWords: await this.page.evaluate(() => {
          const text = document.body.innerText || '';
          return text.split(/\s+/).filter(word => word.length > 0);
        }),

        // All sentences
        sentences: await this.page.evaluate(() => {
          const text = document.body.innerText || '';
          return text.match(/[^.!?]+[.!?]+/g) || [text];
        }),

        // Page title and description
        title: await this.page.title(),
        description: await this.page.evaluate(() => {
          const meta = document.querySelector('meta[name="description"]');
          return meta ? meta.getAttribute('content') : '';
        })
      },

      // ========================================
      // 2. BACKEND EXTRACTED DATA (Baad mein)
      // ========================================
      backendExtractedData: {
        // All forms
        forms: await this.scrapeForms(),

        // All interactive elements
        interactiveElements: {
          buttons: await this.scrapeButtons(),
          inputs: await this.scrapeInputs()
        },

        // All navigation links
        links: await this.scrapeLinks(),

        // All images
        images: await this.scrapeImages(),

        // All tables
        tables: await this.scrapeTables(),

        // All lists
        lists: await this.scrapeLists(),

        // Structured data (JSON-LD)
        structuredData: await this.scrapeStructuredData(),

        // SEO Meta tags
        metaTags: await this.scrapeMeta()
      },

      // ========================================
      // 3. PAGE INFO
      // ========================================
      pageInfo: {
        url: this.page.url(),
        timestamp: new Date().toISOString()
      },

      // Screenshot
      screenshot: options.screenshots !== false ? await this.captureScreenshot('page') : null
    };

    logger.info('Page scraping complete');
    return scrapedData;
  }

  /**
   * Scrape meta tags
   */
  async scrapeMeta() {
    return await this.page.evaluate(() => {
      const meta = {};
      document.querySelectorAll('meta').forEach(el => {
        const name = el.getAttribute('name') || el.getAttribute('property');
        const content = el.getAttribute('content');
        if (name && content) {
          meta[name] = content;
        }
      });
      return meta;
    });
  }

  /**
   * Scrape all forms
   */
  async scrapeForms() {
    return await this.page.evaluate(() => {
      const forms = [];
      document.querySelectorAll('form').forEach((form, idx) => {
        const formData = {
          index: idx,
          action: form.action,
          method: form.method,
          fields: []
        };

        form.querySelectorAll('input, textarea, select').forEach(field => {
          formData.fields.push({
            type: field.type || field.tagName.toLowerCase(),
            name: field.name,
            id: field.id,
            placeholder: field.placeholder,
            required: field.required,
            value: field.value
          });
        });

        forms.push(formData);
      });
      return forms;
    });
  }

  /**
   * Scrape all links
   */
  async scrapeLinks() {
    return await this.page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a[href]').forEach(link => {
        links.push({
          text: link.textContent?.trim().substring(0, 100),
          href: link.href,
          title: link.title
        });
      });
      return links.slice(0, 100); // Limit to 100 links
    });
  }

  /**
   * Scrape all images
   */
  async scrapeImages() {
    return await this.page.evaluate(() => {
      const images = [];
      document.querySelectorAll('img').forEach(img => {
        images.push({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        });
      });
      return images;
    });
  }

  /**
   * Scrape text content
   */
  async scrapeText() {
    return await this.page.evaluate(() => {
      // Get main content areas
      const contentSelectors = [
        'main',
        'article',
        '[role="main"]',
        '.content',
        '.main-content',
        '#content',
        'body'
      ];

      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          return {
            selector: selector,
            text: element.textContent?.trim().substring(0, 10000),
            htmlLength: element.innerHTML.length
          };
        }
      }

      return {
        selector: 'body',
        text: document.body.textContent?.trim().substring(0, 10000),
        htmlLength: document.body.innerHTML.length
      };
    });
  }

  /**
   * Scrape tables
   */
  async scrapeTables() {
    return await this.page.evaluate(() => {
      const tables = [];
      document.querySelectorAll('table').forEach((table, idx) => {
        const rows = [];
        table.querySelectorAll('tr').forEach((tr, rowIdx) => {
          const cells = [];
          tr.querySelectorAll('td, th').forEach(td => {
            cells.push(td.textContent?.trim());
          });
          if (cells.length > 0) {
            rows.push({ index: rowIdx, cells });
          }
        });

        if (rows.length > 0) {
          tables.push({
            index: idx,
            rows: rows.slice(0, 50) // Limit rows
          });
        }
      });
      return tables;
    });
  }

  /**
   * Scrape lists
   */
  async scrapeLists() {
    return await this.page.evaluate(() => {
      const lists = [];
      document.querySelectorAll('ul, ol').forEach((list, idx) => {
        const items = [];
        list.querySelectorAll('li').forEach(li => {
          items.push(li.textContent?.trim());
        });
        if (items.length > 0) {
          lists.push({
            index: idx,
            type: list.tagName.toLowerCase(),
            items: items.slice(0, 50)
          });
        }
      });
      return lists;
    });
  }

  /**
   * Scrape buttons
   */
  async scrapeButtons() {
    return await this.page.evaluate(() => {
      const buttons = [];
      document.querySelectorAll('button, [role="button"], .btn').forEach(btn => {
        buttons.push({
          text: btn.textContent?.trim(),
          type: btn.type,
          disabled: btn.disabled
        });
      });
      return buttons.slice(0, 50);
    });
  }

  /**
   * Scrape input fields
   */
  async scrapeInputs() {
    return await this.page.evaluate(() => {
      const inputs = [];
      document.querySelectorAll('input, textarea, select').forEach(input => {
        inputs.push({
          type: input.type || input.tagName.toLowerCase(),
          name: input.name,
          id: input.id,
          placeholder: input.placeholder,
          value: input.value,
          required: input.required,
          disabled: input.disabled
        });
      });
      return inputs;
    });
  }

  /**
   * Scrape structured data (JSON-LD)
   */
  async scrapeStructuredData() {
    return await this.page.evaluate(() => {
      const structuredData = [];
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
          structuredData.push(JSON.parse(script.textContent));
        } catch (e) {
          // Invalid JSON
        }
      });
      return structuredData;
    });
  }

  /**
   * Capture screenshot
   */
  async captureScreenshot(name = 'screenshot') {
    try {
      const screenshot = await this.page.screenshot({
        type: 'png',
        fullPage: false
      });

      const base64 = screenshot.toString('base64');
      this.screenshots.push({ name, data: base64, timestamp: new Date().toISOString() });

      logger.info(`Screenshot captured: ${name}`);
      return base64;
    } catch (error) {
      logger.error(`Screenshot failed: ${error.message}`);
      return null;
    }
  }

  /**
   * ROBUST BUTTON CLICK - Try multiple approaches to click a button
   * This is the main function to fix button clicking issues
   */
  async clickButton(buttonTextOrSelector, options = {}) {
    const { exact = false, timeout = 5000 } = options;

    logger.info(`🎯 Trying to click button: ${buttonTextOrSelector}`);

    // APPROACH 1: Direct selector click (if it's a CSS selector)
    if (buttonTextOrSelector.includes('[') || buttonTextOrSelector.includes('#') || buttonTextOrSelector.includes('.')) {
      try {
        const element = await this.page.$(buttonTextOrSelector);
        if (element) {
          // Scroll into view
          await element.scrollIntoViewIfNeeded().catch(() => {});

          // Wait for element to be stable
          await this.page.waitForTimeout(200);

          // Try clicking with force (bypasses visibility checks)
          await element.click({ force: true, timeout: 1000 }).catch(async () => {
            // If force click fails, try regular click
            await element.click({ timeout: 1000 });
          });

          logger.info(`✅ Clicked button via selector: ${buttonTextOrSelector}`);
          return true;
        }
      } catch (e) {
        logger.info(`Selector approach failed: ${e.message.substring(0, 50)}`);
      }
    }

    // APPROACH 2: Text-based button search (most reliable for login buttons)
    const buttonVariations = typeof buttonTextOrSelector === 'string'
      ? [buttonTextOrSelector]
      : [];

    // Add common variations if looking for login buttons
    if (buttonTextOrSelector.toLowerCase().includes('login') ||
        buttonTextOrSelector.toLowerCase().includes('log in') ||
        buttonTextOrSelector.toLowerCase().includes('sign')) {
      buttonVariations.push('Log In', 'Login', 'Sign In', 'Log in', 'login', 'submit', 'continue');
    }

    for (const text of buttonVariations) {
      try {
        // Method 1: Playwright's :has-text() selector
        const selector = exact ? `button:has-text("${text}")` : `button:text-is("${text}")`;

        // Try all buttons with this text
        const buttons = await this.page.$$(selector);

        for (const button of buttons) {
          try {
            // Check if button is attached to DOM
            const isAttached = await button.evaluate(el => document.body.contains(el));
            if (!isAttached) continue;

            // Scroll into view
            await button.scrollIntoViewIfNeeded().catch(() => {});

            // Wait a bit for any animations
            await this.page.waitForTimeout(200);

            // Try force click
            await button.click({ force: true, timeout: 2000 }).catch(async (e) => {
              // If force fails, try JavaScript click
              logger.info(`Force click failed, trying JS click: ${e.message.substring(0, 30)}`);
              await button.evaluate(el => el.click());
            });

            logger.info(`✅ Clicked button via text: "${text}"`);
            return true;
          } catch (e) {
            // Try next button
          }
        }
      } catch (e) {
        // Continue to next variation
      }
    }

    // APPROACH 3: Evaluate ALL buttons on page and find matching one
    try {
      logger.info('🔍 Scanning all buttons on page...');

      const clicked = await this.page.evaluate((searchTexts) => {
        // Convert search texts to lowercase for comparison
        const searchLower = searchTexts.map(s => s.toLowerCase());

        // Find all clickable elements
        const clickables = document.querySelectorAll(`
          button, [role="button"], input[type="submit"],
          input[type="button"], a[href*="login"], .btn, .button
        `);

        for (const el of clickables) {
          const text = (el.textContent || el.value || '').trim().toLowerCase();
          const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();

          // Check if any search text matches
          for (const search of searchLower) {
            if (text.includes(search) || ariaLabel.includes(search) || search.includes(text)) {
              // Scroll to element
              el.scrollIntoView({ behavior: 'instant', block: 'center' });

              // Try clicking
              el.click();

              return true;
            }
          }
        }

        return false;
      }, buttonVariations);

      if (clicked) {
        logger.info(`✅ Clicked button via JS evaluation`);
        return true;
      }
    } catch (e) {
      logger.info(`JS evaluation approach failed: ${e.message.substring(0, 50)}`);
    }

    // APPROACH 4: Try finding submit button in forms
    try {
      logger.info('🔍 Looking for form submit buttons...');

      const clicked = await this.page.evaluate(() => {
        // Find all forms with password fields (login forms)
        const forms = document.querySelectorAll('form');
        const passwordForms = Array.from(forms).filter(form =>
          form.querySelector('input[type="password"]')
        );

        for (const form of passwordForms) {
          // Find submit button in this form
          const submitBtn = form.querySelector(`
            button[type="submit"],
            input[type="submit"],
            button:not([type]),
            button:has-text("Log"),
            button:has-text("Sign"),
            button:has-text("Login"),
            button:has-text("Continue")
          `) || form.lastElementChild; // Last child is often submit button

          if (submitBtn) {
            submitBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
            submitBtn.click();
            return true;
          }
        }

        return false;
      });

      if (clicked) {
        logger.info(`✅ Clicked form submit button`);
        return true;
      }
    } catch (e) {
      logger.info(`Form submit approach failed: ${e.message.substring(0, 50)}`);
    }

    // APPROACH 5: Last resort - Press Enter on password field
    try {
      logger.info('🔍 Last resort - pressing Enter on password field...');

      await this.page.focus('input[type="password"]');
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);

      // Check if URL changed (indicates success)
      const currentUrl = this.page.url();

      logger.info(`✅ Pressed Enter on password field`);
      return true;
    } catch (e) {
      logger.info(`Enter key approach failed: ${e.message.substring(0, 50)}`);
    }

    logger.error(`❌ Failed to click button: ${buttonTextOrSelector}`);
    return false;
  }

  /**
   * Check if already authenticated (better check)
   */
  async checkIfAuthenticated() {
    const currentUrl = this.page.url();
    const isFacebook = currentUrl.includes('facebook.com');

    // Check for login page URL
    if (currentUrl.includes('/login') || currentUrl.includes('/signin')) {
      logger.info('On login page - not authenticated');
      return false;
    }

    // Check for authenticated user indicators
    const hasLoggedInIndicators = await this.page.evaluate(() => {
      // Facebook specific indicators
      if (window.location.hostname.includes('facebook.com')) {
        // Look for profile menu, notifications, etc.
        return !!(
          document.querySelector('[aria-label="Your profile"]') ||
          document.querySelector('[aria-label="Messenger"]') ||
          document.querySelector('[aria-label="Notifications"]') ||
          document.querySelector('[aria-label="Account"]') ||
          document.querySelector('[data-pagelet="LeftRail"]') ||
          document.querySelector('[role="navigation"]') ||
          document.cookie.includes('c_user') && document.cookie.includes('xs')
        );
      }

      // Generic indicators for other sites
      return !!(
        document.querySelector('[href*="logout" i]') ||
        document.querySelector('[href*="signout" i]') ||
        document.querySelector('[href*="profile" i]') ||
        document.querySelector('[class*="user-menu" i]') ||
        document.querySelector('[class*="avatar" i]') ||
        document.querySelector('[id*="user" i]')
      );
    });

    if (hasLoggedInIndicators) {
      logger.info('Found logged-in indicators - user is authenticated');
      return true;
    }

    // Check if NOT on login page and no password field visible
    const hasPasswordField = await this.page.$('input[type="password"]:visible');
    if (!hasPasswordField && !currentUrl.includes('/login')) {
      logger.info('No password field and not on login page - likely authenticated');
      return true;
    }

    logger.info('Could not confirm authentication status');
    return false;
  }

  /**
   * Main scrape function with optional login and persistent session
   */
  async scrape(url, credentials = null, options = {}) {
    const originalUrl = this.formatUrl(url);
    let loginResult = null;
    let hadExistingSession = false;

    try {
      // Check if cookies provided for session reuse
      if (options.cookies) {
        this.cookies = options.cookies;
        logger.info(`Session cookies provided: ${options.cookies.length} cookies`);
      }

      // Initialize browser with URL (for cookie normalization)
      // Returns true if existing session was loaded
      hadExistingSession = await this.init(originalUrl);

      await this.navigate(originalUrl);

      // Get final URL after redirects
      const finalUrl = this.page.url();
      const wasRedirected = originalUrl !== finalUrl;

      if (wasRedirected) {
        logger.info(`URL was redirected: ${originalUrl} -> ${finalUrl}`);
      }

      // Wait a bit for cookies to take effect
      if (hadExistingSession || this.cookies || options.cookies) {
        await this.page.waitForTimeout(2000);
      }

      // Better check if already authenticated
      let alreadyAuthenticated = false;
      if (hadExistingSession || this.cookies || options.cookies) {
        alreadyAuthenticated = await this.checkIfAuthenticated();
        if (alreadyAuthenticated) {
          logger.info('✅ Already authenticated! Skipping login.');
        } else {
          logger.info('⚠️ Session found but not authenticated - checking for login form...');
        }
      }

      // Detect if login is needed
      const authInfo = await this.detectLoginForm();

      // Only try login if:
      // 1. Not already authenticated
      // 2. Credentials provided
      // 3. Login form exists
      if (!alreadyAuthenticated && credentials && credentials.username && credentials.password && authInfo.hasLoginForm) {
        logger.info('Credentials provided, attempting login...');
        loginResult = await this.login(credentials.username, credentials.password);

        if (loginResult.success) {
          logger.info('✅ Login successful! Saving session...');

          // Save session for future use
          await this.saveSession();
          this._sessionSaved = true;

          // Update auth info after login
          const newAuthInfo = await this.detectLoginForm();
          if (!newAuthInfo.hasLoginForm) {
            alreadyAuthenticated = true;
            logger.info('✅ Now authenticated after login!');
          }
        } else {
          logger.warn('⚠️ Login was not successful');
        }
      } else if (alreadyAuthenticated) {
        logger.info('✅ Using existing authenticated session for scraping...');
      }

      // Scrape all data from the current page
      const data = await this.scrapePage(options);

      return {
        success: true,
        redirect: {
          originalUrl: originalUrl,
          finalUrl: this.page.url(),
          wasRedirected: wasRedirected
        },
        auth: {
          detected: authInfo.hasLoginForm,
          attempted: !!(credentials && credentials.username && credentials.password),
          alreadyAuthenticated: alreadyAuthenticated,
          hadExistingSession: hadExistingSession,
          sessionSaved: this._sessionSaved,
          loginUrl: authInfo.loginUrl,
          fields: authInfo.fields,
          successful: alreadyAuthenticated || loginResult?.success || false,
          message: alreadyAuthenticated
            ? 'Already authenticated using existing session'
            : (loginResult?.message || 'No login attempted')
        },
        session: {
          cookies: await this.getCookies(),
          cookieCount: (await this.getCookies()).length,
          sessionId: this.sessionId
        },
        data: data,
        screenshots: this.screenshots
      };

    } catch (error) {
      logger.error(`Scrape failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        url: url
      };
    }
  }

  /**
   * Scrape multiple pages
   */
  async scrapeMultiple(urls, credentials = null, options = {}) {
    const results = [];

    for (const url of urls) {
      logger.info(`Scraping: ${url}`);

      try {
        const result = await this.scrape(url, credentials, options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          url: url,
          error: error.message
        });
      }

      // Delay between requests
      if (options.delay) {
        await this.page.waitForTimeout(options.delay);
      }
    }

    return results;
  }

  /**
   * Close browser
   */
  async close() {
    // Save session before closing
    if (this.context && !this._sessionSaved) {
      await this.saveSession();
    }

    if (this.browser) {
      await this.browser.close();
      logger.info('Browser closed');
    }
  }
}

/**
 * Scrape website with agent (convenience function)
 */
export async function scrapeWithAgent(url, credentials = null, options = {}) {
  const agent = new ScraperAgent(options);

  try {
    const result = await agent.scrape(url, credentials, options);
    return result;
  } finally {
    await agent.close();
  }
}

export default ScraperAgent;
