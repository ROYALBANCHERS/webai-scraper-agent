import { chromium } from 'playwright';

// ============================================
// REAL USER STYLE WEBSITE AUDITOR
// Like a real human browsing the site
// Works with ANY tech stack - React, Vue, Angular, vanilla, AI-generated (v0, Claude, Cursor)
// No AI dependency - pure technical analysis
// ============================================

const normalizeUrl = (input) => {
  const url = input.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Comprehensive check categories
const CHECK_CATEGORIES = {
  UI: 'UI',
  UX: 'UX',
  SEO: 'SEO',
  SECURITY: 'Security',
  PERFORMANCE: 'Performance',
  ACCESSIBILITY: 'Accessibility',
  MOBILE: 'Mobile',
  FUNCTIONALITY: 'Functionality'
};

const SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// ============================================
// COMPREHENSIVE TECH STACK DETECTION
// Detects ALL frameworks, libraries, tools regardless of tech stack
// ============================================
const detectTechStack = async (page) => {
  const techStack = {
    frameworks: [],
    libraries: [],
    analytics: [],
    cms: [],
    ecommerce: [],
    fonts: [],
    buildTools: [],
    hosting: [],
    other: []
  };

  try {
    const data = await page.evaluate(() => {
      const result = {
        scripts: [],
        metaGenerators: [],
        frameworks: [],
        libraries: [],
        analytics: [],
        fonts: [],
        stylesheets: [],
        inlineStyles: 0,
        inlineScripts: 0,
        externalScripts: 0
      };

      // Check all scripts
      document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src') || '';
        result.scripts.push(src);
        result.externalScripts++;
      });

      // Check inline scripts
      result.inlineScripts = document.querySelectorAll('script:not([src])').length;

      // Check all stylesheets
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href') || '';
        result.stylesheets.push(href);
      });

      // Check inline styles
      document.querySelectorAll('style').forEach(() => result.inlineStyles++);

      // Check meta generator
      const metaGenerator = document.querySelector('meta[name="generator"]');
      if (metaGenerator) {
        result.metaGenerators.push(metaGenerator.getAttribute('content'));
      }

      // Check for React patterns
      if (window.React || window.ReactDOM || document.querySelector('[data-reactroot], [data-reactid]')) {
        result.frameworks.push('React');
      }
      if (window.__NUXT__) {
        result.frameworks.push('Nuxt.js');
      }
      if (window.__VUE__) {
        result.frameworks.push('Vue.js');
      }
      if (window.angular || window.ng || document.querySelector('[ng-app], [ng-controller], [data-ng-app]')) {
        result.frameworks.push('Angular');
      }
      if (window.svelte || document.querySelector('script[data-svelte]')) {
        result.frameworks.push('Svelte');
      }
      if (window.Solid || window.SolidStart) {
        result.frameworks.push('SolidJS');
      }
      if (window.__NEXT_DATA__) {
        result.frameworks.push('Next.js');
      }
      if (window.__REMIX_RUNTIME__) {
        result.frameworks.push('Remix');
      }
      if (window.__GATSBY__) {
        result.frameworks.push('Gatsby');
      }
      if (window.__astro || document.querySelector('[data-astro]')) {
        result.frameworks.push('Astro');
      }
      if (window.__SVELTEKIT__) {
        result.frameworks.push('SvelteKit');
      }
      if (window.__framework_version_ref__ || document.querySelector('[data-v-]')) {
        result.frameworks.push('Vue/Unknown Framework');
      }

      // Check for jQuery
      if (window.jQuery || window.$ || window.jQuery?.fn) {
        result.libraries.push('jQuery');
      }

      // Check for common UI libraries
      if (window.Bootstrap || document.querySelector('[class*="col-"], .navbar, .container')) {
        result.libraries.push('Bootstrap');
      }
      if (window.Tailwind) {
        result.libraries.push('Tailwind CSS');
      }
      if (window.MUI || window.MaterialUI) {
        result.libraries.push('Material-UI');
      }
      if (window.ChakraUI) {
        result.libraries.push('Chakra UI');
      }
      if (window.Antd) {
        result.libraries.push('Ant Design');
      }
      if (window.ReactBootstrap) {
        result.libraries.push('React Bootstrap');
      }

      // Check analytics
      if (window.ga || window._gaq || window.GoogleAnalyticsObject) {
        result.analytics.push('Google Analytics');
      }
      if (window.fbq || window._fbq) {
        result.analytics.push('Facebook Pixel');
      }
      if (window.gtag || window.dataLayer) {
        result.analytics.push('Google Tag Manager');
      }
      if (window.mixpanel) {
        result.analytics.push('Mixpanel');
      }
      if (window.amplitude) {
        result.analytics.push('Amplitude');
      }
      if (window.heap) {
        result.analytics.push('Heap Analytics');
      }
      if (window.Hotjar) {
        result.analytics.push('Hotjar');
      }
      if (window.Intercom) {
        result.analytics.push('Intercom');
      }
      if (window.drift) {
        result.analytics.push('Drift');
      }
      if (window.__cf || document.querySelector('[data-cf-beacon]')) {
        result.analytics.push('Cloudflare Web Analytics');
      }

      // Check fonts
      document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').forEach(link => {
        const href = link.getAttribute('href') || '';
        const fontMatch = href.match(/family=([^&]+)/);
        if (fontMatch) {
          result.fonts.push(fontMatch[1].replace(/\+/g, ', '));
        }
      });

      // Check for Adobe Fonts (Typekit)
      if (document.querySelector('script[src*="use.typekit"], link[href*="use.typekit"]')) {
        result.fonts.push('Adobe Fonts (Typekit)');
      }

      // Check WordPress
      if (document.querySelector('link[href*="wp-content"], script[src*="wp-"]') ||
          document.body.classList.contains('wordpress') ||
          result.metaGenerators.some(g => g?.toLowerCase().includes('wordpress'))) {
        result.cms.push('WordPress');
      }

      // Check Shopify
      if (window.Shopify || window.Shopify.theme || document.querySelector('script[src*="shopify"]')) {
        result.cms.push('Shopify');
        result.ecommerce = result.ecommerce || [];
        result.ecommerce.push('Shopify');
      }

      // Check WooCommerce
      if (document.querySelector('link[href*="woocommerce"], script[src*="woocommerce"]') ||
          document.body.classList.contains('woocommerce')) {
        result.ecommerce = result.ecommerce || [];
        result.ecommerce.push('WooCommerce');
      }

      // Check Squarespace
      if (document.querySelector('script[src*="squarespace"], body[class*="squarespace"]')) {
        result.cms.push('Squarespace');
      }

      // Check Wix
      if (window.wixBiSession || document.querySelector('[data-wix]')) {
        result.cms.push('Wix');
      }

      // Check Webflow
      if (window.Webflow || document.querySelector('script[src*="webflow"]')) {
        result.cms.push('Webflow');
      }

      // Check Laravel/PHP indicators
      if (document.querySelector('meta[name="csrf-token"]') || document.querySelector('input[name="_token"]')) {
        result.frameworks.push('Laravel/PHP Framework');
      }

      // Check Django/Python indicators
      if (document.querySelector('input[name="csrfmiddlewaretoken"]')) {
        result.frameworks.push('Django/Python Framework');
      }

      // Check Ruby on Rails indicators
      if (document.querySelector('meta[name="csrf-param"]')) {
        result.frameworks.push('Ruby on Rails');
      }

      return result;
    });

    // Process scripts for more detections
    data.scripts.forEach(src => {
      // Build tools and frameworks detection from script URLs
      if (src.includes('vite')) {
        techStack.buildTools.push('Vite');
      }
      if (src.includes('webpack')) {
        techStack.buildTools.push('Webpack');
      }
      if (src.includes('parcel')) {
        techStack.buildTools.push('Parcel');
      }
      if (src.includes('esbuild')) {
        techStack.buildTools.push('esbuild');
      }
      if (src.includes('rollup')) {
        techStack.buildTools.push('Rollup');
      }
      if (src.includes('turbo')) {
        techStack.buildTools.push('TurboPack');
      }

      // Library detection from scripts
      if (src.includes('bootstrap') && !techStack.libraries.includes('Bootstrap')) {
        techStack.libraries.push('Bootstrap');
      }
      if (src.includes('tailwind') && !techStack.libraries.includes('Tailwind CSS')) {
        techStack.libraries.push('Tailwind CSS');
      }
      if (src.includes('jquery') && !techStack.libraries.includes('jQuery')) {
        techStack.libraries.push('jQuery');
      }
      if (src.includes('font-awesome') || src.includes('fontawesome')) {
        techStack.libraries.push('Font Awesome');
      }
      if (src.includes('gsap')) {
        techStack.libraries.push('GSAP');
      }
      if (src.includes('three') || src.includes('threejs')) {
        techStack.libraries.push('Three.js');
      }
      if (src.includes('chart') || src.includes('Chart.js')) {
        techStack.libraries.push('Chart.js');
      }
      if (src.includes('swiper')) {
        techStack.libraries.push('Swiper');
      }
      if (src.includes('aos') || src.includes('animate')) {
        techStack.libraries.push('Animation Library');
      }
      if (src.includes('lodash')) {
        techStack.libraries.push('Lodash');
      }
      if (src.includes('axios')) {
        techStack.libraries.push('Axios');
      }
      if (src.includes('moment')) {
        techStack.libraries.push('Moment.js');
      }
      if (src.includes('dayjs')) {
        techStack.libraries.push('Day.js');
      }
      if (src.includes('luxon')) {
        techStack.libraries.push('Luxon');
      }
      if (src.includes('date-fns')) {
        techStack.libraries.push('date-fns');
      }

      // UI Component Libraries
      if (src.includes('@mui') || src.includes('material-ui')) {
        techStack.libraries.push('Material-UI (MUI)');
      }
      if (src.includes('@chakra-ui')) {
        techStack.libraries.push('Chakra UI');
      }
      if (src.includes('antd')) {
        techStack.libraries.push('Ant Design');
      }
      if (src.includes('@mantine')) {
        techStack.libraries.push('Mantine');
      }
      if (src.includes('react-bootstrap')) {
        techStack.libraries.push('React Bootstrap');
      }
      if (src.includes('@headlessui')) {
        techStack.libraries.push('Headless UI');
      }
      if (src.includes('@heroicons')) {
        techStack.libraries.push('Heroicons');
      }
      if (src.includes('lucide')) {
        techStack.libraries.push('Lucide Icons');
      }
      if (src.includes('react-icons')) {
        techStack.libraries.push('React Icons');
      }
      if (src.includes('framer-motion')) {
        techStack.libraries.push('Framer Motion');
      }
      if (src.includes('styled-components')) {
        techStack.libraries.push('styled-components');
      }

      // Hosting/CDN detection
      if (src.includes('cloudflare')) {
        techStack.hosting.push('Cloudflare');
      }
      if (src.includes('cloudfront')) {
        techStack.hosting.push('AWS CloudFront');
      }
      if (src.includes('firebase')) {
        techStack.hosting.push('Firebase');
      }
      if (src.includes('vercel')) {
        techStack.hosting.push('Vercel');
      }
      if (src.includes('netlify')) {
        techStack.hosting.push('Netlify');
      }
    });

    // Check stylesheets for CSS frameworks
    data.stylesheets.forEach(href => {
      if (href.includes('bootstrap') && !techStack.libraries.includes('Bootstrap')) {
        techStack.libraries.push('Bootstrap');
      }
      if (href.includes('tailwind') && !techStack.libraries.includes('Tailwind CSS')) {
        techStack.libraries.push('Tailwind CSS');
      }
      if (href.includes('bulma')) {
        techStack.libraries.push('Bulma');
      }
      if (href.includes('foundation')) {
        techStack.libraries.push('Foundation');
      }
      if (href.includes('semantic')) {
        techStack.libraries.push('Semantic UI');
      }
      if (href.includes('material')) {
        techStack.libraries.push('Material Design');
      }
    });

    // Add from evaluate results
    data.frameworks.forEach(f => {
      if (!techStack.frameworks.includes(f)) techStack.frameworks.push(f);
    });
    data.analytics.forEach(a => {
      if (!techStack.analytics.includes(a)) techStack.analytics.push(a);
    });
    data.cms.forEach(c => {
      if (!techStack.cms.includes(c)) techStack.cms.push(c);
    });
    if (data.ecommerce) {
      data.ecommerce.forEach(e => {
        if (!techStack.ecommerce.includes(e)) techStack.ecommerce.push(e);
      });
    }
    data.fonts.forEach(f => {
      if (!techStack.fonts.includes(f)) techStack.fonts.push(f);
    });

  } catch (e) {
    console.warn('Tech stack detection failed:', e.message);
  }

  return techStack;
};

