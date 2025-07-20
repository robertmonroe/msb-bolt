import React, { useState, useRef } from 'react';
import { ExternalLink, Clock, GripVertical } from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  timestamp?: string;
  thumbnail?: string;
}

interface SearchContainerProps {
  engine: string;
  results: SearchResult[];
  isLoading: boolean;
  theme: 'light' | 'dark';
  onDragStart: (engine: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetEngine: string) => void;
}

const engineIcons: Record<string, string> = {
  google: '/google.png',
  bing: '/bing.png',
  duckduckgo: '/duckduckgo.png',
  yahoo: '/yahoo.png',
  brave: '/brave.png',
  mojeek: '/mojeek.png'
};

const engineColors: Record<string, string> = {
  google: 'border-red-500',
  bing: 'border-blue-500',
  duckduckgo: 'border-orange-500',
  yahoo: 'border-purple-500',
  brave: 'border-orange-600',
  mojeek: 'border-green-600'
};

export const SearchContainer: React.FC<SearchContainerProps> = ({
  engine,
  results,
  isLoading,
  theme,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(engine);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, engine);
  };

  return (
    <div
      ref={containerRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl border-2 ${engineColors[engine] || 'border-gray-300'} shadow-lg transition-all duration-300 hover:shadow-xl ${isDragging ? 'opacity-50 scale-95' : ''} overflow-hidden`}
    >
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} cursor-move`}>
        <div className="flex items-center">
          <img 
            src={engineIcons[engine]} 
            alt={engine}
            className="w-5 h-5 mr-2"
          />
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} capitalize`}>
            {engine}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {isLoading ? 'Loading...' : `${results.length} results`}
          </div>
          <GripVertical className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                  <div className={`h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                  <div className={`h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="group">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-3 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} group-hover:shadow-md`}
                  >
                    <div className="flex gap-3">
                      {result.thumbnail && (
                        <img
                          src={result.thumbnail}
                          alt=""
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} group-hover:underline line-clamp-2`}>
                            {result.title}
                          </h4>
                          <ExternalLink className="w-3 h-3 text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1 line-clamp-2`}>
                          {result.snippet}
                        </p>
                        {result.timestamp && (
                          <div className="flex items-center mt-2">
                            <Clock className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-400">{result.timestamp}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <img 
                src={engineIcons[engine]} 
                alt={engine}
                className="w-8 h-8 mx-auto mb-2 opacity-50"
              />
              <p>No results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};