import instance from '@/api/http';

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

// API Class
class InterviewAPI {
  async getCategories(): Promise<InterviewCategory[]> {
    const response = await instance.get('/interview-categories');
    return response.data;
  }

  async getCategoryById(id: string): Promise<InterviewCategory> {
    const response = await instance.get(`/interview-categories/${id}`);
    return response.data;
  }

  async createInterviewSession(
    data: CreateInterviewSessionData
  ): Promise<InterviewSession> {
    const response = await instance.post('/interview-sessions', data);
    return response.data;
  }

  async getUserSessions(
    skip: number = 0,
    take: number = 20
  ): Promise<InterviewSession[]> {
    const response = await instance.get(
      `/interview-sessions?skip=${skip}&take=${take}`
    );
    return response.data;
  }

  async getSessionById(sessionId: string): Promise<InterviewSession> {
    const response = await instance.get(`/interview-sessions/${sessionId}`);
    return response.data;
  }

  async updateSession(
    sessionId: string,
    data: { status?: string }
  ): Promise<InterviewSession> {
    const response = await instance.put(
      `/interview-sessions/${sessionId}`,
      data
    );
    return response.data;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await instance.delete(`/interview-sessions/${sessionId}`);
  }

  async createCategory(data: {
    name: string;
    slug: string;
    systemPrompt: string;
    language?: string;
  }): Promise<InterviewCategory> {
    const response = await instance.post('/interview-categories', data);
    return response.data;
  }

  async updateCategory(
    categoryId: string,
    data: Partial<InterviewCategory>
  ): Promise<InterviewCategory> {
    const response = await instance.put(
      `/interview-categories/${categoryId}`,
      data
    );
    return response.data;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await instance.delete(`/interview-categories/${categoryId}`);
  }

  async getAllSessions(
    skip: number = 0,
    take: number = 50
  ): Promise<InterviewSession[]> {
    const response = await instance.get(
      `/interview-sessions/all?skip=${skip}&take=${take}`
    );
    return response.data;
  }
}

export const interviewAPI = new InterviewAPI();

// Backward compatible alias
export const interviewCategoriesAPI = interviewAPI;