// ============================================
// SEO ANALYSIS - Complete SEO checkup
// ============================================
const analyzeSEO = async (page) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const seoData = {};

  try {
    const seoChecks = await page.evaluate(() => {
      const results = {
        // Title checks
        hasTitle: false,
        titleLength: 0,
        titleContent: '',

        // Meta description
        hasMetaDescription: false,
        metaDescriptionLength: 0,
        metaDescriptionContent: '',

        // Headings
        hasH1: false,
        h1Count: 0,
        h1Contents: [],
        h2Count: 0,
        h3Count: 0,
        headingStructure: [],

        // Images
        totalImages: 0,
        imagesWithoutAlt: 0,
        imagesWithEmptyAlt: 0,

        // Links
        totalLinks: 0,
        internalLinks: 0,
        externalLinks: 0,
        noFollowLinks: 0,
        brokenLinks: 0,

        // Meta tags
        hasViewport: false,
        hasCharset: false,
        hasCanonical: false,
        hasRobots: false,
        hasOpenGraph: false,
        hasTwitterCard: false,
        hasFavicon: false,

        // Structured data
        hasStructuredData: false,
        structuredDataTypes: [],

        // Content
        wordCount: 0,
        textRatio: 0,

        // Performance related
        hasLargeImages: false,
        scriptCount: 0,
        stylesheetCount: 0,

        // Mobile
        viewportContent: '',
        hasMobileFriendly: false
      };

      // Title checks
      const title = document.querySelector('title');
      if (title) {
        results.hasTitle = true;
        results.titleLength = title.textContent.trim().length;
        results.titleContent = title.textContent.trim();
      }

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        results.hasMetaDescription = true;
        results.metaDescriptionContent = metaDesc.getAttribute('content') || '';
        results.metaDescriptionLength = results.metaDescriptionContent.length;
      }

      // Keywords meta (deprecated but still check)
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      results.hasKeywords = !!metaKeywords;

      // Headings
      const h1s = document.querySelectorAll('h1');
      results.h1Count = h1s.length;
      results.hasH1 = h1s.length > 0;
      h1s.forEach(h => results.h1Contents.push(h.textContent.trim().substring(0, 50)));

      results.h2Count = document.querySelectorAll('h2').length;
      results.h3Count = document.querySelectorAll('h3').length;
      results.h4Count = document.querySelectorAll('h4').length;
      results.h5Count = document.querySelectorAll('h5').length;
      results.h6Count = document.querySelectorAll('h6').length;

      // Build heading structure
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        results.headingStructure.push({
          tag: h.tagName,
          text: h.textContent.trim().substring(0, 60)
        });
      });

      // Images
      const images = document.querySelectorAll('img');
      results.totalImages = images.length;
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        if (alt === null) {
          results.imagesWithoutAlt++;
        } else if (alt.trim() === '') {
          results.imagesWithEmptyAlt++;
        }
      });

      // Links
      const links = document.querySelectorAll('a[href]');
      results.totalLinks = links.length;
      const currentOrigin = window.location.origin;

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          if (href.startsWith('http') && !href.includes(currentOrigin)) {
            results.externalLinks++;
          } else {
            results.internalLinks++;
          }
          if (link.getAttribute('rel') === 'nofollow') {
            results.noFollowLinks++;
          }
        }
      });

      // Meta tags
      results.hasViewport = !!document.querySelector('meta[name="viewport"]');
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      results.viewportContent = viewportMeta?.getAttribute('content') || '';
      results.hasMobileFriendly = results.viewportContent.includes('width=device-width');

      results.hasCharset = !!document.querySelector('meta[charset]');
      results.hasCanonical = !!document.querySelector('link[rel="canonical"]');
      results.hasRobots = !!document.querySelector('meta[name="robots"]');
      results.hasFavicon = !!(
        document.querySelector('link[rel="icon"]') ||
        document.querySelector('link[rel="shortcut icon"]')
      );

      // Open Graph
      results.hasOpenGraph = !!(
        document.querySelector('meta[property="og:title"]') ||
        document.querySelector('meta[property="og:description"]') ||
        document.querySelector('meta[property="og:image"]')
      );

      // Twitter Card
      results.hasTwitterCard = !!(
        document.querySelector('meta[name="twitter:card"]') ||
        document.querySelector('meta[name="twitter:title"]')
      );

      // Structured Data
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      results.hasStructuredData = scripts.length > 0;
      scripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (Array.isArray(data)) {
            data.forEach(item => {
              if (item['@type']) results.structuredDataTypes.push(item['@type']);
            });
          } else if (data['@type']) {
            results.structuredDataTypes.push(data['@type']);
          }
        } catch (e) {
          // Invalid JSON
        }
      });

      // Content analysis
      const bodyText = document.body.textContent || '';
      results.wordCount = bodyText.trim().split(/\s+/).length;

      // Text to HTML ratio (rough estimate)
      const htmlLength = document.documentElement.innerHTML.length;
      results.textRatio = htmlLength > 0 ? ((bodyText.length / htmlLength) * 100).toFixed(2) : 0;

      // Scripts and stylesheets count
      results.scriptCount = document.querySelectorAll('script').length;
      results.stylesheetCount = document.querySelectorAll('link[rel="stylesheet"]').length;

      // Check for large images
      let hasLargeImage = false;
      document.querySelectorAll('img').forEach(img => {
        if (img.naturalWidth && img.naturalWidth > 2000) {
          hasLargeImage = true;
        }
      });
      results.hasLargeImages = hasLargeImage;

      return results;
    });

    // Process results and create issues
    seoData.title = seoChecks.titleContent;
    seoData.metaDescription = seoChecks.metaDescriptionContent;

    // Title issues
    if (!seoChecks.hasTitle) {
      issues.push({
        title: 'Missing Page Title',
        description: 'Your page has no <title> tag. Search engines need titles to understand what your page is about.',
        severity: 'critical',
        category: 'SEO'
      });
    } else if (seoChecks.titleLength < 30) {
      issues.push({
        title: 'Title Too Short',
        description: `Your title is only ${seoChecks.titleLength} characters. Aim for 50-60 characters for better SEO.`,
        severity: 'medium',
        category: 'SEO'
      });
    } else if (seoChecks.titleLength > 60) {
      issues.push({
        title: 'Title Too Long',
        description: `Your title is ${seoChecks.titleLength} characters. Google typically displays only 50-60 characters.`,
        severity: 'medium',
        category: 'SEO'
      });
    } else {
      goodPoints.push(`Title length is good (${seoChecks.titleLength} characters)`);
    }

    // Meta description issues
    if (!seoChecks.hasMetaDescription) {
      issues.push({
        title: 'Missing Meta Description',
        description: 'Your page has no meta description. This is important for search engine rankings and click-through rates.',
        severity: 'high',
        category: 'SEO'
      });
    } else if (seoChecks.metaDescriptionLength < 120) {
      issues.push({
        title: 'Meta Description Too Short',
        description: `Your meta description is only ${seoChecks.metaDescriptionLength} characters. Aim for 150-160 characters.`,
        severity: 'low',
        category: 'SEO'
      });
    } else if (seoChecks.metaDescriptionLength > 160) {
      warnings.push({
        title: 'Meta Description Too Long',
        description: `Your meta description is ${seoChecks.metaDescriptionLength} characters. It may be truncated in search results.`,
        category: 'SEO'
      });
    } else {
      goodPoints.push(`Meta description length is good (${seoChecks.metaDescriptionLength} characters)`);
    }

    // H1 issues
    if (!seoChecks.hasH1) {
      issues.push({
        title: 'Missing H1 Heading',
        description: 'Your page has no H1 heading. H1 helps search engines understand your main topic.',
        severity: 'high',
        category: 'SEO'
      });
    } else if (seoChecks.h1Count > 1) {
      issues.push({
        title: 'Multiple H1 Headings',
        description: `Your page has ${seoChecks.h1Count} H1 headings. Use only one H1 per page for better SEO.`,
        severity: 'medium',
        category: 'SEO'
      });
    } else {
      goodPoints.push('Page has a proper H1 heading');
    }

    // Heading structure
    if (seoChecks.h2Count === 0) {
      warnings.push({
        title: 'No H2 Headings',
        description: 'Consider adding H2 headings to structure your content better for both users and search engines.',
        category: 'SEO'
      });
    }

    // Image alt issues
    if (seoChecks.imagesWithoutAlt > 0) {
      issues.push({
        title: 'Images Missing Alt Text',
        description: `${seoChecks.imagesWithoutAlt} images are missing alt text. This is bad for SEO and accessibility.`,
        severity: seoChecks.imagesWithoutAlt > 5 ? 'high' : 'medium',
        category: 'SEO'
      });
    }
    if (seoChecks.imagesWithEmptyAlt > 5) {
      warnings.push({
        title: 'Many Images Have Empty Alt Text',
        description: `${seoChecks.imagesWithEmptyAlt} images have empty alt text. Consider adding descriptive alt text.`,
        category: 'SEO'
      });
    }

    // Viewport issues
    if (!seoChecks.hasViewport) {
      issues.push({
        title: 'Missing Viewport Meta Tag',
        description: 'Your page has no viewport meta tag. This causes mobile ranking issues.',
        severity: 'high',
        category: 'SEO'
      });
    } else if (!seoChecks.hasMobileFriendly) {
      warnings.push({
        title: 'Viewport Not Optimized for Mobile',
        description: 'Your viewport meta tag should include "width=device-width" for proper mobile display.',
        category: 'SEO'
      });
    }

    // Canonical URL
    if (!seoChecks.hasCanonical) {
      warnings.push({
        title: 'Missing Canonical URL',
        description: 'Consider adding a canonical link to prevent duplicate content issues.',
        category: 'SEO'
      });
    }

    // Open Graph
    if (!seoChecks.hasOpenGraph) {
      warnings.push({
        title: 'Missing Open Graph Tags',
        description: 'Your page lacks Open Graph tags. Add them for better social media sharing.',
        category: 'SEO'
      });
    }

    // Structured data
    if (!seoChecks.hasStructuredData) {
      warnings.push({
        title: 'No Structured Data Found',
        description: 'Consider adding JSON-LD structured data to help search engines understand your content better.',
        category: 'SEO'
      });
    } else {
      goodPoints.push(`Structured data found: ${seoChecks.structuredDataTypes.join(', ')}`);
    }

    // Content issues
    if (seoChecks.wordCount < 300) {
      issues.push({
        title: 'Thin Content',
        description: `Your page has only ~${seoChecks.wordCount} words. Aim for at least 300 words for better SEO.`,
        severity: 'medium',
        category: 'SEO'
      });
    } else if (seoChecks.wordCount > 300) {
      goodPoints.push(`Good content depth (${seoChecks.wordCount} words)`);
    }

    // Text to HTML ratio
    if (seoChecks.textRatio < 10) {
      warnings.push({
        title: 'Low Text to HTML Ratio',
        description: `Your text ratio is ${seoChecks.textRatio}%. Higher ratios (15%+) are better for SEO.`,
        category: 'SEO'
      });
    }

    // Favicon
    if (!seoChecks.hasFavicon) {
      warnings.push({
        title: 'Missing Favicon',
        description: 'Your page has no favicon. Add one for better branding in browser tabs.',
        category: 'SEO'
      });
    }

    seoData.checks = seoChecks;

  } catch (e) {
    issues.push({
      title: 'SEO Analysis Error',
      description: `Could not complete SEO analysis: ${e.message}`,
      severity: 'low',
      category: 'SEO'
    });
  }

  return { issues, goodPoints, warnings, data: seoData };
};

