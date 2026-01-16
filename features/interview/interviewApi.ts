import { apiSlice } from '@/store/apiSlice';

// Types
export interface InterviewCategory {
  id: string;
  name: string;
  slug: string;
  systemPrompt: string;
  language: string;
  createdAt: string;
}

export interface CreateInterviewSessionData {
  categoryId: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  categoryId: string;
  dailyRoomUrl: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  startTime: string | null;
  endTime: string | null;
  score?: number;
  createdAt: string;
  category: InterviewCategory;
}

export const interviewApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInterviewCategories: builder.query<InterviewCategory[], void>({
      query: () => '/interview-categories',
      providesTags: ['InterviewCategory'],
    }),
    getInterviewCategoryById: builder.query<InterviewCategory, string>({
      query: (id) => `/interview-categories/${id}`,
      providesTags: (result, error, arg) => [
        { type: 'InterviewCategory', id: arg },
      ],
    }),
    createInterviewSession: builder.mutation<
      InterviewSession,
      CreateInterviewSessionData
    >({
      query: (data) => ({
        url: '/interview-sessions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['InterviewSession'],
    }),
    getUserInterviewSessions: builder.query<
      InterviewSession[],
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 20 }) =>
        `/interview-sessions?skip=${skip}&take=${take}`,
      providesTags: ['InterviewSession'],
    }),
    getInterviewSessionById: builder.query<InterviewSession, string>({
      query: (sessionId) => `/interview-sessions/${sessionId}`,
      providesTags: (result, error, arg) => [
        { type: 'InterviewSession', id: arg },
      ],
    }),
    updateInterviewSession: builder.mutation<
      InterviewSession,
      { sessionId: string; data: { status?: string } }
    >({
      query: ({ sessionId, data }) => ({
        url: `/interview-sessions/${sessionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'InterviewSession', id: arg.sessionId },
        'InterviewSession',
      ],
    }),
    deleteInterviewSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `/interview-sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InterviewSession'],
    }),
    // Category management
    createCategory: builder.mutation<
      InterviewCategory,
      { name: string; slug: string; systemPrompt: string; language?: string }
    >({
      query: (data) => ({
        url: '/interview-categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['InterviewCategory'],
    }),
    updateCategory: builder.mutation<
      InterviewCategory,
      { categoryId: string; data: Partial<InterviewCategory> }
    >({
      query: ({ categoryId, data }) => ({
        url: `/interview-categories/${categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['InterviewCategory'],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (categoryId) => ({
        url: `/interview-categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InterviewCategory'],
    }),
    getAllInterviewSessions: builder.query<
      InterviewSession[],
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 50 }) =>
        `/interview-sessions/all?skip=${skip}&take=${take}`,
      providesTags: ['InterviewSession'],
    }),
  }),
});

export const {
  useGetInterviewCategoriesQuery,
  useGetInterviewCategoryByIdQuery,
  useCreateInterviewSessionMutation,
  useGetUserInterviewSessionsQuery,
  useGetInterviewSessionByIdQuery,
  useUpdateInterviewSessionMutation,
  useDeleteInterviewSessionMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllInterviewSessionsQuery,
} = interviewApi;

// Backward compatible aliases
export const interviewApiLegacy = {
  getCategories: async () =>
    interviewApi.endpoints.getInterviewCategories.initiate(),
  getCategoryById: async (id: string) =>
    interviewApi.endpoints.getInterviewCategoryById.initiate(id),
  createInterviewSession: async (data: CreateInterviewSessionData) =>
    interviewApi.endpoints.createInterviewSession.initiate(data),
  getUserSessions: async (skip = 0, take = 20) =>
    interviewApi.endpoints.getUserInterviewSessions.initiate({ skip, take }),
  getSessionById: async (sessionId: string) =>
    interviewApi.endpoints.getInterviewSessionById.initiate(sessionId),
  updateSession: async (sessionId: string, data: { status?: string }) =>
    interviewApi.endpoints.updateInterviewSession.initiate({ sessionId, data }),
  deleteSession: async (sessionId: string) =>
    interviewApi.endpoints.deleteInterviewSession.initiate(sessionId),
  createCategory: async (data: {
    name: string;
    slug: string;
    systemPrompt: string;
    language?: string;
  }) => interviewApi.endpoints.createCategory.initiate(data),
  updateCategory: async (
    categoryId: string,
    data: Partial<InterviewCategory>
  ) => interviewApi.endpoints.updateCategory.initiate({ categoryId, data }),
  deleteCategory: async (categoryId: string) =>
    interviewApi.endpoints.deleteCategory.initiate(categoryId),
  getAllSessions: async (skip = 0, take = 50) =>
    interviewApi.endpoints.getAllInterviewSessions.initiate({ skip, take }),
};

export const interviewAPI = interviewApiLegacy;
export const interviewCategoriesAPI = interviewApiLegacy;
