/**
 * GameScreen Component
 * Manages different screen states for the Math Asteroids game
 */

import React from 'react';

type ScreenType = 'start' | 'playing' | 'paused' | 'gameOver';

interface GameScreenProps {
  screenType: ScreenType;
  score: number;
  highScore: number;
  onStartGame: () => void;
  onResumeGame: () => void;
  onRestartGame: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  screenType,
  score,
  highScore,
  onStartGame,
  onResumeGame,
  onRestartGame
}) => {
  // Start screen
  if (screenType === 'start') {
    return (
      <div className="math-asteroids-screen start-screen">
        <h1>Math Asteroids</h1>
        <p>Solve math problems to destroy incoming asteroids!</p>
        <button onClick={onStartGame} className="start-button">
          Start Game
        </button>
        
        <div className="instructions">
          <h3>How to Play:</h3>
          <ul>
            <li>Solve the math problems shown on each asteroid</li>
            <li>Type your answer and press Enter</li>
            <li>Don't let asteroids reach the bottom</li>
            <li>Each correct answer: +1 point</li>
            <li>Each wrong answer: -1 point</li>
          </ul>
        </div>
      </div>
    );
  }
  
  // Game over screen
  if (screenType === 'gameOver') {
    const isNewHighScore = score > highScore;
    
    return (
      <div className="math-asteroids-screen game-over-screen">
        <h1>Game Over</h1>
        
        <div className="game-over-message">
          {isNewHighScore ? 
            <p>Congratulations! You achieved a new high score!</p> :
            <p>Nice try! Keep practicing to improve your score.</p>
          }
        </div>
        
        <div className="score-summary">
          <div className="score-item">
            <span className="score-label">Your Score:</span>
            <span className="final-score">{score}</span>
          </div>
          
          <div className="score-item">
            <span className="score-label">High Score:</span>
            <span className="high-score">{highScore}</span>
          </div>
          
          {isNewHighScore && (
            <div className="new-high-score-badge">
              New Record!
            </div>
          )}
        </div>
        
        <div className="game-over-tips">
          <h3>Tips to Improve</h3>
          <ul>
            <li>Answer questions faster to prevent asteroid timers from expiring</li>
            <li>Practice mental math to reduce calculation time</li>
            <li>Focus on asteroids with the shortest timers first</li>
          </ul>
        </div>
        
        <button onClick={onRestartGame} className="restart-button">
          Play Again
        </button>
      </div>
    );
  }
  
  // Pause screen
  if (screenType === 'paused') {
    return (
      <div className="math-asteroids-screen pause-screen">
        <h2>Game Paused</h2>
        <button onClick={onResumeGame} className="resume-button">
          Resume Game
        </button>
        <button onClick={onRestartGame} className="restart-button">
          Restart Game
        </button>
      </div>
    );
  }
  
  // By default, return null for the playing state
  return null;
};

export default GameScreen; 