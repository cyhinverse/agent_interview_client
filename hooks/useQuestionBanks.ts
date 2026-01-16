import {
  useSubmitAnswerMutation,
  useGetSessionResponsesQuery,
  useGetResponseByIdQuery,
  useUpdateResponseMutation,
  useDeleteResponseMutation,
} from '@/features/questions/questionsApi';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

// Hooks for question responses
export function useQuestions(
  sessionIdOrFilter: string | { categoryId?: string }
) {
  const sessionId =
    typeof sessionIdOrFilter === 'string' ? sessionIdOrFilter : '';
  // Note: if categoryId is passed, we might need a different query, but for now
  // let's at least prevent it from being [object Object] in the URL
  return useGetSessionResponsesQuery(sessionId, {
    skip: !sessionId,
  });
}

export function useQuestion(responseId: string) {
  return useGetResponseByIdQuery(responseId, {
    skip: !responseId,
  });
}

export function useQuestionResponse(responseId: string) {
  return useQuestion(responseId);
}

// Mutations
export function useSubmitAnswer() {
  const [submitAnswer, result] = useSubmitAnswerMutation();

  const handleSubmit = async (
    sessionId: string,
    data: { questionText: string; answer: string }
  ) => {
    try {
      const response = await submitAnswer({ sessionId, data }).unwrap();
      return response;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      toast.error(getErrorMessage(error, 'Failed to submit answer'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleSubmit,
    mutateAsync: handleSubmit,
  };
}

export function useUpdateResponse() {
  const [updateResponse, result] = useUpdateResponseMutation();

  const handleUpdate = async (
    responseId: string,
    data: { answer?: string }
  ) => {
    try {
      const response = await updateResponse({ responseId, data }).unwrap();
      toast.success('Response updated');
      return response;
    } catch (error) {
      console.error('Failed to update response:', error);
      toast.error(getErrorMessage(error, 'Failed to update response'));
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

export function useDeleteResponse() {
  const [deleteResponse, result] = useDeleteResponseMutation();

  const handleDelete = async (responseId: string) => {
    try {
      await deleteResponse(responseId).unwrap();
      toast.success('Response deleted');
    } catch (error) {
      console.error('Failed to delete response:', error);
      toast.error(getErrorMessage(error, 'Failed to delete response'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleDelete,
    mutateAsync: handleDelete,
  };
}
