import instance from '@/api/http';

// Types
export interface QuestionBank {
  id: string;
  categoryId: string;
  questionText: string;
  expectedAnswer: string;
  difficulty: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface QuestionResponse {
  id: string;
  sessionId: string;
  questionId: string;
  answer: string;
  score: number;
  comment: string | null;
  question?: QuestionBank;
}

export interface SubmitAnswerData {
  questionId: string;
  answer: string;
}

// API Class
class QuestionsAPI {
  async getQuestions(
    categoryId?: string,
    skip: number = 0,
    take: number = 50
  ): Promise<QuestionBank[]> {
    let url = `/question-banks?skip=${skip}&take=${take}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    const response = await instance.get(url);
    return response.data;
  }

  async getQuestionById(id: string): Promise<QuestionBank> {
    const response = await instance.get(`/question-banks/${id}`);
    return response.data;
  }

  async submitAnswer(
    sessionId: string,
    data: SubmitAnswerData
  ): Promise<QuestionResponse> {
    const response = await instance.post(`/question-responses`, {
      sessionId,
      ...data,
    });
    return response.data;
  }

  async getSessionResponses(sessionId: string): Promise<QuestionResponse[]> {
    const response = await instance.get(
      `/question-responses/session/${sessionId}`
    );
    return response.data;
  }

  async getResponseById(responseId: string): Promise<QuestionResponse> {
    const response = await instance.get(`/question-responses/${responseId}`);
    return response.data;
  }

  async updateResponse(
    responseId: string,
    data: { answer?: string }
  ): Promise<QuestionResponse> {
    const response = await instance.put(
      `/question-responses/${responseId}`,
      data
    );
    return response.data;
  }

  async deleteResponse(responseId: string): Promise<void> {
    await instance.delete(`/question-responses/${responseId}`);
  }

  async createQuestion(data: {
    categoryId: string;
    questionText: string;
    expectedAnswer: string;
    difficulty?: string;
  }): Promise<QuestionBank> {
    const response = await instance.post('/question-banks', data);
    return response.data;
  }

  async updateQuestion(
    questionId: string,
    data: Partial<QuestionBank>
  ): Promise<QuestionBank> {
    const response = await instance.put(`/question-banks/${questionId}`, data);
    return response.data;
  }

  async deleteQuestion(questionId: string): Promise<void> {
    await instance.delete(`/question-banks/${questionId}`);
  }

  async getAllResponses(
    skip: number = 0,
    take: number = 50
  ): Promise<QuestionResponse[]> {
    const response = await instance.get(
      `/question-responses/all?skip=${skip}&take=${take}`
    );
    return response.data;
  }
}

export const questionsAPI = new QuestionsAPI();

// Backward compatible alias
export const questionBanksAPI = questionsAPI;
