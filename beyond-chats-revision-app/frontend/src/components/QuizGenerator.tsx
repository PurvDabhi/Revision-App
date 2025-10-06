import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { apiService } from '../api';
import { Question } from '../types';

interface QuizGeneratorProps {
  selectedPDF: string;
}

export default function QuizGenerator({ selectedPDF }: QuizGeneratorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [questionType, setQuestionType] = useState('MCQ');
  const [questionCount, setQuestionCount] = useState(5);

  const generateQuiz = async () => {
    if (!selectedPDF) return;
    
    setLoading(true);
    try {
      const response = await apiService.generateQuiz(selectedPDF, questionType, questionCount);
      setQuestions(response.data.questions);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setShowResults(false);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await apiService.submitQuiz(selectedPDF, questions, answers);
      setScore(response.data.score);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        Quiz Generator
      </h2>

      {questions.length === 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="SAQ">Short Answer (SAQ)</option>
                <option value="LAQ">Long Answer (LAQ)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Number of Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={generateQuiz}
            disabled={!selectedPDF || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {!showResults && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {questions.length} questions • {questionType}
              </span>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-4 h-4" />
                New Quiz
              </button>
            </div>
          )}

          {questions.map((question, index) => (
            <div key={index} className="quiz-card border rounded-lg p-4">
              <h3 className="font-medium mb-3">
                {index + 1}. {question.question}
              </h3>

              {question.options ? (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        disabled={showResults}
                        className="text-blue-600"
                      />
                      <span className={showResults && option === question.correct_answer ? 'text-green-600 font-medium' : ''}>
                        {option}
                      </span>
                      {showResults && option === question.correct_answer && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {showResults && answers[index] === option && option !== question.correct_answer && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={showResults}
                  placeholder="Enter your answer..."
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                />
              )}

              {showResults && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Explanation:</p>
                  <p className="text-sm text-blue-700">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}

          {!showResults ? (
            <button
              onClick={submitQuiz}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-blue-600">
                Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
              </div>
              <button
                onClick={resetQuiz}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generate New Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}