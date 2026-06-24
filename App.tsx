import React, { useState, useCallback } from 'react';
import StoryInputForm from './components/StoryInputForm';
import StoryDisplay from './components/StoryDisplay';
import LoadingView from './components/LoadingView';
import { generateStoryAndCover, regenerateCoverImage } from './services/geminiService';
import { Story, StoryLength, VoiceStyle } from './types';
import ThemeSwitcher from './components/ThemeSwitcher';

const App: React.FC = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ message: string; value: number }>({ message: '', value: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStory = useCallback(async (
    idea: string, 
    includeDialogues: boolean, 
    length: StoryLength,
    narratorVoice: VoiceStyle,
    characterVoice: VoiceStyle
  ) => {
    setIsLoading(true);
    setError(null);
    setStory(null);
    setProgress({ message: 'Iniciando...', value: 0 });

    try {
      const result = await generateStoryAndCover(
          idea, 
          includeDialogues, 
          length, 
          narratorVoice, 
          characterVoice, 
          (message, value) => setProgress({ message, value })
      );
      setStory(result);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Ocurrió un error inesperado.');
        }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerateCover = async () => {
    if (!story) return;
    
    try {
        const newCoverUrl = await regenerateCoverImage(story.originalIdea);
        setStory(prev => prev ? { ...prev, coverImageUrl: newCoverUrl } : null);
    } catch (err) {
        console.error("Failed to regenerate cover:", err);
        // Optional: Add a specific toast notification here
        // For now, we let the component handle the UI state reset via the promise rejection
        throw err; 
    }
  };

  const handleReset = () => {
    setStory(null);
    setError(null);
    setProgress({ message: '', value: 0 });
  };

  const renderContent = () => {
    if (isLoading && !progress.message) {
        // Fallback if progress hasn't started updates yet (rare)
       return <LoadingView />;
    }
    
    if (error) {
      return (
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-red-500 mb-4">¡Ups! Algo salió mal</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 text-base font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-indigo-500"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }
    if (story) {
      return <StoryDisplay story={story} onReset={handleReset} onRegenerateCover={handleRegenerateCover} />;
    }
    
    return (
        <StoryInputForm 
            onSubmit={handleGenerateStory} 
            isLoading={isLoading} 
            progressMessage={progress.message}
            progressValue={progress.value}
        />
    );
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 scrollbar-thin">
      <ThemeSwitcher />
      <div className="w-full transition-all duration-500 ease-in-out">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;