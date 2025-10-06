export interface Question {
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  pdf_name: string;
  score: number;
  total: number;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}