import axios from 'axios';
import { Question, QuizAttempt, YouTubeVideo } from './types';

const api = axios.create({
  baseURL: 'http://localhost:5173/api'
});

export const apiService = {
  // PDF Management
  getPDFs: () => api.get<string[]>('/pdfs'),
  uploadPDF: (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return api.post('/upload', formData);
  },

  // Quiz Management
  generateQuiz: (pdfName: string, questionType: string, count: number) =>
    api.post<{ questions: Question[] }>('/generate-quiz', { pdfName, questionType, count }),
  
  submitQuiz: (pdfName: string, questions: Question[], answers: string[]) =>
    api.post<{ score: number; total: number; attemptId: string }>('/submit-quiz', { pdfName, questions, answers }),

  // Progress Tracking
  getProgress: () => api.get<QuizAttempt[]>('/progress'),

  // Chat
  sendMessage: (message: string, pdfName?: string, sessionId?: string) =>
    api.post<{ reply: string }>('/chat', { message, pdfName, sessionId }),

  // YouTube Recommendations
  getYouTubeRecommendations: (topic: string) =>
    api.get<{ videos: YouTubeVideo[] }>('/youtube-recommendations', { params: { topic } })
};