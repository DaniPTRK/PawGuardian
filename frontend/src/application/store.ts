import { configureStore } from '@reduxjs/toolkit';
import { profileSlice } from './state-slices/profile';

export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
