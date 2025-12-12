'use client';

import React, { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { CalculatorState, CalculatorMode, HistoryEntry } from '../types/calculator';
import { processButtonClick, formatDisplay } from '../lib/calculator';
import { saveToHistory } from '../lib/history';

interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
  handleButtonClick: (value: string) => void;
  setMode: (mode: CalculatorMode) => void;
  setDisplay: (value: string) => void;
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast' | 'instant') => void;
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  previousExpression: string | null;
  setPreviousExpression: (expr: string | null) => void;
}

type CalculatorAction =
  | { type: 'BUTTON_CLICK'; payload: string }
  | { type: 'SET_DISPLAY'; payload: string }
  | { type: 'SET_MODE'; payload: CalculatorMode }
  | { type: 'SET_ANIMATION_SPEED'; payload: 'slow' | 'normal' | 'fast' | 'instant' }
  | { type: 'SET_ANIMATING'; payload: boolean }
  | { type: 'ADD_HISTORY'; payload: HistoryEntry }
  | { type: 'RESET' }
  | { type: 'UPDATE_STATE'; payload: Partial<CalculatorState> };

const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  currentOperation: null,
  waitingForOperand: true,
  memory: 0,
  mode: 'normal',
  history: [],
  isAnimating: false,
  animationSpeed: 'normal',
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'BUTTON_CLICK':
      try {
        const updates = processButtonClick(state, action.payload);
        // Track expression when equals is pressed
        if (action.payload === '=' && state.previousValue !== null && state.currentOperation) {
          const expr = `${state.previousValue} ${state.currentOperation} ${state.display}`;
          // This will be handled by context provider
        }
        return { ...state, ...updates };
      } catch (error) {
        return { ...state, display: 'Error' };
      }

    case 'SET_DISPLAY':
      return { ...state, display: action.payload };

    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'SET_ANIMATION_SPEED':
      return { ...state, animationSpeed: action.payload };

    case 'SET_ANIMATING':
      return { ...state, isAnimating: action.payload };

    case 'ADD_HISTORY':
      const newHistory = [action.payload, ...state.history].slice(0, 100);
      saveToHistory(action.payload);
      return { ...state, history: newHistory };

    case 'RESET':
      return initialState;

    case 'UPDATE_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [previousExpression, setPreviousExpression] = useState<string | null>(null);

  const handleButtonClick = (value: string) => {
    // Track expression when equals is pressed
    if (value === '=' && state.previousValue !== null && state.currentOperation) {
      const expr = `${state.previousValue} ${state.currentOperation} ${state.display}`;
      setPreviousExpression(expr);
    } else if (['+', '-', '×', '÷'].includes(value)) {
      // Clear previous expression when new operation starts
      setPreviousExpression(null);
    }
    dispatch({ type: 'BUTTON_CLICK', payload: value });
  };

  const setMode = (mode: CalculatorMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  const setDisplay = (value: string) => {
    dispatch({ type: 'SET_DISPLAY', payload: value });
  };

  const setAnimationSpeed = (speed: 'slow' | 'normal' | 'fast' | 'instant') => {
    dispatch({ type: 'SET_ANIMATION_SPEED', payload: speed });
  };

  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const historyEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_HISTORY', payload: historyEntry });
  };

  return (
    <CalculatorContext.Provider
      value={{
        state,
        dispatch,
        handleButtonClick,
        setMode,
        setDisplay,
        setAnimationSpeed,
        addToHistory,
        activeKey,
        setActiveKey,
        theme,
        setTheme,
        previousExpression,
        setPreviousExpression,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

