import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useRefreshMutation,
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
import { apiSlice } from '@/store/apiSlice';
import { getErrorMessage } from '@/lib/utils';

// Login hook
export function useLogin() {
  const dispatch = useAppDispatch();
  const [login, result] = useLoginMutation();

  const handleLogin = async (data: LoginData) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response));
      toast.success('Logged in successfully!');
      return response;
    } catch (error) {
      console.error('Failed to login:', error);
      toast.error(getErrorMessage(error, 'Failed to login'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleLogin,
    mutateAsync: handleLogin,
  };
}

// Register hook
export function useRegister() {
  const dispatch = useAppDispatch();
  const [register, result] = useRegisterMutation();

  const handleRegister = async (data: RegisterData) => {
    try {
      const response = await register(data).unwrap();
      dispatch(setCredentials(response));
      toast.success('Account created successfully!');
      return response;
    } catch (error) {
      console.error('Failed to register:', error);
      toast.error(getErrorMessage(error, 'Failed to register'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleRegister,
    mutateAsync: handleRegister,
  };
}

// Logout hook
export function useAuthLogout() {
  const dispatch = useAppDispatch();
  const [logoutMutation, result] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Call API logout if exists
      try {
        await logoutMutation().unwrap();
      } catch (err) {
        console.warn('Logout API failed, but clearing local state anyway', err);
      }

      // Clear all queries
      dispatch(apiSlice.util.resetApiState());

      // Dispatch logout action
      dispatch(logoutAction());

      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Failed to logout:', error);
      toast.error('Failed to logout');
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleLogout,
    mutateAsync: handleLogout,
  };
}

export const useLogout = useAuthLogout;

// Change password hook
export function useAuthChangePassword() {
  const [changePassword, result] = useChangePasswordMutation();

  const handleChange = async (data: ChangePasswordData) => {
    try {
      await changePassword(data).unwrap();
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error(getErrorMessage(error, 'Failed to change password'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleChange,
    mutateAsync: handleChange,
  };
}

export const useChangePassword = useAuthChangePassword;
