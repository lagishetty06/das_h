import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import TaskDetailModal from './TaskDetailModal';
import { Plus, Loader2, AlertCircle, Sparkles } from 'lucide-react';

// Enhanced loading spinner
const Spinner = () => (
  <div className="flex flex-col justify-center items-center py-20">
    <div className="relative">
      <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
      <div className="absolute inset-0 h-16 w-16 border-4 border-purple-200 rounded-full animate-pulse"></div>
    </div>
    <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading your tasks...</p>
  </div>
);

const AllTasksPage = () => {
  const { tasks, loading, error, addTask } = useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setTaskToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleOpenDetailModal = (task) => {
    setTaskToView(task);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setTaskToView(null);
    setIsDetailModalOpen(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <p className="text-sm text-red-600">Could not load tasks. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
            All Tasks
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {tasks.length === 0 ? 'No tasks yet' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} in your workspace`}
          </p>
          <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            Sorted by: Priority → Due Date → Reminders
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="group relative px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300" />
          Add New Task
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </button>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-200 text-center max-w-md w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No tasks yet!</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Get started by creating your first task and stay organized.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              Create Your First Task
            </button>
          </div>
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onEdit={handleOpenEditModal} 
          onViewDetails={handleOpenDetailModal} 
        />
      )}

      {/* Modals */}
      <AddTaskModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={addTask}
      />
      
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

export default AllTasksPage;











