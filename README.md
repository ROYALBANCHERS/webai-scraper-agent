# WebAI Scraper Agent

A powerful, self-contained web scraping agent that navigates websites, handles authentication, and extracts structured data - **without any AI or 3rd party APIs**.

## Features

- 🤖 **Real Browser Automation** - Uses Playwright (Chromium) for human-like browsing
- 🔐 **Auto Login** - Detects and fills login forms automatically
- 🍪 **Persistent Sessions** - Stay logged in across multiple scrapes
- 📊 **Structured JSON Output** - Clean, organized data extraction
- 🖼️ **Screenshot Capture** - Visual proof of scraping
- 🔍 **Smart Form Detection** - Finds all forms, inputs, buttons
- 🌐 **Multiple Site Support** - Works with Facebook, Gmail, websites, etc.
- ⚡ **Fast & Efficient** - Optimized page loading with domcontentloaded

---

## Isme AI Nahi Hai - Pure Code!

**Important:** Yeh scraper **kisi AI ka use nahi karta**. Yeh 100% code-based hai:

| Component | Technology | AI Used? |
|-----------|------------|----------|
| Browser Automation | Playwright (Node.js) | ❌ No |
| Backend Server | Express.js | ❌ No |
| Frontend UI | React + Vite | ❌ No |
| Data Extraction | JavaScript DOM APIs | ❌ No |
| Form Detection | CSS Selectors | ❌ No |
| Authentication | Cookie Management | ❌ No |

**3rd Party APIs?** **❌ NONE!** - Everything runs locally on your machine.

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER (Browser)                                  │
│                         http://localhost:3000                                │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  │ 1. Enter URL + Credentials (optional)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite)                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Home.tsx - User enters:                                              │   │
│  │   - URL to scrape                                                     │   │
│  │   - Username/Password (optional)                                      │   │
│  │   - Cookies (optional - JSON format)                                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  │ 2. POST /api/agent/scrape
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Express.js)                                │
│                         Port: 8787                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ server.js - Receives request & calls scraperAgent                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  │ 3. scrapeWithAgent(url, credentials, options)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCRAPER AGENT (Playwright + Chromium)                    │
│                          backend/scraperAgent.js                            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ STEP 1: INITIALIZE BROWSER                                          │     │
│  │  - Launch Chromium (headless or visible)                           │     │
│  │  - Load persistent session (if exists)                             │     │
│  │  - Apply cookies (if provided)                                     │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ STEP 2: NAVIGATE TO URL                                            │     │
│  │  - Format URL (add https://)                                       │     │
│  │  - Handle redirects automatically                                 │     │
│  │  - Wait for domcontentloaded                                        │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ STEP 3: CHECK AUTHENTICATION                                       │     │
│  │  - Check if already logged in (session/cookies)                    │     │
│  │  - If authenticated → Skip to Step 5                               │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼ (if not authenticated)                        │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ STEP 4: DETECT & FILL LOGIN FORM (NEW: Robust Button Click)        │     │
│  │  - Find password field                                             │     │
│  │  - Find username/email field                                       │     │
│  │  - Fill credentials                                                │     │
│  │  - Click login button using clickButton() method:                 │     │
│  │    1. Direct selector with force click                            │     │
│  │    2. Text-based search for buttons                               │     │
│  │    3. JavaScript evaluation of all buttons                        │     │
│  │    4. Form submit button detection                                │     │
│  │    5. Enter key on password field (last resort)                   │     │
│  │  - Wait for navigation                                            │     │
│  │  - Check for 2FA/errors                                           │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ STEP 5: SCRAPE PAGE DATA (Separated Structure)                    │     │
│  │                                                                     │     │
│  │  📦 websiteContent (Pehle - Page ka asli content):                 │     │
│  │     ├─ fullText (poore page ka text)                               │     │
│  │     ├─ htmlContent (raw HTML)                                      │     │
│  │     ├─ visibleText (sab visible text elements)                     │     │
│  │     ├─ allWords (text split into words)                            │     │
│  │     ├─ sentences (text split into sentences)                       │     │
│  │     ├─ title (page title)                                          │     │
│  │     └─ description (meta description)                              │     │
│  │                                                                     │     │
│  │  🔧 backendExtractedData (Baad mein - Technical extraction):        │     │
│  │     ├─ forms (sare forms with fields)                              │     │
│  │     ├─ interactiveElements                                        │     │
│  │     │   ├─ buttons (sare clickable buttons)                        │     │
│  │     │   └─ inputs (sare input fields)                              │     │
│  │     ├─ links (sare anchor tags with href)                          │     │
│  │     ├─ images (sare img tags with src/alt)                         │     │
│  │     ├─ tables (sare table data)                                    │     │
│  │     ├─ lists (sare ul/ol lists)                                    │     │
│  │     ├─ structuredData (JSON-LD schema)                             │     │
│  │     └─ metaTags (sare meta tags)                                   │     │
│  │                                                                     │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ STEP 6: CAPTURE SCREENSHOT & SAVE SESSION                         │     │
│  │  - Take screenshot (base64)                                         │     │
│  │  - Save session cookies to storage-state.json                      │     │
│  │  - Close browser                                                   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  │ 6. Return JSON
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Results.tsx)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Display Results:                                                     │   │
│  │  - Overview tab (stats, screenshot, title)                           │   │
│  │  - JSON tab (full raw data)                                          │   │
│  │  - Forms tab (all forms with fields)                                 │   │
│  │  - Links tab (all links found)                                       │   │
│  │  - Images tab (all images with thumbnails)                           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Robust Button Clicking - 5 Fallback Approaches

