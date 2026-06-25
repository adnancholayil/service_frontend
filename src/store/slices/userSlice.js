import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [], // array of providerIds
  addresses: [
    { id: 'addr-1', name: 'Home', address: 'Flat 402, Sunset Heights, Main Street, NY' },
    { id: 'addr-2', name: 'Office', address: 'Floor 12, Tech Towers, Wall Street, NY' }
  ],
  reviews: [], // array of user reviews
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addFavorite(state, action) {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    addAddress(state, action) {
      state.addresses.push({
        id: `addr-${Date.now()}`,
        ...action.payload
      });
    },
    removeAddress(state, action) {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    editAddress(state, action) {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    addReview(state, action) {
      state.reviews.push(action.payload);
    }
  }
});

export const { addFavorite, removeFavorite, addAddress, removeAddress, editAddress, addReview } = userSlice.actions;
export default userSlice.reducer;
