import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setPage: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, setPage }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <Navbar currentPage={currentPage} setPage={setPage} />
      
      <main className="flex-grow w-full">
        {children}
      </main>

      <Footer setPage={setPage} />
    </div>
  );
};