```
┌─────────────────────────────────────────────────────────────┐
│         clickButton() - Login Button Click System           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣ DIRECT SELECTOR (CSS Selector Approach)                 │
│     ├─ Find button by CSS selector                          │
│     ├─ Scroll element into view                             │
│     └─ Force click (bypass visibility checks)               │
│                                                             │
│     ↓ (if fails)                                            │
│                                                             │
│  2️⃣ TEXT-BASED SEARCH (Playwright Selectors)               │
│     ├─ Search for: "Log In", "Login", "Sign In", etc.       │
│     ├─ Use :has-text() selector                             │
│     └─ Try all matching buttons one by one                  │
│                                                             │
│     ↓ (if fails)                                            │
│                                                             │
│  3️⃣ JAVASCRIPT EVALUATION (Page Scan)                       │
│     ├─ Evaluate page to find ALL buttons                    │
│     ├─ Match by text, id, className, name                   │
│     ├─ Check visibility with getComputedStyle               │
│     ├─ Scroll to element                                    │
│     └─ Click via JavaScript                                │
│                                                             │
│     ↓ (if fails)                                            │
│                                                             │
│  4️⃣ FORM SUBMIT BUTTON (Form-based)                        │
│     ├─ Find form with password field                        │
│     ├─ Locate submit button in that form                    │
│     ├─ Often the last element is submit                     │
│     └─ Click via JavaScript                                │
│                                                             │
│     ↓ (if fails)                                            │
│                                                             │
│  5️⃣ ENTER KEY (Last Resort - Always Works)                 │
│     ├─ Focus on password input field                       │
│     └─ Press Enter key                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### Installation Steps

```bash
# 1. Navigate to project directory
cd webai-auditor-main

# 2. Install dependencies
npm install

# 3. Done! (No API keys needed, no cloud setup)
```

---

## Starting the Server

### Method 1: Start Everything (Backend + Frontend)

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:8787`
- Frontend on `http://localhost:3000`

### Method 2: Start Separately

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Method 3: Start Backend Only (for API use)

```bash
npm run dev:backend
```

Then use API directly:
```bash
curl -X POST http://localhost:8787/api/agent/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "credentials": {
      "username": "your@email.com",
      "password": "yourpassword"
    }
  }'
```

---

## API Reference

### POST /api/agent/scrape

Scrape a website with optional authentication.

**Request Body:**
```json
{
  "url": "https://example.com/login",
  "credentials": {
    "username": "user@example.com",
    "password": "password123"
  },
  "cookies": [
    {
      "name": "session",
      "value": "abc123",
      "domain": ".example.com"
    }
  ],
  "options": {
    "headless": true,
    "screenshots": true,
    "timeout": 60000
  }
}
```