// ============================================
// SECURITY ANALYSIS - Complete security checkup
// ============================================
const analyzeSecurity = async (page, url) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const securityData = {};

  try {
    const securityChecks = await page.evaluate(() => {
      const results = {
        // HTTPS
        isHTTPS: window.location.protocol === 'https:',

        // Forms
        insecureForms: 0,
        formsWithoutAction: 0,
        passwordFields: 0,
        formsOnHTTPS: true,

        // Mixed content
        mixedContentLinks: 0,
        mixedContentImages: 0,
        mixedContentScripts: 0,
        mixedContentCSS: 0,

        // Sensitive data exposure
        exposedAPIKeys: [],
        exposedEmails: [],
        exposedPhones: [],

        // External scripts
        externalScripts: [],
        trackingScripts: [],

        // Cookies
        hasCookies: document.cookie ? document.cookie.length : 0,
        cookiesWithoutSecure: 0,
        cookiesWithoutSameSite: 0,

        // Headers (we can't access all headers from JS, but can check some)
        hasCSP: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
        hasXFrameOptions: false, // Can't check from JS

        // Other
        hasAutocomplete: false,
        hasInputValidation: false
      };

      // Check forms
      document.querySelectorAll('form').forEach(form => {
        const action = form.getAttribute('action');
        if (!action) {
          results.formsWithoutAction++;
        } else if (action.startsWith('http://')) {
          results.insecureForms++;
          if (window.location.protocol === 'https:') {
            results.formsOnHTTPS = false;
          }
        }
      });

      // Check password fields
      document.querySelectorAll('input[type="password"]').forEach(() => {
        results.passwordFields++;
      });

      // Check for autocomplete on password fields
      const passwordField = document.querySelector('input[type="password"]');
      if (passwordField) {
        results.hasAutocomplete = passwordField.hasAttribute('autocomplete');
      }

      // Check mixed content
      document.querySelectorAll('a[href^="http://"]').forEach(() => results.mixedContentLinks++);
      document.querySelectorAll('img[src^="http://"]').forEach(() => results.mixedContentImages++);
      document.querySelectorAll('script[src^="http://"]').forEach(() => results.mixedContentScripts++);
      document.querySelectorAll('link[href^="http://"]').forEach(link => {
        if (link.rel === 'stylesheet') results.mixedContentCSS++;
      });

      // Check external scripts
      document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
          const url = new URL(src);
          if (url.origin !== window.location.origin) {
            results.externalScripts.push(src);
          }
        }
      });

      // Check for tracking scripts
      if (window.ga || window._gaq) results.trackingScripts.push('Google Analytics');
      if (window.fbq) results.trackingScripts.push('Facebook Pixel');
      if (window.gtag) results.trackingScripts.push('Google Tag Manager');

      // Look for potential API key patterns in scripts
      document.querySelectorAll('script').forEach(script => {
        const text = script.textContent;
        if (text) {
          // Common API key patterns (basic check)
          if (text.match(/AIza[A-Za-z0-9_\-]{35}/)) results.exposedAPIKeys.push('Google API Key');
          if (text.match(/ghp_[A-Za-z0-9_]{36}/)) results.exposedAPIKeys.push('GitHub Token');
          if (text.match(/pk_test_[A-Za-z0-9]+/)) results.exposedAPIKeys.push('Stripe Test Key');
          if (text.match(/AKIA[A-Z0-9]{16}/)) results.exposedAPIKeys.push('AWS Access Key');
        }
      });

      // Look for exposed emails
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emailMatches = document.body.textContent?.match(emailRegex) || [];
      results.exposedEmails = [...new Set(emailMatches)].slice(0, 10); // Max 10

      return results;
    });

    // Process results

    // HTTPS check
    if (!securityChecks.isHTTPS) {
      issues.push({
        title: 'Site Not Using HTTPS',
        description: 'Your site is not using HTTPS. This is a security risk and affects SEO.',
        severity: 'critical',
        category: 'Security'
      });
    } else {
      goodPoints.push('Site is using HTTPS');
    }

    // Insecure forms
    if (securityChecks.insecureForms > 0) {
      issues.push({
        title: 'Insecure Form Submissions',
        description: `${securityChecks.insecureForms} form(s) submit to HTTP URLs. All forms should use HTTPS.`,
        severity: 'critical',
        category: 'Security'
      });
    }

    // Forms without action
    if (securityChecks.formsWithoutAction > 0) {
      warnings.push({
        title: 'Forms Without Action Attribute',
        description: `${securityChecks.formsWithoutAction} form(s) don't have an action attribute. Forms should explicitly state where they submit.`,
        category: 'Security'
      });
    }

    // Mixed content
    if (securityChecks.mixedContentScripts > 0) {
      issues.push({
        title: 'Mixed Content: Insecure Scripts',
        description: `${securityChecks.mixedContentScripts} script(s) are loaded over HTTP on an HTTPS page. Browsers will block these.`,
        severity: 'high',
        category: 'Security'
      });
    }
    if (securityChecks.mixedContentCSS > 0) {
      issues.push({
        title: 'Mixed Content: Insecure Stylesheets',
        description: `${securityChecks.mixedContentCSS} stylesheet(s) are loaded over HTTP on an HTTPS page.`,
        severity: 'medium',
        category: 'Security'
      });
    }
    if (securityChecks.mixedContentImages > 5) {
      warnings.push({
        title: 'Mixed Content: Insecure Images',
        description: `${securityChecks.mixedContentImages} image(s) are loaded over HTTP on an HTTPS page.`,
        category: 'Security'
      });
    }

    // Exposed API keys
    if (securityChecks.exposedAPIKeys.length > 0) {
      issues.push({
        title: 'Potential API Keys Exposed',
        description: `Found possible API keys in page source: ${securityChecks.exposedAPIKeys.join(', ')}. This is a critical security issue.`,
        severity: 'critical',
        category: 'Security'
      });
    }

    // Password field autocomplete
    if (securityChecks.passwordFields > 0 && !securityChecks.hasAutocomplete) {
      warnings.push({
        title: 'Password Field Missing Autocomplete',
        description: 'Password fields should have autocomplete enabled for better UX and password manager support.',
        category: 'Security'
      });
    }

    // Content Security Policy
    if (!securityChecks.hasCSP) {
      warnings.push({
        title: 'Missing Content Security Policy',
        description: 'Consider adding a Content-Security-Policy header to protect against XSS attacks.',
        category: 'Security'
      });
    }

    // External scripts
    if (securityChecks.externalScripts.length > 10) {
      warnings.push({
        title: 'Many External Scripts',
        description: `${securityChecks.externalScripts.length} external scripts loaded. Each external script is a potential security risk.`,
        category: 'Security'
      });
    }

    securityData.checks = securityChecks;

  } catch (e) {
    issues.push({
      title: 'Security Analysis Error',
      description: `Could not complete security analysis: ${e.message}`,
      severity: 'low',
      category: 'Security'
    });
  }

  return { issues, goodPoints, warnings, data: securityData };
};

// ============================================
// PERFORMANCE ANALYSIS - Complete performance checkup
// ============================================
const analyzePerformance = async (page, url) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const perfData = {};

  try {
    const perfChecks = await page.evaluate(() => {
      const results = {
        // Navigation timing
        domContentLoaded: 0,
        loadComplete: 0,
        firstPaint: 0,

        // Resources
        totalResources: 0,
        totalSize: 0,
        imageCount: 0,
        imageTotalSize: 0,
        scriptCount: 0,
        scriptTotalSize: 0,
        stylesheetCount: 0,
        stylesheetTotalSize: 0,
        fontCount: 0,
        fontTotalSize: 0,

        // Performance issues
        largeImages: [],
        unoptimizedImages: 0,
        renderBlockingResources: 0,

        // DOM complexity
        domElements: 0,
        maxDepth: 0,
        iframes: 0,

        // Caching indicators (can't actually check headers from JS)
        hasCacheHeaders: false
      };

      // Get performance timing if available
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        results.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
        results.loadComplete = timing.loadEventEnd - timing.navigationStart;
      }

      if (window.performance && window.performance.getEntriesByType) {
        const paintEntries = window.performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            results.firstPaint = entry.startTime;
          }
        });

        // Resource timing
        const resources = window.performance.getEntriesByType('resource');
        results.totalResources = resources.length;

        resources.forEach(resource => {
          const size = resource.transferSize || 0;
          results.totalSize += size;

          if (resource.initiatorType === 'img') {
            results.imageCount++;
            results.imageTotalSize += size;
            if (size > 500000) { // > 500KB
              results.largeImages.push({
                name: resource.name.substring(0, 50),
                size: size
              });
            }
          } else if (resource.initiatorType === 'script') {
            results.scriptCount++;
            results.scriptTotalSize += size;
          } else if (resource.initiatorType === 'link') {
            results.stylesheetCount++;
            results.stylesheetTotalSize += size;
          } else if (resource.initiatorType === 'css') {
            results.fontCount++;
            results.fontTotalSize += size;
          }
        });
      }

      // DOM complexity
      results.domElements = document.querySelectorAll('*').length;
      results.iframes = document.querySelectorAll('iframe').length;

      // Calculate DOM depth
      let maxDepth = 0;
      function calculateDepth(element, depth) {
        if (depth > maxDepth) maxDepth = depth;
        for (let i = 0; i < element.children.length; i++) {
          calculateDepth(element.children[i], depth + 1);
        }
      }
      if (document.body) {
        calculateDepth(document.body, 0);
      }
      results.maxDepth = maxDepth;

      // Check for render-blocking resources
      const headScripts = document.querySelectorAll('head script:not([async]):not([defer])');
      results.renderBlockingResources = headScripts.length;

      // Check for unoptimized images (lazy loading)
      const imagesWithoutLazy = document.querySelectorAll('img:not([loading]):not([src^="data:"])');
      results.unoptimizedImages = imagesWithoutLazy.length;

      return results;
    });

    // Process results

    // Load time issues
    if (perfChecks.domContentLoaded > 3000) {
      issues.push({
        title: 'Slow DOM Content Loaded',
        description: `DOM content loaded in ${(perfChecks.domContentLoaded / 1000).toFixed(1)}s. Aim for under 1.5 seconds.`,
        severity: perfChecks.domContentLoaded > 5000 ? 'high' : 'medium',
        category: 'Performance'
      });
    } else if (perfChecks.domContentLoaded > 0) {
      goodPoints.push(`Fast DOM content loaded (${(perfChecks.domContentLoaded / 1000).toFixed(1)}s)`);
    }

    // Large images
    if (perfChecks.largeImages.length > 0) {
      issues.push({
        title: 'Large Images Detected',
        description: `${perfChecks.largeImages.length} image(s) are larger than 500KB. Consider compressing or using modern formats like WebP.`,
        severity: 'medium',
        category: 'Performance'
      });
    }

    // Image optimization
    if (perfChecks.unoptimizedImages > 10) {
      warnings.push({
        title: 'Images Not Using Lazy Loading',
        description: `${perfChecks.unoptimizedImages} images don't use lazy loading. Add loading="lazy" to below-fold images.`,
        category: 'Performance'
      });
    }

    // DOM complexity
    if (perfChecks.domElements > 2500) {
      issues.push({
        title: 'High DOM Complexity',
        description: `Page has ${perfChecks.domElements} DOM elements. High DOM complexity slows down rendering.`,
        severity: perfChecks.domElements > 5000 ? 'high' : 'medium',
        category: 'Performance'
      });
    } else if (perfChecks.domElements < 500) {
      goodPoints.push('Reasonable DOM size');
    }

    // Render blocking resources
    if (perfChecks.renderBlockingResources > 3) {
      warnings.push({
        title: 'Render-Blocking Scripts',
        description: `${perfChecks.renderBlockingResources} script(s) in head are blocking render. Consider using async or defer.`,
        category: 'Performance'
      });
    }

    // Total page size
    const totalMB = (perfChecks.totalSize / (1024 * 1024)).toFixed(2);
    if (perfChecks.totalSize > 3000000) { // > 3MB
      issues.push({
        title: 'Large Page Size',
        description: `Total page size is ~${totalMB}MB. Aim for under 2MB for optimal performance.`,
        severity: 'medium',
        category: 'Performance'
      });
    } else if (perfChecks.totalSize > 0) {
      goodPoints.push(`Reasonable page size (~${totalMB}MB)`);
    }

    perfData.checks = perfChecks;
    perfData.loadTime = perfChecks.domContentLoaded;
    perfData.totalSize = perfChecks.totalSize;

  } catch (e) {
    issues.push({
      title: 'Performance Analysis Error',
      description: `Could not complete performance analysis: ${e.message}`,
      severity: 'low',
      category: 'Performance'
    });
  }

  return { issues, goodPoints, warnings, data: perfData };
};

