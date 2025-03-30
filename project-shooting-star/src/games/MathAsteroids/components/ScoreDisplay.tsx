/**
 * ScoreDisplay Component
 * Shows the player's current score and level with effects for changes
 */

import React, { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
  level: number;
  className?: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  level,
  className = ''
}) => {
  const [prevScore, setPrevScore] = useState(score);
  const [prevLevel, setPrevLevel] = useState(level);
  const [scoreEffect, setScoreEffect] = useState<'increase' | 'decrease' | null>(null);
  const [levelEffect, setLevelEffect] = useState<'increase' | null>(null);
  
  // Handle score changes
  useEffect(() => {
    if (score > prevScore) {
      setScoreEffect('increase');
    } else if (score < prevScore) {
      setScoreEffect('decrease');
    }
    
    // Clear effect after animation time
    const timer = setTimeout(() => {
      setScoreEffect(null);
    }, 800);
    
    setPrevScore(score);
    
    return () => clearTimeout(timer);
  }, [score, prevScore]);
  
  // Handle level changes
  useEffect(() => {
    if (level > prevLevel) {
      setLevelEffect('increase');
    }
    
    // Clear effect after animation time
    const timer = setTimeout(() => {
      setLevelEffect(null);
    }, 1500);
    
    setPrevLevel(level);
    
    return () => clearTimeout(timer);
  }, [level, prevLevel]);
  
  return (
    <div className={`score-display ${className}`}>
      <div className="score-container">
        <div className="score-label">Score</div>
        <div className={`score-value ${scoreEffect ? `score-${scoreEffect}` : ''}`}>
          {score}
        </div>
      </div>
      
      <div className="level-container">
        <div className="level-label">Level</div>
        <div className={`level-value ${levelEffect ? 'level-increase' : ''}`}>
          {level}
        </div>
        {levelEffect && (
          <div className="level-up-alert">Level Up!</div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay; 