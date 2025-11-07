
import React from 'react';
import type { ScraperConfig } from '../types';
import Checkbox from './Checkbox';

interface ConfigPanelProps {
  config: ScraperConfig;
  setConfig: React.Dispatch<React.SetStateAction<ScraperConfig>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onGenerate, isLoading }) => {
  const handleCheckboxChange = (field: keyof ScraperConfig) => {
    setConfig(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(prev => ({ ...prev, profileUrls: event.target.value }));
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-6">1. Configure Scraper Features</h2>

      <div className="space-y-5 mb-8">
        <Checkbox
          id="proxyRotation"
          label="Proxy Rotation"
          description="Rotate through a list of proxies to avoid IP blocks."
          checked={config.proxyRotation}
          onChange={() => handleCheckboxChange('proxyRotation')}
        />
        <Checkbox
          id="randomUserAgent"
          label="Random User-Agent"
          description="Use fake user-agents to mimic different browsers."
          checked={config.randomUserAgent}
          onChange={() => handleCheckboxChange('randomUserAgent')}
        />
        <Checkbox
          id="dynamicWaiting"
          label="Dynamic Waiting"
          description="Add random delays between actions to appear more human."
          checked={config.dynamicWaiting}
          onChange={() => handleCheckboxChange('dynamicWaiting')}
        />
        <Checkbox
          id="retryMechanism"
          label="Retry Mechanism"
          description="Implement a simple retry logic for failed requests."
          checked={config.retryMechanism}
          onChange={() => handleCheckboxChange('retryMechanism')}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="profileUrls" className="block text-lg font-medium text-gray-300 mb-2">
          2. LinkedIn Profile URLs
        </label>
        <p className="text-sm text-gray-400 mb-3">Enter one public LinkedIn profile URL per line (around 20 recommended).</p>
        <textarea
          id="profileUrls"
          rows={10}
          className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          value={config.profileUrls}
          onChange={handleTextareaChange}
          placeholder="e.g., https://www.linkedin.com/in/username/"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200 ease-in-out flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : 'Generate Python Script & Guide'}
      </button>
    </div>
  );
};

export default ConfigPanel;
