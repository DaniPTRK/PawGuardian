import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface ProfileState {
  token: string | null;
  user: { id?: number; username?: string; email?: string; roles?: string[] } | null;
  isAuthenticated: boolean;
}

const storedToken = localStorage.getItem('token');

const initialState: ProfileState = {
  token: storedToken,
  user: null,
  isAuthenticated: !!storedToken,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    setUser: (state, action: PayloadAction<ProfileState['user']>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, setUser, logout } = profileSlice.actions;