**Response Structure:**
```json
{
  "success": true,
  "auth": {
    "detected": true,
    "attempted": true,
    "alreadyAuthenticated": false
  },
  "data": {
    "websiteContent": {
      "fullText": "Complete page text...",
      "htmlContent": "<html>...</html>",
      "textContent": [
        { "selector": "h1", "text": "Heading" }
      ],
      "visibleText": ["Heading", "Paragraph", ...],
      "allWords": ["word1", "word2", ...],
      "sentences": ["Sentence 1.", "Sentence 2.", ...],
      "title": "Page Title",
      "description": "Meta description"
    },
    "backendExtractedData": {
      "forms": [
        {
          "index": 0,
          "action": "/login",
          "method": "POST",
          "fields": [
            { "type": "email", "name": "email", "placeholder": "Email" },
            { "type": "password", "name": "password", "placeholder": "Password" }
          ]
        }
      ],
      "interactiveElements": {
        "buttons": [
          { "text": "Login", "type": "submit", "disabled": false }
        ],
        "inputs": [
          { "type": "email", "name": "email", "required": true }
        ]
      },
      "links": [
        { "text": "Home", "href": "/", "title": "Go to home" }
      ],
      "images": [
        { "src": "/logo.png", "alt": "Logo", "width": 200, "height": 100 }
      ],
      "tables": [...],
      "lists": [...],
      "structuredData": [...],
      "metaTags": { "description": "...", "og:title": "..." }
    },
    "pageInfo": {
      "url": "https://example.com",
      "timestamp": "2025-01-15T10:30:00.000Z"
    },
    "screenshot": "base64_encoded_image..."
  }
}
```

---

## Project Structure

```
webai-auditor-main/
├── backend/
│   ├── server.js              # Express server & API endpoints
│   ├── scraperAgent.js        # Main scraper logic (Playwright)
│   └── browser-session/       # Persistent session storage
│       └── default/
│           └── storage-state.json  # Saved cookies/session
├── components/
│   ├── Home.tsx               # Main input form (URL, credentials)
│   └── Results.tsx            # Results display with tabs
├── services/
│   └── geminiService.ts       # API service layer
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
├── package.json               # Dependencies & scripts
└── README.md                  # This file
```

---

## How Authentication Works

### Persistent Sessions (Auto-Login)

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION FLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PEHLI BAAR LOGIN                                        │
│     ├─ User credentials enter karta hai                     │
│     ├─ Scraper login karta hai                             │
│     └─ Session save hota hai browser-session/default/       │
│                                                             │
│  2. USI BAAR DUSRI SCRAPING                                  │
│     ├─ Scraper saved session load karta hai                 │
│     ├─ Check karta hai ki authenticated hai ya nahi        │
│     ├─ Agar hai → Login skip kar deta hai!                  │
│     └─ Direct scraping pe move karta hai                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Session Storage Location:**
```
backend/browser-session/default/storage-state.json
```

This file contains:
- Cookies
- localStorage
- sessionStorage

### Cookie-Based Authentication

You can also provide cookies directly:

```json
{
  "cookies": [
    {
      "name": "session_id",
      "value": "abc123xyz",
      "domain": ".example.com",
      "path": "/",
      "secure": true
    }
  ]
}
```

**How to get cookies:**
1. Install "EditThisCookie" extension in Chrome
2. Login to the website in your browser
3. Click the extension → Export → JSON
4. Paste in the scraper input

---

## Error Handling

The scraper detects and reports specific errors:

| Error Type | Message | Cause | Solution |
|------------|---------|-------|----------|
| `wrong_password` | "Wrong password!" | Incorrect password | Check password |
| `wrong_credentials` | "Invalid credentials!" | Wrong username | Check username |
| `2fa_required` | "2FA/OTP detected!" | Two-factor auth | Disable 2FA |
| `security_checkpoint` | "Security checkpoint!" | FB verification | Manual verification |
| `navigation_timeout` | "Navigation timeout" | Page slow | Increase timeout |
| `button_not_found` | "Login button not found" | Button issue | Auto-handled |

