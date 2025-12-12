'use client';

import React, { useState, useEffect } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { HistoryEntry } from '../types/calculator';
import { getHistory, clearHistory, deleteHistoryEntry } from '../lib/history';

export default function HistoryPanel() {
  const { state, setDisplay, dispatch, theme } = useCalculator();
  const [isOpen, setIsOpen] = useState(false);
  const [localHistory, setLocalHistory] = useState<HistoryEntry[]>([]);
  
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    // Load history from localStorage
    const stored = getHistory();
    setLocalHistory(stored);
  }, [state.history]);

  const handleReplay = (entry: HistoryEntry) => {
    if (entry.keySequence && entry.keySequence.length > 0) {
      setDisplay(entry.result.toString());
      // Trigger animation
      dispatch({ type: 'SET_ANIMATING', payload: true });
      // Animation will be handled by parent component
      setTimeout(() => {
        dispatch({ type: 'SET_ANIMATING', payload: false });
      }, entry.keySequence.length * 200);
    } else {
      setDisplay(entry.result.toString());
    }
  };

  const handleCopy = (entry: HistoryEntry) => {
    const text = `${entry.input} = ${entry.result}`;
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setLocalHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Clear all history?')) {
      clearHistory();
      setLocalHistory([]);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 ${cardBg} hover:opacity-90 ${textColor} rounded-xl flex items-center justify-between transition-colors shadow-md`}
      >
        <span className="font-semibold">History ({localHistory.length})</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div className={`mt-2 ${cardBg} rounded-xl p-4 max-h-96 overflow-y-auto shadow-md`}>
          {localHistory.length === 0 ? (
            <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>No history yet</div>
          ) : (
            <>
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleClearAll}
                  className="text-red-500 hover:text-red-600 text-sm font-semibold"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-3">
                {localHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-3 hover:opacity-80 transition-opacity border ${borderColor}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                          {formatTime(entry.timestamp)}
                        </div>
                        <div className={`${textColor} font-semibold mb-1`}>
                          {entry.input}
                        </div>
                        {entry.expression && (
                          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                            → {entry.expression}
                          </div>
                        )}
                        {entry.keySequence && (
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                            Keys: [{entry.keySequence.join('][')}]
                          </div>
                        )}
                        <div className="text-lg text-blue-500 font-mono font-semibold">
                          = {entry.result}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-500 hover:text-red-600 ml-2 text-xl font-bold"
                        aria-label="Delete"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {entry.keySequence && entry.keySequence.length > 0 && (
                        <button
                          onClick={() => handleReplay(entry)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-semibold"
                        >
                          ↻ Replay
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(entry)}
                        className={`px-3 py-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} hover:opacity-80 ${textColor} text-sm rounded-lg font-semibold`}
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

