import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO2.jpg';

const Header = ({ onAuthModalOpen }) => {
  const handleAuthClick = (mode) => {
    if (onAuthModalOpen) {
      onAuthModalOpen(mode);
    }
  };

  return (
    <header className="bg-gray-100/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/home" className="-m-1.5 p-1.5 flex items-center group">
            <img 
              className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              src={logo} 
              alt="DASH Logo" 
            />
          </Link>
        </div>
        <div className="flex items-center gap-x-4">
          <button 
            onClick={() => handleAuthClick('login')}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-all duration-200 relative group"
          >
            Sign In
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => handleAuthClick('register')}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;





// import React from 'react';
// import { Link } from 'react-router-dom';

// const Header = () => {
//   // This is the header for the PUBLIC pages (before login)
//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
//         <div className="flex lg:flex-1">
//           <Link to="/home" className="-m-1.5 p-1.5">
//             <span className="text-2xl font-bold text-blue-600">DASH</span>
//           </Link>
//         </div>
//         <div className="flex items-center gap-x-8">
//             <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
//               Register
//             </Link>
//             <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
//               Log in
//             </Link>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;