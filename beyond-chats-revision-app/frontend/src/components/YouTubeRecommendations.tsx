import React, { useState, useEffect } from 'react';
import { Youtube, ExternalLink } from 'lucide-react';
import { apiService } from '../api';
import { YouTubeVideo } from '../types';

interface YouTubeRecommendationsProps {
  selectedPDF: string;
}

export default function YouTubeRecommendations({ selectedPDF }: YouTubeRecommendationsProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');

  const searchVideos = async (topic: string) => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiService.getYouTubeRecommendations(topic);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to fetch YouTube videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchVideos(searchTopic);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-search based on selected PDF
  useEffect(() => {
    if (selectedPDF && selectedPDF !== 'all') {
      const topic = selectedPDF.replace('.pdf', '').replace(/[-_]/g, ' ');
      setSearchTopic(topic);
      searchVideos(topic);
    }
  }, [selectedPDF]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Youtube className="w-5 h-5 text-red-600" />
        YouTube Recommendations
      </h2>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for educational videos..."
            className="flex-1 p-3 border rounded-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchTopic.trim()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Youtube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Search for educational videos related to your coursebook topics.</p>
        </div>
      )}
    </div>
  );
}