// ============================================
// ACCESSIBILITY ANALYSIS - Complete a11y checkup
// ============================================
const analyzeAccessibility = async (page) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const a11yData = {};

  try {
    const a11yChecks = await page.evaluate(() => {
      const results = {
        // Alt text
        imagesWithoutAlt: 0,
        imagesWithEmptyAlt: 0,
        totalImages: 0,

        // ARIA labels
        buttonsWithoutLabel: 0,
        inputsWithoutLabel: 0,
        linksWithEmptyText: 0,

        // Color contrast (basic check)
        lowContrastElements: [],

        // Keyboard navigation
        skipLinks: 0,
        focusIndicators: false,

        // Semantic HTML
        hasLandmarks: false,
        hasNav: false,
        hasMain: false,
        hasHeader: false,
        hasFooter: false,

        // Form labels
        formFieldsWithoutLabels: 0,
        totalFormFields: 0,

        // Heading structure
        hasH1: false,
        skippedHeadings: [],

        // Tables
        tablesWithoutHeaders: 0,

        // iframes
        iframesWithoutTitle: 0,

        // ARIA
        hasAriaLabels: 0,
        hasAriaHidden: 0,
        hasRoleAttributes: 0,

        // Language
        hasLangAttribute: false
      };

      // Images
      const images = document.querySelectorAll('img');
      results.totalImages = images.length;
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        if (alt === null) {
          results.imagesWithoutAlt++;
        } else if (alt.trim() === '') {
          results.imagesWithEmptyAlt++;
        }
      });

      // Language attribute
      if (document.documentElement.getAttribute('lang')) {
        results.hasLangAttribute = true;
      }

      // Semantic landmarks
      results.hasNav = !!document.querySelector('nav, [role="navigation"]');
      results.hasMain = !!document.querySelector('main, [role="main"]');
      results.hasHeader = !!document.querySelector('header, [role="banner"]');
      results.hasFooter = !!document.querySelector('footer, [role="contentinfo"]');
      results.hasLandmarks = results.hasNav || results.hasMain || results.hasHeader || results.hasFooter;

      // Heading
      results.hasH1 = !!document.querySelector('h1');

      // Form fields
      const formFields = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
      results.totalFormFields = formFields.length;
      formFields.forEach(field => {
        const hasLabel = !!(
          document.querySelector(`label[for="${field.id}"]`) ||
          field.getAttribute('aria-label') ||
          field.getAttribute('aria-labelledby') ||
          field.closest('label')
        );
        if (!hasLabel) {
          results.formFieldsWithoutLabels++;
        }
      });

      // Buttons without labels
      const buttons = document.querySelectorAll('button, [role="button"]');
      buttons.forEach(btn => {
        const hasLabel = !!(
          btn.textContent?.trim() ||
          btn.getAttribute('aria-label') ||
          btn.getAttribute('title') ||
          btn.querySelector('img[alt]')
        );
        if (!hasLabel && btn.offsetParent !== null) { // Only visible buttons
          results.buttonsWithoutLabel++;
        }
      });

      // Links with empty text
      document.querySelectorAll('a').forEach(link => {
        const text = link.textContent?.trim();
        const ariaLabel = link.getAttribute('aria-label');
        if ((!text || text === '') && !ariaLabel) {
          results.linksWithEmptyText++;
        }
      });

      // Tables
      document.querySelectorAll('table').forEach(table => {
        const hasHeaders = !!(
          table.querySelector('th') ||
          table.querySelector('[scope]')
        );
        if (!hasHeaders) {
          results.tablesWithoutHeaders++;
        }
      });

      // iframes
      document.querySelectorAll('iframe').forEach(iframe => {
        const title = iframe.getAttribute('title');
        if (!title || title.trim() === '') {
          results.iframesWithoutTitle++;
        }
      });

      // ARIA attributes
      results.hasAriaLabels = document.querySelectorAll('[aria-label]').length;
      results.hasAriaHidden = document.querySelectorAll('[aria-hidden]').length;
      results.hasRoleAttributes = document.querySelectorAll('[role]').length;

      // Focus indicators (rough check via CSS)
      const styleSheet = Array.from(document.styleSheets).find(sheet => {
        try {
          return Array.from(sheet.cssRules || []).some(rule =>
            rule.cssText && rule.cssText.includes(':focus')
          );
        } catch (e) {
          return false;
        }
      });
      results.focusIndicators = !!styleSheet || !!document.querySelector('[class*="focus"]');

      return results;
    });

    // Process results

    // Images
    if (a11yChecks.imagesWithoutAlt > 0) {
      issues.push({
        title: 'Images Missing Alt Text',
        description: `${a11yChecks.imagesWithoutAlt} image(s) are missing alt text. Screen readers cannot describe these images.`,
        severity: a11yChecks.imagesWithoutAlt > 5 ? 'high' : 'medium',
        category: 'Accessibility'
      });
    }
    if (a11yChecks.imagesWithEmptyAlt > 3) {
      warnings.push({
        title: 'Images With Empty Alt Text',
        description: `${a11yChecks.imagesWithEmptyAlt} image(s) have empty alt text. Consider adding decorative alt or description.`,
        category: 'Accessibility'
      });
    }

    // Language attribute
    if (!a11yChecks.hasLangAttribute) {
      issues.push({
        title: 'Missing Language Attribute',
        description: 'The <html> element has no lang attribute. This helps screen readers use correct pronunciation.',
        severity: 'high',
        category: 'Accessibility'
      });
    } else {
      goodPoints.push('Page has language attribute');
    }

    // Semantic landmarks
    if (!a11yChecks.hasMain) {
      issues.push({
        title: 'Missing Main Landmark',
        description: 'Page has no <main> element or [role="main"]. Screen readers use this to navigate to main content.',
        severity: 'high',
        category: 'Accessibility'
      });
    }
    if (!a11yChecks.hasNav) {
      warnings.push({
        title: 'Missing Navigation Landmark',
        description: 'Page has no <nav> element or [role="navigation"]. Add this for better screen reader navigation.',
        category: 'Accessibility'
      });
    }

    // Form labels
    if (a11yChecks.formFieldsWithoutLabels > 0) {
      issues.push({
        title: 'Form Fields Without Labels',
        description: `${a11yChecks.formFieldsWithoutLabels} form field(s) don't have associated labels. This makes forms inaccessible.`,
        severity: 'high',
        category: 'Accessibility'
      });
    }

    // Buttons without labels
    if (a11yChecks.buttonsWithoutLabel > 0) {
      issues.push({
        title: 'Buttons Without Labels',
        description: `${a11yChecks.buttonsWithoutLabel} button(s) don't have accessible labels. Add aria-label or text content.`,
        severity: 'medium',
        category: 'Accessibility'
      });
    }

    // Links with empty text
    if (a11yChecks.linksWithEmptyText > 0) {
      issues.push({
        title: 'Links With Empty Text',
        description: `${a11yChecks.linksWithEmptyText} link(s) have no text content. Screen readers will announce "link" with no destination.`,
        severity: 'medium',
        category: 'Accessibility'
      });
    }

    // Tables without headers
    if (a11yChecks.tablesWithoutHeaders > 0) {
      issues.push({
        title: 'Tables Without Headers',
        description: `${a11yChecks.tablesWithoutHeaders} table(s) don't have header cells. Add <th> elements for accessibility.`,
        severity: 'medium',
        category: 'Accessibility'
      });
    }

    // iframes without title
    if (a11yChecks.iframesWithoutTitle > 0) {
      issues.push({
        title: 'iframes Without Titles',
        description: `${a11yChecks.iframesWithoutTitle} iframe(s) don't have title attributes. Screen readers need titles to describe iframe content.`,
        severity: 'medium',
        category: 'Accessibility'
      });
    }

    // H1 check
    if (!a11yChecks.hasH1) {
      warnings.push({
        title: 'Missing H1 Heading',
        description: 'Page has no H1 heading. This helps screen reader users understand the main topic.',
        category: 'Accessibility'
      });
    }

    // Positive findings
    if (a11yChecks.formFieldsWithoutLabels === 0 && a11yChecks.totalFormFields > 0) {
      goodPoints.push('All form fields have labels');
    }
    if (a11yChecks.imagesWithoutAlt === 0 && a11yChecks.totalImages > 0) {
      goodPoints.push('All images have alt text');
    }

    a11yData.checks = a11yChecks;

  } catch (e) {
    issues.push({
      title: 'Accessibility Analysis Error',
      description: `Could not complete accessibility analysis: ${e.message}`,
      severity: 'low',
      category: 'Accessibility'
    });
  }

  return { issues, goodPoints, warnings, data: a11yData };
};

// ============================================
// MOBILE RESPONSIVENESS ANALYSIS
// ============================================
const analyzeMobile = async (page, url) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const mobileData = {};

  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);

  try {
    const mobileChecks = await page.evaluate(() => {
      const results = {
        // Viewport
        hasViewportMeta: false,
        viewportContent: '',
        hasDeviceWidth: false,

        // Touch targets
        smallTouchTargets: 0,
        totalInteractiveElements: 0,

        // Text readability
        hasSmallText: false,
        fontSizeIssues: [],

        // Layout
        hasHorizontalScroll: false,
        contentOverflow: false,
        viewportTooNarrow: false,

        // Mobile menu
        hasMobileMenu: false,
        hasHamburger: false,

        // Images
        responsiveImages: 0,
        fixedWidthImages: 0,

        // Forms
        inputsTooSmall: 0,
        selectTooSmall: 0
      };

      // Check viewport meta
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        results.hasViewportMeta = true;
        results.viewportContent = viewportMeta.getAttribute('content');
        results.hasDeviceWidth = results.viewportContent.includes('width=device-width');
      }

      // Check for horizontal scroll
      results.hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      // Check content overflow
      const bodyWidth = document.body.scrollWidth;
      results.contentOverflow = bodyWidth > window.innerWidth;

      // Check for mobile menu indicators
      results.hasHamburger = !!(
        document.querySelector('[class*="hamburger"]') ||
        document.querySelector('[class*="mobile-menu"]') ||
        document.querySelector('[class*="nav-toggle"]') ||
        document.querySelector('button[aria-expanded]') ||
        document.querySelector('[class*="menu-toggle"]')
      );
      results.hasMobileMenu = results.hasHamburger;

      // Check touch target sizes
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [onclick]');
      results.totalInteractiveElements = interactiveElements.length;

      interactiveElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.width < 44 && rect.height < 44) {
          // Touch target should be at least 44x44
          results.smallTouchTargets++;
        }
      });

      // Check text sizes
      const bodyStyles = window.getComputedStyle(document.body);
      const bodyFontSize = parseFloat(bodyStyles.fontSize);
      results.hasSmallText = bodyFontSize < 14;

      // Check for small inputs (common mobile issue)
      document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
        const styles = window.getComputedStyle(input);
        const fontSize = parseFloat(styles.fontSize);
        const height = parseFloat(styles.height) || input.offsetHeight;
        if (fontSize < 16 || height < 44) {
          results.inputsTooSmall++;
        }
      });

      // Check select elements
      document.querySelectorAll('select').forEach(select => {
        const height = select.offsetHeight || parseFloat(window.getComputedStyle(select).height);
        if (height < 44) {
          results.selectTooSmall++;
        }
      });

      // Check for fixed-width images
      document.querySelectorAll('img').forEach(img => {
        const hasResponsiveClass = img.className && (
          img.className.includes('img-fluid') ||
          img.className.includes('img-responsive') ||
          img.className.includes('responsive') ||
          img.className.includes('max-width')
        );
        const hasResponsiveStyle = img.style.maxWidth === '100%' ||
                               img.style.width === '100%';

        if (!hasResponsiveClass && !hasResponsiveStyle && img.width > 300) {
          results.fixedWidthImages++;
        } else {
          results.responsiveImages++;
        }
      });

      return results;
    });

    // Process results

    // Viewport
    if (!mobileChecks.hasViewportMeta) {
      issues.push({
        title: 'Missing Viewport Meta Tag',
        description: 'Mobile browsers cannot properly render pages without viewport meta tag.',
        severity: 'critical',
        category: 'Mobile'
      });
    } else if (!mobileChecks.hasDeviceWidth) {
      issues.push({
        title: 'Viewport Not Optimized for Mobile',
        description: 'Viewport should include "width=device-width" for proper mobile rendering.',
        severity: 'high',
        category: 'Mobile'
      });
    } else {
      goodPoints.push('Viewport is properly configured for mobile');
    }

    // Horizontal scroll
    if (mobileChecks.hasHorizontalScroll || mobileChecks.contentOverflow) {
      issues.push({
        title: 'Horizontal Scroll on Mobile',
        description: 'Page requires horizontal scrolling on mobile. Content should fit within the viewport width.',
        severity: 'high',
        category: 'Mobile'
      });
    } else {
      goodPoints.push('Content fits mobile viewport');
    }

    // Touch targets
    if (mobileChecks.smallTouchTargets > 5) {
      issues.push({
        title: 'Touch Targets Too Small',
        description: `${mobileChecks.smallTouchTargets} interactive element(s) are too small for touch (< 44x44px). Increase tap target size.`,
        severity: 'medium',
        category: 'Mobile'
      });
    }

    // Text size
    if (mobileChecks.hasSmallText) {
      warnings.push({
        title: 'Text Too Small on Mobile',
        description: 'Body text is smaller than 14px. Consider using at least 16px for better readability.',
        category: 'Mobile'
      });
    }

    // Mobile menu
    if (!mobileChecks.hasMobileMenu) {
      warnings.push({
        title: 'No Mobile Menu Detected',
        description: 'Could not find a mobile menu (hamburger icon). Navigation may be difficult on small screens.',
        category: 'Mobile'
      });
    }

    // Input sizes
    if (mobileChecks.inputsTooSmall > 0) {
      issues.push({
        title: 'Input Fields Too Small on Mobile',
        description: `${mobileChecks.inputsTooSmall} input field(s) are too small for comfortable mobile input. Use minimum 16px font and 44px height.`,
        severity: 'medium',
        category: 'Mobile'
      });
    }

    // Fixed width images
    if (mobileChecks.fixedWidthImages > 3) {
      warnings.push({
        title: 'Images May Not Be Responsive',
        description: `${mobileChecks.fixedWidthImages} image(s) may not scale properly on mobile. Use max-width: 100% or responsive classes.`,
        category: 'Mobile'
      });
    }

    mobileData.checks = mobileChecks;

  } catch (e) {
    issues.push({
      title: 'Mobile Analysis Error',
      description: `Could not complete mobile analysis: ${e.message}`,
      severity: 'low',
      category: 'Mobile'
    });
  }

  // Reset to desktop
  await page.setViewportSize({ width: 1920, height: 1080 });

  return { issues, goodPoints, warnings, data: mobileData };
};

