/**
 * Math Asteroids Game Input Hook
 * Handles keyboard input for the game
 */

import { useCallback, useEffect } from 'react';

interface GameInputProps {
  onInput: (value: string | ((prevValue: string) => string)) => void;
  onSubmit: () => void;
  onPause: () => void;
  onReset?: () => void;
  enabled: boolean;
}

/**
 * Custom hook for handling keyboard input in the game
 */
export const useGameInput = ({
  onInput,
  onSubmit,
  onPause,
  onReset,
  enabled
}: GameInputProps) => {
  
  // Handle keydown events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Prevent default for game controls to avoid page scrolling
    if (
      event.key === 'Enter' ||
      event.key === 'Escape' ||
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      (event.key >= '0' && event.key <= '9') ||
      event.key === '.' || 
      event.key === '-'
    ) {
      event.preventDefault();
    }

    // Handle numeric input (0-9)
    if (event.key >= '0' && event.key <= '9') {
      onInput((prev: string) => prev + event.key);
    }
    // Handle decimal point (allow only one)
    else if (event.key === '.') {
      onInput((prev: string) => prev.includes('.') ? prev : prev + '.');
    }
    // Handle backspace (remove last character)
    else if (event.key === 'Backspace') {
      onInput((prev: string) => prev.slice(0, -1));
    }
    // Handle submit (Enter key)
    else if (event.key === 'Enter') {
      onSubmit();
    }
    // Handle pause/resume (Escape key)
    else if (event.key === 'Escape') {
      onPause();
    }
    // Handle reset (Ctrl+R)
    else if (event.key === 'r' && event.ctrlKey) {
      event.preventDefault(); // Prevent browser refresh
      if (onReset) {
        onReset();
      }
    }
  }, [enabled, onInput, onSubmit, onPause, onReset]);
  
  // Set up event listeners
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
  
  /**
   * Handle input from a virtual keyboard
   * Useful for mobile devices
   */
  const handleVirtualKeyInput = useCallback((key: string) => {
    if (!enabled) return;
    
    if (key >= '0' && key <= '9') {
      onInput((prev: string) => prev + key);
    } else if (key === '.') {
      onInput((prev: string) => prev.includes('.') ? prev : prev + '.');
    } else if (key === 'Backspace') {
      onInput((prev: string) => prev.slice(0, -1));
    } else if (key === 'Enter') {
      onSubmit();
    }
  }, [enabled, onInput, onSubmit]);
  
  return {
    handleVirtualKeyInput
  };
};

export default useGameInput; 