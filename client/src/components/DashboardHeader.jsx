// import React from 'react';
// import { Link } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
// import useTasks from '../hooks/useTasks';

// // --- NEW: Professional SVG Icons ---
// const CalendarIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75h10.5m-10.5 3.75h10.5m-10.5 3.75h10.5m-10.5 3.75h10.5m-10.5 3.75h10.5m-10.5 3.75h10.5m-10.5 3.75h10.5m-10.5 3.75h10.5M6.75 21v-3.75m10.5 3.75v-3.75m0 0h-10.5" />
//   </svg>
// );
// const BellIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a.75.75 0 01-1.06 0l-1.06-1.061a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.061zm-4.633 0a.75.75 0 01-1.06 0l-1.06-1.061a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.061zM12 21a2.25 2.25 0 01-2.25-2.25H14.25A2.25 2.25 0 0112 21zm-2.25-4.5h4.5m-4.5 0a.75.75 0 010-1.061l1.06-1.06a.75.75 0 011.06 0l1.06 1.061a.75.75 0 010 1.061m-4.633 0a.75.75 0 01-1.06 0l-1.06-1.061a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.061z" />
//   </svg>
// );
// const UserIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );
// // --- End Icons ---

// const DashboardHeader = () => {
//   const { user } = useAuth();
//   const { searchTerm, setSearchTerm } = useTasks();

//   return (
//     <header className="w-full bg-white p-4 flex justify-between items-center border-b border-gray-200 space-x-4">
      
//       {/* Search Bar - Redesigned */}
//       <div className="relative flex-1 max-w-xs">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
//         </div>
//         <input 
//           type="text" 
//           placeholder="Search tasks by title..."
//           // Updated search bar styles
//           className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary focus:border-transparent text-sm"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Right-side Icons and Profile - Redesigned */}
//       <div className="flex items-center space-x-6">
//         <Link to="/dashboard/calendar" className="text-gray-500 hover:text-text-link transition-colors duration-200" title="Calendar">
//           <CalendarIcon />
//         </Link>
//         <Link to="/dashboard/notifications" className="text-gray-500 hover:text-text-link transition-colors duration-200" title="Notifications">
//           <BellIcon />
//         </Link>
//         <div className="relative">
//           <Link to="/dashboard/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-text-link transition-colors duration-200 group">
//             <UserIcon className="text-gray-500 group-hover:text-text-link" />
//             <span>{user?.name || 'My Account'}</span>
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default DashboardHeader;






import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';
import { Calendar, Bell, User, Search, Menu } from 'lucide-react';

const DashboardHeader = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { searchTerm, setSearchTerm, unreadCount } = useTasks();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md p-3 sm:p-4 flex justify-between items-center border-b border-gray-200 shadow-sm sticky top-0 z-40">
      
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 mr-2"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search tasks..."
          className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white text-xs sm:text-sm transition-all duration-300 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right-side Icons and Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 ml-3 sm:ml-6">
        <Link 
          to="/tasks/calendar" 
          className="group relative p-2 sm:p-3 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-110" 
          title="Calendar"
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        </Link>
        
        <Link 
          to="/tasks/notifications" 
          className="group relative p-2 sm:p-3 rounded-xl text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 transform hover:scale-110" 
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-pink-500 text-white text-[9px] sm:text-xs items-center justify-center font-bold">{unreadCount}</span>
            </span>
          )}
        </Link>
        
        <div className="h-6 sm:h-8 w-px bg-gray-300 hidden sm:block"></div>
        
        <Link 
          to="/profile" 
          className="group flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
        >
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 text-sm sm:text-base">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="hidden md:block">
            <p className="font-semibold text-xs sm:text-sm">{user?.name || 'My Account'}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">View Profile</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;