// ============================================
// UX ANALYSIS - Complete UX checkup
// ============================================
const analyzeUX = async (page) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const uxData = {};

  try {
    const uxChecks = await page.evaluate(() => {
      const results = {
        // Navigation
        hasNavigation: false,
        navigationItems: 0,
        hasBreadcrumbs: false,
        hasSearch: false,

        // CTAs
        ctaButtons: 0,
        primaryCTAVisible: false,

        // Links
        deadLinks: 0,
        confusingLinks: 0,

        // Content
        hasHeroSection: false,
        hasFooter: false,
        hasHeader: false,

        // Forms
        hasContactForm: false,
        hasNewsletterSignup: false,

        // User guidance
        has404Page: false,
        hasErrorHandling: false,

        // Popups
        hasPopup: false,
        hasCookieBanner: false,
        hasNewsletterPopup: false,

        // Design
        colorContrastIssues: 0,
        clutteredElements: 0,

        // Scroll behavior
        hasBackToTop: false,
        hasStickyHeader: false
      };

      // Navigation
      const nav = document.querySelector('nav, [role="navigation"], .nav, .navbar, .navigation, header nav');
      results.hasNavigation = !!nav;
      if (nav) {
        results.navigationItems = nav.querySelectorAll('a').length;
      }

      // Header/Footer
      results.hasHeader = !!document.querySelector('header, .header, [role="banner"]');
      results.hasFooter = !!document.querySelector('footer, .footer, [role="contentinfo"]');

      // Breadcrumbs
      results.hasBreadcrumbs = !!(
        document.querySelector('.breadcrumb') ||
        document.querySelector('[aria-label*="breadcrumb"]') ||
        document.querySelector('nav[aria-label="Breadcrumb"]')
      );

      // Search
      results.hasSearch = !!(
        document.querySelector('input[type="search"]') ||
        document.querySelector('input[name*="search" i]') ||
        document.querySelector('[class*="search"]')
      );

      // Hero section
      const hero = document.querySelector('.hero, .banner, [class*="hero"], header');
      if (hero) {
        const hasHeroText = hero.textContent?.trim().length > 50;
        const hasHeroButton = hero.querySelector('button, a[class*="btn"], a[class*="button"]');
        results.hasHeroSection = hasHeroText || hasHeroButton;
      }

      // CTAs
      const ctaKeywords = ['buy', 'shop', 'order', 'get started', 'sign up', 'subscribe', 'register', 'join', 'contact', 'learn more'];
      document.querySelectorAll('button, a').forEach(el => {
        const text = (el.textContent || '').toLowerCase().trim();
        if (ctaKeywords.some(keyword => text.includes(keyword))) {
          results.ctaButtons++;
          if (!results.primaryCTAVisible) {
            const rect = el.getBoundingClientRect();
            results.primaryCTAVisible = rect.top >= 0 && rect.top < 500; // In viewport
          }
        }
      });

      // Forms
      results.hasContactForm = !!(
        document.querySelector('form[action*="contact" i]') ||
        document.querySelector('form[id*="contact" i]') ||
        document.querySelector('textarea[name*="message" i]')
      );
      results.hasNewsletterSignup = !!(
        document.querySelector('input[type="email"]') &&
        document.querySelector('form[action*="subscribe" i], form[class*="newsletter" i]')
      );

      // Dead/empty links
      document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
          results.deadLinks++;
        }
      });

      // Popups
      results.hasPopup = !!(
        document.querySelector('[class*="popup"]') ||
        document.querySelector('[class*="modal"]:not([hidden])') ||
        document.querySelector('[role="dialog"]')
      );
      results.hasCookieBanner = !!(
        document.querySelector('[class*="cookie"]') ||
        document.querySelector('[id*="cookie"]') ||
        document.querySelector('[class*="consent"]')
      );

      // Back to top button
      results.hasBackToTop = !!(
        document.querySelector('a[href="#top"]') ||
        document.querySelector('[class*="back-to-top"]') ||
        document.querySelector('[class*="scrolltop"]')
      );

      // Sticky header check
      const header = document.querySelector('header, .header');
      if (header) {
        const styles = window.getComputedStyle(header);
        results.hasStickyHeader = styles.position === 'sticky' || styles.position === 'fixed';
      }

      return results;
    });

    // Process results

    // Navigation
    if (!uxChecks.hasNavigation) {
      issues.push({
        title: 'No Navigation Menu',
        description: 'Page has no visible navigation menu. Users cannot find other pages.',
        severity: 'critical',
        category: 'UX'
      });
    } else {
      goodPoints.push(`Navigation menu found with ${uxChecks.navigationItems} items`);
    }

    // CTAs
    if (uxChecks.ctaButtons === 0) {
      issues.push({
        title: 'No Clear Call-to-Action',
        description: 'No clear CTA buttons found (Buy, Sign Up, Contact, etc.). Users may not know what to do.',
        severity: 'high',
        category: 'UX'
      });
    } else if (!uxChecks.primaryCTAVisible) {
      warnings.push({
        title: 'CTA Not Above the Fold',
        description: 'CTAs are present but may not be visible without scrolling.',
        category: 'UX'
      });
    } else {
      goodPoints.push(`Found ${uxChecks.ctaButtons} call-to-action elements`);
    }

    // Dead links
    if (uxChecks.deadLinks > 3) {
      issues.push({
        title: 'Dead/Empty Links Found',
        description: `${uxChecks.deadLinks} links go nowhere (href="#" or javascript:void(0)). This confuses users.`,
        severity: 'medium',
        category: 'UX'
      });
    }

    // Header/Footer
    if (!uxChecks.hasHeader) {
      warnings.push({
        title: 'No Header Section',
        description: 'Page has no clear header section. Consider adding one for better navigation.',
        category: 'UX'
      });
    }
    if (!uxChecks.hasFooter) {
      warnings.push({
        title: 'No Footer Section',
        description: 'Page has no footer. Add footer with contact info, links, and legal pages.',
        category: 'UX'
      });
    }

    // Hero section
    if (!uxChecks.hasHeroSection) {
      warnings.push({
        title: 'No Clear Hero Section',
        description: 'Page lacks a clear hero section with main message and CTA.',
        category: 'UX'
      });
    } else {
      goodPoints.push('Page has a hero section');
    }

    // Search
    if (!uxChecks.hasSearch) {
      warnings.push({
        title: 'No Search Functionality',
        description: 'No search feature found. Consider adding search for better content discovery.',
        category: 'UX'
      });
    }

    // Contact form
    if (!uxChecks.hasContactForm) {
      warnings.push({
        title: 'No Contact Form',
        description: 'No obvious way for users to contact you. Add a contact form or contact info.',
        category: 'UX'
      });
    }

    // Popups
    if (uxChecks.hasPopup || uxChecks.hasCookieBanner) {
      warnings.push({
        title: 'Popups Detected',
        description: uxChecks.hasCookieBanner
          ? 'Cookie banner detected. Ensure it\'s easy to dismiss.'
          : 'Popup/modal detected. Ensure it doesn\'t block important content.',
        category: 'UX'
      });
    } else {
      goodPoints.push('No intrusive popups');
    }

    uxData.checks = uxChecks;

  } catch (e) {
    issues.push({
      title: 'UX Analysis Error',
      description: `Could not complete UX analysis: ${e.message}`,
      severity: 'low',
      category: 'UX'
    });
  }

  return { issues, goodPoints, warnings, data: uxData };
};

// ============================================
// UI ANALYSIS - Complete UI checkup
// ============================================
const analyzeUI = async (page) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const uiData = {};

  try {
    const uiChecks = await page.evaluate(() => {
      const results = {
        // Typography
        fontCount: 0,
        hasConsistentFonts: true,
        fontSizeVariations: [],

        // Colors
        hasColorScheme: false,
        darkModeSupport: false,

        // Spacing/Layout
        hasWhitespace: true,
        hasGridAlignment: false,

        // Images
        brokenImages: 0,
        totalImages: 0,

        // Consistency
        buttonStylesCount: 0,
        headingStylesCount: 0,

        // Visual hierarchy
        hasVisualHierarchy: true,
        hasContrastIssues: false,

        // Responsive
        hasResponsiveClasses: false,

        // Modern UI indicators
        hasAnimations: false,
        hasGradients: false,
        hasShadows: false,

        // Loading states
        hasLoadingIndicators: false,

        // Error states
        hasErrorStyles: false
      };

      // Count unique fonts
      const fonts = new Set();
      document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        const font = styles.fontFamily;
        if (font) fonts.add(font.split(',')[0]);
      });
      results.fontCount = fonts.size;
      results.hasConsistentFonts = fonts.size <= 4;

      // Font size variations
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingSizes = new Set();
      headingElements.forEach(h => {
        headingSizes.add(window.getComputedStyle(h).fontSize);
      });
      results.fontSizeVariations = headingSizes.size;

      // Check for responsive classes
      results.hasResponsiveClasses = !!(
        document.querySelector('[class*="col-"]') ||
        document.querySelector('[class*="md:"]') ||
        document.querySelector('[class*="lg:"]') ||
        document.querySelector('[class*="sm:"]') ||
        document.querySelector('.container') ||
        document.querySelector('.container-fluid')
      );

      // Check for modern UI features
      results.hasGradients = !!(
        document.querySelector('[style*="gradient"]') ||
        Array.from(document.querySelectorAll('[class*="bg"]')).some(el =>
          el.className.includes('gradient') || el.className.includes('from-')
        )
      );

      results.hasShadows = !!(
        document.querySelector('[style*="shadow"]') ||
        document.querySelector('[class*="shadow"]')
      );

      results.hasAnimations = !!(
        document.querySelector('[class*="animate"]') ||
        document.querySelector('[class*="transition"]') ||
        document.querySelector('style')?.textContent.includes('animation') ||
        document.querySelector('style')?.textContent.includes('transition')
      );

      // Check images
      const images = document.querySelectorAll('img');
      results.totalImages = images.length;
      images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
          results.brokenImages++;
        }
      });

      // Check for loading indicators
      results.hasLoadingIndicators = !!(
        document.querySelector('[class*="loading"]') ||
        document.querySelector('[class*="spinner"]') ||
        document.querySelector('[role="status"]')
      );

      // Check dark mode
      const hasDarkModeMedia = !!(
        Array.from(document.styleSheets).some(sheet => {
          try {
            return Array.from(sheet.cssRules || []).some(rule =>
              rule.cssText && rule.cssText.includes('@media (prefers-color-scheme: dark)')
            );
          } catch (e) {
            return false;
          }
        })
      );
      results.darkModeSupport = hasDarkModeMedia;

      return results;
    });

    // Process results

    // Typography
    if (uiChecks.fontCount > 5) {
      warnings.push({
        title: 'Too Many Font Families',
        description: `Using ${uiChecks.fontCount} different fonts. Stick to 2-3 fonts for consistency.`,
        category: 'UI'
      });
    } else if (uiChecks.hasConsistentFonts) {
      goodPoints.push('Consistent font usage');
    }

    // Images
    if (uiChecks.brokenImages > 0) {
      issues.push({
        title: 'Broken Images',
        description: `${uiChecks.brokenImages} image(s) are not loading properly.`,
        severity: 'high',
        category: 'UI'
      });
    } else if (uiChecks.totalImages > 0) {
      goodPoints.push('All images loading correctly');
    }

    // Modern UI
    if (uiChecks.hasResponsiveClasses) {
      goodPoints.push('Uses responsive design patterns');
    } else {
      warnings.push({
        title: 'No Responsive Design Detected',
        description: 'Page may not have responsive classes or grid system. May not work well on different screen sizes.',
        category: 'UI'
      });
    }

    // Dark mode
    if (uiChecks.darkModeSupport) {
      goodPoints.push('Dark mode support detected');
    }

    uiData.checks = uiChecks;

  } catch (e) {
    issues.push({
      title: 'UI Analysis Error',
      description: `Could not complete UI analysis: ${e.message}`,
      severity: 'low',
      category: 'UI'
    });
  }

  return { issues, goodPoints, warnings, data: uiData };
};

