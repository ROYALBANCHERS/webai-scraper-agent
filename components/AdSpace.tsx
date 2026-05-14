import React from 'react';

export const AdSpace: React.FC = () => {
  return (
    <div className="w-full h-32 bg-gray-50 flex flex-col items-center justify-center border border-gray-100 rounded-lg my-8 overflow-hidden relative">
      <span className="text-gray-300 text-xs font-medium uppercase tracking-widest z-10">Advertisement</span>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_25%,rgba(0,0,0,0.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.02)_75%,rgba(0,0,0,0.02)_100%)] bg-[length:20px_20px]"></div>
    </div>
  );
};