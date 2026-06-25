import { createSlice } from '@reduxjs/toolkit';
import { MOCK_NOTIFICATIONS } from '../../constants/mockData';

const initialState = {
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
        ...action.payload
      });
      state.unreadCount = state.notifications.filter(n => !n.read).length;
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

export const { addNotification, markAsRead, markAllAsRead, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
