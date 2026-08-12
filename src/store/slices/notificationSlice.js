import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
    addNotification(state, action) {
      // Avoid duplicate notifications in redux state
      const exists = state.notifications.some(n => n.id === action.payload.id);
      if (!exists) {
        state.notifications.unshift({
          read: false,
          createdAt: new Date().toISOString(),
          ...action.payload
        });
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      }
    },
    markAsRead(state, action) {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification(state, action) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    }
  }
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