// ============================================
// FUNCTIONALITY ANALYSIS - Complete functionality checkup
// ============================================
const analyzeFunctionality = async (page) => {
  const issues = [];
  const goodPoints = [];
  const warnings = [];
  const funcData = {};

  try {
    const funcChecks = await page.evaluate(() => {
      const results = {
        // JavaScript
        hasJSErrors: false,
        hasJSLibraries: 0,

        // Forms
        formsCount: 0,
        formsWithValidation: 0,
        workingForms: 0,

        // Links
        totalLinks: 0,
        emptyLinks: 0,
        javascriptLinks: 0,

        // Media
        videosWithControls: 0,
        videosWithoutControls: 0,
        audioElements: 0,

        // Downloads
        downloadableFiles: [],

        // External resources
        brokenResources: 0,

        // 404s
        has404Indicators: false,

        // Loading
        hasLazyLoading: false,
        lazyElements: 0
      };

      // Check for JavaScript errors (basic check)
      results.hasJSErrors = !!(window.console && window.console.error);

      // Count JS libraries
      const scripts = document.querySelectorAll('script[src]');
      results.hasJSLibraries = scripts.length;
      results.hasJSLibraries = scripts.filter(s => !s.src.startsWith(window.location.origin)).length;

      // Forms
      const forms = document.querySelectorAll('form');
      results.formsCount = forms.length;
      forms.forEach(form => {
        const hasRequired = !!form.querySelector('[required]');
        const hasPattern = !!form.querySelector('[pattern]');
        const hasTypeValidation = !!form.querySelector('input[type="email"], input[type="number"], input[type="tel"]');

        if (hasRequired || hasPattern || hasTypeValidation) {
          results.formsWithValidation++;
        }
        if (form.querySelector('button[type="submit"], input[type="submit"]')) {
          results.workingForms++;
        }
      });

      // Links
      const links = document.querySelectorAll('a[href]');
      results.totalLinks = links.length;
      links.forEach(a => {
        const href = a.getAttribute('href');
        if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
          results.emptyLinks++;
        }
        if (href && href.startsWith('javascript:')) {
          results.javascriptLinks++;
        }
      });

      // Videos
      document.querySelectorAll('video').forEach(video => {
        if (video.hasAttribute('controls')) {
          results.videosWithControls++;
        } else {
          results.videosWithoutControls++;
        }
      });
      results.audioElements = document.querySelectorAll('audio').length;

      // Downloadable files
      document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".zip"], a[href$=".doc"]').forEach(a => {
        results.downloadableFiles.push(a.getAttribute('href') || '');
      });

      // Lazy loading
      const lazyElements = document.querySelectorAll('[loading="lazy"], [data-src], .lazy');
      results.lazyElements = lazyElements.length;
      results.hasLazyLoading = lazyElements.length > 0;

      // 404 indicators
      const title404 = document.title.includes('404');
      const body404 = document.body.textContent.includes('404') || document.body.textContent.includes('Not Found');
      const hasErrorClass = document.querySelector('.error, .error-page, .not-found');
      results.has404Indicators = title404 || body404 || !!hasErrorClass;

      return results;
    });

    // Process results

    // Forms
    if (funcChecks.formsCount > 0 && funcChecks.formsWithValidation === 0) {
      warnings.push({
        title: 'Forms May Lack Validation',
        description: `${funcChecks.formsCount} form(s) found but none have visible validation attributes.`,
        category: 'Functionality'
      });
    } else if (funcChecks.formsWithValidation > 0) {
      goodPoints.push(`Forms have validation (${funcChecks.formsWithValidation}/${funcChecks.formsCount})`);
    }

    // Videos
    if (funcChecks.videosWithoutControls > 0) {
      issues.push({
        title: 'Videos Without Controls',
        description: `${funcChecks.videosWithoutControls} video(s) don't have controls. Users cannot pause/play the video.`,
        severity: 'medium',
        category: 'Functionality'
      });
    }

    // Empty links
    if (funcChecks.emptyLinks > 5) {
      issues.push({
        title: 'Many Empty/Dead Links',
        description: `${funcChecks.emptyLinks} links don't go anywhere. Remove or fix these for better UX.`,
        severity: 'medium',
        category: 'Functionality'
      });
    }

    // JavaScript links
    if (funcChecks.javascriptLinks > 5) {
      warnings.push({
        title: 'JavaScript Links Detected',
        description: `${funcChecks.javascriptLinks} links use javascript:. This is bad practice and accessibility.`,
        category: 'Functionality'
      });
    }

    // Lazy loading
    if (funcChecks.hasLazyLoading) {
      goodPoints.push(`Lazy loading implemented (${funcChecks.lazyElements} elements)`);
    }

    // 404
    if (funcChecks.has404Indicators) {
      issues.push({
        title: '404 Error Page Detected',
        description: 'This page appears to be a 404 error page.',
        severity: 'critical',
        category: 'Functionality'
      });
    }

    funcData.checks = funcChecks;

  } catch (e) {
    issues.push({
      title: 'Functionality Analysis Error',
      description: `Could not complete functionality analysis: ${e.message}`,
      severity: 'low',
      category: 'Functionality'
    });
  }

  return { issues, goodPoints, warnings, data: funcData };
};

// ============================================
// PAGE DISCOVERY - Find all pages
// ============================================
const discoverAllPages = async (page, baseUrl, maxPages = 20) => {
  const pages = new Set();
  pages.add('/');
  pages.add(baseUrl);

  try {
    // Get all links from homepage
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({
          href: a.getAttribute('href'),
          text: a.textContent?.trim().substring(0, 50)
        }))
        .filter(link => {
          const href = link.href;
          if (!href) return false;
          // Filter out external links, anchors, mailto, tel
          if (href.startsWith('http') && !href.includes(arguments[0]?.origin)) return false;
          if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
          if (href.includes('.pdf') || href.includes('.jpg') || href.includes('.png')) return false;
          return true;
        })
        .slice(0, 100);
    }, baseUrl);

    // Extract unique internal pages
    for (const link of links) {
      try {
        const url = new URL(link.href, baseUrl);
        const path = url.pathname;

        // Clean up common patterns
        const cleanPath = path
          .replace(/\/\d+$/g, '') // Remove trailing numbers (pagination/product IDs)
          .replace(/\/page\/\d+$/g, '') // Remove pagination
          .split('?')[0] // Remove query params
          .split('#')[0]; // Remove hashes

        // Only add meaningful paths
        if (cleanPath && cleanPath !== '/' && cleanPath.length > 1) {
          const validPath = cleanPath.replace(/\/+/g, '/'); // Remove double slashes
          if (!pages.has(validPath) && pages.size < maxPages) {
            pages.add(validPath);
          }
        }
      } catch (e) {
        // Skip invalid URLs
      }
    }

  } catch (e) {
    console.warn('Page discovery warning:', e.message);
  }

  return Array.from(pages);
};

// ============================================
// INTERACTIVE ELEMENT TESTER - Actually click stuff
// ============================================
const testInteractiveElements = async (page, url) => {
  const results = {
    buttons: { total: 0, clickable: 0, working: 0, broken: 0, details: [] },
    forms: { total: 0, working: 0, broken: 0, details: [] },
    links: { total: 0, working: 0, broken: 0, details: [] },
    navigation: { hasNav: false, menuItems: 0, mobileMenuWorks: false, details: [] },
    modals: { found: 0, closable: 0, details: [] }
  };

  try {
    // Test Navigation
    await page.evaluate(() => {
      const nav = document.querySelector('nav, [role="navigation"], .navbar, .navigation, header nav');
      if (nav) {
        const links = nav.querySelectorAll('a[href], button').length;
        return { hasNav: true, menuItems: links, navExists: true };
      }
      return { hasNav: false, menuItems: 0, navExists: false };
    }).then(navResult => {
      results.navigation.hasNav = navResult.navExists;
      results.navigation.menuItems = navResult.menuItems;
      results.navigation.details.push(`Navigation ${navResult.navExists ? 'found' : 'NOT found'} with ${navResult.menuItems} items`);
    });

    // Test Buttons - Actually hover and check response
    const buttonData = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], a[class*="btn"], a[class*="Btn"], a[class*="button"], input[type="submit"], input[type="button"]'));

      return buttons.map((btn, index) => {
        const rect = btn.getBoundingClientRect();
        const style = window.getComputedStyle(btn);
        const isVisible = rect.width > 5 && rect.height > 5 &&
                          style.visibility !== 'hidden' &&
                          style.display !== 'none' &&
                          style.opacity !== '0';
        const text = btn.textContent?.trim().substring(0, 40) || btn.getAttribute('aria-label') || btn.getAttribute('title') || '';
        const tagName = btn.tagName.toLowerCase();
        const type = btn.getAttribute('type') || 'button';

        // Check if it's a CTA
        const textLower = text.toLowerCase();
        const isCTA = ['buy', 'shop', 'order', 'add', 'cart', 'book', 'sign', 'register', 'subscribe', 'join', 'get started', 'learn more', 'contact', 'try free', 'start'].some(cta => textLower.includes(cta));

        return { index, isVisible, text, tagName, type, isCTA };
      });
    });

    results.buttons.total = buttonData.filter(b => b.isVisible).length;

    // Count clickable buttons by type
    const workingButtons = buttonData.filter(b => b.isVisible && !b.disabled);
    results.buttons.clickable = workingButtons.length;
    results.buttons.details.push(`Found ${results.buttons.total} visible buttons (${workingButtons.filter(b => b.isCTA).length} appear to be CTAs)`);

    // Test Forms - Check if they're actually submittable
    const formData = await page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));

      return forms.map((form, index) => {
        const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
        const hasSubmit = form.querySelector('button[type="submit"], input[type="submit"], input[type="image"]');
        const action = form.getAttribute('action') || window.location.href;
        const method = form.getAttribute('method') || 'GET';

        // Check for common form types
        const isLogin = form.querySelector('input[type="password"], input[name*="login" i], input[name*="email" i]');
        const isSearch = form.querySelector('input[type="search"], input[name*="search" i]');
        const isContact = form.querySelector('textarea, input[name*="message" i], input[name*="comment" i]');

        let formType = 'unknown';
        if (isLogin) formType = 'login/signup';
        else if (isSearch) formType = 'search';
        else if (isContact) formType = 'contact';
        else if (action.includes('cart') || action.includes('checkout')) formType = 'ecommerce';

        return { index, inputCount: inputs.length, hasSubmit, action, method, formType };
      });
    });

    results.forms.total = formData.length;
    results.forms.working = formData.filter(f => f.hasSubmit).length;
    results.forms.details.push(...formData.map(f => `${f.formType} form (${f.inputCount} inputs) - ${f.hasSubmit ? '✓' : '✗ no submit'}`));

    // Test Links by sampling
    const linkData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]')).slice(0, 30).map(a => ({
        href: a.getAttribute('href'),
        text: a.textContent?.trim().substring(0, 30) || '[no text]',
        hasIcon: !!a.querySelector('svg, i, img'),
        isExternal: !a.getAttribute('href')?.startsWith('/')
      }));
    });

    results.links.total = linkData.length;
    results.links.details.push(`Sampled ${linkData.length} links`);

    // Test Modals/Popups
    const modalsFound = await page.evaluate(() => {
      const modals = document.querySelectorAll('[role="dialog"], .modal, .popup, [class*="modal"], [class*="popup"], [class*="overlay"]');
      return modals.length;
    });

    results.modals.found = modalsFound;
    if (modalsFound > 0) {
      results.modals.details.push(`Found ${modalsFound} modal elements`);
    }

  } catch (e) {
    console.warn('Interactive test error:', e.message);
  }

  return results;
};

