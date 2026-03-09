import React, { useState } from 'react';
import { X, Calendar, Clock, Bell, Plus, Trash2, Sparkles } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(50);
  const [dueDate, setDueDate] = useState('');
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddAlarm = () => setAlarms([...alarms, { time: '', repeatDaily: false }]);
  const handleRemoveAlarm = (index) => setAlarms(alarms.filter((_, i) => i !== index));
  const handleAlarmChange = (index, field, value) => {
    const newAlarms = [...alarms];
    newAlarms[index][field] = value;
    setAlarms(newAlarms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- NEW: Due Date Logic ---
    // If a due date is selected, format it correctly.
    let finalDueDate = null;
    if (dueDate) {
      // If the user picked a date but not a time, the input format is just 'YYYY-MM-DD'.
      // We append the default time to make it the end of the day.
      if (dueDate.length === 10) { // This checks if only a date is picked
        finalDueDate = `${dueDate}T23:59`;
      } else {
        finalDueDate = dueDate;
      }
    }

    // IMPORTANT: Convert local datetime (from <input type="datetime-local" />)
    // into a UTC ISO string before sending to the API. Otherwise, the server
    // will assume the value is UTC and apply an extra +offset when read back.
    const finalDueDateISO = finalDueDate ? new Date(finalDueDate).toISOString() : null;

    // Normalize alarm times as well (same reason as above)
    const normalizedAlarms = alarms.map(a => ({
      ...a,
      time: a.time ? new Date(a.time).toISOString() : null,
    })).filter(a => a.time); // drop empty times if any

    setLoading(true);
    try {
      await onAddTask({
        title,
        description,
        priority: Number(priority),
        dueDate: finalDueDateISO,
        alarms: normalizedAlarms,
      });
      onClose(); // Close the modal on success
    } catch {
      // Error toast is already handled in the provider
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (value) => {
    if (value >= 75) return 'from-red-500 to-red-600';
    if (value >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getPriorityLabel = (value) => {
    if (value >= 75) return 'High Priority';
    if (value >= 50) return 'Medium Priority';
    return 'Low Priority';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Create New Task</h3>
              <p className="text-xs text-indigo-100">Add a task to your workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Title */}
              <div className="group">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Complete project proposal"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Description */}
              <div className="group">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about this task..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Due Date */}
              <div className="group">
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Due Date & Time <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 transition-all duration-200 text-gray-900"
                  />
                </div>
              </div>

              {/* Priority Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Priority Level
                </label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getPriorityColor(priority)}`}>
                      {priority}% - {getPriorityLabel(priority)}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer priority-slider"
                      style={{
                        background: `linear-gradient(to right, 
                          ${priority >= 75 ? '#ef4444' : priority >= 50 ? '#eab308' : '#22c55e'} 0%, 
                          ${priority >= 75 ? '#ef4444' : priority >= 50 ? '#eab308' : '#22c55e'} ${priority}%, 
                          #e5e7eb ${priority}%, 
                          #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500 font-medium">Low</span>
                    <span className="text-xs text-gray-500 font-medium">Medium</span>
                    <span className="text-xs text-gray-500 font-medium">High</span>
                  </div>
                </div>
              </div>

              {/* Reminders */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  Reminders
                </label>
                <div className="space-y-3">
                  {alarms.map((alarm, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-xl"
                    >
                      <div className="flex-1">
                        <input
                          type="datetime-local"
                          value={alarm.time}
                          onChange={(e) => handleAlarmChange(index, 'time', e.target.value)}
                          className="w-full px-3 py-2 bg-white border-2 border-indigo-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-indigo-200">
                        <input
                          id={`repeat-${index}`}
                          type="checkbox"
                          checked={alarm.repeatDaily}
                          onChange={(e) => handleAlarmChange(index, 'repeatDaily', e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <label htmlFor={`repeat-${index}`} className="text-sm text-gray-700 font-medium whitespace-nowrap">
                          Daily
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAlarm(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddAlarm}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm text-indigo-600 hover:text-indigo-700 font-semibold border-2 border-dashed border-indigo-300 hover:border-indigo-400 rounded-xl hover:bg-indigo-50 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Reminder
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;











