import React, { useEffect } from 'react';
import { Page } from '../../types';
import { AdSpace } from '../AdSpace';

interface BlogPostProps {
  setPage: (page: Page) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ setPage }) => {
  useEffect(() => {
    document.title = "Why your buttons are not working on Mobile - Webai Auditor";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <button 
        onClick={() => setPage(Page.BLOGS)}
        className="mb-8 flex items-center text-gray-500 hover:text-black transition-colors text-sm"
      >
        ← Back to Blogs
      </button>

      <span className="text-blue-600 font-medium text-sm tracking-wider uppercase mb-3 block">UX Design</span>
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
        Why your buttons are not working on Mobile
      </h1>
      
      <div className="flex items-center space-x-4 mb-10 border-b border-gray-100 pb-8">
         <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
         <div>
            <p className="text-sm font-medium text-gray-900">Rahul Sharma</p>
            <p className="text-xs text-gray-500">Senior UX Engineer • Oct 12, 2023</p>
         </div>
      </div>

      <div className="prose prose-lg prose-gray max-w-none text-gray-600 font-light leading-relaxed">
        <p className="mb-6">
          We've all been there. You're browsing a beautiful website on your phone, trying to click "Add to Cart" or "Sign Up," and... nothing happens. Or worse, you accidentally click the link next to it. This is the plague of modern mobile web design: <strong>Touch Targets.</strong>
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">The 44px Rule</h3>
        <p className="mb-6">
          Apple's Human Interface Guidelines recommend a minimum touch target size of 44x44 points. Android recommends 48x48dp. Why? Because the average human finger pad is about 10-14mm wide. If your button is styled to be `height: 30px`, you are essentially asking your user to perform microsurgery just to navigate your app.
        </p>

        <blockquote className="border-l-4 border-black pl-4 italic text-gray-800 my-8">
           "A user who cannot click your button is a user who cannot pay you."
        </blockquote>

        <h3 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Common Mistakes in CSS</h3>
        <p className="mb-4">
          Here are the top reasons your buttons fail on mobile:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
           <li><strong>Using `padding: 5px`:</strong> This might look minimal on desktop, but on mobile, it's unusable. Use `padding: 12px 24px` at minimum.</li>
           <li><strong>Overlapping elements:</strong> Check your `z-index`. Often a transparent layer (like a cookie banner) overlays the bottom buttons.</li>
           <li><strong>No Active State:</strong> Mobile users don't have a "hover" state. If your button doesn't react (change color/opacity) on touch (`:active`), users think the site is frozen.</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">How to fix it</h3>
        <p className="mb-6">
          The easiest fix is to increase padding or use a transparent border to increase the clickable area without affecting the visual design.
        </p>
        
        <div className="bg-gray-900 p-6 rounded-xl text-gray-200 font-mono text-sm mb-8 overflow-x-auto">
{`.button {
  /* Visual size */
  height: 40px; 
  /* Clickable size magic */
  position: relative;
}
.button::after {
  content: '';
  position: absolute;
  top: -10px; bottom: -10px;
  left: -10px; right: -10px;
}`}
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100">
        <h4 className="text-gray-900 font-semibold mb-4">Was this article helpful?</h4>
        <div className="flex space-x-4">
           <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">👍 Yes</button>
           <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">👎 No</button>
        </div>
      </div>

      <div className="mt-12">
        <AdSpace />
      </div>
    </div>
  );
};