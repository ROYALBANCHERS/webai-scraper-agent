import React, { useEffect } from 'react';
import { AdSpace } from '../AdSpace';

export const Services: React.FC = () => {
  useEffect(() => {
    document.title = "Services - Webai Auditor";
  }, []);

  const services = [
    {
      title: "Full Website Audit",
      desc: "Deep dive into your HTML structure, CSS layout, and JavaScript performance. We check everything.",
      icon: "🔍"
    },
    {
      title: "Code Review",
      desc: "Identify deprecated code, missing semantic tags, and poor practices that hurt SEO.",
      icon: "💻"
    },
    {
      title: "UX Optimization",
      desc: "Ensure your buttons are clickable, forms work, and users don't get frustrated.",
      icon: "🚀"
    },
    {
      title: "Mobile Responsiveness",
      desc: "Check how your site breaks on small screens and how to fix it immediately.",
      icon: "📱"
    }
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Our Services</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We help developers and business owners build better websites through automated, intelligent analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {services.map((s, i) => (
          <div key={i} className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow bg-white">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-500 font-light">{s.desc}</p>
          </div>
        ))}
      </div>

      <AdSpace />
    </div>
  );
};