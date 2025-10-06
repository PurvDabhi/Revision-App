import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, BookOpen, Calendar } from 'lucide-react';
import { apiService } from '../api';
import { QuizAttempt } from '../types';

export default function ProgressDashboard() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await apiService.getProgress();
      setAttempts(response.data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = attempts.slice(0, 7).reverse().map((attempt, index) => ({
    attempt: `Quiz ${index + 1}`,
    score: Math.round((attempt.score / attempt.total) * 100),
    date: new Date(attempt.timestamp).toLocaleDateString()
  }));

  const averageScore = attempts.length > 0 
    ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) / attempts.length)
    : 0;

  const totalQuizzes = attempts.length;
  const bestScore = attempts.length > 0 
    ? Math.max(...attempts.map(attempt => Math.round((attempt.score / attempt.total) * 100)))
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Progress Dashboard
      </h2>

      {attempts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No quiz attempts yet. Start taking quizzes to track your progress!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Average Score</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{averageScore}%</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Best Score</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{bestScore}%</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Total Quizzes</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{totalQuizzes}</div>
            </div>
          </div>

          {/* Chart */}
          <div>
            <h3 className="text-lg font-medium mb-4">Recent Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attempt" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                    labelFormatter={(label, payload) => 
                      payload?.[0]?.payload?.date ? `${label} (${payload[0].payload.date})` : label
                    }
                  />
                  <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Attempts */}
          <div>
            <h3 className="text-lg font-medium mb-4">Recent Attempts</h3>
            <div className="space-y-2">
              {attempts.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{attempt.pdf_name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(attempt.timestamp).toLocaleDateString()} at{' '}
                      {new Date(attempt.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {attempt.score}/{attempt.total}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round((attempt.score / attempt.total) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}