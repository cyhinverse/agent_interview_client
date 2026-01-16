import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/features/users/usersApi';

// Auth state now only contains essential data
// Loading and error states are managed by React Query
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getInitialRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  refreshToken: getInitialRefreshToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: User;
        accessToken: string;
        refreshToken?: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      if (user) {
        state.user = user;
      }
      state.token = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }

      // Store tokens in localStorage (browser only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;

      // Clear tokens from localStorage (browser only)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
