'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Trash2, Calendar, MessageSquare, Info } from 'lucide-react';

import { setNotificationDrawerOpen } from '../../store/slices/appSlice';
import { markAsRead, markAllAsRead, deleteNotification } from '../../store/slices/notificationSlice';
import Button from '../ui/Button';

export function NotificationDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.app.notificationDrawerOpen);
  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-emerald-500" />;
      default:
        return <Info className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setNotificationDrawerOpen(false))}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-card text-foreground border-l border-border flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-4 py-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-brand" />
                  <h2 className="text-lg font-semibold">Notifications</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    title="Mark all as read"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => dispatch(setNotificationDrawerOpen(false))}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
                    <Bell className="h-10 w-10 text-muted-foreground opacity-40" />
                    <p className="font-semibold text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground">You don&apos;t have any notifications at the moment.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border transition-all flex gap-3 items-start relative group ${
                        notif.read
                          ? 'bg-card border-border'
                          : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40'
                      }`}
                    >
                      <div className="mt-0.5">{getIcon(notif.type)}</div>
                      <div className="flex-1 pr-6" onClick={() => dispatch(markAsRead(notif.id))}>
                        <h4 className="text-sm font-semibold leading-tight">{notif.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                        <span className="text-[10px] text-muted-foreground block mt-2">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <button
                        onClick={() => dispatch(deleteNotification(notif.id))}
                        className="absolute right-2 top-2 p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default NotificationDrawer;
