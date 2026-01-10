import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  questionBanksAPI,
  SubmitAnswerData,
} from '@/features/questions/questionsApi';
import { toast } from 'sonner';

// Query keys
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters: { categoryId?: string; skip?: number; take?: number }) =>
    [...questionKeys.lists(), filters] as const,
  detail: (id: string) => [...questionKeys.all, 'detail', id] as const,
  responses: (sessionId: string) =>
    [...questionKeys.all, 'responses', sessionId] as const,
  response: (responseId: string) =>
    [...questionKeys.all, 'response', responseId] as const,
};

// Hooks for questions
export function useQuestions(filters?: {
  categoryId?: string;
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: questionKeys.list(filters || {}),
    queryFn: () =>
      questionBanksAPI.getQuestions(
        filters?.categoryId,
        filters?.skip,
        filters?.take
      ),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionBanksAPI.getQuestionById(id),
    enabled: !!id,
  });
}

// Hooks for question responses
export function useSessionResponses(sessionId: string) {
  return useQuery({
    queryKey: questionKeys.responses(sessionId),
    queryFn: () => questionBanksAPI.getSessionResponses(sessionId),
    enabled: !!sessionId,
  });
}

export function useQuestionResponse(responseId: string) {
  return useQuery({
    queryKey: questionKeys.response(responseId),
    queryFn: () => questionBanksAPI.getResponseById(responseId),
    enabled: !!responseId,
  });
}

// Mutations
export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: SubmitAnswerData;
    }) => questionBanksAPI.submitAnswer(sessionId, data),
    onSuccess: (response, variables) => {
      // Update the cache for session responses
      queryClient.invalidateQueries({
        queryKey: questionKeys.responses(variables.sessionId),
      });

      // Set the new response in cache
      queryClient.setQueryData(questionKeys.response(response.id), response);

      toast.success('Answer submitted successfully!');
    },
    onError: (error) => {
      console.error('Failed to submit answer:', error);
      toast.error('Failed to submit answer');
    },
  });
}

export function useUpdateAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      data,
    }: {
      responseId: string;
      data: { answer?: string };
    }) => questionBanksAPI.updateResponse(responseId, data),
    onSuccess: (response) => {
      // Update the cache
      queryClient.setQueryData(questionKeys.response(response.id), response);

      toast.success('Answer updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update answer:', error);
      toast.error('Failed to update answer');
    },
  });
}

export function useDeleteAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: string) =>
      questionBanksAPI.deleteResponse(responseId),
    onSuccess: (_, responseId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: questionKeys.response(responseId),
      });

      toast.success('Answer deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete answer:', error);
      toast.error('Failed to delete answer');
    },
  });
}
