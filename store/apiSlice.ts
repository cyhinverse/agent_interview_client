import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '@/features/auth/authSlice';
import { RootState } from './store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/',
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.token || localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Types
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshToken =
      (api.getState() as RootState).auth.refreshToken ||
      localStorage.getItem('refreshToken');

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data as RefreshResponse;

        // Store the new token
        api.dispatch(
          setCredentials({ accessToken, refreshToken: newRefreshToken })
        );

        // Retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'InterviewCategory',
    'InterviewSession',
    'Question',
    'EvaluationReport',
    'QuestionBank',
  ],
  endpoints: (_builder) => ({}),
});
