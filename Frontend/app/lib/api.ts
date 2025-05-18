import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  is_published: boolean;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  order: number;
  answers: Answer[];
}

export interface Answer {
  id: number;
  text: string;
}

export interface TestResult {
  id: number;
  test: number;
  score: number;
  passed_at: string;
  is_passed: boolean;
}

export const auth = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${API_URL}-token-auth/`, credentials);
    return response.data;
  },
  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    group_number?: string | null;
  }) => {
    const response = await axios.post(`${API_URL}/users/register/`, data);
    return response.data;
  },
  verifyToken: async () => {
    const response = await api.get('/verify-token/');
    return response.data;
  },
};

export const tests = {
  getAll: async () => {
    const response = await api.get<Test[]>('/tests/');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get<Test>(`/tests/${id}/`);
    return response.data;
  },
  
  submitResult: async (testId: number, answers: Record<number, number>) => {
    const response = await api.post<TestResult>('/results/', {
      test: testId,
      answers,
    });
    return response.data;
  },
};

export default api; 