export type CalculatorMode = 'normal' | 'scientific';

export type ButtonType = 
  | 'number'
  | 'operator'
  | 'function'
  | 'memory'
  | 'clear'
  | 'equals'
  | 'special';

export interface CalculatorButton {
  label: string;
  value: string;
  type: ButtonType;
  className?: string;
  showInMode?: CalculatorMode[];
}

export interface KeySequence {
  keys: string[];
  expression: string;
  result: number;
  timestamp: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  input: string;
  expression?: string;
  keySequence?: string[];
  result: number;
  mode: 'ai' | 'manual';
}

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  currentOperation: string | null;
  waitingForOperand: boolean;
  memory: number;
  mode: CalculatorMode;
  history: HistoryEntry[];
  isAnimating: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast' | 'instant';
}

export interface AIResponse {
  expression: string;
  keySequence: string[];
  explanation?: string;
}

