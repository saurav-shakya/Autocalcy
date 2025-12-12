'use client';

import { useState, useCallback, useRef } from 'react';
import { KeySequence } from '../types/calculator';

interface AnimationState {
  isAnimating: boolean;
  currentKeyIndex: number;
  activeKey: string | null;
}

export function useAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    currentKeyIndex: 0,
    activeKey: null,
  });

  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const animateKeySequence = useCallback(
    async (
      keySequence: string[],
      onKeyPress: (key: string, index: number) => void,
      speed: 'slow' | 'normal' | 'fast' | 'instant' = 'normal'
    ): Promise<void> => {
      if (keySequence.length === 0) return;

      // Clear any existing animation
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }

      const delays = {
        slow: 300,
        normal: 150,
        fast: 50,
        instant: 0,
      };

      const delay = delays[speed];

      setAnimationState({
        isAnimating: true,
        currentKeyIndex: 0,
        activeKey: keySequence[0],
      });

      for (let i = 0; i < keySequence.length; i++) {
        await new Promise<void>((resolve) => {
          if (delay > 0) {
            animationRef.current = setTimeout(() => {
              onKeyPress(keySequence[i], i);
              setAnimationState({
                isAnimating: i < keySequence.length - 1,
                currentKeyIndex: i,
                activeKey: keySequence[i],
              });
              resolve();
            }, delay * i);
          } else {
            onKeyPress(keySequence[i], i);
            setAnimationState({
              isAnimating: i < keySequence.length - 1,
              currentKeyIndex: i,
              activeKey: keySequence[i],
            });
            resolve();
          }
        });
      }

      // Final state
      setAnimationState({
        isAnimating: false,
        currentKeyIndex: keySequence.length - 1,
        activeKey: null,
      });
    },
    []
  );

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setAnimationState({
      isAnimating: false,
      currentKeyIndex: 0,
      activeKey: null,
    });
  }, []);

  return {
    animationState,
    animateKeySequence,
    stopAnimation,
  };
}

