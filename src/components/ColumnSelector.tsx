import React from 'react';
import { Grid } from 'lucide-react';

interface ColumnSelectorProps {
  columns: number;
  onColumnsChange: (columns: number) => void;
  theme: 'light' | 'dark';
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  onColumnsChange,
  theme
}) => {
  return (
    <div className={`flex items-center rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-sm overflow-hidden`}>
      <div className={`px-3 py-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium flex items-center gap-1`}>
        <Grid className="w-4 h-4" />
        <span>Columns:</span>
      </div>
      {[1, 2, 3, 4].map((num) => (
        <button
          key={num}
          onClick={() => onColumnsChange(num)}
          className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
            columns === num
              ? theme === 'dark'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white'
              : theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={`${num} Column${num > 1 ? 's' : ''}`}
        >
          {num}
        </button>
      ))}
      {[5, 6].map((num) => (
        <button
          key={num}
          onClick={() => onColumnsChange(num)}
          className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
            columns === num
              ? theme === 'dark'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white'
              : theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={`${num} Column${num > 1 ? 's' : ''}`}
        >
          {num}
        </button>
      ))}
    </div>
  );
};