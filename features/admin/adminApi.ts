import instance from '@/api/http';
import { User, EvaluationReport } from '@/features/users/usersApi';
import {
  InterviewCategory,
  InterviewSession,
} from '@/features/interview/interviewApi';
import {
  QuestionBank,
  QuestionResponse,
} from '@/features/questions/questionsApi';

// Types
export interface SystemStats {
  totalUsers: number;
  totalSessions: number;
  totalQuestions: number;
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

// API Class
class AdminAPI {
  async getDashboard(): Promise<AdminDashboardData> {
    const response = await instance.get('/admin/dashboard');
    return response.data;
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await instance.get('/admin/stats');
    return response.data;
  }

  async getAllUsers(skip: number = 0, take: number = 50): Promise<User[]> {
    const response = await instance.get(
      `/admin/users?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async updateUserRole(
    userId: string,
    role: 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN'
  ): Promise<User> {
    const response = await instance.put(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await instance.delete(`/admin/users/${userId}`);
  }

  async getAllInterviewCategories(): Promise<InterviewCategory[]> {
    const response = await instance.get('/admin/interview-categories');
    return response.data;
  }

  async createInterviewCategory(data: {
    name: string;
    slug: string;
    systemPrompt: string;
    language?: string;
  }): Promise<InterviewCategory> {
    const response = await instance.post('/admin/interview-categories', data);
    return response.data;
  }

  async updateInterviewCategory(
    categoryId: string,
    data: Partial<InterviewCategory>
  ): Promise<InterviewCategory> {
    const response = await instance.put(
      `/admin/interview-categories/${categoryId}`,
      data
    );
    return response.data;
  }

  async deleteInterviewCategory(categoryId: string): Promise<void> {
    await instance.delete(`/admin/interview-categories/${categoryId}`);
  }

  async getAllQuestions(
    skip: number = 0,
    take: number = 50
  ): Promise<QuestionBank[]> {
    const response = await instance.get(
      `/admin/question-banks?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async createQuestion(data: {
    categoryId: string;
    questionText: string;
    expectedAnswer: string;
    difficulty?: string;
  }): Promise<QuestionBank> {
    const response = await instance.post('/admin/question-banks', data);
    return response.data;
  }

  async updateQuestion(
    questionId: string,
    data: Partial<QuestionBank>
  ): Promise<QuestionBank> {
    const response = await instance.put(
      `/admin/question-banks/${questionId}`,
      data
    );
    return response.data;
  }

  async deleteQuestion(questionId: string): Promise<void> {
    await instance.delete(`/admin/question-banks/${questionId}`);
  }

  async getAllSessions(
    skip: number = 0,
    take: number = 50
  ): Promise<InterviewSession[]> {
    const response = await instance.get(
      `/admin/interview-sessions?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async getSessionDetails(sessionId: string): Promise<
    InterviewSession & {
      responses: QuestionResponse[];
      report?: EvaluationReport;
    }
  > {
    const response = await instance.get(
      `/admin/interview-sessions/${sessionId}`
    );
    return response.data;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await instance.delete(`/admin/interview-sessions/${sessionId}`);
  }

  async getAllReports(
    skip: number = 0,
    take: number = 50
  ): Promise<EvaluationReport[]> {
    const response = await instance.get(
      `/admin/evaluation-reports?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async updateReport(
    reportId: string,
    data: Partial<EvaluationReport>
  ): Promise<EvaluationReport> {
    const response = await instance.put(
      `/admin/evaluation-reports/${reportId}`,
      data
    );
    return response.data;
  }

  async deleteReport(reportId: string): Promise<void> {
    await instance.delete(`/admin/evaluation-reports/${reportId}`);
  }

  async getAllResponses(
    skip: number = 0,
    take: number = 50
  ): Promise<QuestionResponse[]> {
    const response = await instance.get(
      `/admin/question-responses?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async updateResponse(
    responseId: string,
    data: Partial<QuestionResponse>
  ): Promise<QuestionResponse> {
    const response = await instance.put(
      `/admin/question-responses/${responseId}`,
      data
    );
    return response.data;
  }

  async deleteResponse(responseId: string): Promise<void> {
    await instance.delete(`/admin/question-responses/${responseId}`);
  }
}

export const adminAPI = new AdminAPI();
