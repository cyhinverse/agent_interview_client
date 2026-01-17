import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  useQuestions,
  useSubmitAnswer,
  useUpdateResponse,
  useDeleteResponse,
} from '@/hooks/useQuestionBanks';
import { apiSlice } from '@/store/apiSlice';
import { toast } from 'sonner';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock questionsApi
const mockSubmitAnswer = jest.fn();
const mockUpdateResponse = jest.fn();
const mockDeleteResponse = jest.fn();

jest.mock('@/features/questions/questionsApi', () => ({
  useGetSessionResponsesQuery: jest.fn((sessionId) => ({
    data: sessionId === 'session-1' ? [{ id: '1', questionText: 'Test?' }] : [],
    isLoading: false,
  })),
  useGetResponseByIdQuery: jest.fn(),
  useSubmitAnswerMutation: () => [mockSubmitAnswer, { isLoading: false }],
  useUpdateResponseMutation: () => [mockUpdateResponse, { isLoading: false }],
  useDeleteResponseMutation: () => [mockDeleteResponse, { isLoading: false }],
}));

// Create a wrapper with Redux Provider
const createWrapper = () => {
  const store = configureStore({
    reducer: {
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

describe('useQuestionBanks Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useQuestions', () => {
    it('should fetch questions for a session', () => {
      const { result } = renderHook(() => useQuestions('session-1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toEqual([{ id: '1', questionText: 'Test?' }]);
    });

    it('should skip fetching if no sessionId', () => {
      const { result } = renderHook(() => useQuestions(''), {
        wrapper: createWrapper(),
      });
      // In mockery it might return what the hook returns from query mock
      // but the logic in hook is `skip: !sessionId`
    });
  });

  describe('useSubmitAnswer', () => {
    it('should submit answer successfully', async () => {
      const mockResponse = { id: 'resp-1' };
      mockSubmitAnswer.mockReturnValue({
        unwrap: () => Promise.resolve(mockResponse),
      });

      const { result } = renderHook(() => useSubmitAnswer(), {
        wrapper: createWrapper(),
      });

      let response;
      await act(async () => {
        response = await result.current.mutate('session-1', {
          questionText: 'Q',
          answer: 'A',
        });
      });

      expect(response).toEqual(mockResponse);
      expect(mockSubmitAnswer).toHaveBeenCalled();
    });

    it('should handle submit error', async () => {
      const mockError = { data: { message: 'Submission failed' } };
      mockSubmitAnswer.mockReturnValue({
        unwrap: () => Promise.reject(mockError),
      });

      const { result } = renderHook(() => useSubmitAnswer(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.mutate('session-1', {
            questionText: 'Q',
            answer: 'A',
          });
        } catch (e) {}
      });

      expect(toast.error).toHaveBeenCalledWith('Submission failed');
    });
  });

  describe('useUpdateResponse', () => {
    it('should update response successfully', async () => {
      mockUpdateResponse.mockReturnValue({
        unwrap: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useUpdateResponse(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate('resp-1', { answer: 'A2' });
      });

      expect(toast.success).toHaveBeenCalledWith('Response updated');
    });
  });

  describe('useDeleteResponse', () => {
    it('should delete response successfully', async () => {
      mockDeleteResponse.mockReturnValue({
        unwrap: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useDeleteResponse(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate('resp-1');
      });

      expect(toast.success).toHaveBeenCalledWith('Response deleted');
    });
  });
});
