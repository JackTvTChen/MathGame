/**
 * InputField Component
 * Displays and handles user input for answers
 */

import React, { useEffect, useRef } from 'react';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isActive: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  onSubmit,
  isActive
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input field when active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };
  
  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };
  
  return (
    <div className="math-asteroids-input-field">
      <label htmlFor="answer-input">Your Answer:</label>
      <input
        ref={inputRef}
        id="answer-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!isActive}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Enter your answer"
        placeholder="Type answer..."
      />
      <button
        className="submit-button"
        onClick={onSubmit}
        disabled={!isActive || value === ''}
      >
        Submit
      </button>
    </div>
  );
};

export default InputField; 