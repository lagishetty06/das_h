import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Contact Information */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Contact Us</h3>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Vamshikrishna</span>
              </p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a 
                href="mailto:dashprojectteam@gmail.com" 
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                dashprojectteam@gmail.com
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} DASH, Inc. A Decisive Assistant for Scheduling. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
};

export default Footer;