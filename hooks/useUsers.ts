import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  usersAPI,
  UpdateUserData,
  ChangePasswordData,
} from '@/features/users/usersApi';
import { useAppDispatch } from '@/store/hooks';
import { logout as logoutAction } from '@/features/auth/authSlice';
import { toast } from 'sonner';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  reports: () => [...userKeys.all, 'reports'] as const,
  report: (id: string) => [...userKeys.reports(), id] as const,
  sessionReport: (sessionId: string) =>
    [...userKeys.reports(), 'session', sessionId] as const,
};

// Hooks for users
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: () => usersAPI.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401 errors
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => usersAPI.getUserStats(),
  });
}

// Hooks for evaluation reports
export function useUserReports(skip: number = 0, take: number = 20) {
  return useQuery({
    queryKey: [...userKeys.reports(), { skip, take }],
    queryFn: () => usersAPI.getUserReports(skip, take),
  });
}

export function useEvaluationReport(reportId: string) {
  return useQuery({
    queryKey: userKeys.report(reportId),
    queryFn: () => usersAPI.getReportById(reportId),
    enabled: !!reportId,
  });
}

export function useSessionReport(sessionId: string) {
  return useQuery({
    queryKey: userKeys.sessionReport(sessionId),
    queryFn: () => usersAPI.getSessionReport(sessionId),
    enabled: !!sessionId,
  });
}

// Mutations
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => usersAPI.updateUser(data),
    onSuccess: (user) => {
      // Update the cache
      queryClient.setQueryData(userKeys.current(), user);

      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => usersAPI.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // In a real app, you might want to call a logout API endpoint
      // For now, we'll just clear the local state
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      // Dispatch logout action
      dispatch(logoutAction());

      toast.success('Logged out successfully!');
    },
    onError: (error) => {
      console.error('Failed to logout:', error);
      toast.error('Failed to logout');
    },
  });
}
