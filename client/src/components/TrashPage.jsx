import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskList from './TaskList';
import EditTaskModal from './EditTaskModal';
import TaskDetailModal from './TaskDetailModal';

const Spinner = () => (
  <div className="flex justify-center items-center py-8 sm:py-10">
    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-red-500"></div>
  </div>
);

const TrashPage = () => {
  // Get the filtered list and the new delete function
  const { trashTasks, loading, error, deleteMultipleTasksPermanently } = useTasks();

  // --- NEW: State to manage selected tasks ---
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal states (no changes)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  const handleOpenEditModal = (task) => { setTaskToEdit(task); setIsEditModalOpen(true); };
  const handleCloseEditModal = () => { setTaskToEdit(null); setIsEditModalOpen(false); };
  const handleOpenDetailModal = (task) => { setTaskToView(task); setIsDetailModalOpen(true); };
  const handleCloseDetailModal = () => { setTaskToView(null); setIsDetailModalOpen(false); };

  // --- NEW: Functions to handle selection ---
  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTasks(trashTasks.map(task => task._id));
    } else {
      setSelectedTasks([]);
    }
  };

  // --- NEW: Function to delete selected tasks ---
  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedTasks.length} tasks? This action cannot be undone.`)) {
      setIsDeleting(true);
      await deleteMultipleTasksPermanently(selectedTasks);
      setSelectedTasks([]); // Clear selection
      setIsDeleting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;

  const isAllSelected = trashTasks.length > 0 && selectedTasks.length === trashTasks.length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Trash</h1>
        {/* --- NEW: Delete Button --- */}
        {selectedTasks.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="px-3 sm:px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300 w-full sm:w-auto"
          >
            {isDeleting ? 'Deleting...' : `Delete ${selectedTasks.length} Permanently`}
          </button>
        )}
      </div>

      {/* --- NEW: Selection Header --- */}
      {trashTasks.length > 0 && (
        <div className="flex items-center p-3 sm:p-4 mb-3 sm:mb-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <input
            type="checkbox"
            className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
          <label className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-700">
            Select All ({selectedTasks.length} selected)
          </label>
        </div>
      )}

      {/* --- NEW: Pass selection props to TaskList --- */}
      <TaskList
        tasks={trashTasks}
        onEdit={handleOpenEditModal}
        onViewDetails={handleOpenDetailModal}
        // Pass down selection state and handler
        selectionMode={true}
        selectedTasks={selectedTasks}
        onSelectTask={handleSelectTask}
      />

      <EditTaskModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} task={taskToEdit} />
      <TaskDetailModal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} task={taskToView} />
    </div>
  );
};

export default TrashPage;




