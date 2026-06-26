import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedCategory: 'all',
  themeMode: 'light', // synced with next-themes if needed
  sidebarOpen: false,
  notificationDrawerOpen: false,
  authModalType: null, // 'login', 'register', or null
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
    },
    openAuthModal(state, action) {
      state.authModalType = action.payload;
    },
    closeAuthModal(state) {
      state.authModalType = null;
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
  setNotificationDrawerOpen,
  openAuthModal,
  closeAuthModal
} = appSlice.actions;
export default appSlice.reducer;
