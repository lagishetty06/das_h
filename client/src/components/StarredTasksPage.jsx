import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskList from './TaskList';
import EditTaskModal from './EditTaskModal';
import TaskDetailModal from './TaskDetailModal';
import { Star, Loader2, Sparkles } from 'lucide-react';

const Spinner = () => (
  <div className="flex flex-col justify-center items-center py-20">
    <div className="relative">
      <Loader2 className="h-16 w-16 text-yellow-600 animate-spin" />
      <div className="absolute inset-0 h-16 w-16 border-4 border-yellow-200 rounded-full animate-pulse"></div>
    </div>
    <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading starred tasks...</p>
  </div>
);

const StarredTasksPage = () => {
  const { starredTasks, loading, error } = useTasks();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  const handleOpenEditModal = (task) => { setTaskToEdit(task); setIsEditModalOpen(true); };
  const handleCloseEditModal = () => { setTaskToEdit(null); setIsEditModalOpen(false); };
  const handleOpenDetailModal = (task) => { setTaskToView(task); setIsDetailModalOpen(true); };
  const handleCloseDetailModal = () => { setTaskToView(null); setIsDetailModalOpen(false); };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
            <Star className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 fill-yellow-600" />
            Starred Tasks
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {starredTasks.length === 0 ? 'No starred tasks yet' : `${starredTasks.length} starred task${starredTasks.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {starredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-yellow-200 text-center max-w-md w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Star className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No starred tasks yet!</h3>
            <p className="text-sm sm:text-base text-gray-600">Star important tasks to quickly access them here.</p>
          </div>
        </div>
      ) : (
        <TaskList 
          tasks={starredTasks}
          onEdit={handleOpenEditModal} 
          onViewDetails={handleOpenDetailModal}
        />
      )}

      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        task={taskToEdit}
      />
      
      <TaskDetailModal 
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={taskToView}
      />
    </div>
  );
};

export default StarredTasksPage;








