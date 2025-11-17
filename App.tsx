import React, { useState, useCallback, useRef } from 'react';
import { generateContent } from './services/geminiService';
import { ThinkingIcon, FlashIcon, SendIcon, LoadingSpinner } from './components/icons';

// Main App Component
const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const responseAreaRef = useRef<HTMLDivElement>(null);

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            const result = await generateContent(prompt, isThinkingMode);
            setResponse(result);
            // Scroll to bottom of response area after content is set
            setTimeout(() => {
                if (responseAreaRef.current) {
                    responseAreaRef.current.scrollTop = responseAreaRef.current.scrollHeight;
                }
            }, 0);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
            setError(errorMessage);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, isLoading, isThinkingMode]);

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
            <header className="p-4 border-b border-gray-700 text-center flex-shrink-0">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    Gemini Thinking Mode
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Toggle Thinking Mode for deeper analysis on complex topics.
                </p>
            </header>

            <main className="flex-grow p-4 overflow-y-auto" ref={responseAreaRef}>
                <div className="max-w-4xl mx-auto h-full">
                    <div className="bg-gray-800 rounded-lg p-6 min-h-full">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <LoadingSpinner className="w-12 h-12 mb-4" />
                                <p className="text-lg">
                                    {isThinkingMode ? "Thinking deeply..." : "Generating response..."}
                                </p>
                            </div>
                        )}
                        {!isLoading && !response && !error && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                                <ThinkingIcon className="w-16 h-16 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-300">Welcome!</h2>
                                <p>Enter a prompt below to get started. Enable "Thinking Mode" for complex questions.</p>
                            </div>
                        )}
                        {response && (
                            <pre className="whitespace-pre-wrap text-gray-200 text-base leading-relaxed font-sans">{response}</pre>
                        )}
                        {error && (
                            <div className="text-red-400 bg-red-900/20 p-4 rounded-md">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="sticky bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4 border-t border-gray-700 flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-end gap-2 sm:gap-4 bg-gray-800 border border-gray-600 rounded-xl p-2 shadow-lg">
                        <div className="flex flex-col items-center gap-1 p-1">
                             <span className="text-xs text-gray-400 select-none">{isThinkingMode ? 'Deep' : 'Fast'}</span>
                            <button
                                onClick={() => setIsThinkingMode(!isThinkingMode)}
                                className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${isThinkingMode ? 'bg-purple-600' : 'bg-gray-600'}`}
                            >
                                <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 flex items-center justify-center ${isThinkingMode ? 'translate-x-7' : 'translate-x-1'}`}>
                                    {isThinkingMode ? <ThinkingIcon className="w-4 h-4 text-purple-600" /> : <FlashIcon className="w-4 h-4 text-gray-600" />}
                                </span>
                            </button>
                        </div>
                        
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={handlePromptChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            placeholder="Ask me anything..."
                            rows={1}
                            className="flex-grow bg-transparent resize-none focus:outline-none text-gray-200 placeholder-gray-500 max-h-48"
                        />
                        
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !prompt.trim()}
                            className="p-2 rounded-full bg-purple-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 self-end"
                        >
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;