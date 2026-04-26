import { configureStore } from '@reduxjs/toolkit';
import { profileSlice } from './state-slices/profile';
import { testFormSlice } from './state-slices/test-form';

export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer,
    testForm: testFormSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
