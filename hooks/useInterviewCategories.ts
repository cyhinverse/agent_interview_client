import {
  useGetInterviewCategoriesQuery,
  useGetInterviewCategoryByIdQuery,
  useCreateInterviewSessionMutation,
  useGetUserInterviewSessionsQuery,
  useGetInterviewSessionByIdQuery,
  useUpdateInterviewSessionMutation,
  useDeleteInterviewSessionMutation,
} from '@/features/interview/interviewApi';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

// Hooks for interview categories
export function useInterviewCategories() {
  return useGetInterviewCategoriesQuery();
}

export function useInterviewCategory(id: string) {
  return useGetInterviewCategoryByIdQuery(id, {
    skip: !id,
  });
}

// Hooks for interview sessions
export function useUserInterviewSessions(skip: number = 0, take: number = 20) {
  return useGetUserInterviewSessionsQuery({ skip, take });
}

export const useInterviewSessions = useUserInterviewSessions;

export function useInterviewSession(sessionId: string) {
  return useGetInterviewSessionByIdQuery(sessionId, {
    skip: !sessionId,
  });
}

// Mutations
export function useCreateInterviewSession() {
  const [createSession, result] = useCreateInterviewSessionMutation();

  const handleCreate = async (data: { categoryId: string }) => {
    try {
      const response = await createSession(data).unwrap();
      toast.success('Interview session created!');
      return response;
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error(getErrorMessage(error, 'Failed to create session'));
      throw error;
    }
  };

  return { ...result, mutate: handleCreate, mutateAsync: handleCreate };
}

export function useUpdateInterviewSession() {
  const [updateSession, result] = useUpdateInterviewSessionMutation();

  const handleUpdate = async (sessionId: string, data: { status?: string }) => {
    try {
      const response = await updateSession({ sessionId, data }).unwrap();
      return response;
    } catch (error) {
      console.error('Failed to update session:', error);
      toast.error(getErrorMessage(error, 'Failed to update session'));
      throw error;
    }
  };

  return { ...result, mutate: handleUpdate };
}

export function useDeleteInterviewSession() {
  const [deleteSession, result] = useDeleteInterviewSessionMutation();

  const handleDelete = async (sessionId: string) => {
    try {
      await deleteSession(sessionId).unwrap();
      toast.success('Session deleted');
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error(getErrorMessage(error, 'Failed to delete session'));
      throw error;
    }
  };

  return { ...result, mutate: handleDelete };
}
