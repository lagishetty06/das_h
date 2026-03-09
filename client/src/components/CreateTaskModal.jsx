import React, { useState } from 'react';
import { Calendar, Bell, Trash2, Plus } from 'lucide-react';

const CreateTaskModal = () => {
  // eslint-disable-next-line no-unused-vars
  const [title, setTitle] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [priority, setPriority] = useState(1);
  const [reminders, setReminders] = useState([]);
  const [reminderType, setReminderType] = useState('once'); // 'once', 'daily', 'monthly', 'yearly'
  const [dailyTime, setDailyTime] = useState('09:00');
  const [monthlyDay, setMonthlyDay] = useState(1);
  const [monthlyTime, setMonthlyTime] = useState('09:00');
  const [yearlyMonth, setYearlyMonth] = useState(1);
  const [yearlyDay, setYearlyDay] = useState(1);
  const [yearlyTime, setYearlyTime] = useState('09:00');

  const addReminder = () => {
    const now = new Date();
    // Use local timezone
    const localTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const formattedTime = localTime.toISOString().slice(0, 16);

    setReminders([...reminders, { time: formattedTime, daily: false }]);
  };

  const updateReminder = (index, field, value) => {
    const updated = [...reminders];
    updated[index][field] = value;
    setReminders(updated);
  };

  const removeReminder = (index) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Process reminders based on type
    let processedReminders = [];

    if (reminderType === 'once') {
      processedReminders = reminders.map(r => ({
        time: new Date(r.time).toISOString(),
        daily: false
      }));
    } else if (reminderType === 'daily') {
      const [hours, minutes] = dailyTime.split(':');
      const reminderTime = new Date();
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      processedReminders = [{
        time: reminderTime.toISOString(),
        daily: true,
        repeatType: 'daily'
      }];
    } else if (reminderType === 'monthly') {
      const [hours, minutes] = monthlyTime.split(':');
      const reminderTime = new Date();
      reminderTime.setDate(monthlyDay);
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      processedReminders = [{
        time: reminderTime.toISOString(),
        daily: false,
        repeatType: 'monthly',
        monthlyDay: monthlyDay
      }];
    } else if (reminderType === 'yearly') {
      const [hours, minutes] = yearlyTime.split(':');
      const reminderTime = new Date();
      reminderTime.setMonth(yearlyMonth - 1);
      reminderTime.setDate(yearlyDay);
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      processedReminders = [{
        time: reminderTime.toISOString(),
        daily: false,
        repeatType: 'yearly',
        yearlyMonth: yearlyMonth,
        yearlyDay: yearlyDay
      }];
    }

    const _taskData = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      reminders: processedReminders,
    };

    // ...existing code for API call...
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* ...existing header code... */}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* ...existing title and description inputs... */}

          {/* Due Date & Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Due Date & Time
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* ...existing priority slider... */}

          {/* Reminders Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Bell className="h-4 w-4 text-purple-600" />
              Reminders
            </label>

            {/* Reminder Type Selection */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setReminderType('once')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${reminderType === 'once'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                One-time
              </button>
              <button
                type="button"
                onClick={() => setReminderType('daily')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${reminderType === 'daily'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setReminderType('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${reminderType === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setReminderType('yearly')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${reminderType === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Yearly
              </button>
            </div>

            {/* One-time Reminders */}
            {reminderType === 'once' && (
              <div className="space-y-3">
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="datetime-local"
                      value={reminder.time}
                      onChange={(e) => updateReminder(index, 'time', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeReminder(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addReminder}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Reminder
                </button>
              </div>
            )}

            {/* Daily Reminder */}
            {reminderType === 'daily' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Set a time for daily reminder</p>
                <input
                  type="time"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">
                  You'll receive a reminder every day at {dailyTime}
                </p>
              </div>
            )}

            {/* Monthly Reminder */}
            {reminderType === 'monthly' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Set a monthly reminder</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Day of Month</label>
                    <select
                      value={monthlyDay}
                      onChange={(e) => setMonthlyDay(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={monthlyTime}
                      onChange={(e) => setMonthlyTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Reminder on day {monthlyDay} of every month at {monthlyTime}
                </p>
              </div>
            )}

            {/* Yearly Reminder */}
            {reminderType === 'yearly' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Set a yearly reminder</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Month</label>
                    <select
                      value={yearlyMonth}
                      onChange={(e) => setYearlyMonth(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                        <option key={idx} value={idx + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Day</label>
                    <select
                      value={yearlyDay}
                      onChange={(e) => setYearlyDay(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={yearlyTime}
                      onChange={(e) => setYearlyTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Reminder every year on {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][yearlyMonth - 1]} {yearlyDay} at {yearlyTime}
                </p>
              </div>
            )}
          </div>

          {/* ...existing action buttons... */}
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;