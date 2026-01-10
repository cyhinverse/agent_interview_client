import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  interviewCategoriesAPI,
  InterviewSession,
  CreateInterviewSessionData,
} from '@/features/interview/interviewApi';
import { toast } from 'sonner';

// Query keys
export const interviewKeys = {
  all: ['interviews'] as const,
  categories: () => [...interviewKeys.all, 'categories'] as const,
  category: (id: string) => [...interviewKeys.categories(), id] as const,
  sessions: () => [...interviewKeys.all, 'sessions'] as const,
  session: (id: string) => [...interviewKeys.sessions(), id] as const,
  userSessions: (skip: number, take: number) =>
    [...interviewKeys.sessions(), 'user', { skip, take }] as const,
};

// Hooks for interview categories
export function useInterviewCategories() {
  return useQuery({
    queryKey: interviewKeys.categories(),
    queryFn: () => interviewCategoriesAPI.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInterviewCategory(id: string) {
  return useQuery({
    queryKey: interviewKeys.category(id),
    queryFn: () => interviewCategoriesAPI.getCategoryById(id),
    enabled: !!id,
  });
}

// Hooks for interview sessions
export function useInterviewSessions(skip: number = 0, take: number = 20) {
  return useQuery({
    queryKey: interviewKeys.userSessions(skip, take),
    queryFn: () => interviewCategoriesAPI.getUserSessions(skip, take),
  });
}

export function useInterviewSession(id: string) {
  return useQuery({
    queryKey: interviewKeys.session(id),
    queryFn: () => interviewCategoriesAPI.getSessionById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes for active sessions
  });
}

// Mutations
export function useCreateInterviewSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInterviewSessionData) =>
      interviewCategoriesAPI.createInterviewSession(data),
    onSuccess: (session) => {
      // Update the cache
      queryClient.invalidateQueries({ queryKey: interviewKeys.sessions() });
      queryClient.setQueryData(interviewKeys.session(session.id), session);

      toast.success('Interview session created successfully!');
    },
    onError: (error) => {
      console.error('Failed to create interview session:', error);
      toast.error('Failed to create interview session');
    },
  });
}

export function useUpdateInterviewSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<InterviewSession>;
    }) => interviewCategoriesAPI.updateSession(id, data),
    onSuccess: (session) => {
      // Update the cache
      queryClient.setQueryData(interviewKeys.session(session.id), session);
      queryClient.invalidateQueries({ queryKey: interviewKeys.sessions() });

      toast.success('Interview session updated!');
    },
    onError: (error) => {
      console.error('Failed to update interview session:', error);
      toast.error('Failed to update interview session');
    },
  });
}

export function useDeleteInterviewSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => interviewCategoriesAPI.deleteSession(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: interviewKeys.session(id) });
      queryClient.invalidateQueries({ queryKey: interviewKeys.sessions() });

      toast.success('Interview session deleted!');
    },
    onError: (error) => {
      console.error('Failed to delete interview session:', error);
      toast.error('Failed to delete interview session');
    },
  });
}
