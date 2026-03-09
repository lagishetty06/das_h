// import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';

// // --- NEW: Professional SVG Icons ---
// // (Heroicons - https://heroicons.com/)

// const ListIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//   </svg>
// );
// const StarIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.4c.566 0 .793.812.383 1.077l-4.337 3.16a.563.563 0 00-.18.636l1.62 5.091a.562.562 0 01-.813.621l-4.337-3.16a.563.563 0 00-.651 0l-4.337 3.16a.562.562 0 01-.813-.621l1.62-5.091a.563.563 0 00-.18-.636l-4.337-3.16a.562.562 0 01.383-1.077h5.4a.563.563 0 00.475-.31l2.125-5.11z" />
//   </svg>
// );
// const CheckIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );
// const TrashIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9M9.26 9l.94 6.936m2.613-6.936L14.74 9M14.74 9l-2.226-2.226c-.34-.34-.8-.53-1.28-.53s-.94.19-1.28.53L9.26 9m9.46-4.125l-2.828-2.828A4.5 4.5 0 0012 4.5v2.25M7.5 4.5v2.25m6 13.5v-2.25a.75.75 0 00-.75-.75h-3.5a.75.75 0 00-.75.75v2.25m4.125 0H9.375c-.621 0-1.125-.504-1.125-1.125V9.75c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125z" />
//   </svg>
// );
// const LogoutIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
//   </svg>
// );
// // --- End Icons ---


// const Sidebar = () => {
//   const { logout } = useAuth();

//   // --- NEW: Theme-aligned classes ---
//   const activeLinkClass = "bg-indigo-50 text-button-primary border-l-4 border-button-primary font-medium";
//   const inactiveLinkClass = "text-gray-600 hover:bg-indigo-50 hover:text-button-primary";

//   return (
//     <div className="flex-col w-64 h-screen px-4 py-8 bg-white border-r hidden md:flex"> {/* Hide on mobile */}
      
//       {/* Updated DASH link to match public header */}
//       <Link to="/dashboard" className="-m-1.5 p-1.5 flex items-center gap-2 group mb-6">
//         <span className="text-3xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-text-link">
//           DASH
//         </span>
//       </Link>
      
//       <div className="flex flex-col justify-between flex-1">
//         <nav>
//           <NavLink
//             to="/dashboard" // Changed to /dashboard for index
//             end 
//             className={({ isActive }) => 
//               `flex items-center px-4 py-2 mt-5 rounded-md ${isActive ? activeLinkClass : inactiveLinkClass}`
//             }
//           >
//             <ListIcon />
//             <span className="mx-4 font-medium">All Tasks</span>
//           </NavLink>

//           <NavLink
//             to="/dashboard/starred" // Prefixed with /dashboard
//             className={({ isActive }) => 
//               `flex items-center px-4 py-2 mt-5 rounded-md ${isActive ? activeLinkClass : inactiveLinkClass}`
//             }
//           >
//             <StarIcon />
//             <span className="mx-4 font-medium">Starred</span>
//           </NavLink>

//           <NavLink
//             to="/dashboard/completed" // Prefixed with /dashboard
//             className={({ isActive }) => 
//               `flex items-center px-4 py-2 mt-5 rounded-md ${isActive ? activeLinkClass : inactiveLinkClass}`
//             }
//           >
//             <CheckIcon />
//             <span className="mx-4 font-medium">Completed</span>
//           </NavLink>

//           <NavLink
//             to="/dashboard/trash" // Prefixed with /dashboard
//             className={({ isActive }) => 
//               `flex items-center px-4 py-2 mt-5 rounded-md ${isActive ? activeLinkClass : inactiveLinkClass}`
//             }
//           >
//             <TrashIcon />
//             <span className="mx-4 font-medium">Trash</span>
//           </NavLink>
//         </nav>

//         <div>
//           <button 
//             onClick={logout} 
//             className="w-full flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-red-50 hover:text-red-700"
//           >
//             <LogoutIcon />
//             <span className="mx-4 font-medium">Log out</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;









import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Star, 
  CheckCircle, 
  Trash2,
  User,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { 
      to: '/tasks', 
      icon: LayoutDashboard, 
      label: 'All Tasks', 
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50'
    },
    { 
      to: '/tasks/starred', 
      icon: Star, 
      label: 'Starred', 
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-50'
    },
    { 
      to: '/tasks/completed', 
      icon: CheckCircle, 
      label: 'Completed', 
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      hoverColor: 'hover:bg-green-50'
    },
    { 
      to: '/tasks/trash', 
      icon: Trash2, 
      label: 'Trash', 
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      hoverColor: 'hover:bg-red-50'
    },
  ];

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        flex flex-col w-64 lg:w-72 h-screen bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 shadow-lg
        fixed md:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      
      {/* Logo Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
        <Link to="/tasks" className="flex items-center gap-2 group" onClick={handleNavClick}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            DASH
          </span>
        </Link>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      
      <div className="flex flex-col justify-between flex-1 p-3 sm:p-4">
        <nav className="space-y-1 sm:space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/tasks'}
              className={({ isActive }) => 
                `group flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? `${item.bgColor} ${item.textColor} shadow-md border-l-4 border-current font-semibold transform scale-105` 
                    : `text-gray-600 ${item.hoverColor} hover:text-gray-900 hover:shadow-sm`
                }`
              }
              onClick={handleNavClick}
            >
              {({ isActive }) => (
                <>
                  <div className={`
                    p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg` 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }
                  `}>
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-1 sm:space-y-2 border-t border-gray-200 pt-3 sm:pt-4">
          <NavLink
            to="/profile"
            className={({ isActive }) => 
              `group flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600 shadow-md font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
            onClick={handleNavClick}
          >
            <div className="p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all duration-300">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium">Profile</span>
          </NavLink>
          
          <button 
            onClick={() => {
              logout();
              handleNavClick();
            }}
            className="w-full group flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          >
            <div className="p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-300">
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;