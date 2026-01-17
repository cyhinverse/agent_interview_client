import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  useInterviewCategories,
  useCreateInterviewSession,
  useDeleteInterviewSession,
} from '@/hooks/useInterviewCategories';
import { apiSlice } from '@/store/apiSlice';
import { toast } from 'sonner';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock interviewApi
const mockCreateSession = jest.fn();
const mockDeleteSession = jest.fn();

jest.mock('@/features/interview/interviewApi', () => ({
  useGetInterviewCategoriesQuery: jest.fn(() => ({
    data: [{ id: '1', name: 'Frontend' }],
    isLoading: false,
  })),
  useGetInterviewCategoryByIdQuery: jest.fn(),
  useCreateInterviewSessionMutation: () => [
    mockCreateSession,
    { isLoading: false },
  ],
  useGetUserInterviewSessionsQuery: jest.fn(),
  useGetInterviewSessionByIdQuery: jest.fn(),
  useUpdateInterviewSessionMutation: jest.fn(),
  useDeleteInterviewSessionMutation: () => [
    mockDeleteSession,
    { isLoading: false },
  ],
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

describe('useInterviewCategories Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch interview categories', () => {
    const { result } = renderHook(() => useInterviewCategories(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toEqual([{ id: '1', name: 'Frontend' }]);
  });

  it('should create interview session successfully', async () => {
    const mockResponse = { id: 'session-123' };
    mockCreateSession.mockReturnValue({
      unwrap: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useCreateInterviewSession(), {
      wrapper: createWrapper(),
    });

    let response;
    await act(async () => {
      response = await result.current.mutate({ categoryId: '1' });
    });

    expect(response).toEqual(mockResponse);
    expect(toast.success).toHaveBeenCalledWith('Interview session created!');
  });

  it('should handle create interview session error', async () => {
    const mockError = { data: { message: 'Creation failed' } };
    mockCreateSession.mockReturnValue({
      unwrap: () => Promise.reject(mockError),
    });

    const { result } = renderHook(() => useCreateInterviewSession(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutate({ categoryId: '1' });
      } catch (e) {
        // Expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith('Creation failed');
  });

  it('should delete interview session successfully', async () => {
    mockDeleteSession.mockReturnValue({
      unwrap: () => Promise.resolve({ success: true }),
    });

    const { result } = renderHook(() => useDeleteInterviewSession(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate('session-123');
    });

    expect(mockDeleteSession).toHaveBeenCalledWith('session-123');
    expect(toast.success).toHaveBeenCalledWith('Session deleted');
  });
});
