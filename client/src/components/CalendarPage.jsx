import React, { useMemo, useState, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Star, Clock } from 'lucide-react';
import useTasks from '../hooks/useTasks';
import CalendarToolbar from './CalendarToolbar';
import './CalendarPage.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { tasks, loading, error } = useTasks();

  // --- NEW: State to manually control the calendar ---
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Memoize events
  const events = useMemo(() => {
    return tasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: task._id,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
      }));
  }, [tasks]);

  // --- NEW: Handlers that allow our toolbar to control the calendar ---
  const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const handleView = useCallback((newView) => setView(newView), [setView]);
  const handleSelectSlot = useCallback(({ start }) => setSelectedDate(start), [setSelectedDate]);

  // Memoize selected tasks
  const selectedTasks = useMemo(() => {
    return tasks.filter(task => 
      task.dueDate && moment(task.dueDate).isSame(selectedDate, 'day')
    );
  }, [tasks, selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Calendar...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-600 text-5xl mb-3">⚠️</div>
          <p className="text-red-700 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Task Calendar</h1>
            </div>
          </div>
          <div className="p-6">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '70vh' }}
              selectable
              onSelectSlot={handleSelectSlot}
              view={view}
              date={date}
              onView={handleView}
              onNavigate={handleNavigate}
              views={['month', 'week']}
              components={{
                toolbar: CalendarToolbar,
              }}
            />
          </div>
        </div>
      </div>

      {/* Selected Date Tasks Section (Right Panel) */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Tasks for
            </h2>
            <p className="text-sm text-indigo-700 font-semibold mt-1">
              {moment(selectedDate).format('MMMM D, YYYY')}
            </p>
          </div>
          
          <div className="p-5">
            {selectedTasks.length > 0 ? (
              <ul className="space-y-3 max-h-[calc(70vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
                {selectedTasks.map(task => (
                  <li 
                    key={task._id} 
                    className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-gray-900 text-sm leading-tight ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {task.priority !== undefined && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              task.priority >= 75 ? 'bg-red-100 text-red-700' :
                              task.priority >= 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority}% Priority
                            </span>
                          )}
                          {task.isStarred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-50 rounded-full mb-3">
                  <CalendarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No tasks due on this day</p>
                <p className="text-xs text-gray-400 mt-1">Select a different date to view tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;








// import React, { useMemo, useState, useCallback } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import useTasks from '../hooks/useTasks';
// import './CalendarPage.css';

// const localizer = momentLocalizer(moment);

// const CustomToolbar = ({ label, onNavigate }) => {
//   return (
//     <div className="flex items-center justify-between mb-6">
//       <div className="flex items-center space-x-2">
//         <button type="button" onClick={() => onNavigate('PREV')} className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">&larr;</button>
//         <button type="button" onClick={() => onNavigate('TODAY')} className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Today</button>
//         <button type="button" onClick={() => onNavigate('NEXT')} className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">&rarr;</button>
//       </div>
//       <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
//       <div className="w-32"></div>
//     </div>
//   );
// };

// const CalendarPage = () => {
//   const { tasks, loading, error } = useTasks();
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const events = useMemo(() => tasks.filter(task => task.dueDate).map(task => ({
//     id: task._id, title: task.title, start: new Date(task.dueDate), end: new Date(task.dueDate), allDay: true,
//   })), [tasks]);

//   const handleSelectSlot = useCallback(({ start }) => setSelectedDate(start), []);

//   const selectedTasks = useMemo(() => tasks.filter(task => 
//     task.dueDate && moment(task.dueDate).isSame(selectedDate, 'day')
//   ), [tasks, selectedDate]);

//   if (loading) return <div>Loading Calendar...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
//         <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: '75vh' }} selectable onSelectSlot={handleSelectSlot} view="month" views={['month']} components={{ toolbar: CustomToolbar }} />
//       </div>
//       <div className="lg:col-span-1">
//         <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks for <span className="text-blue-600">{moment(selectedDate).format('MMMM D, YYYY')}</span></h2>
//             {selectedTasks.length > 0 ? (
//               <ul className="space-y-3 max-h-96 overflow-y-auto">{selectedTasks.map(task => (<li key={task._id} className="p-3 bg-gray-50 rounded-md border border-gray-200"><p className="font-medium text-gray-900">{task.title}</p></li>))}</ul>
//             ) : (<p className="text-sm text-gray-500 mt-4">No tasks due on this day.</p>)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CalendarPage;