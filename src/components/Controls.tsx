import React from 'react';
import { Sun, Moon, RotateCcw } from 'lucide-react';

interface ControlsProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  theme,
  onThemeToggle,
  onReset
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onReset}
        className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}
        title="Reset Layout"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      
      <button
        onClick={onThemeToggle}
        className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    </div>
  );
};