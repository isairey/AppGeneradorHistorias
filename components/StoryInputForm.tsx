import React, { useState } from 'react';
import { StoryLength, VoiceStyle, voiceStyles } from '../types';

interface StoryInputFormProps {
  onSubmit: (idea: string, includeDialogues: boolean, length: StoryLength, narratorVoice: VoiceStyle, characterVoice: VoiceStyle) => void;
  isLoading: boolean;
  progressMessage?: string;
  progressValue?: number;
}

interface VoiceSelectorProps {
    label: string;
    role: string;
    value: VoiceStyle;
    onChange: (value: VoiceStyle) => void;
    disabled: boolean;
    options: { id: VoiceStyle; name: string }[];
    icon: React.ReactNode;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ label, role, value, onChange, disabled, options, icon }) => (
    <div className="flex flex-col h-full p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                {icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {role}
            </span>
        </div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
        </label>
        <div className="relative mt-auto">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as VoiceStyle)}
                disabled={disabled}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
            >
                {options.map((voice) => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
            </select>
        </div>
    </div>
);

// Icons
const NarratorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const CharacterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const StoryInputForm: React.FC<StoryInputFormProps> = ({ onSubmit, isLoading, progressMessage = "Generando...", progressValue = 0 }) => {
  const [idea, setIdea] = useState('');
  const [includeDialogues, setIncludeDialogues] = useState(false);
  const [length, setLength] = useState<StoryLength>('media');
  const [narratorVoice, setNarratorVoice] = useState<VoiceStyle>('Kore');
  const [characterVoice, setCharacterVoice] = useState<VoiceStyle>('Zephyr');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onSubmit(idea.trim(), includeDialogues, length, narratorVoice, characterVoice);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white font-serif">
            Generador de Historias
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Da vida a tus ideas con narración, personajes y portadas de cine.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-6">
            {/* Section: Idea */}
            <div>
                <label htmlFor="story-idea" className="block text-lg font-medium text-gray-900 dark:text-white mb-3">
                    ¿Cuál es tu historia?
                </label>
                <textarea
                    id="story-idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ej: Un chef famoso pierde el sentido del gusto justo antes de la competencia más importante de su vida..."
                    className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    disabled={isLoading}
                />
            </div>

            {/* Section: Length */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Longitud de la historia
                </label>
                <div className="grid grid-cols-3 gap-3">
                {(['corta', 'media', 'larga'] as StoryLength[]).map((len) => (
                    <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len)}
                    disabled={isLoading}
                    className={`py-2.5 text-sm font-semibold rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
                        length === len
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    >
                    {len.charAt(0).toUpperCase() + len.slice(1)}
                    </button>
                ))}
                </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Audio Configuration */}
            <div>
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                        Elenco de Voces
                    </h3>
                    
                    <div className="mt-4 sm:mt-0 flex items-center">
                        <label className="inline-flex items-center cursor-pointer relative">
                            <input
                                type="checkbox"
                                checked={includeDialogues}
                                onChange={(e) => setIncludeDialogues(e.target.checked)}
                                disabled={isLoading}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Incluir diálogos
                            </span>
                        </label>
                    </div>
                </div>

                <div className={`grid gap-4 transition-all duration-500 ease-in-out ${includeDialogues ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    <div className={`${includeDialogues ? '' : 'max-w-sm mx-auto w-full'}`}>
                        <VoiceSelector 
                            role="Narrador"
                            label="Voz Principal"
                            value={narratorVoice}
                            onChange={setNarratorVoice}
                            disabled={isLoading}
                            options={voiceStyles}
                            icon={<NarratorIcon />}
                        />
                    </div>
                    
                    {includeDialogues && (
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <VoiceSelector 
                                role="Personaje"
                                label="Voz del Personaje"
                                value={characterVoice}
                                onChange={setCharacterVoice}
                                disabled={isLoading}
                                options={voiceStyles}
                                icon={<CharacterIcon />}
                            />
                        </div>
                    )}
                </div>
                {!includeDialogues && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Activa "Incluir diálogos" para asignar una voz distinta al personaje.
                    </p>
                )}
            </div>
        </div>

        <div className="pt-4">
            {isLoading ? (
                <div className="w-full max-w-2xl mx-auto space-y-3 animate-fade-in">
                    <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                        <span>{progressMessage}</span>
                        <span>{progressValue}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                            style={{ width: `${progressValue}%` }}
                        >
                             <div className="absolute inset-0 bg-white/20 animate-pulse w-full h-full"></div>
                        </div>
                    </div>
                     <p className="text-center text-xs text-gray-400 dark:text-gray-500 animate-pulse">
                        Estamos creando tu historia, la portada y el audio...
                    </p>
                </div>
            ) : (
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={!idea.trim()}
                        className="w-full md:w-auto px-10 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:scale-95"
                    >
                        Generar Historia y Portada
                    </button>
                </div>
            )}
        </div>
      </form>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
             from { opacity: 0; }
             to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StoryInputForm;