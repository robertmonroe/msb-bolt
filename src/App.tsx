import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { EngineSelector } from './components/EngineSelector';
import { CategoryTabs } from './components/CategoryTabs';
import { SearchContainer } from './components/SearchContainer';
import { AiSummary } from './components/AiSummary';
import { StatusBar } from './components/StatusBar';
import { Controls } from './components/Controls';
import { ColumnSelector } from './components/ColumnSelector';
import { HealthIndicator } from './components/HealthIndicator';
import { searchAPI, EngineResults, AISummary, HealthStatus } from './services/api';

interface SearchState {
  query: string;
  results: EngineResults;
  isSearching: boolean;
  activeSearches: number;
  completedSearches: number;
  error?: string;
}

// Mock search results for when backend is not available
const generateMockResults = (query: string, engines: string[], category: string = 'general'): EngineResults => {
  const mockResults: EngineResults = {};
  
  // Generate category-specific results
  const getCategoryResults = (engine: string) => {
    switch (category) {
      case 'images':
        return [
          {
            title: `${query} - High Quality Images`,
            url: `https://images.google.com/search?q=${encodeURIComponent(query)}`,
            snippet: `High-resolution images related to "${query}". Browse through thousands of quality images from various sources.`,
            timestamp: 'Image search',
            thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Stock Photos and Graphics`,
            url: `https://www.pexels.com/search/${encodeURIComponent(query)}/`,
            snippet: `Professional stock photos and graphics for "${query}". Free and premium images available for download.`,
            timestamp: 'Stock photos',
            thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Creative Commons Images`,
            url: `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(query)}`,
            snippet: `Free-to-use images related to "${query}" from Wikimedia Commons. High-quality images with proper licensing.`,
            timestamp: 'Free images',
            thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          }
        ];
      
      case 'videos':
        return [
          {
            title: `${query} - YouTube Videos`,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
            snippet: `Educational and entertaining videos about "${query}". Watch tutorials, documentaries, and expert discussions.`,
            timestamp: '2 hours ago',
            thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Documentary Films`,
            url: `https://www.vimeo.com/search?q=${encodeURIComponent(query)}`,
            snippet: `In-depth documentaries and professional videos about "${query}". High-quality content from creators worldwide.`,
            timestamp: '1 day ago',
            thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Educational Content`,
            url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(query)}`,
            snippet: `Educational videos and courses about "${query}". Learn from expert instructors and comprehensive curricula.`,
            timestamp: '3 days ago',
            thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          }
        ];
      
      case 'news':
        return [
          {
            title: `Breaking: Latest News on ${query}`,
            url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Latest breaking news and updates about "${query}". Real-time coverage from trusted news sources worldwide.`,
            timestamp: '15 minutes ago',
            thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Reuters Coverage`,
            url: `https://www.reuters.com/search/news?blob=${encodeURIComponent(query)}`,
            snippet: `Professional journalism and in-depth analysis of "${query}". Reliable reporting from Reuters correspondents.`,
            timestamp: '1 hour ago',
            thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - BBC News Report`,
            url: `https://www.bbc.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Comprehensive news coverage of "${query}" from BBC News. International perspective and expert analysis.`,
            timestamp: '2 hours ago',
            thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          }
        ];
      
      case 'shopping':
        return [
          {
            title: `Buy ${query} - Best Deals and Prices`,
            url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
            snippet: `Shop for "${query}" with competitive prices and fast shipping. Compare products, read reviews, and find the best deals.`,
            timestamp: 'Shopping',
            thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Price Comparison`,
            url: `https://www.google.com/shopping/search?q=${encodeURIComponent(query)}`,
            snippet: `Compare prices for "${query}" across multiple retailers. Find the best deals and save money on your purchase.`,
            timestamp: 'Price check',
            thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Customer Reviews`,
            url: `https://www.trustpilot.com/search?query=${encodeURIComponent(query)}`,
            snippet: `Read customer reviews and ratings for "${query}". Make informed purchasing decisions based on real user experiences.`,
            timestamp: 'Reviews',
            thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          }
        ];
      
      case 'map':
        return [
          {
            title: `${query} - Google Maps`,
            url: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
            snippet: `Find locations, directions, and local businesses related to "${query}". Interactive maps with real-time traffic and reviews.`,
            timestamp: 'Maps',
            thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Local Businesses`,
            url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(query)}`,
            snippet: `Local businesses and services for "${query}" in your area. Read reviews, see photos, and get contact information.`,
            timestamp: 'Local',
            thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - OpenStreetMap`,
            url: `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`,
            snippet: `Open-source mapping data for "${query}". Community-driven maps with detailed geographic information.`,
            timestamp: 'Open maps',
            thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          }
        ];
      
      case 'music':
        return [
          {
            title: `${query} - Spotify Music`,
            url: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
            snippet: `Listen to music related to "${query}" on Spotify. Discover songs, albums, artists, and playlists.`,
            timestamp: 'Music',
            thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - YouTube Music`,
            url: `https://music.youtube.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Stream music and music videos for "${query}". Official tracks, covers, and live performances.`,
            timestamp: 'Streaming',
            thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - SoundCloud`,
            url: `https://soundcloud.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Discover independent music and podcasts about "${query}". Support emerging artists and creators.`,
            timestamp: 'Independent',
            thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          }
        ];
      
      case 'social media':
        return [
          {
            title: `${query} - Twitter/X Discussions`,
            url: `https://twitter.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Real-time discussions and trending topics about "${query}" on Twitter/X. See what people are saying right now.`,
            timestamp: '5 minutes ago',
            thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - Reddit Communities`,
            url: `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
            snippet: `Community discussions and user experiences about "${query}". Join conversations and get diverse perspectives.`,
            timestamp: '1 hour ago',
            thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          },
          {
            title: `${query} - LinkedIn Professional Network`,
            url: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(query)}`,
            snippet: `Professional insights and industry discussions about "${query}". Connect with experts and thought leaders.`,
            timestamp: '3 hours ago',
            thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop'
          }
        ];
      
      default: // general
        return [
          {
            title: `${query} - Search Results from ${engine.charAt(0).toUpperCase() + engine.slice(1)}`,
            url: `https://www.${engine === 'duckduckgo' ? 'duckduckgo.com' : engine}.com/search?q=${encodeURIComponent(query)}`,
            snippet: `This is a demo result for "${query}". The backend API server is not currently running. To get real search results, please deploy the backend server to a platform like Railway, Render, or Heroku.`,
            timestamp: 'Demo result'
          },
          {
            title: `How to Setup MySearchBot™ Backend Server`,
            url: 'https://github.com/your-repo#deployment',
            snippet: 'Learn how to deploy the MySearchBot backend server to get real search results from multiple search engines. Includes step-by-step instructions for Railway, Render, and other platforms.',
            timestamp: 'Setup guide'
          },
          {
            title: `${query} - Wikipedia Reference`,
            url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
            snippet: `Wikipedia articles and references related to "${query}". This is a reliable source for factual information and background context.`,
            timestamp: 'Reference'
          }
        ];
    }
  };
  
  engines.forEach(engine => {
    mockResults[engine] = getCategoryResults(engine);
  });
  
  return mockResults;
};

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [columns, setColumns] = useState<number>(3);
  const [currentCategory, setCurrentCategory] = useState('general');
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [engineOrder, setEngineOrder] = useState(['google', 'bing', 'duckduckgo', 'yahoo', 'brave', 'mojeek']);
  const [draggedEngine, setDraggedEngine] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isHealthy, setIsHealthy] = useState<boolean>(false);

  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: {},
    isSearching: false,
    activeSearches: 0,
    completedSearches: 0
  });

  const [aiSummary, setAiSummary] = useState<AISummary & { isLoading: boolean; error?: string }>({
    summary: '',
    keyPoints: [],
    sources: [],
    isLoading: false
  });

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await searchAPI.healthCheck();
        setHealthStatus(health);
        setIsHealthy(health.status === 'OK');
        console.log('🟢 API is healthy:', health);
      } catch (error) {
        console.error('🔴 API health check failed:', error);
        setIsHealthy(false);
        setHealthStatus(null);
      }
    };

    checkHealth();
    
    // Check health every 2 minutes to avoid rate limiting
    const healthInterval = setInterval(checkHealth, 120000);
    
    return () => clearInterval(healthInterval);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      alert('Please enter a search query.');
      return;
    }
    
    if (selectedEngines.length === 0) {
      setSearchState(prev => ({
        ...prev,
        error: 'No Search Engine Selected'
      }));
      return;
    }

    console.log(`🚀 Starting search for: "${query}" in category: "${currentCategory}"`);

    setSearchState({
      query,
      results: {},
      isSearching: true,
      activeSearches: selectedEngines.length,
      completedSearches: 0,
      error: undefined
    });

    setAiSummary(prev => ({ 
      ...prev, 
      isLoading: false, 
      summary: '', 
      keyPoints: [], 
      sources: [],
      error: undefined 
    }));

    try {
      let results: EngineResults;
      
      if (isHealthy) {
        // Try real search if backend is available
        results = await searchAPI.performSearch(query, selectedEngines, currentCategory);
        console.log('📊 Real search results received:', Object.keys(results).length, 'engines');
      } else {
        // Use mock results if backend is not available
        console.log('🔄 Using mock results (backend not available)');
        results = generateMockResults(query, selectedEngines, currentCategory);
        
        // Simulate search delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setSearchState({
        query,
        results,
        isSearching: false,
        activeSearches: 0,
        completedSearches: selectedEngines.length
      });

      // Generate AI summary
      const totalResults = Object.values(results).reduce((sum, engineResults) => sum + engineResults.length, 0);
      
      if (totalResults > 0) {
        setAiSummary(prev => ({ ...prev, isLoading: true }));
        
        try {
          if (isHealthy) {
            const summary = await searchAPI.generateAISummary(query, results);
            setAiSummary({
              ...summary,
              isLoading: false
            });
            console.log('🤖 AI summary generated successfully');
          } else {
            // Generate mock AI summary
            setAiSummary({
              summary: `This is a demo summary for "${query}". The backend API server is not currently running, so this is mock data. To get real AI-powered summaries, please deploy the backend server to a cloud platform.`,
              keyPoints: [
                'Backend server is not currently deployed',
                'This is demonstration data only',
                'Deploy to Railway, Render, or Heroku for real results',
                'Real AI summaries use OpenAI or HuggingFace APIs',
                'Setup instructions available in the repository',
                'Mock results include direct search links'
              ],
              sources: selectedEngines,
              isLoading: false
            });
          }
        } catch (summaryError) {
          console.error('❌ AI Summary generation failed:', summaryError);
          setAiSummary(prev => ({
            ...prev,
            isLoading: false,
            error: summaryError.message || 'Failed to generate AI summary'
          }));
        }
      } else {
        console.log('⚠️ No results found, skipping AI summary');
        setAiSummary(prev => ({
          ...prev,
          summary: 'No search results were found to summarize. Try different search terms or select more search engines.',
          keyPoints: [
            'Try different or more specific search terms',
            'Check your spelling and try alternative keywords', 
            'Select additional search engines (DuckDuckGo and Mojeek are most reliable)',
            'Some search engines may be temporarily blocking automated requests',
            'Consider using broader or more general search terms'
          ],
          sources: [],
          isLoading: false
        }));
      }

    } catch (error) {
      console.error('💥 Search failed:', error);
      
      // Fallback to mock results even if real search fails
      const mockResults = generateMockResults(query, selectedEngines);
      
      setSearchState({
        query,
        results: mockResults,
        isSearching: false,
        activeSearches: 0,
        completedSearches: selectedEngines.length,
        error: `Search service unavailable: ${error.message}`
      });
      
      setAiSummary({
        summary: `Search service is currently unavailable. This may be because the backend server is not deployed or there are connectivity issues. Mock results are provided to demonstrate the interface.`,
        keyPoints: [
          'Backend API server may not be deployed',
          'Check deployment status and server logs',
          'Mock results provided for demonstration',
          'Deploy backend to Railway, Render, or Heroku',
          'Ensure environment variables are configured',
          'Contact support if issues persist'
        ],
        sources: selectedEngines,
        isLoading: false,
        error: 'Using fallback results due to API unavailability'
      });
    }
  };

  const handleRefreshSummary = async () => {
    if (!searchState.query || Object.keys(searchState.results).length === 0) {
      alert('No search results available to summarize.');
      return;
    }

    setAiSummary(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      if (isHealthy) {
        const summary = await searchAPI.generateAISummary(searchState.query, searchState.results);
        setAiSummary({
          ...summary,
          isLoading: false
        });
        console.log('🔄 AI summary refreshed successfully');
      } else {
        // Generate new mock summary
        setAiSummary({
          summary: `Refreshed demo summary for "${searchState.query}". The backend server is not available, so this is mock data. Deploy the backend to get real AI-powered summaries.`,
          keyPoints: [
            'This is a refreshed demo summary',
            'Backend deployment required for real AI summaries',
            'Multiple deployment options available',
            'Real summaries use advanced AI models',
            'Configuration guide available in documentation'
          ],
          sources: Object.keys(searchState.results),
          isLoading: false
        });
      }
    } catch (error) {
      console.error('❌ AI Summary refresh failed:', error);
      setAiSummary(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error.message || 'Failed to refresh AI summary'
      }));
    }
  };

  const handleEngineToggle = (engineId: string) => {
    setSelectedEngines(prev =>
      prev.includes(engineId)
        ? prev.filter(id => id !== engineId)
        : [...prev, engineId]
    );
  };

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
  };

  const handleReset = () => {
    setEngineOrder(['google', 'bing', 'duckduckgo', 'yahoo', 'brave', 'mojeek']);
    setSelectedEngines([]);
    setColumns(3);
    setCurrentCategory('general');
    setSearchState({
      query: '',
      results: {},
      isSearching: false,
      activeSearches: 0,
      completedSearches: 0
    });
    setAiSummary({
      summary: '',
      keyPoints: [],
      sources: [],
      isLoading: false
    });
  };

  const handleDragStart = (engine: string) => {
    setDraggedEngine(engine);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetEngine: string) => {
    e.preventDefault();
    if (!draggedEngine || draggedEngine === targetEngine) return;

    const newOrder = [...engineOrder];
    const draggedIndex = newOrder.indexOf(draggedEngine);
    const targetIndex = newOrder.indexOf(targetEngine);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedEngine);

    setEngineOrder(newOrder);
    setDraggedEngine(null);
  };

  const orderedSelectedEngines = engineOrder.filter(engine => selectedEngines.includes(engine));

  const getGridClasses = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 lg:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
      default:
        return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            MySearchBot™
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Multi-Engine Search with AI-Powered Summaries
          </p>
          <HealthIndicator isHealthy={isHealthy} theme={theme} />
          <Controls
            theme={theme}
            onThemeToggle={handleThemeToggle}
            onReset={handleReset}
          />
        </div>

        {/* Backend Status Warning */}
        {!isHealthy && (
          <div className={`mb-6 p-4 rounded-lg border ${theme === 'dark' ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Backend Server Not Available</p>
                <p className="text-sm mt-1">
                  The search results shown are demonstrations. To get real search results, deploy the backend server to Railway, Render, or Heroku. 
                  <a 
                    href="https://github.com/your-repo#deployment" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline ml-1 hover:no-underline"
                  >
                    View setup instructions →
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Interface */}
        <div className="space-y-6">
          <EngineSelector
            selectedEngines={selectedEngines}
            onEngineToggle={handleEngineToggle}
            theme={theme}
          />

          <SearchBar
            onSearch={handleSearch}
            isSearching={searchState.isSearching}
            theme={theme}
          />

          <CategoryTabs
            currentCategory={currentCategory}
            onCategoryChange={setCurrentCategory}
            theme={theme}
          />
        </div>

        {/* Centered Error Modal */}
        {searchState.error && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSearchState(prev => ({ ...prev, error: undefined }))}
          >
            <div className={`max-w-md w-full mx-4 p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AlertCircle className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Error
                  </h3>
                </div>
                <button
                  onClick={() => setSearchState(prev => ({ ...prev, error: undefined }))}
                  className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchState.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {(searchState.query || searchState.isSearching) && (
          <div className="mt-8 space-y-6">
            {/* AI Summary */}
            <AiSummary
              summary={aiSummary.summary}
              keyPoints={aiSummary.keyPoints}
              sources={aiSummary.sources}
              isLoading={aiSummary.isLoading}
              error={aiSummary.error}
              theme={theme}
              onRefresh={handleRefreshSummary}
            />

            {/* Column Selector and Search Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Search Results {!isHealthy && '(Demo)'}
                </h2>
                <ColumnSelector
                  columns={columns}
                  onColumnsChange={handleColumnsChange}
                  theme={theme}
                />
              </div>

              <div className={`grid gap-6 ${getGridClasses()}`}>
                {orderedSelectedEngines.map(engine => (
                  <SearchContainer
                    key={engine}
                    engine={engine}
                    results={searchState.results[engine] || []}
                    isLoading={searchState.isSearching && !searchState.results[engine]}
                    theme={theme}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Status Bar */}
        {(searchState.isSearching || searchState.query) && (
          <StatusBar
            activeSearches={searchState.activeSearches}
            completedSearches={searchState.completedSearches}
            totalSearches={selectedEngines.length}
            theme={theme}
          />
        )}

        {/* Health Status Debug Info (only in development) */}
        {healthStatus && import.meta.env.DEV && (
          <div className={`mt-8 p-4 rounded-lg text-xs ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <details>
              <summary className="cursor-pointer font-medium mb-2">API Health Status (Dev Only)</summary>
              <pre className="whitespace-pre-wrap">{JSON.stringify(healthStatus, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;