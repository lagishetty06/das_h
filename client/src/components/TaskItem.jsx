import React from 'react';
import useTasks from '../hooks/useTasks';
import moment from 'moment';
import { Star, Edit2, Trash2, Clock, AlertTriangle, RotateCcw, Sparkles, Timer } from 'lucide-react';

const TaskItem = ({ task, onEdit, onViewDetails, selectionMode = false, isSelected = false, onSelectTask = () => { } }) => {
  const { updateTask, deleteTask, restoreTask } = useTasks();

  const isOverdueForPurge = task.dueDate && moment().diff(moment(task.dueDate), 'days') > 7;
  const showWarning = task.isDeleted && isOverdueForPurge;
  const isOverdue = task.dueDate && moment(task.dueDate).isBefore(moment()) && !task.isCompleted;

  // Check if task is due today and calculate time remaining
  const isDueToday = task.dueDate && moment(task.dueDate).isSame(moment(), 'day') && !task.isCompleted;
  const getTimeRemaining = () => {
    if (!isDueToday) return null;
    const now = moment();
    const due = moment(task.dueDate);
    const diff = due.diff(now);

    if (diff <= 0) return 'Due now!';

    const duration = moment.duration(diff);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    if (hours === 0) {
      return `${minutes}m left`;
    } else if (hours < 24) {
      return `${hours}h ${minutes}m left`;
    }
    return null;
  };

  const timeRemaining = getTimeRemaining();

  const PriorityBadge = ({ priority }) => {
    let colorClass, text;
    if (priority > 75) {
      [colorClass, text] = ['bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg', 'High'];
    }
    else if (priority > 40) {
      [colorClass, text] = ['bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md', 'Medium'];
    }
    else {
      [colorClass, text] = ['bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md', 'Low'];
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full ${colorClass} transform hover:scale-110 transition-transform duration-200`}>
        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        {text}
      </span>
    );
  };

  const handleToggleComplete = (e) => { e.stopPropagation(); updateTask(task._id, { isCompleted: !task.isCompleted }); };
  const handleToggleStar = (e) => { e.stopPropagation(); updateTask(task._id, { isStarred: !task.isStarred }); };
  const handleEdit = (e) => { e.stopPropagation(); onEdit(task); };
  const handleDelete = (e) => { e.stopPropagation(); if (window.confirm(`Move "${task.title}" to the trash?`)) { deleteTask(task._id); } };
  const handleRestore = (e) => { e.stopPropagation(); restoreTask(task._id); };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (selectionMode) {
      onSelectTask(task._id);
    } else {
      handleToggleComplete(e);
    }
  };

  const isCheckboxChecked = selectionMode ? isSelected : task.isCompleted;

  return (
    <div
      onClick={() => onViewDetails(task)}
      className={`
        group relative bg-white rounded-2xl shadow-md border-2 flex flex-col 
        hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden
        ${showWarning ? 'border-red-400 bg-red-50' : 'border-gray-200'} 
        ${isSelected ? 'ring-4 ring-indigo-500 border-indigo-500 scale-105' : ''}
        ${isOverdue && !task.isCompleted ? 'border-orange-400' : ''}
      `}
    >
      {/* Gradient top bar */}
      <div className={`h-1 w-full ${task.isStarred ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
          task.isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
            isOverdue ? 'bg-gradient-to-r from-orange-400 to-red-500' :
              'bg-gradient-to-r from-indigo-400 to-purple-500'
        }`} />

      {/* Card Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between">
        <div className="flex items-start flex-1">
          <div className="relative">
            <input
              type="checkbox"
              checked={isCheckboxChecked}
              onChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200 hover:scale-110"
              disabled={task.isDeleted && !selectionMode}
            />
            {task.isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-2 w-2 sm:h-3 sm:w-3 bg-indigo-600 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
          <div className="ml-3 sm:ml-4 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <p className={`font-bold text-base sm:text-lg ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {task.title}
              </p>
              {task.isStarred && !task.isDeleted && (
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 animate-pulse flex-shrink-0" />
              )}
            </div>
            {task.description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>
        {!task.isDeleted && (
          <button
            onClick={handleToggleStar}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-yellow-50 transition-all duration-200 group/star flex-shrink-0 ml-2"
          >
            <Star className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200 ${task.isStarred
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 group-hover/star:text-yellow-400 group-hover/star:scale-110'
              }`} />
          </button>
        )}
      </div>

      {/* Card Footer */}
      <div className="border-t-2 border-gray-100 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
          {task.dueDate && (
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${isOverdue && !task.isCompleted
                ? 'bg-orange-100 text-orange-700 font-semibold'
                : 'bg-gray-100 text-gray-600'
              }`}>
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs font-medium whitespace-nowrap">{moment(task.dueDate).format('MMM D, h:mm A')}</span>
            </div>
          )}
          {/* Time Remaining Badge for Today's Tasks */}
          {isDueToday && timeRemaining && (
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg animate-pulse ${timeRemaining === 'Due now!'
                ? 'bg-red-500 text-white font-bold shadow-lg'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md'
              }`}>
              <Timer className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 animate-spin" />
              <span className="text-xs font-bold whitespace-nowrap">{timeRemaining}</span>
            </div>
          )}
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
          {showWarning && (
            <div className="flex items-center gap-1 text-xs text-red-600 bg-red-100 px-1.5 sm:px-2 py-1 rounded-lg"
              title={`Overdue. Will be permanently deleted ${moment(task.dueDate).add(7, 'days').fromNow()}.`}>
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          )}

          {task.isDeleted ? (
            <button
              onClick={handleRestore}
              className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 transform hover:scale-110"
              title="Restore Task"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-110"
                title="Edit Task"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                title="Move to Trash"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
};

export default TaskItem;






