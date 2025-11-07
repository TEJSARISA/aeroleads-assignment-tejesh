
import React from 'react';
import { OutputTab } from '../types';
import CodeBlock from './CodeBlock';

interface OutputPanelProps {
  pythonScript: string;
  setupGuide: string;
  isLoading: boolean;
  error: string | null;
  activeTab: OutputTab;
  setActiveTab: (tab: OutputTab) => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({
  pythonScript,
  setupGuide,
  isLoading,
  error,
  activeTab,
  setActiveTab
}) => {
  const tabs = [OutputTab.PYTHON_SCRIPT, OutputTab.SETUP_GUIDE];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg className="animate-spin h-10 w-10 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium">Generating your script...</p>
          <p className="text-sm">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-md text-red-200">
          <h3 className="font-bold mb-2">Generation Failed</h3>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    if (!pythonScript && !setupGuide) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="text-lg font-medium">Your generated code will appear here.</p>
          <p className="text-sm">Configure your options and click "Generate".</p>
        </div>
      );
    }

    if (activeTab === OutputTab.PYTHON_SCRIPT) {
      return <CodeBlock language="python" code={pythonScript} filename="scraper.py" />;
    }

    if (activeTab === OutputTab.SETUP_GUIDE) {
      return <CodeBlock language="markdown" code={setupGuide} filename="README.md" />;
    }
    
    return null;
  };

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700 flex flex-col min-h-[600px] lg:min-h-full">
      <div className="flex border-b border-gray-700 px-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={!pythonScript}
            className={`py-3 px-5 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-gray-400 hover:text-white'
            } disabled:text-gray-600 disabled:cursor-not-allowed`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-6 flex-grow relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputPanel;
