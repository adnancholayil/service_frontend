import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  providers: [],
  loading: false,
  error: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    addProvider(state, action) {
      state.providers.push(action.payload);
    },
    updateProviderVerification(state, action) {
      const { id, status } = action.payload;
      const index = state.providers.findIndex(p => p.id === id);
      if (index !== -1) {
        state.providers[index].status = status;
      }
    },
    updateProviderPortfolio(state, action) {
      const { id, portfolio } = action.payload;
      const index = state.providers.findIndex(p => p.id === id);
      if (index !== -1) {
        state.providers[index].portfolio = portfolio;
      }
    },
    addProviderService(state, action) {
      const { id, serviceId } = action.payload;
      const index = state.providers.findIndex(p => p.id === id);
      if (index !== -1) {
        if (!state.providers[index].services.includes(serviceId)) {
          state.providers[index].services.push(serviceId);
        }
      }
    },
    removeProviderService(state, action) {
      const { id, serviceId } = action.payload;
      const index = state.providers.findIndex(p => p.id === id);
      if (index !== -1) {
        state.providers[index].services = state.providers[index].services.filter(srvId => srvId !== serviceId);
      }
    }
  }
});

export const {
  addProvider,
  updateProviderVerification,
  updateProviderPortfolio,
  addProviderService,
  removeProviderService
} = providerSlice.actions;
export default providerSlice.reducer;
