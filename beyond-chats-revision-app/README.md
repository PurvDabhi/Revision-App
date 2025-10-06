# Beyond Chats — Student Revision App

A comprehensive, responsive web application that helps school students revise from their coursebooks using AI-powered features.

## 🚀 Features Implemented

### ✅ Must-Have Features (100% Complete)

1. **Source Selector**
   - Choose between all uploaded PDFs or specific PDF
   - Pre-seeded with NCERT Class XI Physics support
   - Upload custom PDF coursebooks
   - Real-time PDF processing and content extraction

2. **PDF Viewer**
   - Interactive PDF display with zoom controls
   - Page navigation (previous/next)
   - Split view alongside other features
   - Responsive design for mobile and desktop

3. **Quiz Generator Engine**
   - Generate MCQs, SAQs, and LAQs from PDF content
   - Configurable question count (3, 5, or 10 questions)
   - Real-time scoring and feedback
   - Detailed explanations for each answer
   - Progress tracking and attempt history

4. **Progress Tracking**
   - Comprehensive dashboard with charts and statistics
   - Track strengths and weaknesses through quiz performance
   - Visual progress indicators and trends
   - Recent attempts history

### ✅ Nice-to-Have Features (100% Complete)

1. **Chat UI (ChatGPT-inspired)**
   - AI-powered virtual teaching assistant
   - Session management with chat history
   - Mobile-responsive design
   - Context-aware responses based on selected PDFs

2. **RAG Answers with Citations**
   - PDF content ingestion with chunking
   - AI responses cite relevant content
   - Context-aware answers from coursebook material

3. **YouTube Video Recommender**
   - Educational video recommendations
   - Auto-search based on selected PDF topics
   - Direct links to YouTube content
   - Thumbnail previews and descriptions

---

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **React PDF** for PDF viewing
- **Recharts** for progress visualization
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Node.js** with Express and TypeScript
- **OpenAI GPT-3.5** for quiz generation and chat
- **PDF-Parse** for content extraction
- **SQLite** for data persistence
- **Multer** for file uploads
- **YouTube Data API** for video recommendations

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (required for AI features)
- YouTube Data API key (optional for video recommendations)

### 📝 Step-by-Step Setup

1. **Install Dependencies:**
```bash
# Install all dependencies at once
npm install
cd frontend && npm install
cd ../server && npm install
cd ..
```

2. **Add Your OpenAI API Key:**
```bash
# Edit server/.env file and add:
OPENAI_API_KEY=your_actual_openai_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here  # Optional
```

3. **Add PDF Files:**
   - Download NCERT Physics PDFs from https://ncert.nic.in/textbook.php?keph1=0-8
   - Place PDF files in the `data/` directory
   - Or use the upload feature in the app

4. **Run the Application:**
```bash
npm run dev
```

### 🌐 Access the App
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5173

### 🔑 Getting OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create account and generate API key
3. Add it to `server/.env` file

## 🏗 Project Structure

```
beyond-chats-revision-app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── api.ts          # API service layer
│   │   └── App.tsx         # Main application
│   └── package.json
├── server/                  # Express backend
│   ├── src/
│   │   └── index.ts        # Main server file
│   └── package.json
├── data/                   # PDF storage directory
└── README.md
```

## 🎯 How It Works

1. **PDF Processing**: Upload PDFs → Extract text content → Store in database with chunks
2. **Quiz Generation**: Select source → AI generates questions → Interactive quiz interface → Score tracking
3. **Chat Assistant**: Context-aware AI responses using PDF content as reference
4. **Progress Tracking**: SQLite database stores all attempts → Visual dashboard with charts
5. **Video Recommendations**: YouTube API integration for educational content discovery

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
- `OPENAI_API_KEY`: Required for AI features
- `YOUTUBE_API_KEY`: Optional for video recommendations
- `NODE_ENV=production`

## 🤖 LLM Usage

This project makes extensive use of LLM tools for rapid development:

### AI-Assisted Development
- **Code Generation**: Used Claude/ChatGPT for component scaffolding and boilerplate
- **API Integration**: AI helped with OpenAI and YouTube API implementations
- **Styling**: Tailwind CSS classes and responsive design patterns
- **TypeScript**: Interface definitions and type safety

### AI Features in the App
- **Quiz Generation**: OpenAI GPT-3.5 creates contextual questions from PDF content
- **Chat Assistant**: AI-powered teaching companion with RAG capabilities
- **Content Processing**: Intelligent text chunking and context extraction

## ✅ What's Implemented

- [x] PDF upload and processing
- [x] Source selection (all PDFs / specific PDF)
- [x] Interactive PDF viewer with controls
- [x] AI-powered quiz generation (MCQ, SAQ, LAQ)
- [x] Real-time scoring and explanations
- [x] Progress tracking with visual dashboard
- [x] Chat interface with session management
- [x] RAG-based AI responses with PDF context
- [x] YouTube video recommendations
- [x] Fully responsive design
- [x] Mobile-friendly navigation
- [x] SQLite database for persistence
- [x] Error handling and loading states

## 🔄 What Could Be Enhanced

- Vector embeddings for better RAG performance
- User authentication and multi-user support
- Advanced analytics and learning insights
- Offline mode capabilities
- More question types and difficulty levels
- Integration with more educational platforms

## 🎨 Design Decisions

1. **Single-page application** with client-side routing for smooth UX
2. **Component-based architecture** for maintainability and reusability
3. **SQLite database** for simplicity and portability
4. **Tailwind CSS** for rapid, consistent styling
5. **TypeScript** throughout for type safety and better DX
6. **Responsive-first design** ensuring mobile compatibility

## 📱 Responsive Design

- Mobile-first approach with collapsible sidebar
- Touch-friendly interface elements
- Optimized layouts for tablets and phones
- Progressive enhancement for larger screens

## 🔧 Development Tools Used

- **Vite**: Fast development server and building
- **ESLint & Prettier**: Code quality and formatting
- **TypeScript**: Type safety and better IDE support
- **Concurrently**: Run frontend and backend simultaneously

Built with ❤️ for the Beyond Chats assignment
