import React from 'react';
import { CheckCircle, AlertCircle, XCircle, ExternalLink } from 'lucide-react';

interface HealthIndicatorProps {
  isHealthy: boolean;
  theme: 'light' | 'dark';
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ isHealthy, theme }) => {
  const handleSetupClick = () => {
    window.open('https://github.com/your-repo#deployment', '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      {isHealthy ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className={`text-xs font-medium text-green-500`}>
            API Online
          </span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 text-red-500" />
          <span className={`text-xs font-medium text-red-500`}>
            API Offline
          </span>
          <button
            onClick={handleSetupClick}
            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 underline"
            title="Setup Instructions"
          >
            Setup
            <ExternalLink className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
};