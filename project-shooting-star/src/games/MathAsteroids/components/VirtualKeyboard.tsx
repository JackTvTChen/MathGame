/**
 * VirtualKeyboard Component
 * Provides an on-screen keyboard for mobile users
 */

import React from 'react';

interface VirtualKeyboardProps {
  onNumberPress: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  isActive: boolean;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onNumberPress,
  onDelete,
  onSubmit,
  isActive
}) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  
  return (
    <div className="math-asteroids-virtual-keyboard">
      <div className="number-keys">
        {numbers.map(num => (
          <button
            key={num}
            className="keyboard-key number-key"
            onClick={() => onNumberPress(num)}
            disabled={!isActive}
            aria-label={`Number ${num}`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="action-keys">
        <button
          className="keyboard-key delete-key"
          onClick={onDelete}
          disabled={!isActive}
          aria-label="Delete"
        >
          DEL
        </button>
        <button
          className="keyboard-key submit-key"
          onClick={onSubmit}
          disabled={!isActive}
          aria-label="Submit"
        >
          ENTER
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard; 