'use client';

import React from 'react';
import { ButtonType } from '../types/calculator';
import { useCalculator } from '../context/CalculatorContext';

interface ButtonProps {
  label: string;
  value: string;
  type?: ButtonType;
  onClick: () => void;
  isActive?: boolean;
  isAnimating?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  label,
  value,
  type = 'number',
  onClick,
  isActive = false,
  isAnimating = false,
  className = '',
  disabled = false,
}: ButtonProps) {
  const { theme } = useCalculator();
  const isDark = theme === 'dark';
  
  const baseClasses = `
    rounded-2xl font-semibold 
    text-2xl md:text-3xl
    transition-all duration-200
    active:scale-95 active:brightness-90
    shadow-lg hover:shadow-xl
    focus:outline-none focus:ring-2 focus:ring-offset-2
    touch-manipulation
  `;
  
  // Professional color scheme matching the image
  const typeClasses = {
    number: isDark 
      ? 'bg-[#505050] hover:bg-[#606060] active:bg-[#404040] text-white' 
      : 'bg-[#d4d4d4] hover:bg-[#c4c4c4] active:bg-[#b4b4b4] text-black',
    operator: 'bg-[#ff9500] hover:bg-[#ffad33] active:bg-[#e68500] text-white focus:ring-orange-400',
    function: isDark
      ? 'bg-[#a6a6a6] hover:bg-[#b6b6b6] active:bg-[#969696] text-black'
      : 'bg-[#d4d4d4] hover:bg-[#c4c4c4] active:bg-[#b4b4b4] text-black',
    memory: isDark
      ? 'bg-[#2d2d2d] hover:bg-[#3d3d3d] active:bg-[#1d1d1d] text-white text-sm md:text-base'
      : 'bg-[#e5e5e5] hover:bg-[#d5d5d5] active:bg-[#c5c5c5] text-black text-sm md:text-base',
    clear: 'bg-[#06b6d4] hover:bg-[#0891b2] active:bg-[#0284c7] text-white focus:ring-cyan-400',
    equals: 'bg-[#ff9500] hover:bg-[#ffad33] active:bg-[#e68500] text-white focus:ring-orange-400',
    special: isDark
      ? 'bg-[#a6a6a6] hover:bg-[#b6b6b6] active:bg-[#969696] text-black'
      : 'bg-[#d4d4d4] hover:bg-[#c4c4c4] active:bg-[#b4b4b4] text-black',
  };

  const activeClasses = isActive ? 'ring-2 ring-blue-400 ring-offset-2' : '';
  const animatingClasses = isAnimating 
    ? 'animate-pulse scale-110 shadow-2xl shadow-yellow-400/50 z-10 ring-2 ring-yellow-400' 
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${typeClasses[type]}
        ${activeClasses}
        ${animatingClasses}
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        h-16 md:h-20 lg:h-24
      `}
      aria-label={label}
    >
      {label}
    </button>
  );
}

