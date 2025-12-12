'use client';

import React from 'react';
import { useCalculator } from '../context/CalculatorContext';

interface DisplayProps {
  value: string;
  isAnimating?: boolean;
}

export default function Display({ value, isAnimating = false }: DisplayProps) {
  const { theme, previousExpression } = useCalculator();
  
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const prevTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  // Format large numbers with commas
  const formatNumber = (val: string) => {
    if (val === 'Error' || val === '0' || !val) return val;
    const num = parseFloat(val.replace(/,/g, ''));
    if (isNaN(num)) return val;
    return num.toLocaleString('en-US', { 
      maximumFractionDigits: 10,
      useGrouping: true 
    });
  };

  return (
    <div className={`
      w-full ${bgColor} ${borderColor} border-2
      rounded-3xl p-6 md:p-8 mb-4 
      min-h-[160px] md:min-h-[180px] 
      flex flex-col justify-end
      transition-all duration-300
      shadow-2xl
    `}>
      {previousExpression && (
        <div className={`
          ${prevTextColor} text-lg md:text-xl 
          font-mono mb-3 text-right 
          opacity-70 truncate
        `}>
          {previousExpression}
        </div>
      )}
      <div
        className={`
          ${textColor} text-5xl md:text-6xl lg:text-7xl
          font-mono font-light text-right
          ${isAnimating ? 'animate-pulse' : ''}
          transition-all duration-200
          break-all
          leading-tight
        `}
      >
        {formatNumber(value)}
      </div>
    </div>
  );
}

