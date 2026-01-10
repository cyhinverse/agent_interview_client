import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminAPI,
  AdminDashboardData,
  SystemStats,
} from '@/features/admin/adminApi';
import { User, EvaluationReport } from '@/features/users/usersApi';
import {
  InterviewCategory,
  InterviewSession,
} from '@/features/interview/interviewApi';
import {
  QuestionBank,
  QuestionResponse,
} from '@/features/questions/questionsApi';
import { toast } from 'sonner';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (skip: number, take: number) =>
    [...adminKeys.users(), 'list', { skip, take }] as const,
  user: (id: string) => [...adminKeys.users(), 'detail', id] as const,
  categories: () => [...adminKeys.all, 'categories'] as const,
  categoryList: () => [...adminKeys.categories(), 'list'] as const,
  category: (id: string) => [...adminKeys.categories(), 'detail', id] as const,
  questions: () => [...adminKeys.all, 'questions'] as const,
  questionList: (skip: number, take: number) =>
    [...adminKeys.questions(), 'list', { skip, take }] as const,
  question: (id: string) => [...adminKeys.questions(), 'detail', id] as const,
  sessions: () => [...adminKeys.all, 'sessions'] as const,
  sessionList: (skip: number, take: number) =>
    [...adminKeys.sessions(), 'list', { skip, take }] as const,
  session: (id: string) => [...adminKeys.sessions(), 'detail', id] as const,
  reports: () => [...adminKeys.all, 'reports'] as const,
  reportList: (skip: number, take: number) =>
    [...adminKeys.reports(), 'list', { skip, take }] as const,
  report: (id: string) => [...adminKeys.reports(), 'detail', id] as const,
  responses: () => [...adminKeys.all, 'responses'] as const,
  responseList: (skip: number, take: number) =>
    [...adminKeys.responses(), 'list', { skip, take }] as const,
  response: (id: string) => [...adminKeys.responses(), 'detail', id] as const,
};

// Dashboard hooks
export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminAPI.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSystemStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminAPI.getSystemStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// User management hooks
export function useAdminUsers(skip: number = 0, take: number = 50) {
  return useQuery({
    queryKey: adminKeys.userList(skip, take),
    queryFn: () => adminAPI.getAllUsers(skip, take),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN';
    }) => adminAPI.updateUserRole(userId, role),
    onSuccess: (user) => {
      // Update user in cache
      queryClient.setQueryData(adminKeys.user(user.id), user);
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });

      toast.success(`User role updated to ${user.role}`);
    },
    onError: (error) => {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminAPI.deleteUser(userId),
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: adminKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });

      toast.success('User deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    },
  });
}

// Interview category management hooks
export function useAdminCategories() {
  return useQuery({
    queryKey: adminKeys.categoryList(),
    queryFn: () => adminAPI.getAllInterviewCategories?.(),
  });
}

export function useCreateInterviewCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Parameters<typeof adminAPI.createInterviewCategory>[0]
    ) => adminAPI.createInterviewCategory(data),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Interview category created successfully');
    },
    onError: (error) => {
      console.error('Failed to create interview category:', error);
      toast.error('Failed to create interview category');
    },
  });
}

export function useUpdateInterviewCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: Partial<InterviewCategory>;
    }) => adminAPI.updateInterviewCategory(categoryId, data),
    onSuccess: (category) => {
      queryClient.setQueryData(adminKeys.category(category.id), category);
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Interview category updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update interview category:', error);
      toast.error('Failed to update interview category');
    },
  });
}

export function useDeleteInterviewCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      adminAPI.deleteInterviewCategory(categoryId),
    onSuccess: (_, categoryId) => {
      queryClient.removeQueries({ queryKey: adminKeys.category(categoryId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('Interview category deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete interview category:', error);
      toast.error('Failed to delete interview category');
    },
  });
}

// Question management hooks
export function useAdminQuestions(skip: number = 0, take: number = 50) {
  return useQuery({
    queryKey: adminKeys.questionList(skip, take),
    queryFn: () => adminAPI.getAllQuestions?.(skip, take),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof adminAPI.createQuestion>[0]) =>
      adminAPI.createQuestion(data),
    onSuccess: (question) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.questions() });
      toast.success('Question created successfully');
    },
    onError: (error) => {
      console.error('Failed to create question:', error);
      toast.error('Failed to create question');
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: Partial<QuestionBank>;
    }) => adminAPI.updateQuestion(questionId, data),
    onSuccess: (question) => {
      queryClient.setQueryData(adminKeys.question(question.id), question);
      queryClient.invalidateQueries({ queryKey: adminKeys.questions() });
      toast.success('Question updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update question:', error);
      toast.error('Failed to update question');
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => adminAPI.deleteQuestion(questionId),
    onSuccess: (_, questionId) => {
      queryClient.removeQueries({ queryKey: adminKeys.question(questionId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.questions() });
      toast.success('Question deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete question:', error);
      toast.error('Failed to delete question');
    },
  });
}

// Session management hooks
export function useAdminSessions(skip: number = 0, take: number = 50) {
  return useQuery({
    queryKey: adminKeys.sessionList(skip, take),
    queryFn: () => adminAPI.getAllSessions(skip, take),
  });
}

export function useAdminSession(sessionId: string) {
  return useQuery({
    queryKey: adminKeys.session(sessionId),
    queryFn: () => adminAPI.getSessionDetails(sessionId),
    enabled: !!sessionId,
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => adminAPI.deleteSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.removeQueries({ queryKey: adminKeys.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.sessions() });
      toast.success('Session deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
    },
  });
}

// Report management hooks
export function useAdminReports(skip: number = 0, take: number = 50) {
  return useQuery({
    queryKey: adminKeys.reportList(skip, take),
    queryFn: () => adminAPI.getAllReports(skip, take),
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      data,
    }: {
      reportId: string;
      data: Partial<EvaluationReport>;
    }) => adminAPI.updateReport(reportId, data),
    onSuccess: (report) => {
      queryClient.setQueryData(adminKeys.report(report.id), report);
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
      toast.success('Report updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update report:', error);
      toast.error('Failed to update report');
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => adminAPI.deleteReport(reportId),
    onSuccess: (_, reportId) => {
      queryClient.removeQueries({ queryKey: adminKeys.report(reportId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
      toast.success('Report deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete report:', error);
      toast.error('Failed to delete report');
    },
  });
}

// Response management hooks
export function useAdminResponses(skip: number = 0, take: number = 50) {
  return useQuery({
    queryKey: adminKeys.responseList(skip, take),
    queryFn: () => adminAPI.getAllResponses(skip, take),
  });
}

export function useUpdateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      data,
    }: {
      responseId: string;
      data: Partial<QuestionResponse>;
    }) => adminAPI.updateResponse(responseId, data),
    onSuccess: (response) => {
      queryClient.setQueryData(adminKeys.response(response.id), response);
      queryClient.invalidateQueries({ queryKey: adminKeys.responses() });
      toast.success('Response updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update response:', error);
      toast.error('Failed to update response');
    },
  });
}

export function useDeleteResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: string) => adminAPI.deleteResponse(responseId),
    onSuccess: (_, responseId) => {
      queryClient.removeQueries({ queryKey: adminKeys.response(responseId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.responses() });
      toast.success('Response deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete response:', error);
      toast.error('Failed to delete response');
    },
  });
}
