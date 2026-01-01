import { createAsyncThunk } from '@reduxjs/toolkit';
import instance from '@/api/http';

export const login = createAsyncThunk(
  'auth/login',
  async (user: { email: string; password: string }) => {
    try {
      const response = await instance.post('/auth/login', user);
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (user: {
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await instance.post('/auth/register', user);
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }
);
