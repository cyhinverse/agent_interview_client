import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useLogin, useRegister, useAuthLogout } from '@/hooks/useAuth';
import authReducer from '@/features/auth/authSlice';
import { apiSlice } from '@/store/apiSlice';
import { toast } from 'sonner';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Create a wrapper with Redux Provider
const createWrapper = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(apiSlice.middleware),
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

// Mock the API mutations
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/features/auth/authApi', () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false }],
  useRegisterMutation: () => [mockRegister, { isLoading: false }],
  useLogoutMutation: () => [mockLogout, { isLoading: false }],
  useChangePasswordMutation: () => [jest.fn(), { isLoading: false }],
  useRefreshMutation: () => [jest.fn(), { isLoading: false }],
}));

describe('useAuth Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useLogin', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: { id: '1', fullName: 'Test' },
        accessToken: 'token',
      };
      mockLogin.mockReturnValue({
        unwrap: () => Promise.resolve(mockResponse),
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      let response;
      await act(async () => {
        response = await result.current.mutate({
          email: 'test@example.com',
          password: 'password',
        });
      });

      expect(response).toEqual(mockResponse);
      expect(mockLogin).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
    });

    it('should handle login error', async () => {
      const mockError = { data: { message: 'Invalid credentials' } };
      mockLogin.mockReturnValue({
        unwrap: () => Promise.reject(mockError),
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.mutate({
            email: 'test@example.com',
            password: 'wrong',
          });
        } catch (e) {
          // Expected
        }
      });

      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('useRegister', () => {
    it('should register successfully', async () => {
      const mockResponse = { user: { id: '1' }, accessToken: 'token' };
      mockRegister.mockReturnValue({
        unwrap: () => Promise.resolve(mockResponse),
      });

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      let response;
      await act(async () => {
        response = await result.current.mutate({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password',
          confirmPassword: 'password',
        });
      });

      expect(response).toEqual(mockResponse);
      expect(toast.success).toHaveBeenCalledWith(
        'Account created successfully!'
      );
    });
  });

  describe('useAuthLogout', () => {
    it('should logout successfully', async () => {
      mockLogout.mockReturnValue({
        unwrap: () => Promise.resolve({ message: 'OK' }),
      });

      const { result } = renderHook(() => useAuthLogout(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate();
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
    });
  });
});
