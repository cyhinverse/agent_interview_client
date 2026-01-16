import { apiSlice } from '@/store/apiSlice';

// Types
export interface QuestionResponse {
  id: string;
  sessionId: string;
  questionText: string;
  answer: string;
  score: number;
  comment: string | null;
  ragContext?: string | null;
  difficulty?: string;
  expectedAnswer?: string;
  category?: {
    id: string;
    name: string;
  };
  session?: {
    id: string;
    userId: string;
    user: {
      fullName: string;
      email: string;
      avatar?: string | null;
    };
  };
  createdAt: string;
}

export interface SubmitAnswerData {
  questionText: string;
  answer: string;
}

export const questionsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    submitAnswer: builder.mutation<
      QuestionResponse,
      { sessionId: string; data: SubmitAnswerData }
    >({
      query: ({ sessionId, data }) => ({
        url: '/question-responses',
        method: 'POST',
        body: { sessionId, ...data },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Question', id: arg.sessionId },
        'Question',
      ],
    }),
    getSessionResponses: builder.query<QuestionResponse[], string>({
      query: (sessionId) => `/question-responses/session/${sessionId}`,
      providesTags: (result, error, arg) => [{ type: 'Question', id: arg }],
    }),
    getResponseById: builder.query<QuestionResponse, string>({
      query: (responseId) => `/question-responses/${responseId}`,
      providesTags: (result, error, arg) => [{ type: 'Question', id: arg }],
    }),
    updateResponse: builder.mutation<
      QuestionResponse,
      { responseId: string; data: { answer?: string } }
    >({
      query: ({ responseId, data }) => ({
        url: `/question-responses/${responseId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Question', id: arg.responseId },
      ],
    }),
    deleteResponse: builder.mutation<void, string>({
      query: (responseId) => ({
        url: `/question-responses/${responseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
    getAllResponses: builder.query<
      QuestionResponse[],
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 50 }) =>
        `/question-responses/all?skip=${skip}&take=${take}`,
      providesTags: ['Question'],
    }),
  }),
});

export const {
  useSubmitAnswerMutation,
  useGetSessionResponsesQuery,
  useGetResponseByIdQuery,
  useUpdateResponseMutation,
  useDeleteResponseMutation,
  useGetAllResponsesQuery,
} = questionsApi;

// Backward compatible alias
export const questionsAPI = {
  submitAnswer: async (sessionId: string, data: SubmitAnswerData) =>
    questionsApi.endpoints.submitAnswer.initiate({ sessionId, data }),
  getSessionResponses: async (sessionId: string) =>
    questionsApi.endpoints.getSessionResponses.initiate(sessionId),
  getResponseById: async (responseId: string) =>
    questionsApi.endpoints.getResponseById.initiate(responseId),
  updateResponse: async (responseId: string, data: Partial<QuestionResponse>) =>
    questionsApi.endpoints.updateResponse.initiate({ responseId, data }),
  deleteResponse: async (responseId: string) =>
    questionsApi.endpoints.deleteResponse.initiate(responseId),
  getAllResponses: async (skip = 0, take = 50) =>
    questionsApi.endpoints.getAllResponses.initiate({ skip, take }),
};
