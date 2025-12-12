'use client';

import React, { useEffect } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { CalculatorButton, CalculatorMode } from '../types/calculator';
import Button from './Button';
import Display from './Display';

const normalButtons: CalculatorButton[] = [
  { label: 'C', value: 'C', type: 'clear' },
  { label: '±', value: '±', type: 'special' },
  { label: '%', value: '%', type: 'function' },
  { label: '÷', value: '÷', type: 'operator' },
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '×', type: 'operator' },
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '-', value: '-', type: 'operator' },
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },
  { label: '0', value: '0', type: 'number', className: 'col-span-2' },
  { label: '.', value: '.', type: 'special' },
  { label: '=', value: '=', type: 'equals' },
];

const scientificButtons: CalculatorButton[] = [
  { label: 'sin', value: 'sin', type: 'function', showInMode: ['scientific'] },
  { label: 'cos', value: 'cos', type: 'function', showInMode: ['scientific'] },
  { label: 'tan', value: 'tan', type: 'function', showInMode: ['scientific'] },
  { label: 'log', value: 'log', type: 'function', showInMode: ['scientific'] },
  { label: 'ln', value: 'ln', type: 'function', showInMode: ['scientific'] },
  { label: '√', value: '√', type: 'function' },
  { label: 'x²', value: 'x²', type: 'function' },
  { label: 'x^y', value: '^', type: 'function', showInMode: ['scientific'] },
  { label: 'π', value: 'π', type: 'special', showInMode: ['scientific'] },
  { label: 'e', value: 'e', type: 'special', showInMode: ['scientific'] },
  { label: '(', value: '(', type: 'special', showInMode: ['scientific'] },
  { label: ')', value: ')', type: 'special', showInMode: ['scientific'] },
  { label: '⌫', value: '⌫', type: 'special' },
  { label: 'MC', value: 'MC', type: 'memory' },
  { label: 'MR', value: 'MR', type: 'memory' },
  { label: 'M+', value: 'M+', type: 'memory' },
  { label: 'M-', value: 'M-', type: 'memory' },
];

export default function Calculator() {
  const { state, handleButtonClick, activeKey, setActiveKey } = useCalculator();
  const { display, mode, isAnimating } = state;

  // Reset active key when animation stops
  useEffect(() => {
    if (!isAnimating) {
      setActiveKey(null);
    }
  }, [isAnimating, setActiveKey]);

  const getVisibleButtons = () => {
    const baseButtons = [...normalButtons];
    if (mode === 'scientific') {
      const sciButtons = scientificButtons.filter(
        btn => !btn.showInMode || btn.showInMode.includes('scientific')
      );
      return [...sciButtons, ...baseButtons];
    }
    const normalSciButtons = scientificButtons.filter(
      btn => !btn.showInMode || btn.showInMode.includes('normal')
    );
    return [...normalSciButtons, ...baseButtons];
  };

  const visibleButtons = getVisibleButtons();

  return (
    <div className="w-full max-w-sm mx-auto px-2">
      <Display value={display} isAnimating={isAnimating} />
      
      <div className="grid grid-cols-4 gap-2.5 md:gap-3">
        {visibleButtons.map((button) => (
          <Button
            key={button.value}
            label={button.label}
            value={button.value}
            type={button.type}
            onClick={() => {
              handleButtonClick(button.value);
            }}
            className={button.className}
            isAnimating={activeKey === button.value}
          />
        ))}
      </div>
    </div>
  );
}

