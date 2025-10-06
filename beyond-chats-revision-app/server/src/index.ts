import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import dotenv from 'dotenv';
const __dirname = path.resolve();

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
const dataPath = path.join(__dirname, 'data');
app.use('/data', express.static(dataPath));

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const upload = multer({ dest: path.join(dataPath, 'uploads') });

// Initialize SQLite database
const db = new sqlite3.Database(path.join(dataPath, 'app.db'));

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY,
    pdf_name TEXT,
    questions TEXT,
    answers TEXT,
    score INTEGER,
    total INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    title TEXT,
    messages TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS pdf_content (
    filename TEXT PRIMARY KEY,
    content TEXT,
    chunks TEXT
  )`);
});

// Helper function to chunk text
function chunkText(text: string, chunkSize = 1000): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// API Routes
app.get('/api/ping', (req: express.Request, res: express.Response) => res.json({ ok: true }));

app.get('/api/pdfs', (req: express.Request, res: express.Response) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      return res.json([]);
    }
    const files = fs.readdirSync(dataDir).filter((f: string) => f.endsWith('.pdf'));
    res.json(files);
  } catch (error) {
    console.error('Error reading PDFs:', error);
    res.json([]);
  }
});

app.post('/api/upload', upload.single('pdf'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    
    const pdfPath = req.file.path;
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    
    // Store PDF content and chunks
    const chunks = chunkText(pdfData.text);
    db.run('INSERT OR REPLACE INTO pdf_content (filename, content, chunks) VALUES (?, ?, ?)',
      [req.file.originalname, pdfData.text, JSON.stringify(chunks)]);
    
    // Move file to data directory
    const finalPath = path.join(__dirname, 'data', req.file.originalname);
    fs.renameSync(pdfPath, finalPath);
    
    res.json({ filename: req.file.originalname, success: true });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process PDF: ' + (error?.message || 'Unknown error') });
  }
});

app.post('/api/generate-quiz', async (req: express.Request, res: express.Response) => {
  try {
    const { pdfName, questionType, count = 5 } = req.body;
    
    const getContent = () => {
      return new Promise<string>((resolve, reject) => {
        if (pdfName === 'all') {
          db.all('SELECT content FROM pdf_content', (err: any, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows.map(row => row.content).join('\n\n'));
          });
        } else {
          db.get('SELECT content FROM pdf_content WHERE filename = ?', [pdfName], (err: any, row: any) => {
            if (err) reject(err);
            else resolve(row?.content || '');
          });
        }
      });
    };
    
    let content = await getContent();
    
    if (!content) {
      return res.status(400).json({ error: 'No PDFs found. Please upload a PDF first using the Source Selection tab.' });
    }
    
    // Truncate content if too long
    const maxLength = 8000;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
    }
    
    const prompt = `Generate ${count} ${questionType} questions based on this content:\n\n${content}\n\nFormat as JSON with this structure:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"], // Only for MCQ
      "correct_answer": "Answer",
      "explanation": "Explanation text"
    }
  ]
}`;
    
    if (!openai) {
      return res.status(400).json({ error: 'OpenAI API key not configured' });
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });
    
    const quizData = JSON.parse(response.choices[0].message.content || '{}');
    res.json(quizData);
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    if (error?.message?.includes('API key') || error?.code === 'invalid_api_key') {
      res.status(400).json({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to server/.env file.' });
    } else {
      res.status(500).json({ error: 'Failed to generate quiz. Please check your OpenAI API key and try again.' });
    }
  }
});

app.post('/api/submit-quiz', (req: express.Request, res: express.Response) => {
  try {
    const { pdfName, questions, answers } = req.body;
    
    let score = 0;
    questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correct_answer) score++;
    });
    
    const attemptId = uuidv4();
    db.run('INSERT INTO quiz_attempts (id, pdf_name, questions, answers, score, total) VALUES (?, ?, ?, ?, ?, ?)',
      [attemptId, pdfName, JSON.stringify(questions), JSON.stringify(answers), score, questions.length]);
    
    res.json({ score, total: questions.length, attemptId });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

app.get('/api/progress', (req: express.Request, res: express.Response) => {
  db.all('SELECT * FROM quiz_attempts ORDER BY timestamp DESC LIMIT 10', (err: any, rows: any) => {
    if (err) {
      console.error('Progress error:', err);
      return res.json([]);
    }
    res.json(rows || []);
  });
});

app.post('/api/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { message, pdfName, sessionId } = req.body;
    
    const getContext = () => {
      return new Promise<string>((resolve) => {
        if (pdfName && pdfName !== 'all') {
          db.get('SELECT content FROM pdf_content WHERE filename = ?', [pdfName], (err: any, row: any) => {
            if (row && !err) {
              resolve(row.content.substring(0, 4000)); // Limit context
            } else {
              resolve('');
            }
          });
        } else {
          resolve('');
        }
      });
    };
    
    const context = await getContext();
    
    if (!openai) {
      return res.status(400).json({ error: 'OpenAI API key not configured' });
    }
    
    const systemPrompt = context ? 
      `You are a helpful teaching assistant. Use this content as reference: ${context}. Always cite relevant information when possible.` :
      'You are a helpful teaching assistant for students.';
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    });
    
    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    if (error?.message?.includes('API key') || error?.code === 'invalid_api_key') {
      res.status(400).json({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to server/.env file.' });
    } else {
      res.status(500).json({ error: 'Failed to process chat. Please check your OpenAI API key and try again.' });
    }
  }
});

app.get('/api/youtube-recommendations', async (req: express.Request, res: express.Response) => {
  try {
    const { topic } = req.query;
    
    // Return mock data if no API key
    if (!process.env.YOUTUBE_API_KEY) {
      const mockVideos = [
        {
          id: 'mock1',
          title: `${topic} - Physics Tutorial`,
          description: 'Educational video about physics concepts',
          thumbnail: 'https://via.placeholder.com/320x180?text=Physics+Video',
          url: 'https://youtube.com'
        },
        {
          id: 'mock2', 
          title: `Understanding ${topic} in Physics`,
          description: 'Comprehensive explanation of physics principles',
          thumbnail: 'https://via.placeholder.com/320x180?text=Physics+Tutorial',
          url: 'https://youtube.com'
        }
      ];
      return res.json({ videos: mockVideos });
    }
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        q: `${topic} physics education tutorial`,
        part: 'snippet',
        type: 'video',
        maxResults: 5,
        order: 'relevance'
      }
    });
    
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
    
    res.json({ videos });
  } catch (error) {
    console.error('YouTube API error:', error);
    res.json({ videos: [] });
  }
});

const server = app.listen(5173, () => console.log('Server running on http://localhost:5173'));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
