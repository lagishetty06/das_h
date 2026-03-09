
import React, { useState, useEffect } from 'react';
import useTasks from '../hooks/useTasks';

const EditTaskModal = ({ task, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 50, dueDate: '', alarms: [] });
  const [loading, setLoading] = useState(false);
  const { updateTask } = useTasks();

  const formatDateTimeLocal = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return adjustedDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 50,
        // --- NEW: Use the same timezone-safe formatting for due date ---
        dueDate: task.dueDate ? formatDateTimeLocal(task.dueDate) : '',
        alarms: task.alarms.map(alarm => ({
            ...alarm,
            time: formatDateTimeLocal(alarm.time)
        })) || [],
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddAlarm = () => setFormData(prev => ({ ...prev, alarms: [...prev.alarms, { time: '', repeatDaily: false }] }));
  const handleRemoveAlarm = (index) => setFormData(prev => ({ ...prev, alarms: formData.alarms.filter((_, i) => i !== index) }));
  const handleAlarmChange = (index, field, value) => {
    const newAlarms = [...formData.alarms];
    newAlarms[index][field] = value;
    setFormData(prev => ({ ...prev, alarms: newAlarms }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  let finalDueDate = null;
  if (formData.dueDate) {
    if (formData.dueDate.length === 10) {
      finalDueDate = `${formData.dueDate}T23:59`;
    } else {
      finalDueDate = formData.dueDate;
    }
  }

  // Convert local datetime strings to UTC ISO before updating
  const finalDueDateISO = finalDueDate ? new Date(finalDueDate).toISOString() : null;
  const normalizedAlarms = (formData.alarms || []).map(a => ({
    ...a,
    time: a.time ? new Date(a.time).toISOString() : null,
  })).filter(a => a.time);
    setLoading(true);
    await updateTask(task._id, { ...formData, priority: Number(formData.priority), dueDate: finalDueDateISO, alarms: normalizedAlarms });
    setLoading(false);
    onClose();
  };

  const getPriorityColor = (value) => {
    if (value > 75) return 'bg-red-500'; if (value > 40) return 'bg-yellow-500'; return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Edit Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div><label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label><input type="text" name="title" id="title" value={formData.title} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
            <div><label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label><textarea name="description" id="description" rows="3" value={formData.description} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea></div>
            
            {/* --- NEW: Changed input type to datetime-local --- */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date & Time</label>
              <input type="datetime-local" name="dueDate" id="dueDate" value={formData.dueDate} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reminders</label>
              <div className="mt-2 space-y-3">{formData.alarms.map((alarm, index) => (<div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"><input type="datetime-local" value={alarm.time} onChange={(e) => handleAlarmChange(index, 'time', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required /><div className="flex items-center"><input id={`edit-repeat-${index}`} type="checkbox" checked={alarm.repeatDaily} onChange={(e) => handleAlarmChange(index, 'repeatDaily', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" /><label htmlFor={`edit-repeat-${index}`} className="ml-2 text-sm text-gray-600">Daily</label></div><button type="button" onClick={() => handleRemoveAlarm(index)} className="text-red-500 hover:text-red-700 font-bold text-xl px-2">&times;</button></div>))}<button type="button" onClick={handleAddAlarm} className="w-full text-sm text-blue-600 hover:text-blue-800 font-semibold py-2 border-2 border-dashed border-gray-300 rounded-md">+ Add Reminder</button></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority: {formData.priority}%</label>
              <div className="flex items-center space-x-3 mt-1"><span className="text-sm text-gray-500">Low</span><input type="range" name="priority" id="priority" min="0" max="100" value={formData.priority} onChange={onChange} className={`w-full h-2 ${getPriorityColor(formData.priority)} rounded-lg appearance-none cursor-pointer`} /><span className="text-sm text-gray-500">High</span></div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-300">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
















