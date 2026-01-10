import instance from '@/api/http';

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

// API Class
class AuthAPI {
  async login(data: LoginData): Promise<TokenResponse> {
    const response = await instance.post<TokenResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterData): Promise<TokenResponse> {
    const response = await instance.post<TokenResponse>('/auth/register', data);
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await instance.post('/auth/change-password', data);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await instance.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  async logout(): Promise<{ message: string }> {
    const response = await instance.post('/auth/logout');
    return response.data;
  }
}

export const authAPI = new AuthAPI();
