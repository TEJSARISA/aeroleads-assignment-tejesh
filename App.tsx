
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { ScraperConfig } from './types';
import { OutputTab } from './types';
import ConfigPanel from './components/ConfigPanel';
import OutputPanel from './components/OutputPanel';

const App: React.FC = () => {
  const [scraperConfig, setScraperConfig] = useState<ScraperConfig>({
    proxyRotation: true,
    randomUserAgent: true,
    dynamicWaiting: true,
    retryMechanism: true,
    profileUrls: [
      'https://www.linkedin.com/in/williamhgates/',
      'https://www.linkedin.com/in/satyanadella/',
      'https://www.linkedin.com/in/sundarpichai/',
      'https://www.linkedin.com/in/jeffbezos/',
      'https://www.linkedin.com/in/elonmusk/',
      'https://www.linkedin.com/in/sherylsandberg/',
      'https://www.linkedin.com/in/marissamayr/',
      'https://www.linkedin.com/in/tim-cook/',
      'https://www.linkedin.com/in/reidhoffman/',
      'https://www.linkedin.com/in/brianchesky/',
      'https://www.linkedin.com/in/sallie-krawcheck-b35699',
      'https://www.linkedin.com/in/daniel-ek-1b559bb',
      'https://www.linkedin.com/in/arvindkrishna/',
      'https://www.linkedin.com/in/melindagates/',
      'https://www.linkedin.com/in/richardbranson/',
      'https://www.linkedin.com/in/susan-wojcicki-b16a203',
      'https://www.linkedin.com/in/shantanu-narayen-35848a',
      'https://www.linkedin.com/in/safra-catz/',
      'https://www.linkedin.com/in/mary-barra/',
      'https://www.linkedin.com/in/ginnirometty/'
    ].join('\n'),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pythonScript, setPythonScript] = useState<string>('');
  const [setupGuide, setSetupGuide] = useState<string>('');
  const [activeTab, setActiveTab] = useState<OutputTab>(OutputTab.PYTHON_SCRIPT);

  const generateScript = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPythonScript('');
    setSetupGuide('');

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const promptParts = [
        "You are an expert Python developer specializing in web scraping, tasked with helping a junior developer.",
        "Generate a JSON object with two keys: `python_script` and `setup_guide`.",
        "The `python_script` value must be a single string containing a fully commented Python 3 script named `scraper.py`.",
        "The script must use Selenium to scrape public data (Name, Title, Location, and URL) from a list of LinkedIn profiles and save it to a `profiles.csv` file.",
        `The script should be pre-filled with the following URLs:\n${scraperConfig.profileUrls}`,
        "The code must be extremely clear, with comments explaining each step for a beginner.",
        "The script MUST be compatible with macOS (Chrome + ChromeDriver).",
      ];
      
      if (scraperConfig.proxyRotation) {
        promptParts.push("Implement proxy rotation using a placeholder list of proxies. Handle proxy failures gracefully.");
      }
      if (scraperConfig.randomUserAgent) {
        promptParts.push("Use the `fake-useragent` package to randomize the User-Agent header for each request.");
      }
      if (scraperConfig.dynamicWaiting) {
        promptParts.push("Include random sleep times (between 2 to 5 seconds) between actions to mimic human behavior.");
      }
      if (scraperConfig.retryMechanism) {
        promptParts.push("Implement a simple retry mechanism (e.g., up to 3 retries) if a proxy or request fails, before skipping a profile.");
      }

      promptParts.push("The `setup_guide` value must be a single string in Markdown format.");
      promptParts.push("This guide must provide clear, step-by-step instructions for a beginner on macOS to set up their environment and run the script.");
      promptParts.push("The guide must include: 1. Setting up a `venv`. 2. Installing dependencies with `pip install selenium pandas fake-useragent`. 3. A link and instructions to download the correct ChromeDriver. 4. How to prepare the list of LinkedIn profile URLs. 5. How to run the script using `python3 scraper.py`. 6. How to verify the output in `profiles.csv` and handle common errors.");

      promptParts.push("The final output must be a valid JSON object matching the specified schema. Do not include any text or markdown formatting outside of the JSON object itself.");

      const fullPrompt = promptParts.join('\n');

      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                python_script: { type: Type.STRING },
                setup_guide: { type: Type.STRING },
              },
              required: ["python_script", "setup_guide"],
            },
          },
      });

      const responseText = response.text.trim();
      const result = JSON.parse(responseText);

      if (result.python_script && result.setup_guide) {
        setPythonScript(result.python_script);
        setSetupGuide(result.setup_guide);
        setActiveTab(OutputTab.PYTHON_SCRIPT);
      } else {
        throw new Error("Invalid response format from API.");
      }
    } catch (e: any) {
      setError(`An error occurred: ${e.message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [scraperConfig]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            AeroLeads Scraper Script Generator
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Configure your LinkedIn profile scraper and let AI generate the Python script and setup guide for you.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ConfigPanel
            config={scraperConfig}
            setConfig={setScraperConfig}
            onGenerate={generateScript}
            isLoading={isLoading}
          />
          <OutputPanel
            pythonScript={pythonScript}
            setupGuide={setupGuide}
            isLoading={isLoading}
            error={error}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </main>
        
        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by Gemini API. Built for junior developers.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