// ============================================
// AUTH/LOGIN FLOW TESTER
// ============================================
const testAuthFlow = async (page, url) => {
  const authResults = {
    hasLogin: false,
    hasSignup: false,
    loginPageAccessible: false,
    signupPageAccessible: false,
    socialLoginAvailable: false,
    issues: [],
    details: []
  };

  try {
    // Check for login/signup elements on main page
    const mainPageAuth = await page.evaluate(() => {
      const loginLinks = Array.from(document.querySelectorAll('a, button')).filter(el => {
        const text = (el.textContent || '').toLowerCase();
        return text.includes('login') || text.includes('sign in') || text.includes('log in');
      });

      const signupLinks = Array.from(document.querySelectorAll('a, button')).filter(el => {
        const text = (el.textContent || '').toLowerCase();
        return text.includes('sign up') || text.includes('register') || text.includes('create account') || text.includes('join');
      });

      const loginForms = document.querySelectorAll('input[type="password"], input[name*="login" i], input[name*="email" i]');
      const hasSocialLogin = !!(
        document.querySelector('a[href*="facebook"]') ||
        document.querySelector('a[href*="google"]') ||
        document.querySelector('[class*="facebook"]') ||
        document.querySelector('[class*="google"]') ||
        document.querySelector('[class*="oauth"]')
      );

      return {
        loginLinkCount: loginLinks.length,
        signupLinkCount: signupLinks.length,
        loginFormCount: loginForms.length,
        hasSocialLogin
      };
    });

    authResults.hasLogin = mainPageAuth.loginLinkCount > 0 || mainPageAuth.loginFormCount > 0;
    authResults.hasSignup = mainPageAuth.signupLinkCount > 0;
    authResults.socialLoginAvailable = mainPageAuth.hasSocialLogin;

    if (mainPageAuth.loginLinkCount > 0) {
      authResults.details.push(`Found ${mainPageAuth.loginLinkCount} login link(s) on homepage`);
    }

    if (mainPageAuth.signupLinkCount > 0) {
      authResults.details.push(`Found ${mainPageAuth.signupLinkCount} signup link(s) on homepage`);
    }

    if (mainPageAuth.loginFormCount > 0) {
      authResults.details.push(`Found ${mainPageAuth.loginFormCount} login form(s) on homepage`);
    }

    // Check for Pricing page
    console.log('💰 Checking for Pricing page...');
    const pricingLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      const pricingLink = links.find(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        const text = (a.textContent || '').toLowerCase();
        // Check for pricing related keywords
        return href.includes('pricing') || href.includes('price') || href.includes('plan') ||
               text.includes('pricing') || text.includes('price') || text.includes('plan') ||
               text.includes('₹') || text.includes('₹') || href.includes('pricing') ||
               text.includes('₹') || text.includes('₹') || text.includes('pricing');
      });
      return pricingLink ? { href: pricingLink.getAttribute('href'), text: pricingLink.textContent } : null;
    });

    if (pricingLink && pricingLink.href) {
      authResults.hasPricing = true;
      authResults.pricingPageAccessible = true;
      authResults.details.push(`Pricing page found: "${pricingLink.text}" (${pricingLink.href})`);
    } else {
      authResults.issues.push({
        title: 'Pricing Page Not Found',
        description: 'No pricing/plan page detected on the website.',
        severity: 'medium',
        category: 'Auth'
      });
    }

    // Try to navigate to login page
    if (mainPageAuth.loginLinkCount > 0) {
      authResults.details.push('Social login options available');
      authResults.socialLoginAvailable = true;
    }

    // Try to navigate to login page
    if (mainPageAuth.loginLinkCount > 0) {
      try {
        // Find login link
        const loginLink = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a')).filter(a => {
            const text = (a.textContent || '').toLowerCase();
            return text.includes('login') || text.includes('sign in') || text.includes('log in');
          });
          return links[0]?.getAttribute('href');
        });

        if (loginLink) {
          await page.goto(new URL(loginLink, url).toString(), { waitUntil: 'domcontentloaded', timeout: 10000 });
          await sleep(2000);

          const loginPageContent = await page.evaluate(() => {
            const hasPasswordField = !!document.querySelector('input[type="password"]');
            const hasEmailField = !!document.querySelector('input[type="email"], input[name*="email" i], input[name*="user" i]');
            const hasSubmitButton = !!document.querySelector('button[type="submit"], input[type="submit"]');
            const title = document.title;
            const url = window.location.href;
            return { hasPasswordField, hasEmailField, hasSubmitButton, title, url };
          });

          authResults.loginPageAccessible = true;
          authResults.details.push(`Login page accessible: "${loginPageContent.title}"`);

          if (!loginPageContent.hasEmailField) {
            authResults.issues.push('Login page missing email field');
          }
          if (!loginPageContent.hasPasswordField) {
            authResults.issues.push('Login page missing password field');
          }
          if (!loginPageContent.hasSubmitButton) {
            authResults.issues.push('Login page has no submit button');
          }
        }
      } catch (e) {
        authResults.issues.push(`Cannot access login page: ${e.message}`);
      }
    }

    // Try to navigate to signup page
    if (mainPageAuth.signupLinkCount > 0) {
      try {
        const signupLink = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a')).filter(a => {
            const text = (a.textContent || '').toLowerCase();
            return text.includes('sign up') || text.includes('register') || text.includes('create account');
          });
          return links[0]?.getAttribute('href');
        });

        if (signupLink) {
          await page.goto(new URL(signupLink, url).toString(), { waitUntil: 'domcontentloaded', timeout: 10000 });
          await sleep(2000);

          const signupPageContent = await page.evaluate(() => {
            const hasNameField = !!document.querySelector('input[name*="name" i], input[name*="user" i]');
            const hasEmailField = !!document.querySelector('input[type="email"], input[name*="email" i]');
            const hasPasswordField = !!document.querySelector('input[type="password"]');
            const hasConfirmPassword = !!document.querySelector('input[name*="confirm" i], input[name*="repeat" i]');
            const hasSubmitButton = !!document.querySelector('button[type="submit"], input[type="submit"]');
            const title = document.title;
            return { hasNameField, hasEmailField, hasPasswordField, hasConfirmPassword, hasSubmitButton, title };
          });

          authResults.signupPageAccessible = true;
          authResults.details.push(`Signup page accessible: "${signupPageContent.title}"`);

          if (!signupPageContent.hasEmailField) {
            authResults.issues.push('Signup page missing email field');
          }
          if (!signupPageContent.hasPasswordField) {
            authResults.issues.push('Signup page missing password field');
          }
        }
      } catch (e) {
        authResults.issues.push(`Cannot access signup page: ${e.message}`);
      }
    }

  } catch (e) {
    authResults.issues.push(`Auth testing error: ${e.message}`);
  }

  return authResults;
};

// ============================================
// UX/ISSUE DETECTION - Real user problems
// ============================================
const detectRealUserIssues = async (page, url) => {
  const issues = [];
  const warnings = [];
  const goodPoints = [];

  try {
    const issuesData = await page.evaluate(() => {
      const results = {
        brokenImages: [],
        missingAlt: [],
        emptyLinks: [],
        tinyText: false,
        hugeText: false,
        lowContrast: [],
        hiddenOverflows: [],
        noMobileMenu: false,
        confusingCTA: false,
        loadingSlow: false,
        cookieBanner: false,
        popupDetected: false
      };

      // Check for broken images
      document.querySelectorAll('img').forEach((img, i) => {
        if (i < 50) { // Check first 50 images
          if (!img.complete || img.naturalHeight === 0) {
            results.brokenImages.push({
              src: img.src?.substring(0, 50),
              alt: img.alt || '[no alt]'
            });
          }
          // Check for missing alt
          if (!img.alt && !img.getAttribute('role')) {
            results.missingAlt.push({
              src: img.src?.substring(0, 50)
            });
          }
        }
      });

      // Check for empty/dead links
      document.querySelectorAll('a[href]').forEach((link, i) => {
        if (i < 30) {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim();

          if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
            results.emptyLinks.push({
              text: text?.substring(0, 30) || '[no text]',
              href: href
            });
          }
        }
      });

      // Check text sizes for readability
      const bodyStyles = window.getComputedStyle(document.body);
      const fontSize = parseFloat(bodyStyles.fontSize);
      if (fontSize < 12) {
        results.tinyText = true;
      } else if (fontSize > 24) {
        results.hugeText = true;
      }

      // Check for overflow issues (content cut off)
      const overflowElements = document.querySelectorAll('[class*="container"], [class*="wrapper"], main, .content');
      overflowElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.overflowX === 'hidden' || styles.overflowY === 'hidden') {
          // Check if content actually overflows
          if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
            results.hiddenOverflows.push(el.tagName.toLowerCase());
          }
        }
      });

      // Check for mobile menu
      const hasMobileMenu = !!(
        document.querySelector('[class*="hamburger"], [class*="mobile-menu"], [class*="nav-toggle"], button[aria-expanded], button[aria-label*="menu" i]')
      );
      results.noMobileMenu = !hasMobileMenu;

      // Check for cookie banner
      results.cookieBanner = !!(
        document.querySelector('[class*="cookie"], [id*="cookie"], div[class*="banner"], div[class*="consent"]')
      );

      // Check for popup/modal
      const hasPopup = !!(
        document.querySelector('[class*="popup"], [class*="modal"], [role="dialog"]')
      );
      results.popupDetected = hasPopup;

      // Check CTA clarity
      const ctaButtons = Array.from(document.querySelectorAll('button, a[class*="btn"], a[class*="button"]')).filter(btn => {
        const text = (btn.textContent || '').toLowerCase();
        return ['buy', 'order', 'shop', 'cart', 'book', 'sign', 'register', 'get started'].some(cta => text.includes(cta));
      });

      if (ctaButtons.length === 0) {
        results.confusingCTA = true;
      } else if (ctaButtons.length > 5) {
        results.confusingCTA = true; // Too many CTAs is also confusing
      }

      return results;
    });

    // Process issues
    if (issuesData.brokenImages.length > 0) {
      issues.push({
        title: 'Broken Images Found',
        description: `${issuesData.brokenImages.length} images are not loading properly. This makes the site look unprofessional.`,
        severity: issuesData.brokenImages.length > 5 ? 'high' : 'medium',
        category: 'Functionality'
      });
    }

    if (issuesData.missingAlt.length > 10) {
      issues.push({
        title: 'Missing Alt Text',
        description: `${issuesData.missingAlt.length} images are missing alt text. Screen readers can't describe these images to blind users.`,
        severity: 'low',
        category: 'Accessibility'
      });
    }

    if (issuesData.emptyLinks.length > 5) {
      issues.push({
        title: 'Dead/Empty Links',
        description: `${issuesData.emptyLinks.length} links go nowhere or are empty. Users clicking these will get frustrated.`,
        severity: 'medium',
        category: 'Functionality'
      });
    }

    if (issuesData.tinyText) {
      issues.push({
        title: 'Text Too Small',
        description: 'Font size is below 12px. Many users will struggle to read content.',
        severity: 'medium',
        category: 'UI'
      });
    }

    if (issuesData.hugeText) {
      issues.push({
        title: 'Text Too Large',
        description: 'Font size is over 24px. It looks aggressive and unprofessional.',
        severity: 'low',
        category: 'UI'
      });
    }

    if (issuesData.noMobileMenu) {
      issues.push({
        title: 'No Mobile Menu',
        description: 'Mobile users cannot access navigation. There is no hamburger menu or mobile toggle.',
        severity: 'high',
        category: 'UX'
      });
    }

    if (issuesData.confusingCTA) {
      issues.push({
        title: 'No Clear Call-to-Action',
        description: 'Users cannot figure out what to do. There is no clear "Buy", "Sign Up", or main action button visible.',
        severity: 'high',
        category: 'UX'
      });
    }

    if (issuesData.hiddenOverflows.length > 0) {
      issues.push({
        title: 'Content Cut Off',
        description: `Content in ${issuesData.hiddenOverflows.join(', ')} elements is being cut off/hidden. Users can't see everything.`,
        severity: 'medium',
        category: 'UI'
      });
    }

    // Check for good things
    if (!issuesData.cookieBanner) {
      goodPoints.push('No annoying cookie/banner popup');
    }
    if (!issuesData.popupDetected) {
      goodPoints.push('No intrusive popups or modals');
    }
    if (issuesData.brokenImages.length === 0) {
      goodPoints.push('All images are loading properly');
    }
    if (issuesData.emptyLinks.length <= 2) {
      goodPoints.push('Links are working well');
    }

  } catch (e) {
    issues.push({
      title: 'Analysis Error',
      description: `Could not analyze page properly: ${e.message}`,
      severity: 'low',
      category: 'Functionality'
    });
  }

  return { issues, warnings, goodPoints };
};

