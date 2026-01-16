import { apiSlice } from '@/store/apiSlice';
import { User, EvaluationReport } from '@/features/users/usersApi';
import {
  InterviewCategory,
  InterviewSession,
} from '@/features/interview/interviewApi';
import { QuestionResponse } from '@/features/questions/questionsApi';

// Types
export interface SystemStats {
  totalUsers: number;
  totalSessions: number;
  totalDocuments: number;
  totalResponses: number;
  activeUsers: number;
  averageSessionScore: number;
  recentActivity: {
    date: string;
    newUsers: number;
    newSessions: number;
  }[];
}

export interface AdminDashboardData {
  stats: SystemStats;
  recentUsers: User[];
  recentSessions: InterviewSession[];
  recentReports: EvaluationReport[];
}

export interface KnowledgeDocument {
  id: string;
  categoryId: string;
  title: string;
  fileName: string;
  fileType: string;
  fileUrl?: string | null;
  fileSize?: number | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalChunks: number;
  errorMessage?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const adminApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashboard: builder.query<AdminDashboardData, void>({
      query: () => '/admin/dashboard',
    }),
    getSystemStats: builder.query<SystemStats, void>({
      query: () => '/admin/stats',
    }),
    getAllInterviewCategories: builder.query<InterviewCategory[], void>({
      query: () => '/admin/interview-categories',
      providesTags: ['InterviewCategory'],
    }),
    createInterviewCategory: builder.mutation<
      InterviewCategory,
      { name: string; slug: string; systemPrompt: string; language?: string }
    >({
      query: (data) => ({
        url: '/admin/interview-categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['InterviewCategory'],
    }),
    updateInterviewCategory: builder.mutation<
      InterviewCategory,
      { categoryId: string; data: Partial<InterviewCategory> }
    >({
      query: ({ categoryId, data }) => ({
        url: `/admin/interview-categories/${categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['InterviewCategory'],
    }),
    deleteInterviewCategory: builder.mutation<void, string>({
      query: (categoryId) => ({
        url: `/admin/interview-categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InterviewCategory'],
    }),
    // Knowledge Document Management
    getAllDocuments: builder.query<
      KnowledgeDocument[],
      { skip?: number; take?: number; categoryId?: string }
    >({
      query: ({ skip = 0, take = 50, categoryId }) => {
        let url = `/admin/knowledge-documents?skip=${skip}&take=${take}`;
        if (categoryId) url += `&categoryId=${categoryId}`;
        return url;
      },
      providesTags: ['QuestionBank'],
    }),
    createDocument: builder.mutation<
      KnowledgeDocument,
      {
        categoryId: string;
        title: string;
        fileName: string;
        fileType: string;
        fileUrl?: string;
        fileSize?: number;
      }
    >({
      query: (data) => ({
        url: '/admin/knowledge-documents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QuestionBank'],
    }),
    updateDocument: builder.mutation<
      KnowledgeDocument,
      { documentId: string; data: Partial<KnowledgeDocument> }
    >({
      query: ({ documentId, data }) => ({
        url: `/admin/knowledge-documents/${documentId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['QuestionBank'],
    }),
    deleteDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/admin/knowledge-documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QuestionBank'],
    }),
    // Upload document with file
    uploadDocument: builder.mutation<
      KnowledgeDocument,
      { file: File; categoryId: string; title: string }
    >({
      query: ({ file, categoryId, title }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('categoryId', categoryId);
        formData.append('title', title);
        return {
          url: '/knowledge-documents/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['QuestionBank'],
    }),
    uploadDocumentChunks: builder.mutation<
      { documentId: string; totalChunks: number; status: string },
      { documentId: string; chunks: DocumentChunk[] }
    >({
      query: ({ documentId, chunks }) => ({
        url: `/knowledge-documents/${documentId}/chunks`,
        method: 'POST',
        body: chunks.map((c) => ({ ...c, documentId })),
      }),
    }),
    getDocumentChunks: builder.query<
      DocumentChunk[],
      { documentId: string; skip?: number; take?: number }
    >({
      query: ({ documentId, skip = 0, take = 100 }) =>
        `/knowledge-documents/${documentId}/chunks?skip=${skip}&take=${take}`,
    }),
    getAllSessions: builder.query<
      InterviewSession[],
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 50 }) =>
        `/admin/interview-sessions?skip=${skip}&take=${take}`,
      providesTags: ['InterviewSession'],
    }),
    getSessionDetails: builder.query<
      InterviewSession & {
        responses: QuestionResponse[];
        report?: EvaluationReport;
      },
      string
    >({
      query: (sessionId) => `/admin/interview-sessions/${sessionId}`,
      providesTags: (result, error, arg) => [
        { type: 'InterviewSession', id: arg },
      ],
    }),
    deleteSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `/admin/interview-sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InterviewSession'],
    }),
    getAllResponses: builder.query<
      QuestionResponse[],
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 50 }) =>
        `/admin/question-responses?skip=${skip}&take=${take}`,
    }),
    updateResponse: builder.mutation<
      QuestionResponse,
      { responseId: string; data: Partial<QuestionResponse> }
    >({
      query: ({ responseId, data }) => ({
        url: `/admin/question-responses/${responseId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteResponse: builder.mutation<void, string>({
      query: (responseId) => ({
        url: `/admin/question-responses/${responseId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetSystemStatsQuery,
  useGetAllInterviewCategoriesQuery,
  useCreateInterviewCategoryMutation,
  useUpdateInterviewCategoryMutation,
  useDeleteInterviewCategoryMutation,
  useGetAllDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useUploadDocumentMutation,
  useUploadDocumentChunksMutation,
  useGetDocumentChunksQuery,
  useGetAllSessionsQuery,
  useGetSessionDetailsQuery,
  useDeleteSessionMutation,
  useGetAllResponsesQuery,
  useUpdateResponseMutation,
  useDeleteResponseMutation,
} = adminApi;

// Backward compatible alias
export const adminAPI = {
  getDashboard: async () => adminApi.endpoints.getDashboard.initiate(),
  getSystemStats: async () => adminApi.endpoints.getSystemStats.initiate(),
  getAllInterviewCategories: async () =>
    adminApi.endpoints.getAllInterviewCategories.initiate(),
  createInterviewCategory: async (data: {
    name: string;
    slug: string;
    systemPrompt: string;
    language?: string;
  }) => adminApi.endpoints.createInterviewCategory.initiate(data),
  updateInterviewCategory: async (
    categoryId: string,
    data: Partial<InterviewCategory>
  ) =>
    adminApi.endpoints.updateInterviewCategory.initiate({ categoryId, data }),
  deleteInterviewCategory: async (categoryId: string) =>
    adminApi.endpoints.deleteInterviewCategory.initiate(categoryId),
  getAllDocuments: async (skip = 0, take = 50, categoryId?: string) =>
    adminApi.endpoints.getAllDocuments.initiate({ skip, take, categoryId }),
  createDocument: async (data: {
    categoryId: string;
    title: string;
    fileName: string;
    fileType: string;
    fileUrl?: string;
    fileSize?: number;
  }) => adminApi.endpoints.createDocument.initiate(data),
  updateDocument: async (
    documentId: string,
    data: Partial<KnowledgeDocument>
  ) => adminApi.endpoints.updateDocument.initiate({ documentId, data }),
  deleteDocument: async (documentId: string) =>
    adminApi.endpoints.deleteDocument.initiate(documentId),
  uploadDocumentChunks: async (documentId: string, chunks: DocumentChunk[]) =>
    adminApi.endpoints.uploadDocumentChunks.initiate({ documentId, chunks }),
  getDocumentChunks: async (documentId: string, skip = 0, take = 100) =>
    adminApi.endpoints.getDocumentChunks.initiate({ documentId, skip, take }),
  getAllSessions: async (skip = 0, take = 50) =>
    adminApi.endpoints.getAllSessions.initiate({ skip, take }),
  getSessionDetails: async (sessionId: string) =>
    adminApi.endpoints.getSessionDetails.initiate(sessionId),
  deleteSession: async (sessionId: string) =>
    adminApi.endpoints.deleteSession.initiate(sessionId),
  getAllResponses: async (skip = 0, take = 50) =>
    adminApi.endpoints.getAllResponses.initiate({ skip, take }),
  updateResponse: async (responseId: string, data: Partial<QuestionResponse>) =>
    adminApi.endpoints.updateResponse.initiate({ responseId, data }),
  deleteResponse: async (responseId: string) =>
    adminApi.endpoints.deleteResponse.initiate(responseId),
};
