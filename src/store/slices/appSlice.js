import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedCategory: 'all',
  themeMode: 'light', // synced with next-themes if needed
  sidebarOpen: false,
  notificationDrawerOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setThemeMode(state, action) {
      state.themeMode = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    toggleNotificationDrawer(state) {
      state.notificationDrawerOpen = !state.notificationDrawerOpen;
    },
    setNotificationDrawerOpen(state, action) {
      state.notificationDrawerOpen = action.payload;
    }
  }
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setThemeMode,
  toggleSidebar,
  setSidebarOpen,
  toggleNotificationDrawer,
  setNotificationDrawerOpen
} = appSlice.actions;
export default appSlice.reducer;
