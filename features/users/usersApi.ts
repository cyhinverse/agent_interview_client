import { apiSlice } from '@/store/apiSlice';

// Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  fullName?: string;
  avatarUrl?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserStats {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  totalQuestionsAnswered: number;
  averageResponseTime: number;
}

export interface EvaluationReport {
  id: string;
  sessionId: string;
  userId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  createdAt: string;
  session?: {
    id: string;
    category: {
      name: string;
    };
  };
}

export const usersApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User, UpdateUserData>({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordData>({
      query: (data) => ({
        url: '/users/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => '/users/stats',
    }),
    getUserReports: builder.query<
      EvaluationReport[],
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 20 }) =>
        `/users/reports?skip=${skip}&take=${take}`,
      providesTags: ['EvaluationReport'],
    }),
    getReportById: builder.query<EvaluationReport, string>({
      query: (reportId) => `/users/reports/${reportId}`,
      providesTags: (result, error, arg) => [
        { type: 'EvaluationReport', id: arg },
      ],
    }),
    getSessionReport: builder.query<EvaluationReport, string>({
      query: (sessionId) => `/users/sessions/${sessionId}/report`,
      providesTags: (result, error, arg) => [
        { type: 'EvaluationReport', id: arg },
      ],
    }),
    // Admin user endpoints
    getAllUsers: builder.query<User[], { skip?: number; take?: number }>({
      query: ({ skip = 0, take = 50 }) =>
        `/admin/users?skip=${skip}&take=${take}`,
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation<
      User,
      { userId: string; role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN' }
    >({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getAllReports: builder.query<
      EvaluationReport[],
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 50 }) =>
        `/admin/reports?skip=${skip}&take=${take}`,
      providesTags: ['EvaluationReport'],
    }),
    updateReport: builder.mutation<
      EvaluationReport,
      { reportId: string; data: Partial<EvaluationReport> }
    >({
      query: ({ reportId, data }) => ({
        url: `/admin/reports/${reportId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'EvaluationReport', id: arg.reportId },
        'EvaluationReport',
      ],
    }),
    deleteReport: builder.mutation<void, string>({
      query: (reportId) => ({
        url: `/admin/reports/${reportId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EvaluationReport'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetUserStatsQuery,
  useGetUserReportsQuery,
  useGetReportByIdQuery,
  useGetSessionReportQuery,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetAllReportsQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = usersApi;

// Backward compatible alias
export const usersAPI = {
  getCurrentUser: async () => usersApi.endpoints.getCurrentUser.initiate(),
  updateUser: async (data: UpdateUserData) =>
    usersApi.endpoints.updateUser.initiate(data),
  changePassword: async (data: ChangePasswordData) =>
    usersApi.endpoints.changePassword.initiate(data),
  getUserStats: async () => usersApi.endpoints.getUserStats.initiate(),
  getUserReports: async (skip = 0, take = 20) =>
    usersApi.endpoints.getUserReports.initiate({ skip, take }),
  getReportById: async (reportId: string) =>
    usersApi.endpoints.getReportById.initiate(reportId),
  getSessionReport: async (sessionId: string) =>
    usersApi.endpoints.getSessionReport.initiate(sessionId),
  getAllUsers: async (skip = 0, take = 50) =>
    usersApi.endpoints.getAllUsers.initiate({ skip, take }),
  updateUserRole: async (
    userId: string,
    role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN'
  ) => usersApi.endpoints.updateUserRole.initiate({ userId, role }),
  deleteUser: async (userId: string) =>
    usersApi.endpoints.deleteUser.initiate(userId),
  getAllReports: async (skip = 0, take = 50) =>
    usersApi.endpoints.getAllReports.initiate({ skip, take }),
  updateReport: async (reportId: string, data: Partial<EvaluationReport>) =>
    usersApi.endpoints.updateReport.initiate({ reportId, data }),
  deleteReport: async (reportId: string) =>
    usersApi.endpoints.deleteReport.initiate(reportId),
};
