// ==================== APP STATE ====================
export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

// ==================== PAGES ====================
export enum Page {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  BLOGS = 'BLOGS',
  BLOG_POST = 'BLOG_POST',
  AI_NEWS = 'AI_NEWS',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  CONTACT = 'CONTACT',
  PRICING = 'PRICING',
  API_DOCS = 'API_DOCS',
  HELP_CENTER = 'HELP_CENTER',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  COOKIES = 'COOKIES',
  LOGIN = 'LOGIN'
}

// ==================== API TYPES ====================
export interface ScrapeRequest {
  url: string;
  credentials?: {
    username: string;
    password: string;
  };
  cookies?: Array<{
    name: string;
    value: string;
    domain: string;
  }>;
  headless?: boolean;
  screenshots?: boolean;
  timeout?: number;
}

export interface ScrapeResult {
  success: boolean;
  url: string;
  title?: string;
  content?: string;
  screenshot?: string;
  techStack?: string[];
  links?: string[];
  forms?: Array<{
    type: string;
    action: string;
    inputs: string[];
  }>;
  error?: string;
}

export interface AuditResult {
  url: string;
  title: string;
  rating: number;
  issues: Array<{
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  techStack: string[];
  screenshots: string[];
  metadata: {
    loadTime: number;
    pageSize: number;
    requestCount: number;
  };
}

// ==================== COMPONENT PROPS ====================
export interface PageProps {
  setPage?: (page: Page) => void;
}

export interface LayoutProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  children: React.ReactNode;
}
