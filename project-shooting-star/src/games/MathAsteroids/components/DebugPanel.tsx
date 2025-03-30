/**
 * DebugPanel Component
 * A developer tool for testing the Math Asteroids game
 * Only shown in development mode
 */

import React from 'react';
import { Asteroid } from '../types';

interface DebugPanelProps {
  isActive: boolean;
  asteroids: Asteroid[];
  playerInput: string;
  onAnswerTest: (correctAnswer: number) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  isActive,
  asteroids,
  playerInput,
  onAnswerTest
}) => {
  // Exit early if not active
  if (!isActive) return null;

  // Sort asteroids to show non-exploding ones first
  const sortedAsteroids = [...asteroids].sort((a, b) => {
    if (a.isExploding === b.isExploding) return 0;
    return a.isExploding ? 1 : -1;
  });

  return (
    <div className="math-asteroids-debug-panel">
      <h3>Debug Panel</h3>
      
      <div className="debug-inputs">
        <p>Current Input: <strong>{playerInput || '(empty)'}</strong></p>
      </div>
      
      <div className="debug-asteroids">
        <h4>Active Asteroids ({asteroids.filter(a => !a.isExploding).length})</h4>
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Time Left</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedAsteroids.map(asteroid => (
              <tr 
                key={asteroid.id}
                className={asteroid.isExploding ? 'exploding' : ''}
              >
                <td>{asteroid.question}</td>
                <td>{asteroid.correctAnswer}</td>
                <td>{(asteroid.timeLeft / 1000).toFixed(1)}s</td>
                <td>
                  {!asteroid.isExploding && (
                    <button 
                      onClick={() => onAnswerTest(asteroid.correctAnswer)}
                      className="debug-answer-button"
                    >
                      Test Answer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="debug-controls">
        <p className="debug-note">
          Click "Test Answer" to automatically fill in the correct answer for any asteroid.
        </p>
      </div>
    </div>
  );
};

export default DebugPanel; 