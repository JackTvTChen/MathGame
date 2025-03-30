import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to handle player input with validation and edge case handling
 */
export const usePlayerInput = (
  onSubmit: (value: number) => void,
  isPlaying: boolean
) => {
  // State for raw input value
  const [inputValue, setInputValue] = useState<string>('');
  // State for input validation
  const [isValid, setIsValid] = useState<boolean>(true);
  // State for error message
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  /**
   * Handle input change with validation
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Filter out non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Only update if actually changed to avoid cursor jumps
    if (numericValue !== value) {
      setIsValid(false);
      setErrorMessage('Only numbers are allowed');
    } else {
      setIsValid(true);
      setErrorMessage('');
    }
    
    // Update state with numeric value
    setInputValue(numericValue);
  }, []);
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if not playing
    if (!isPlaying) return;
    
    // Don't submit if invalid
    if (!isValid) return;
    
    // Don't submit if empty
    if (!inputValue.trim()) return;
    
    // Parse the value
    const numericValue = parseInt(inputValue, 10);
    
    // Check for valid number
    if (isNaN(numericValue)) {
      setIsValid(false);
      setErrorMessage('Invalid number');
      return;
    }
    
    // Call the submit handler
    onSubmit(numericValue);
    
    // Clear the input
    setInputValue('');
  }, [inputValue, isValid, isPlaying, onSubmit]);
  
  /**
   * Clear input when game state changes
   */
  useEffect(() => {
    if (!isPlaying) {
      setInputValue('');
      setIsValid(true);
      setErrorMessage('');
    }
  }, [isPlaying]);
  
  return {
    inputValue,
    setInputValue,
    handleInputChange,
    handleSubmit,
    isValid,
    errorMessage,
    clearInput: () => setInputValue('')
  };
}; 