---

## Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8787
NODE_ENV=development

# Scraper Configuration
DEFAULT_TIMEOUT=60000
HEADLESS=true
DEBUG=false

# Session Configuration
SESSION_DIR=./browser-session
```

---

## Troubleshooting

### Issue: "Navigation timeout"
**Solution:** Increase timeout in options:
```json
{
  "options": {
    "timeout": 120000
  }
}
```

### Issue: "Already authenticated false despite login"
**Solution:** Clear the session folder:
```bash
# Windows
rmdir /s backend\browser-session\default

# Linux/Mac
rm -rf backend/browser-session/default/
```

### Issue: Port already in use
**Solution:** Kill the process:
```bash
# Windows
netstat -ano | findstr ":8787"
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:8787 | xargs kill -9
```

### Issue: Button click not working
**Solution:** The new robust click method has 5 fallback approaches and should handle most cases automatically.

---

## Features Breakdown

### What CAN it do?

- ✅ Scrape any public website
- ✅ Login with username/password
- ✅ Handle redirects automatically
- ✅ Extract all forms, buttons, inputs
- ✅ Get all links, images, tables
- ✅ Extract page text, HTML
- ✅ Take screenshots
- ✅ Persistent sessions (stay logged in)
- ✅ Cookie-based authentication
- ✅ Work with Facebook, Gmail, etc.

### What CANNOT it do?

- ❌ Bypass CAPTCHA
- ❌ Handle 2FA (OTP, SMS, etc.)
- ❌ Scrape behind paywalls
- ❌ Break encryption
- ❌ Access private data without credentials

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Credentials are NOT stored** - They're only used for the current scrape
2. **Session files contain cookies** - Keep `browser-session/` folder secure
3. **Run locally** - Don't expose the API to public internet
4. **Use HTTPS** - Always scrape HTTPS websites
5. **2FA sites** - Scraper cannot bypass 2FA, disable it for scraping

---

## JSON Output Structure Explained

### websiteContent (Pehle - Page Content)
Yeh us page ka asli content hai jo user ko dikhata hai:

- `fullText` - Poore page ka text (jo browser mein dikhta hai)
- `htmlContent` - Raw HTML code
- `visibleText` - Sabhi visible text elements ka array
- `allWords` - Text ko words mein split kiya hua
- `sentences` - Text ko sentences mein split kiya hua
- `title` - Page ka title
- `description` - Meta description

### backendExtractedData (Baad mein - Technical Data)
Yeh backend ne extract kiya hai technical analysis:

- `forms` - Sare forms (login, signup, contact, etc.)
- `interactiveElements.buttons` - Sare clickable buttons
- `interactiveElements.inputs` - Sare input fields
- `links` - Sare anchor tags (navigation, external links)
- `images` - Sare images with src and alt
- `tables` - Sare tables with data
- `lists` - Sare ul/ol lists
- `structuredData` - JSON-LD schema markup
- `metaTags` - All meta tags (SEO, Open Graph, etc.)

---

## Summary

**WebAI Scraper Agent:**
- ✅ Pure code-based (No AI)
- ✅ No 3rd party APIs
- ✅ 100% runs locally
- ✅ Your data stays with you
- ✅ Robust button clicking (5 approaches)
- ✅ Persistent sessions
- ✅ Cookie support
- ✅ Structured JSON output

**Tech Stack:**
- Frontend: React + Vite
- Backend: Express.js
- Browser: Playwright (Chromium)
- Language: JavaScript/TypeScript

---

## License

**PROPRIETARY LICENSE** - See [LICENSE](LICENSE) file for details.

This software is for **PERSONAL USE ONLY**.
- ❌ NO copying or redistribution
- ❌ NO commercial use
- ❌ NO derivative works

For licensing inquiries, contact: rishabh023

---

**Made with ❤️ by Rishabh (rishabh023)**
**No AI. No Cloud. No 3rd Party APIs. 100% Your Data.**
