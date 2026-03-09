import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import FloatingAIChatButton from './FloatingAIChatButton';
import AIChatAssistant from './AIChatAssistant';

const DashboardLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Chat Button */}
      <FloatingAIChatButton 
        isOpen={isChatOpen} 
        onClick={() => setIsChatOpen(!isChatOpen)} 
      />

      {/* AI Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-auto max-w-lg"> 
          <AIChatAssistant />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;







