'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Sparkles, Check, Trash2, Calendar, MessageSquare, Info } from 'lucide-react';
import toast from 'react-hot-toast';

import { markAsRead, markAllAsRead, deleteNotification } from '../../store/slices/notificationSlice';
import Button from '../../components/ui/Button';

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);

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

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
    toast.success('Notification deleted');
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Notifications <Sparkles className="h-6 w-6 text-brand" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Stay updated with your bookings and account updates.</p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="border-border">
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
            <Bell className="h-10 w-10 text-muted-foreground opacity-40" />
            <h3 className="font-bold text-lg text-muted-foreground">All caught up!</h3>
            <p className="text-xs text-muted-foreground">You don&apos;t have any notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all flex gap-4 items-start relative group bg-card ${
                notif.read ? 'border-border' : 'border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/10 dark:bg-indigo-950/10'
              }`}
            >
              <div className="mt-0.5 p-2 bg-muted rounded-lg">{getIcon(notif.type)}</div>
              <div className="flex-1 pr-6" onClick={() => dispatch(markAsRead(notif.id))}>
                <h4 className="text-sm font-bold leading-snug">{notif.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                <span className="text-[10px] text-muted-foreground block mt-2">
                  {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={() => handleDelete(notif.id)}
                className="absolute right-3 top-3 p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
