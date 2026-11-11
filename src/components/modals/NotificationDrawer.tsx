import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Clock,
  Trash2,
  Package,
  CreditCard,
  Factory,
  Settings,
  Info,
} from 'lucide-react';
import { NotificationItem } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  if (!isNotificationsOpen) return null;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'high') return n.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'Low Stock':
        return <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Pending Payments':
      case 'Pending Bills':
        return <CreditCard className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'Production Alerts':
        return <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'System Notifications':
        return <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
      default:
        return <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Notifications Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {unreadCount} unread enterprise updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium px-2 py-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filter === 'high'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            High Priority
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              <CheckCheck className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              No notifications in this view.
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className={`p-4 transition-colors relative flex gap-3 ${
                  !item.isRead
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {!item.isRead && (
                        <button
                          onClick={() => markNotificationAsRead(item.id)}
                          className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => dismissNotification(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center text-xs text-slate-500">
          <span>Enterprise Alert System</span>
          <span>Real-time Event Bus Ready</span>
        </div>
      </div>
    </div>
  );
};
