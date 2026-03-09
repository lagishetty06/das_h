import React from 'react';
import { Calendar, Clock, Flag, CheckCircle2, Circle } from 'lucide-react';

// Modal showing task details with a cleaner, more modern UI
const TaskDetailModal = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  // Helpers: format dates in user's local timezone
  const formatLocalDate = (isoDate) => {
    if (!isoDate) return 'Not set';
    return new Date(isoDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatLocalDateTime = (isoDate) => {
    if (!isoDate) return 'Not set';
    return new Date(isoDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const PriorityBadge = ({ priority }) => {
    let color, label;
    if (priority > 75) { color = 'from-red-500 to-pink-500'; label = 'High'; }
    else if (priority > 40) { color = 'from-yellow-500 to-orange-500'; label = 'Medium'; }
    else { color = 'from-green-500 to-emerald-500'; label = 'Low'; }
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${color}`}>
        <Flag className="w-3 h-3" /> {label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold leading-tight">{task.title}</h2>
              <p className="text-sm text-indigo-100 mt-1">{task.description || 'No description provided.'}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-3xl font-light">&times;</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${task.isCompleted ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}>
              {task.isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />} {task.isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                <dd className="text-sm text-gray-900 mt-1">{formatLocalDateTime(task.dueDate)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900 mt-1">{formatLocalDate(task.createdAt)}</dd>
              </div>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Reminders</dt>
              <dd className="mt-2 text-sm text-gray-900">
                {task.alarms && task.alarms.length > 0 ? (
                  <ul className="space-y-2">
                    {task.alarms.map((alarm, i) => (
                      <li key={i} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 border border-gray-100">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span>{formatLocalDateTime(alarm.time)}</span>
                        {alarm.repeatDaily && <span className="ml-2 text-xs font-semibold text-blue-600">(Repeats Daily)</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">No reminders set</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;














// // import React from 'react';
// // import moment from 'moment';

// // const TaskDetailModal = ({ task, isOpen, onClose }) => {
// //   if (!isOpen || !task) return null;

// //   const PriorityBadge = ({ priority }) => {
// //     let colorClass, text;
// //     if (priority > 75) { [colorClass, text] = ['bg-red-100 text-red-800', 'High']; }
// //     else if (priority > 40) { [colorClass, text] = ['bg-yellow-100 text-yellow-800', 'Medium']; }
// //     else { [colorClass, text] = ['bg-green-100 text-green-800', 'Low']; }
// //     return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClass}`}>{text}</span>;
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
// //       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
// //         <div className="p-6">
// //           <div className="flex justify-between items-start">
// //             <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
// //             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
// //           </div>

// //           {task.description && (
// //             <p className="mt-2 text-base text-gray-600">{task.description}</p>
// //           )}

// //           <div className="mt-6 border-t border-gray-200 pt-6">
// //             <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
// //               <div className="sm:col-span-1">
// //                 <dt className="text-sm font-medium text-gray-500">Status</dt>
// //                 <dd className="mt-1 text-sm text-gray-900">{task.isCompleted ? 'Completed' : 'Pending'}</dd>
// //               </div>
// //               <div className="sm:col-span-1">
// //                 <dt className="text-sm font-medium text-gray-500">Priority</dt>
// //                 <dd className="mt-1 text-sm text-gray-900"><PriorityBadge priority={task.priority} /></dd>
// //               </div>
// //               <div className="sm:col-span-1">
// //                 <dt className="text-sm font-medium text-gray-500">Due Date</dt>
// //                 <dd className="mt-1 text-sm text-gray-900">{task.dueDate ? moment(task.dueDate).format('MMMM D, YYYY') : 'Not set'}</dd>
// //               </div>
// //               <div className="sm:col-span-1">
// //                 <dt className="text-sm font-medium text-gray-500">Created</dt>
// //                 <dd className="mt-1 text-sm text-gray-900">{moment(task.createdAt).format('MMMM D, YYYY')}</dd>
// //               </div>
// //               <div className="sm:col-span-2">
// //                 <dt className="text-sm font-medium text-gray-500">Reminders</dt>
// //                 <dd className="mt-1 text-sm text-gray-900">
// //                   {task.alarms && task.alarms.length > 0 ? (
// //                     <ul className="list-disc list-inside space-y-1">
// //                       {task.alarms.map((alarm, index) => (
// //                         <li key={index}>
// //                           {moment(alarm.time).format('MMMM D, YYYY [at] h:mm A')}
// //                           {alarm.repeatDaily && <span className="ml-2 text-xs font-semibold text-blue-600">(Repeats Daily)</span>}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   ) : 'No reminders set'}
// //                 </dd>
// //               </div>
// //             </dl>
// //           </div>
// //         </div>
// //         <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
// //           >
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TaskDetailModal;















