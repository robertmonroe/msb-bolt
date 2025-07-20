import React from 'react';

interface Engine {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface EngineSelectorProps {
  selectedEngines: string[];
  onEngineToggle: (engineId: string) => void;
  theme: 'light' | 'dark';
}

const engines: Engine[] = [
  { 
    id: 'google', 
    name: 'Google', 
    icon: '/google.png', 
    color: 'text-red-500' 
  },
  { 
    id: 'bing', 
    name: 'Bing', 
    icon: '/bing.png', 
    color: 'text-blue-500' 
  },
  { 
    id: 'duckduckgo', 
    name: 'DuckDuckGo', 
    icon: '/duckduckgo.png', 
    color: 'text-orange-500' 
  },
  { 
    id: 'yahoo', 
    name: 'Yahoo', 
    icon: '/yahoo.png', 
    color: 'text-purple-500' 
  },
  { 
    id: 'brave', 
    name: 'Brave', 
    icon: '/brave.png', 
    color: 'text-orange-600' 
  },
  { 
    id: 'mojeek', 
    name: 'Mojeek', 
    icon: '/mojeek.png', 
    color: 'text-green-600' 
  }
];

export const EngineSelector: React.FC<EngineSelectorProps> = ({ selectedEngines, onEngineToggle, theme }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3 text-center`} style={{ fontSize: '1rem' }}>
        Select Search Engines ({selectedEngines.length} selected)
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {engines.map((engine) => {
          const isSelected = selectedEngines.includes(engine.id);
          
          return (
            <label
              key={engine.id}
              className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 border shadow-md ${
                isSelected
                  ? 'border-gray-300 shadow-lg'
                  : theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 border-gray-600 transition-all duration-100'
                  : 'bg-white hover:bg-gray-100 border-gray-300 transition-all duration-100'
              }`}
              style={isSelected ? { backgroundColor: '#29248F', color: 'white' } : {}}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onEngineToggle(engine.id)}
                className="sr-only"
              />
              <img 
                src={engine.icon} 
                alt={engine.name}
                className="w-8 h-8 mr-3"
              />
              <span 
                className="font-medium" 
                style={{ 
                  fontSize: '1rem',
                  color: isSelected ? 'white' : (theme === 'dark' ? 'white' : '#374151')
                }}
              >
                {engine.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};