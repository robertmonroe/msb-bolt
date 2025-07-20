import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryTabsProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  theme: 'light' | 'dark';
}

const categories: Category[] = [
  { id: 'general', name: 'General', icon: 'fas fa-search' },
  { id: 'images', name: 'Images', icon: 'fas fa-images' },
  { id: 'videos', name: 'Videos', icon: 'fas fa-video' },
  { id: 'news', name: 'News', icon: 'fas fa-newspaper' },
  { id: 'map', name: 'Map', icon: 'fas fa-map-marker-alt' },
  { id: 'music', name: 'Music', icon: 'fas fa-music' },
  { id: 'shopping', name: 'Shopping', icon: 'fas fa-shopping-bag' },
  { id: 'social media', name: 'Social Media', icon: 'fas fa-users' }
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ currentCategory, onCategoryChange, theme }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const isActive = currentCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-white shadow-lg'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              style={isActive ? { backgroundColor: '#29248F' } : {}}
            >
              <i className={`${category.icon} mr-3`}></i>
              <span className="text-base font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};