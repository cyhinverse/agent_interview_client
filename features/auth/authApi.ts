import { apiSlice } from '@/store/apiSlice';

// Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TokenResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  statusCode: number;
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<TokenResponse, RegisterData>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordData>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'InterviewSession', 'EvaluationReport'],
    }),
    refresh: builder.mutation<TokenResponse, { refresh_token: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;

// Backward compatible alias
export const authAPI = {
  login: async (data: LoginData) => authApi.endpoints.login.initiate(data),
  register: async (data: RegisterData) =>
    authApi.endpoints.register.initiate(data),
  changePassword: async (data: ChangePasswordData) =>
    authApi.endpoints.changePassword.initiate(data),
  logout: async () => authApi.endpoints.logout.initiate(),
};
