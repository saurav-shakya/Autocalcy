'use client';

import React, { useState, useRef } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { processAIQuery } from '../lib/gemini';
import { evaluateExpression } from '../lib/calculator';
import { useAnimation } from '../hooks/useAnimation';

export default function AIInput() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, setDisplay, addToHistory, dispatch, handleButtonClick, setActiveKey, theme, setPreviousExpression } = useCalculator();
  const { animateKeySequence } = useAnimation();
  const animationRef = useRef<string[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Process AI query
      const aiResponse = await processAIQuery(query);
      
      if (!aiResponse || !aiResponse.expression) {
        throw new Error('Could not process the query. Please try rephrasing.');
      }

      // Evaluate the expression
      const result = evaluateExpression(aiResponse.expression);

      // Set previous expression for display
      setPreviousExpression(aiResponse.expression);

      // Add to history
      addToHistory({
        input: query,
        expression: aiResponse.expression,
        keySequence: aiResponse.keySequence,
        result,
        mode: 'ai',
      });

      // Trigger animation if key sequence is available
      if (aiResponse.keySequence && aiResponse.keySequence.length > 0) {
        dispatch({ type: 'SET_ANIMATING', payload: true });
        animationRef.current = aiResponse.keySequence;

        // Animate the key sequence
        await animateKeySequence(
          aiResponse.keySequence,
          (key) => {
            setActiveKey(key);
            handleButtonClick(key);
          },
          state.animationSpeed
        );

        // Clear active key and set final result
        setActiveKey(null);
        setDisplay(result.toString());
        dispatch({ type: 'SET_ANIMATING', payload: false });
        animationRef.current = null;
      } else {
        // No animation, just show result
        setDisplay(result.toString());
      }

      setQuery('');
    } catch (err) {
      console.error('AI processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      dispatch({ type: 'SET_ANIMATING', payload: false });
      animationRef.current = null;
    } finally {
      setIsProcessing(false);
    }
  };

  const isDark = theme === 'dark';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-white';
  const inputText = isDark ? 'text-white' : 'text-gray-900';
  const inputBorder = isDark ? 'border-gray-700' : 'border-gray-300';
  const placeholder = isDark ? 'placeholder-gray-400' : 'placeholder-gray-500';

  return (
    <div className="w-full mb-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything... e.g., '15% tip on $45'"
            className={`flex-1 px-4 py-3 rounded-xl ${inputBg} ${inputText} ${placeholder} border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !query.trim()}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            {isProcessing ? '...' : 'Ask'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isProcessing && (
        <div className="mt-2 text-blue-400 text-sm flex items-center gap-2">
          <span className="animate-pulse">🤖 Processing...</span>
        </div>
      )}
    </div>
  );
}

