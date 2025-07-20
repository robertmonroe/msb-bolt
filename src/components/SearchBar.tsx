import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  theme: 'light' | 'dark';
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching, theme }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className={`relative flex items-center rounded-full shadow-lg ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`} style={{ borderRadius: '.75rem', height: '60px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web..."
          disabled={isSearching}
          className={`flex-1 px-6 text-lg outline-none border-none h-full ${
            theme === 'dark'
              ? 'bg-gray-800 text-white placeholder-gray-400'
              : 'bg-white text-gray-900 placeholder-gray-500'
          } ${isSearching ? 'cursor-not-allowed' : ''}`}
          style={{ borderRadius: '.75rem 0 0 .75rem' }}
        />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className={`flex items-center justify-center px-6 transition-all duration-200 border-none h-full ${
            isSearching || !query.trim()
              ? 'cursor-not-allowed text-white'
              : theme === 'dark'
              ? 'hover:opacity-90 text-white'
              : 'hover:opacity-90 text-white'
          }`}
          style={{ 
            backgroundColor: '#29248F',
            borderRadius: '0 .75rem .75rem 0'
          }}
        >
          <Search className="w-5 h-5" />
          <span className="ml-2 font-medium">Search</span>
        </button>
      </div>
    </form>
  );
};