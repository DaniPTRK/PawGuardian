import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TestFormState {
  data: any;
}

const initialState: TestFormState = {
  data: null,
};

export const testFormSlice = createSlice({
  name: 'testForm',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    clearData: (state) => {
      state.data = null;
    },
  },
});

export const { setData, clearData } = testFormSlice.actions;
