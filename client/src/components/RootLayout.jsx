







import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';

const RootLayout = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleAuthModalOpen = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onAuthModalOpen={handleAuthModalOpen} />
      <main className="flex-grow">
        {/* The Outlet is a placeholder from react-router-dom. */}
        {/* It will be replaced by the component of the current route, e.g., HomePage. */}
        <Outlet context={{ openAuthModal: handleAuthModalOpen }} />
      </main>
      <Footer />
      
      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
      />
    </div>
  );
};

export default RootLayout;