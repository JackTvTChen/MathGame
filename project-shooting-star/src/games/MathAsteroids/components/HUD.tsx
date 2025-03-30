/**
 * HUD Component
 * Displays game statistics and information overlay
 */

import React from 'react';

interface HUDProps {
  score: number;
  level: number;
  elapsedTime: number;
  isPaused: boolean;
  isPlaying: boolean;
  scoreFlash?: 'positive' | 'negative' | null;
}

const HUD: React.FC<HUDProps> = ({
  score,
  level,
  elapsedTime,
  isPaused,
  isPlaying,
  scoreFlash = null
}) => {
  // Format time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Only show HUD when game is active
  if (!isPlaying) return null;
  
  return (
    <div className="math-asteroids-hud">
      <div className="hud-stats">
        <div className={`hud-score ${scoreFlash ? `flash-${scoreFlash}` : ''}`}>
          <span className="hud-label">Score:</span>
          <span className="hud-value">{score}</span>
        </div>
        
        <div className="hud-level">
          <span className="hud-label">Level:</span>
          <span className="hud-value">{level}</span>
        </div>
        
        <div className="hud-time">
          <span className="hud-label">Time:</span>
          <span className="hud-value">{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      {isPaused && (
        <div className="pause-indicator">
          PAUSED
        </div>
      )}
    </div>
  );
};

export default HUD; 