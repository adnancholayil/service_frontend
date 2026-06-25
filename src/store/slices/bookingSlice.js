import { createSlice } from '@reduxjs/toolkit';
import { MOCK_BOOKINGS } from '../../constants/mockData';

const initialState = {
  bookings: MOCK_BOOKINGS,
  currentBookingFlow: {
    step: 1, // 1 to 8
    service: null,
    provider: null,
    address: null,
    date: null,
    time: null,
    notes: '',
    paymentMethod: 'card',
  },
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    startBookingFlow(state, action) {
      state.currentBookingFlow = {
        ...initialState.currentBookingFlow,
        service: action.payload.service,
        provider: action.payload.provider,
      };
    },
    updateBookingStep(state, action) {
      state.currentBookingFlow = {
        ...state.currentBookingFlow,
        ...action.payload
      };
    },
    nextStep(state) {
      state.currentBookingFlow.step += 1;
    },
    prevStep(state) {
      if (state.currentBookingFlow.step > 1) {
        state.currentBookingFlow.step -= 1;
      }
    },
    resetBookingFlow(state) {
      state.currentBookingFlow = initialState.currentBookingFlow;
    },
    createBooking(state, action) {
      state.bookings.unshift(action.payload);
    },
    cancelBooking(state, action) {
      const index = state.bookings.findIndex(b => b.id === action.payload);
      if (index !== -1) {
        state.bookings[index].status = 'cancelled';
      }
    },
    updateBookingStatus(state, action) {
      const { id, status } = action.payload;
      const index = state.bookings.findIndex(b => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = status;
      }
    }
  }
});

export const {
  startBookingFlow,
  updateBookingStep,
  nextStep,
  prevStep,
  resetBookingFlow,
  createBooking,
  cancelBooking,
  updateBookingStatus
} = bookingSlice.actions;
export default bookingSlice.reducer;
