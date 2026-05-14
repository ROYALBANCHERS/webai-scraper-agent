import React, { useEffect } from 'react';
import { AdSpace } from '../AdSpace';
import { Page } from '../../types';

interface BlogsProps {
  setPage: (page: Page) => void;
}

export const Blogs: React.FC<BlogsProps> = ({ setPage }) => {
  useEffect(() => {
    document.title = "Blog - Web Development Tips";
    window.scrollTo(0, 0);
  }, []);

  const posts = [
    {
      title: "Why your buttons are not working on Mobile",
      snippet: "Touch targets are crucial. If your button is smaller than 44px, you are losing customers.",
      date: "Oct 12, 2023"
    },
    {
      title: "React vs HTML: Which is better for SEO?",
      snippet: "Exploring the nuances of Server Side Rendering vs Client Side Rendering for modern web apps.",
      date: "Sep 28, 2023"
    },
    {
      title: "5 CSS properties you should stop using",
      snippet: "Float is dead. Learn what to use instead to make your layouts bulletproof.",
      date: "Sep 15, 2023"
    }
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-light text-gray-900 mb-12 text-center">Latest Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <article key={i} className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 w-full"></div>
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-xs text-gray-400 font-medium mb-2">{post.date}</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
              <p className="text-gray-500 text-sm font-light mb-4 flex-grow">{post.snippet}</p>
              <button 
                onClick={() => setPage(Page.BLOG_POST)}
                className="text-black text-sm font-medium hover:underline text-left"
              >
                Read more →
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16">
        <AdSpace />
      </div>
    </div>
  );
};