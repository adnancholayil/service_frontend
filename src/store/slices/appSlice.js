import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedCategory: 'all',
  themeMode: 'light', // synced with next-themes if needed
  sidebarOpen: false,
  notificationDrawerOpen: false,
  authModalType: null, // 'login', 'register', or null
  logoutModalOpen: false,
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
    },
    openLogoutModal(state) {
      state.logoutModalOpen = true;
    },
    closeLogoutModal(state) {
      state.logoutModalOpen = false;
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
  closeAuthModal,
  openLogoutModal,
  closeLogoutModal
} = appSlice.actions;
export default appSlice.reducer;
