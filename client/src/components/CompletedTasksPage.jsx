import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskList from './TaskList';
import EditTaskModal from './EditTaskModal';
import TaskDetailModal from './TaskDetailModal';
import { CheckCircle, Loader2, Trophy } from 'lucide-react';

const Spinner = () => (
  <div className="flex flex-col justify-center items-center py-20">
    <div className="relative">
      <Loader2 className="h-16 w-16 text-green-600 animate-spin" />
      <div className="absolute inset-0 h-16 w-16 border-4 border-green-200 rounded-full animate-pulse"></div>
    </div>
    <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading completed tasks...</p>
  </div>
);

const CompletedTasksPage = () => {
  const { completedTasks, loading, error } = useTasks();
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
    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
            <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
            Completed Tasks
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {completedTasks.length === 0 ? 'No completed tasks yet' : `${completedTasks.length} completed task${completedTasks.length !== 1 ? 's' : ''} - Great job!`}
          </p>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-green-200 text-center max-w-md w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No completed tasks yet!</h3>
            <p className="text-sm sm:text-base text-gray-600">Complete your tasks to see them appear here and track your progress.</p>
          </div>
        </div>
      ) : (
        <TaskList 
          tasks={completedTasks}
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

export default CompletedTasksPage;






