import instance from '@/api/http';

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

// API Class
class UsersAPI {
  async getCurrentUser(): Promise<User> {
    const response = await instance.get('/users/me');
    return response.data;
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await instance.put('/users/me', data);
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await instance.post('/users/change-password', data);
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await instance.get('/users/stats');
    return response.data;
  }

  async getUserReports(
    skip: number = 0,
    take: number = 20
  ): Promise<EvaluationReport[]> {
    const response = await instance.get(
      `/users/reports?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async getReportById(reportId: string): Promise<EvaluationReport> {
    const response = await instance.get(`/users/reports/${reportId}`);
    return response.data;
  }

  async getSessionReport(sessionId: string): Promise<EvaluationReport> {
    const response = await instance.get(`/users/sessions/${sessionId}/report`);
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

  async getAllReports(
    skip: number = 0,
    take: number = 50
  ): Promise<EvaluationReport[]> {
    const response = await instance.get(
      `/admin/reports?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async updateReport(
    reportId: string,
    data: Partial<EvaluationReport>
  ): Promise<EvaluationReport> {
    const response = await instance.put(`/admin/reports/${reportId}`, data);
    return response.data;
  }

  async deleteReport(reportId: string): Promise<void> {
    await instance.delete(`/admin/reports/${reportId}`);
  }
}

export const usersAPI = new UsersAPI();