// ============================================
// MAIN AUDIT FUNCTION - Comprehensive Technical Analysis
// Works with ANY tech stack - No AI dependency
// ============================================
export const auditWebsiteWithBrowser = async (inputUrl, language = 'en') => {
  const url = normalizeUrl(inputUrl);
  let browser;

  const auditData = {
    url,
    startTime: new Date().toISOString(),
    techStack: {},
    pages: [],
    interactiveTests: {},
    authTests: {},
    issues: [],
    warnings: [],
    goodPoints: [],
    rating: 0,
    advice: '',
    // Detailed analysis results
    seoAnalysis: {},
    securityAnalysis: {},
    performanceAnalysis: {},
    accessibilityAnalysis: {},
    mobileAnalysis: {},
    uxAnalysis: {},
    uiAnalysis: {},
    functionalityAnalysis: {},
    language // Store selected language
  };

  try {
    console.log(`🔍 Starting COMPREHENSIVE TECH AUDIT for: ${url}`);
    console.log(`🌐 Language: ${language === 'hi' ? 'हिंदी' : 'English'}`);

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Set default timeout
    page.setDefaultTimeout(15000);

    // STEP 1: Visit homepage
    console.log('📄 Loading homepage...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(3000);

    // STEP 2: Comprehensive tech stack detection
    console.log('🔧 Detecting tech stack (all frameworks)...');
    auditData.techStack = await detectTechStack(page);
    console.log(`   Found: ${auditData.techStack.frameworks.length} frameworks, ${auditData.techStack.libraries.length} libraries`);

    // STEP 3: SEO Analysis
    console.log('🔍 Analyzing SEO...');
    const seoAnalysis = await analyzeSEO(page);
    auditData.seoAnalysis = seoAnalysis;
    auditData.issues.push(...seoAnalysis.issues);
    auditData.warnings.push(...seoAnalysis.warnings);
    auditData.goodPoints.push(...seoAnalysis.goodPoints);

    // STEP 4: Security Analysis
    console.log('🔐 Analyzing security...');
    const securityAnalysis = await analyzeSecurity(page, url);
    auditData.securityAnalysis = securityAnalysis;
    auditData.issues.push(...securityAnalysis.issues);
    auditData.warnings.push(...securityAnalysis.warnings);
    auditData.goodPoints.push(...securityAnalysis.goodPoints);

    // STEP 5: Performance Analysis
    console.log('⚡ Analyzing performance...');
    const performanceAnalysis = await analyzePerformance(page, url);
    auditData.performanceAnalysis = performanceAnalysis;
    auditData.issues.push(...performanceAnalysis.issues);
    auditData.warnings.push(...performanceAnalysis.warnings);
    auditData.goodPoints.push(...performanceAnalysis.goodPoints);

    // STEP 6: Accessibility Analysis
    console.log('♿ Analyzing accessibility...');
    const accessibilityAnalysis = await analyzeAccessibility(page);
    auditData.accessibilityAnalysis = accessibilityAnalysis;
    auditData.issues.push(...accessibilityAnalysis.issues);
    auditData.warnings.push(...accessibilityAnalysis.warnings);
    auditData.goodPoints.push(...accessibilityAnalysis.goodPoints);

    // STEP 7: Mobile Analysis
    console.log('📱 Analyzing mobile responsiveness...');
    const mobileAnalysis = await analyzeMobile(page, url);
    auditData.mobileAnalysis = mobileAnalysis;
    auditData.issues.push(...mobileAnalysis.issues);
    auditData.warnings.push(...mobileAnalysis.warnings);
    auditData.goodPoints.push(...mobileAnalysis.goodPoints);

    // STEP 8: UX Analysis
    console.log('👁️ Analyzing UX...');
    const uxAnalysis = await analyzeUX(page);
    auditData.uxAnalysis = uxAnalysis;
    auditData.issues.push(...uxAnalysis.issues);
    auditData.warnings.push(...uxAnalysis.warnings);
    auditData.goodPoints.push(...uxAnalysis.goodPoints);

    // STEP 9: UI Analysis
    console.log('🎨 Analyzing UI...');
    const uiAnalysis = await analyzeUI(page);
    auditData.uiAnalysis = uiAnalysis;
    auditData.issues.push(...uiAnalysis.issues);
    auditData.warnings.push(...uiAnalysis.warnings);
    auditData.goodPoints.push(...uiAnalysis.goodPoints);

    // STEP 10: Functionality Analysis
    console.log('⚙️ Analyzing functionality...');
    const functionalityAnalysis = await analyzeFunctionality(page);
    auditData.functionalityAnalysis = functionalityAnalysis;
    auditData.issues.push(...functionalityAnalysis.issues);
    auditData.warnings.push(...functionalityAnalysis.warnings);
    auditData.goodPoints.push(...functionalityAnalysis.goodPoints);

    // STEP 11: Test interactive elements
    console.log('🖱️ Testing buttons, forms, navigation...');
    auditData.interactiveTests = await testInteractiveElements(page, url);

    // STEP 12: Find all pages
    console.log('🗺️ Discovering site pages...');
    const discoveredPages = await discoverAllPages(page, url, 15);
    auditData.pages = discoveredPages;

    // STEP 13: Visit key pages and check each
    const pageAuditResults = [];
    for (const pagePath of discoveredPages.slice(0, 6)) { // Visit up to 6 pages
      try {
        const pageUrl = new URL(pagePath, url).toString();
        console.log(`📄 Checking page: ${pagePath}`);

        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await sleep(2000);

        // Quick check for errors on this page
        const pageErrors = await page.evaluate(() => {
          const errors = [];

          // Check for console errors indicator
          if (document.body.classList.contains('error') || document.querySelector('.error, .error-page')) {
            errors.push('Error page detected');
          }

          // Check for 404 indicators
          if (document.title.includes('404') || document.body.textContent.includes('404') || document.body.textContent.includes('Not Found')) {
            errors.push('404 page detected');
          }

          // Check if page has content
          const contentLength = document.body.textContent.trim().length;
          if (contentLength < 50) {
            errors.push('Page has very little content');
          }

          return errors;
        });

        pageAuditResults.push({
          path: pagePath,
          url: pageUrl,
          loaded: true,
          errors: pageErrors,
          loadTime: Date.now()
        });

      } catch (e) {
        pageAuditResults.push({
          path: pagePath,
          url: new URL(pagePath, url).toString(),
          loaded: false,
          error: e.message
        });
      }
    }

    auditData.pageAudits = pageAuditResults;

    // STEP 14: Test auth flow
    console.log('🔐 Testing login/signup flow...');
    auditData.authTests = await testAuthFlow(page, url);

    // STEP 15: Take screenshots
    console.log('📸 Taking screenshots...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(1500);
    const desktopScreenshot = await page.screenshot({ encoding: 'base64', fullPage: false });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(1500);
    const mobileScreenshot = await page.screenshot({ encoding: 'base64', fullPage: false });

    auditData.screenshots = {
      desktop: desktopScreenshot,
      mobile: mobileScreenshot
    };

    // Calculate comprehensive rating
    let rating = 5.0;

    // Deduct for critical issues (weighted by category)
    auditData.issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': rating -= 1.0; break;
        case 'high': rating -= 0.75; break;
        case 'medium': rating -= 0.5; break;
        case 'low': rating -= 0.25; break;
      }
    });

    // Also consider warnings
    rating -= Math.min(0.5, auditData.warnings.length * 0.05);

    // Add bonus points for good practices
    if (auditData.goodPoints.length >= 5) rating += 0.3;
    if (auditData.techStack.frameworks.length > 0) rating += 0.1;
    if (auditData.authTests.hasLogin) rating += 0.05;
    if (auditData.interactiveTests.forms.working > 0) rating += 0.05;
    if (auditData.pages.length > 5) rating += 0.1;
    if (auditData.seoAnalysis.data?.checks?.hasStructuredData) rating += 0.1;
    if (auditData.accessibilityAnalysis.data?.checks?.hasLandmarks) rating += 0.1;
    if (auditData.performanceAnalysis.data?.checks?.domContentLoaded < 2000) rating += 0.1;
    if (auditData.mobileAnalysis.data?.checks?.hasDeviceWidth) rating += 0.1;

    rating = Math.max(1.0, Math.min(5.0, rating));
    auditData.rating = Number(rating.toFixed(1));

    // Generate comprehensive advice
    auditData.advice = generateComprehensiveAdvice(auditData);

    auditData.endTime = new Date().toISOString();
    auditData.totalTime = Date.now() - Date.parse(auditData.startTime);

    console.log(`✅ Audit complete! Rating: ${auditData.rating}/5`);
    console.log(`   Issues found: ${auditData.issues.length}`);
    console.log(`   Warnings: ${auditData.warnings.length}`);
    console.log(`   Good points: ${auditData.goodPoints.length}`);

  } catch (error) {
    console.error('Audit error:', error);

    auditData.issues = [{
      title: 'Audit Failed',
      description: `Could not complete the audit: ${error.message}`,
      severity: 'critical',
      category: 'Functionality'
    }];
    auditData.rating = 1.0;
    auditData.advice = 'Website appears to be down or blocking automated access. Please check if the site is live.';
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return auditData;
};

// ============================================
// GENERATE COMPREHENSIVE ADVICE
// ============================================
const generateComprehensiveAdvice = (data) => {
  const { issues, warnings, goodPoints, techStack, seoAnalysis, securityAnalysis, performanceAnalysis, accessibilityAnalysis, mobileAnalysis } = data;

  let advice = 'Bhai, ';

  // Rating-based overall assessment
  if (data.rating < 2.5) {
    advice += 'website ko kaafi serious issues hain. ';
  } else if (data.rating < 3.5) {
    advice += 'website theek hai but improvement ki zarurat hai. ';
  } else if (data.rating < 4.5) {
    advice += 'website achhi hai! Thode improvements aur kar sakte ho. ';
  } else {
    advice += 'kaafi badhiya! Site well maintained hai. ';
  }

  // Category-specific advice

  // SEO Advice
  const seoIssues = issues.filter(i => i.category === 'SEO');
  if (seoIssues.length > 0) {
    advice += 'SEO me dikkat hai - ';
    if (seoIssues.some(i => i.title.includes('Title'))) advice += 'title tag optimize karo. ';
    if (seoIssues.some(i => i.title.includes('Meta Description'))) advice += 'meta description add karo. ';
    if (seoIssues.some(i => i.title.includes('Heading'))) advice += 'headings structure theek karo. ';
  }

  // Security Advice
  const securityIssues = issues.filter(i => i.category === 'Security');
  if (securityIssues.length > 0) {
    advice += 'Security important hai - ';
    if (securityIssues.some(i => i.title.includes('HTTPS'))) advice += 'HTTPS implement karo. ';
    if (securityIssues.some(i => i.title.includes('Mixed Content'))) advice += 'mixed content fix karo. ';
    if (securityIssues.some(i => i.title.includes('API Keys'))) advice += 'API keys hide karo! ';
  }

  // Performance Advice
  const perfIssues = issues.filter(i => i.category === 'Performance');
  if (perfIssues.length > 0) {
    advice += 'Performance improve karo - ';
    if (perfIssues.some(i => i.title.includes('Images'))) advice += 'images compress karo. ';
    if (perfIssues.some(i => i.title.includes('DOM'))) advice += 'DOM complexity kam karo. ';
  }

  // Accessibility Advice
  const a11yIssues = issues.filter(i => i.category === 'Accessibility');
  if (a11yIssues.length > 0) {
    advice += 'Accessibility improve karo - ';
    if (a11yIssues.some(i => i.title.includes('Alt'))) advice += 'alt text add karo. ';
    if (a11yIssues.some(i => i.title.includes('Label'))) advice += 'form labels add karo. ';
  }

  // Mobile Advice
  const mobileIssues = issues.filter(i => i.category === 'Mobile');
  if (mobileIssues.length > 0) {
    advice += 'Mobile experience theek karo - ';
    if (mobileIssues.some(i => i.title.includes('Viewport'))) advice += 'viewport meta tag fix karo. ';
    if (mobileIssues.some(i => i.title.includes('Touch'))) advice += 'touch targets bado. ';
  }

  // Tech stack specific advice
  if (techStack.cms.includes('WordPress')) {
    advice += 'WordPress use kar rahe ho - caching plugin aur optimization consider karo. ';
  }
  if (techStack.ecommerce.includes('Shopify')) {
    advice += 'Shopify store hai - theme optimization karo. ';
  }
  if (techStack.frameworks.includes('React')) {
    advice += 'React hai - code splitting aur lazy loading consider karo. ';
  }
  if (techStack.frameworks.includes('Next.js')) {
    advice += 'Next.js use kar rahe ho - image optimization aur SSG utilize karo. ';
  }

  // What's working well
  if (goodPoints.length >= 3) {
    advice += `${goodPoints.slice(0, 2).join(', ')} sab achha hai! `;
  }

  advice = advice.trim() + ' 🚀';

  return advice;
};
