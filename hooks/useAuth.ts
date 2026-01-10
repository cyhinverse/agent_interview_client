import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authAPI,
  LoginData,
  RegisterData,
  ChangePasswordData,
} from '@/features/auth/authApi';
import { useAppDispatch } from '@/store/hooks';
import {
  setCredentials,
  logout as logoutAction,
} from '@/features/auth/authSlice';
import { toast } from 'sonner';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current'] as const,
};

// Login mutation
export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authAPI.login(data),
    onSuccess: (response) => {
      // Store tokens in localStorage
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Update Redux store
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );

      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });

      toast.success('Login successful!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    },
  });
}

// Register mutation
export function useRegister() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authAPI.register(data),
    onSuccess: (response) => {
      // Store tokens in localStorage
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Update Redux store
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );

      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });

      toast.success('Registration successful!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
    },
  });
}

// Logout mutation
export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Clear tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      // Update Redux store
      dispatch(logoutAction());

      // Clear all queries
      queryClient.clear();

      toast.success('Logged out successfully!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => authAPI.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authAPI.refreshToken(refreshToken),
    onSuccess: (response) => {
      // Update tokens in localStorage
      localStorage.setItem('token', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // Update Redux store
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );

      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
}
