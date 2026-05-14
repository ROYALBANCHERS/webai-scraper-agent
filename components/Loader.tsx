import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Opening your website in a browser...",
  "Scanning buttons and links...",
  "Checking mobile responsiveness...",
  "Running AI analysis...",
  "Detecting issues...",
  "Calculating quality rating...",
  "Almost done...",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Animated AI Brain */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          <div className="text-5xl animate-bounce">🧠</div>
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        AI Website Audit in Progress
      </h2>

      {/* Progress Steps */}
      <div className="flex flex-col items-center gap-2 mb-6">
        {loadingMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm transition-all duration-500 ${
              idx === messageIndex
                ? 'text-black font-medium animate-fade-in'
                : idx < messageIndex
                ? 'text-green-600'
                : 'text-gray-300'
            }`}
          >
            {idx === messageIndex && '▸ '}
            {idx < messageIndex && '✓ '}
            {msg}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${((messageIndex + 1) / loadingMessages.length) * 100}%`,
          }}
        />
      </div>

      <p className="text-gray-400 text-sm mt-6 italic">
        "Please wait a moment while the AI completes your audit..."
      </p>
    </div>
  );
};
