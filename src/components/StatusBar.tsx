import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface StatusBarProps {
  activeSearches: number;
  completedSearches: number;
  totalSearches: number;
  theme: 'light' | 'dark';
}

export const StatusBar: React.FC<StatusBarProps> = ({ activeSearches, completedSearches, totalSearches, theme }) => {
  const progress = totalSearches > 0 ? (completedSearches / totalSearches) * 100 : 0;
  
  return (
    <div className={`fixed bottom-4 right-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-3 min-w-64 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {activeSearches > 0 ? (
            <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mr-2`} />
          ) : (
            <CheckCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'} mr-2`} />
          )}
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {activeSearches > 0 ? 'Searching...' : 'Search Complete'}
          </span>
        </div>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {completedSearches}/{totalSearches}
        </span>
      </div>
      
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
        <div
          className={`h-2 rounded-full transition-all duration-300 ${activeSearches > 0 ? 'bg-blue-500' : 'bg-green-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {activeSearches > 0 && (
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
          {activeSearches} searches in progress
        </div>
      )}
    </div>
  );
};