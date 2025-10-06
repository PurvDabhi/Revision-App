import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, MessageCircle, Youtube, Menu, X } from 'lucide-react';
import SourceSelector from './components/SourceSelector';
import PDFViewer from './components/PDFViewer';
import QuizGenerator from './components/QuizGenerator';
import ProgressDashboard from './components/ProgressDashboard';
import ChatInterface from './components/ChatInterface';
import YouTubeRecommendations from './components/YouTubeRecommendations';

function Navigation({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: BookOpen, label: 'Study' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/videos', icon: Youtube, label: 'Videos' }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Beyond Chats</h1>
          <p className="text-sm text-gray-600">Revision App</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

function StudyPage({ selectedPDF, onPDFSelect }: { selectedPDF: string; onPDFSelect: (pdf: string) => void }) {
  const [activeTab, setActiveTab] = useState<'selector' | 'viewer'>('selector');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('selector')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'selector' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Source Selection
        </button>
        <button
          onClick={() => setActiveTab('viewer')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'viewer' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
          disabled={!selectedPDF || selectedPDF === 'all'}
        >
          PDF Viewer
        </button>
      </div>

      {activeTab === 'selector' && (
        <SourceSelector selectedPDF={selectedPDF} onPDFSelect={onPDFSelect} />
      )}
      
      {activeTab === 'viewer' && selectedPDF && selectedPDF !== 'all' && (
        <PDFViewer pdfUrl={`http://localhost:5173/data/${selectedPDF}`} />
      )}
    </div>
  );
}

function AppContent() {
  const [selectedPDF, setSelectedPDF] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="lg:ml-64 p-4 lg:p-8">
        <Routes>
          <Route 
            path="/" 
            element={<StudyPage selectedPDF={selectedPDF} onPDFSelect={setSelectedPDF} />} 
          />
          <Route 
            path="/quiz" 
            element={<QuizGenerator selectedPDF={selectedPDF} />} 
          />
          <Route 
            path="/progress" 
            element={<ProgressDashboard />} 
          />
          <Route 
            path="/chat" 
            element={<ChatInterface selectedPDF={selectedPDF} />} 
          />
          <Route 
            path="/videos" 
            element={<YouTubeRecommendations selectedPDF={selectedPDF} />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}
