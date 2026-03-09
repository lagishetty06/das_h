import React from 'react';

// This is our new, clean, and fully functional toolbar
const CalendarToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="flex items-center justify-between mb-6 p-2 bg-gray-50 rounded-lg">
      
      {/* Left side: Navigation Buttons */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => onNavigate('PREV')} // Tells the calendar to go back
          className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          &larr; Back
        </button>
        <button
          type="button"
          onClick={() => onNavigate('TODAY')} // Tells the calendar to go to today
          className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate('NEXT')} // Tells the calendar to go forward
          className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Next &rarr;
        </button>
      </div>
      
      {/* Center: The Month/Year Label */}
      <h2 className="text-2xl font-bold text-gray-800">
        {label}
      </h2>
      
      {/* Right side: View Switchers */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onView('month')} // Tells the calendar to switch to Month view
          className={`px-3 py-2 text-sm font-semibold rounded-md ${view === 'month' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
        >
          Month
        </button>
        <button 
          onClick={() => onView('week')} // Tells the calendar to switch to Week view
          className={`px-3 py-2 text-sm font-semibold rounded-md ${view === 'week' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
        >
          Week
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;