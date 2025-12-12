'use client';

import React, { useState, useEffect } from 'react';
import { useCalculator } from './context/CalculatorContext';
import Calculator from './components/Calculator';
import AIInput from './components/AIInput';
import HistoryPanel from './components/HistoryPanel';
import { CalculatorMode } from './types/calculator';

export default function Home() {
  const { state, setMode, setAnimationSpeed, theme, setTheme } = useCalculator();
  const [showSettings, setShowSettings] = useState(false);
  const [showAIInput, setShowAIInput] = useState(false);

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';

  // Apply theme to body
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.className = isDark 
      ? 'bg-gray-900 text-white' 
      : 'bg-gray-100 text-gray-900';
  }, [isDark]);

  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <main className={`
      min-h-screen ${bgColor} transition-colors duration-300
      pb-8 md:pb-12
    `}>
      {/* Mobile Status Bar */}
      <div className={`
        ${cardBg} ${borderColor} border-b
        px-4 py-3 flex justify-between items-center 
        text-sm md:hidden sticky top-0 z-50
        shadow-md
      `}>
        <div className="font-mono font-semibold">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-3 border-2 border-current rounded-sm">
            <div className="w-4/5 h-full bg-current"></div>
          </div>
          <div className="w-1.5 h-1.5 bg-current rounded-full ml-1"></div>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-4 md:py-6">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className={`${textColor} text-2xl md:text-3xl font-bold`}>
            🧮 Autocalcy
          </h1>
          
          {/* Theme Toggle */}
          <div className={`flex items-center gap-2 ${cardBg} rounded-xl p-1 shadow-md`}>
            <button
              onClick={() => setTheme('light')}
              className={`
                p-2.5 rounded-lg transition-all duration-200
                ${theme === 'light' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : `${textColor} opacity-60 hover:opacity-100`
                }
              `}
              aria-label="Light mode"
            >
              <span className="text-xl">☀️</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`
                p-2.5 rounded-lg transition-all duration-200
                ${theme === 'dark' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : `${textColor} opacity-60 hover:opacity-100`
                }
              `}
              aria-label="Dark mode"
            >
              <span className="text-xl">🌙</span>
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className={`
          flex items-center gap-2 ${cardBg} ${borderColor} border-2
          rounded-2xl p-1.5 mb-4 shadow-lg
        `}>
          <button
            onClick={() => setMode('normal')}
            className={`
              flex-1 py-3 rounded-xl transition-all duration-200
              font-semibold text-sm md:text-base
              ${state.mode === 'normal'
                ? 'bg-blue-600 text-white shadow-md'
                : `${textColor} opacity-60 hover:opacity-100`
              }
            `}
          >
            Normal
          </button>
          <button
            onClick={() => setMode('scientific')}
            className={`
              flex-1 py-3 rounded-xl transition-all duration-200
              font-semibold text-sm md:text-base
              ${state.mode === 'scientific'
                ? 'bg-blue-600 text-white shadow-md'
                : `${textColor} opacity-60 hover:opacity-100`
              }
            `}
          >
            Scientific
          </button>
        </div>

        {/* AI Input Toggle */}
        <button
          onClick={() => setShowAIInput(!showAIInput)}
          className={`
            w-full ${cardBg} ${borderColor} border-2
            ${textColor} py-3.5 rounded-2xl mb-4 
            font-semibold transition-all duration-200
            hover:shadow-lg active:scale-98
            shadow-md
          `}
        >
          {showAIInput ? '❌ Close AI' : '🤖 Ask AI'}
        </button>

        {/* AI Input */}
        {showAIInput && (
          <div className="mb-4 animate-fadeIn">
            <AIInput />
          </div>
        )}

        {/* Calculator */}
        <Calculator />

        {/* Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`
            w-full ${cardBg} ${borderColor} border-2
            ${textColor} py-2.5 rounded-2xl mt-4 
            text-sm transition-all duration-200
            hover:shadow-lg active:scale-98
            shadow-md
          `}
        >
          ⚙️ Settings
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`
            ${cardBg} ${borderColor} border-2 rounded-2xl p-4 mt-4 
            shadow-lg animate-fadeIn
          `}>
            <h3 className={`${textColor} font-semibold mb-3 text-lg`}>
              Animation Speed
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {(['slow', 'normal', 'fast', 'instant'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAnimationSpeed(speed)}
                  className={`
                    py-2.5 rounded-xl text-sm font-semibold 
                    transition-all duration-200
                    ${state.animationSpeed === speed
                      ? 'bg-blue-600 text-white shadow-md'
                      : `${isDark ? 'bg-gray-700' : 'bg-gray-200'} ${textColor} hover:opacity-80`
                    }
                  `}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* History Panel */}
        <div className="mt-4">
          <HistoryPanel />
        </div>

        {/* Footer */}
        <footer className={`
          text-center mt-6 ${textColor} opacity-60 text-xs
        `}>
          <p>Powered by Google Gemini AI</p>
        </footer>
      </div>
    </main>
  );
}

