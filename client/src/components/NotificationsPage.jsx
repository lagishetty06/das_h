import React, { useMemo, useState, useEffect } from 'react';
import useTasks from '../hooks/useTasks';
import moment from 'moment';
import { Bell, BellRing, Clock, CheckCircle2, Trash2, Filter, Mail, Calendar, Sparkles } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, loading, markNotificationsAsRead } = useTasks();
  const [filter, setFilter] = useState('all'); // all, email

  // Mark notifications as read when page opens
  useEffect(() => {
    if (markNotificationsAsRead) {
      markNotificationsAsRead();
    }
  }, [markNotificationsAsRead]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    if (!notifications || notifications.length === 0) return {};

    const filtered = filter === 'all'
      ? notifications
      : notifications.filter(n => n.type === filter);

    return filtered.reduce((groups, notification) => {
      const date = moment(notification.createdAt).format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
  }, [notifications, filter]);

  // Statistics
  const stats = useMemo(() => {
    if (!notifications || notifications.length === 0) return { total: 0, email: 0, today: 0 };

    const today = moment().startOf('day');
    return {
      total: notifications.length,
      email: notifications.filter(n => n.type === 'email').length,
      today: notifications.filter(n => moment(n.createdAt).isSameOrAfter(today)).length,
    };
  }, [notifications]);

  const getNotificationIcon = (type) => {
    if (type === 'email') {
      return <Mail className="w-5 h-5" />;
    }
    return <BellRing className="w-5 h-5" />;
  };

  const getNotificationColor = (type) => {
    if (type === 'email') {
      return 'from-blue-500 to-blue-600';
    }
    return 'from-indigo-500 to-indigo-600';
  };

  const formatDateGroup = (dateString) => {
    const date = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    if (date.isSame(today, 'day')) return 'Today';
    if (date.isSame(yesterday, 'day')) return 'Yesterday';
    if (date.isAfter(moment().subtract(7, 'days'))) return date.format('dddd');
    return date.format('MMMM D, YYYY');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-indigo-100 text-sm mt-1">Stay updated with your task reminders</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <Sparkles className="w-12 h-12 text-white/30 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Total Reminders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-inner">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Email Reminders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.email}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-inner">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Today's Reminders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      {stats.total > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Bell className="w-4 h-4 inline mr-2" />
                All Reminders ({stats.total})
              </button>
              <button
                onClick={() => setFilter('email')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${filter === 'email'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email Only ({stats.email})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {Object.keys(groupedNotifications).length > 0 ? (
          <div className="space-y-8">
            {Object.keys(groupedNotifications)
              .sort((a, b) => moment(b).diff(moment(a)))
              .map((dateGroup) => (
                <div key={dateGroup}>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-800">{formatDateGroup(dateGroup)}</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <div className="space-y-4">
                    {groupedNotifications[dateGroup].map((notification) => (
                      <div
                        key={notification._id}
                        className="group relative flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                      >
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center text-white shadow-lg`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: notification.message }}
                          />
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <time dateTime={notification.createdAt}>
                                {moment(notification.createdAt).format('h:mm A')}
                              </time>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              {moment(notification.createdAt).fromNow()}
                            </div>
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getNotificationColor(notification.type)} text-white shadow-sm`}>
                            {notification.type === 'email' ? (
                              <>
                                <Mail className="w-3.5 h-3.5" />
                                Email
                              </>
                            ) : (
                              <>
                                <Bell className="w-3.5 h-3.5" />
                                Reminder
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl mb-6 shadow-inner">
              <Bell className="w-20 h-20 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Reminders Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              {filter === 'email'
                ? "No email reminders found. Try viewing all reminders."
                : "You don't have any reminders yet. When you set email reminders for your tasks, they'll appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;