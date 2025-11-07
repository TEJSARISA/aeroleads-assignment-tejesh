
import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface CodeBlockProps {
  code: string;
  language: 'python' | 'markdown';
  filename: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-900 rounded-md overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-700/50">
        <span className="text-sm text-gray-400 font-mono">{filename}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white transition"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-auto p-4 flex-grow">
        <pre className="text-sm">
          <code className={`language-${language} whitespace-pre-wrap`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
