import {
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
  useUploadDocumentChunksMutation,
  useGetDocumentChunksQuery,
  useGetAllSessionsQuery,
  useGetSessionDetailsQuery,
  useDeleteSessionMutation,
  useGetAllResponsesQuery,
  useUpdateResponseMutation,
  useDeleteResponseMutation,
  KnowledgeDocument,
} from '@/features/admin/adminApi';
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetAllReportsQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
  EvaluationReport,
} from '@/features/users/usersApi';
import { InterviewCategory } from '@/features/interview/interviewApi';
import { QuestionResponse } from '@/features/questions/questionsApi';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

// Hooks for basic stats
export function useAdminDashboard() {
  return useGetDashboardQuery();
}

export function useSystemStats() {
  return useGetSystemStatsQuery();
}

// Category hooks
export function useAdminCategories() {
  return useGetAllInterviewCategoriesQuery();
}

// Alias for backward compatibility
export const useAllCategories = useAdminCategories;

export function useCreateInterviewCategory() {
  const [createCategory, result] = useCreateInterviewCategoryMutation();

  const handleCreate = async (data: {
    name: string;
    slug: string;
    systemPrompt: string;
    language?: string;
  }) => {
    try {
      await createCategory(data).unwrap();
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create category'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleCreate,
    mutateAsync: handleCreate,
  };
}

// Alias
export const useCreateCategory = useCreateInterviewCategory;

export function useUpdateInterviewCategory() {
  const [updateCategory, result] = useUpdateInterviewCategoryMutation();

  const handleUpdate = async (args: {
    categoryId: string;
    data: Partial<InterviewCategory>;
  }) => {
    try {
      await updateCategory(args).unwrap();
      toast.success('Category updated successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update category'));
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

// Alias
export const useUpdateCategory = useUpdateInterviewCategory;

export function useDeleteInterviewCategory() {
  const [deleteCategory, result] = useDeleteInterviewCategoryMutation();

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId).unwrap();
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete category'));
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

// Alias
export const useDeleteCategory = useDeleteInterviewCategory;

// User hooks
export function useAdminUsers(skip: number = 0, take: number = 50) {
  return useGetAllUsersQuery({ skip, take });
}

export function useUpdateUserRole() {
  const [updateRole, result] = useUpdateUserRoleMutation();

  const handleUpdate = async (args: {
    userId: string;
    role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN';
  }) => {
    try {
      await updateRole(args).unwrap();
      toast.success('User role updated successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update user role'));
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

export function useDeleteUser() {
  const [deleteUser, result] = useDeleteUserMutation();

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete user'));
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

// Document hooks
export function useAdminDocuments(
  skip: number = 0,
  take: number = 50,
  categoryId?: string
) {
  return useGetAllDocumentsQuery({ skip, take, categoryId });
}

// Alias
export const useAllDocuments = useAdminDocuments;

export function useCreateDocument() {
  const [createDocument, result] = useCreateDocumentMutation();

  const handleCreate = async (data: {
    categoryId: string;
    title: string;
    fileName: string;
    fileType: string;
    fileUrl?: string;
    fileSize?: number;
  }) => {
    try {
      await createDocument(data).unwrap();
      toast.success('Document created successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create document'));
      throw error;
    }
  };

  return {
    ...result,
    isPending: result.isLoading,
    mutate: handleCreate,
    mutateAsync: handleCreate,
  };
}

export function useUpdateDocument() {
  const [updateDocument, result] = useUpdateDocumentMutation();

  const handleUpdate = async (args: {
    documentId: string;
    data: Partial<KnowledgeDocument>;
  }) => {
    try {
      await updateDocument(args).unwrap();
      toast.success('Document updated successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update document'));
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

export function useDeleteDocument() {
  const [deleteDocument, result] = useDeleteDocumentMutation();

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId).unwrap();
      toast.success('Document deleted successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete document'));
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

// Session hooks
export function useAdminSessions(skip: number = 0, take: number = 50) {
  return useGetAllSessionsQuery({ skip, take });
}

// Alias
export const useAllSessions = useAdminSessions;

export function useSessionDetails(sessionId: string) {
  return useGetSessionDetailsQuery(sessionId, {
    skip: !sessionId,
  });
}

export function useDeleteSession() {
  const [deleteSession, result] = useDeleteSessionMutation();

  const handleDelete = async (sessionId: string) => {
    try {
      await deleteSession(sessionId).unwrap();
      toast.success('Session deleted successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete session'));
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

// Report hooks
export function useAdminReports(skip: number = 0, take: number = 50) {
  return useGetAllReportsQuery({ skip, take });
}

export function useUpdateReport() {
  const [updateReport, result] = useUpdateReportMutation();

  const handleUpdate = async (args: {
    reportId: string;
    data: Partial<EvaluationReport>;
  }) => {
    try {
      await updateReport(args).unwrap();
      toast.success('Report updated successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update report'));
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

export function useDeleteReport() {
  const [deleteReport, result] = useDeleteReportMutation();

  const handleDelete = async (reportId: string) => {
    try {
      await deleteReport(reportId).unwrap();
      toast.success('Report deleted successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete report'));
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

// Response hooks
export function useAdminResponses(skip: number = 0, take: number = 50) {
  return useGetAllResponsesQuery({ skip, take });
}

// Alias
export const useAllResponses = useAdminResponses;

export function useAdminUpdateResponse() {
  const [updateResponse, result] = useUpdateResponseMutation();

  const handleUpdate = async (args: {
    responseId: string;
    data: Partial<QuestionResponse>;
  }) => {
    try {
      await updateResponse(args).unwrap();
      toast.success('Response updated successfully!');
    } catch (error) {
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

// Alias
export const useUpdateResponse = useAdminUpdateResponse;

export function useAdminDeleteResponse() {
  const [deleteResponse, result] = useDeleteResponseMutation();

  const handleDelete = async (responseId: string) => {
    try {
      await deleteResponse(responseId).unwrap();
      toast.success('Response deleted successfully!');
    } catch (error) {
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

// Alias
export const useDeleteResponse = useAdminDeleteResponse;
