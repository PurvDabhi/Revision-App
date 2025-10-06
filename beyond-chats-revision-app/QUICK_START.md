# 🚀 Quick Start Guide

## How to Run the Project

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install
cd ../server && npm install
cd ..
```

### 2. Add OpenAI API Key
Edit `server/.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application
```bash
npm run dev
```

### 4. Open in Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:5173

## ✅ What's Ready
- ✅ All dependencies configured
- ✅ TypeScript setup complete
- ✅ Responsive UI ready
- ⚠️ PDFs need to be added to `data/` directory

## 🎯 First Steps
1. Go to http://localhost:3000
2. Select a PDF from the source selector
3. Generate a quiz or start chatting with AI
4. View your progress in the dashboard

## 🔧 Troubleshooting
- **Port conflicts:** Change ports in `frontend/vite.config.ts` and `server/src/index.ts`
- **API errors:** Ensure OpenAI API key is valid and has credits
- **PDF issues:** Check that PDFs are in `data/` directory

## 📱 Features to Try
- Upload your own PDFs
- Generate different types of quizzes (MCQ, SAQ, LAQ)
- Chat with AI about course content
- Track your learning progress
- Get YouTube video recommendations