import {
  useGetCurrentUserQuery,
  useGetUserStatsQuery,
  useGetUserReportsQuery,
  useGetReportByIdQuery,
  useGetSessionReportQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  UpdateUserData,
  ChangePasswordData,
} from '@/features/users/usersApi';
import { useAppDispatch } from '@/store/hooks';
import { logout as logoutAction } from '@/features/auth/authSlice';
import { toast } from 'sonner';
import { apiSlice } from '@/store/apiSlice';
import { getErrorMessage } from '@/lib/utils';

// Check if user has token (client-side only)
const hasToken = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Hooks for users
export function useCurrentUser() {
  return useGetCurrentUserQuery(undefined, {
    skip: !hasToken(),
  });
}

export function useUserStats() {
  return useGetUserStatsQuery();
}

// Hooks for evaluation reports
export function useUserReports(skip: number = 0, take: number = 20) {
  return useGetUserReportsQuery({ skip, take });
}

export function useEvaluationReport(reportId: string) {
  return useGetReportByIdQuery(reportId, {
    skip: !reportId,
  });
}

export function useSessionReport(sessionId: string) {
  return useGetSessionReportQuery(sessionId, {
    skip: !sessionId,
  });
}

// Mutations
export function useUpdateUser() {
  const [updateUser, result] = useUpdateUserMutation();

  const handleUpdate = async (data: UpdateUserData) => {
    try {
      await updateUser(data).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(getErrorMessage(error, 'Failed to update profile'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleUpdate,
    mutateAsync: handleUpdate,
  };
}

export function useChangePassword() {
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

export function useLogout() {
  const dispatch = useAppDispatch();
  const [logoutMutation, result] = useUpdateUserMutation(); // Dummy for now if no specific logout mutation is used in usersApi

  const handleLogout = async () => {
    try {
      // Clear all queries
      dispatch(apiSlice.util.resetApiState());

      // Dispatch logout action
      dispatch(logoutAction());

      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Failed to logout:', error);
      toast.error('Failed to logout');
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleLogout,
    mutateAsync: handleLogout,
  };
}
