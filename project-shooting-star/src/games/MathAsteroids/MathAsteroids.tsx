/**
 * Math Asteroids Game Component
 * Main component for the Math Asteroids game
 */

import React, { useCallback, useEffect, useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Link, useLocation } from 'react-router-dom';

// Option 2: DOM-based rendering (uncomment to use)
// import { AsteroidField } from './components/AsteroidField';

import { useAsteroidManager } from './hooks/useAsteroidManager';
import useGameState from './hooks/useGameState';
import { usePlayerInput } from './hooks/usePlayerInput';
import { DEFAULT_SETTINGS, GAME_MECHANICS } from './utils/gameConfig';
import { useAuth } from '../../context';
import { API_BASE_URL } from '../../utils/apiConfig';
import { ApiProfileResponse, ApiScoreUpdateResponse } from './types';
import './MathAsteroids.css';
import { ROUTES } from '../../routes';
import { generateQuestion } from './utils/questionGenerator';

// API endpoints
const SCORE_API_ENDPOINT = '/api/game/score';
const PROFILE_API_ENDPOINT = '/api/profile';
const QUESTIONS_API_ENDPOINT = '/api/game/questions';

interface MathAsteroidsProps {
  initialSettings?: {
    initialScore?: number;
    initialLevel?: number;
    difficulty?: 'easy' | 'normal' | 'hard';
  };
  onScoreUpdate?: (score: number) => void;
  onGameOver?: (finalScore: number) => void;
}

const MathAsteroids: React.FC<MathAsteroidsProps> = ({
  initialSettings = {},
  onScoreUpdate,
  onGameOver
}) => {
  // State for API-related UI feedback
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverHighScore, setServerHighScore] = useState(0);
  
  // Get authentication context for the API token
  const { state: authState } = useAuth();
  
  // Get current location for redirection paths
  const location = useLocation();
  
  // Initialize game state with reducer
  const { 
    gameState, 
    dispatch 
  } = useGameState();
  
  // Get asteroid manager functions
  const { 
    spawnAsteroid, 
    spawnMultipleAsteroids,
    updateAsteroids 
  } = useAsteroidManager({
    gameState,
    dispatch,
    isPlaying: gameState.isPlaying,
    gameOver: gameState.gameOver
  });

  // Use the player input hook for input validation
  const {
    inputValue,
    handleInputChange,
    handleSubmit,
    isValid,
    errorMessage,
    clearInput
  } = usePlayerInput((answer: number) => {
    // Find matching asteroids (handles multiple asteroids with same answer)
    const matchingAsteroids = gameState.asteroids.filter(
      a => !a.isExploding && !a.isDestroyed && a.correctAnswer === answer
    );
    
    if (matchingAsteroids.length > 0) {
      // Mark all matching asteroids as exploding
      matchingAsteroids.forEach(asteroid => {
        dispatch({ type: 'DESTROY_ASTEROID', asteroidId: asteroid.id });
      });
      
      // Update score (award points for each destroyed asteroid)
      dispatch({ 
        type: 'UPDATE_SCORE', 
        delta: matchingAsteroids.length * GAME_MECHANICS.scorePerAsteroid 
      });
      
      // Play success sound (optional)
      // playSound('correct');
    } else {
      // Wrong answer - penalize score but ensure it doesn't go below zero
      const newScore = Math.max(0, gameState.score + GAME_MECHANICS.penaltyPerMiss);
      
      // Only update if score changed to prevent unnecessary re-renders
      if (newScore !== gameState.score) {
        dispatch({ type: 'UPDATE_SCORE', delta: GAME_MECHANICS.penaltyPerMiss });
      }
      
      // Play error sound (optional)
      // playSound('wrong');
    }
  }, gameState.isPlaying);
  
  // Fetch user's high score when component mounts
  useEffect(() => {
    fetchHighScore();
  }, []);
  
  // Fetch high score from the server
  const fetchHighScore = async () => {
    // If user is not authenticated, skip API call and use only local storage
    if (!authState.isAuthenticated || !authState.token) {
      // Try to get high score from localStorage for guest users
      try {
        const localHighScore = localStorage.getItem('mathAsteroids_guestHighScore');
        if (localHighScore) {
          const savedScore = parseInt(localHighScore, 10);
          if (!isNaN(savedScore) && savedScore > gameState.highScore) {
            dispatch({ 
              type: 'UPDATE_HIGH_SCORE', 
              highScore: savedScore 
            });
          }
        }
      } catch (error) {
        console.log('Error accessing localStorage:', error);
      }
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${PROFILE_API_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error
          throw new Error('Authentication expired. Please login again.');
        } else {
          // Other server errors
          throw new Error('Failed to load high score. Please try again later.');
        }
      }
      
      const data = await response.json() as ApiProfileResponse;
      if (data.success && data.data && data.data.user && data.data.user.score) {
        const userScore = data.data.user.score;
        setServerHighScore(userScore);
        
        // Update local high score if server has a higher value
        if (userScore > gameState.highScore) {
          dispatch({ 
            type: 'UPDATE_HIGH_SCORE', 
            highScore: userScore 
          });
        }
      }
      
    } catch (error) {
      console.error('Error fetching high score:', error);
      setApiError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit new score to the server
  const submitScore = async (finalScore: number) => {
    // Always save to localStorage for all users (both guests and logged in)
    try {
      const currentHighScore = localStorage.getItem('mathAsteroids_guestHighScore');
      const parsedHighScore = currentHighScore ? parseInt(currentHighScore, 10) : 0;
      
      // Only update if new score is higher
      if (finalScore > parsedHighScore) {
        localStorage.setItem('mathAsteroids_guestHighScore', finalScore.toString());
      }
    } catch (error) {
      console.log('Error saving to localStorage:', error);
    }
    
    // Skip server submission for guest users
    if (!authState.isAuthenticated || !authState.token) {
      console.log('Guest user, score saved locally only');
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${SCORE_API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ 
          gameId: 'math-asteroids',
          score: finalScore,
          delta: finalScore // Using delta format for score updates
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error
          throw new Error('Authentication expired. Please login again.');
        } else {
          // Other server errors
          throw new Error('Failed to save score. Please try again later.');
        }
      }
      
      const data = await response.json() as ApiScoreUpdateResponse;
      
      // Check if the response contains score data
      if (data.success && data.data && data.data.user) {
        const userScore = data.data.user.score;
        setServerHighScore(userScore);
        
        // Update high score if server score is higher
        if (userScore > gameState.highScore) {
          dispatch({ 
            type: 'UPDATE_HIGH_SCORE', 
            highScore: userScore 
          });
          console.log('New high score saved!', userScore);
        } else {
          console.log('Score submitted but not a new high score');
        }
      }
      
    } catch (error) {
      console.error('Error submitting score:', error);
      setApiError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update asteroids on each animation frame
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver || gameState.isPaused) {
      return;
    }
    
    // Set up game loop timer
    const gameLoopInterval = setInterval(() => {
      // Update asteroid positions and timers
      updateAsteroids();
    }, GAME_MECHANICS.gameTickMs);
    
    // Set up asteroid spawner timer
    const asteroidSpawnerInterval = setInterval(() => {
      // Spawn asteroids based on score
      spawnMultipleAsteroids();
    }, gameState.spawnRate);
    
    // Cleanup intervals on unmount or game state change
    return () => {
      clearInterval(gameLoopInterval);
      clearInterval(asteroidSpawnerInterval);
    };
  }, [
    gameState.isPlaying, 
    gameState.gameOver, 
    gameState.isPaused,
    gameState.spawnRate,
    updateAsteroids,
    spawnMultipleAsteroids
  ]);
  
  // Trigger score updates when score changes
  useEffect(() => {
    if (onScoreUpdate && gameState.isPlaying) {
      onScoreUpdate(gameState.score);
    }
  }, [gameState.score, gameState.isPlaying, onScoreUpdate]);
  
  // Trigger game over callback and submit score to server
  useEffect(() => {
    if (gameState.gameOver) {
      // Call the onGameOver callback if provided
      if (onGameOver) {
        onGameOver(gameState.score);
      }
      
      // Submit the score to the server
      submitScore(gameState.score);
    }
  }, [gameState.gameOver, gameState.score, onGameOver]);
  
  // Handle asteroid time expiration
  const handleAsteroidExpired = useCallback((asteroidId: string) => {
    // End game when asteroid timer expires
    dispatch({ type: 'END_GAME' });
  }, [dispatch]);
  
  // Handle removing an asteroid after explosion
  const handleRemoveAsteroid = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ASTEROID', id });
  }, [dispatch]);
  
  // Handle starting a new game
  const startGame = useCallback(() => {
    // Clear any previous API errors
    setApiError(null);
    
    // Clear any input
    clearInput();
    
    // Start the game
    dispatch({ 
      type: 'START_GAME', 
      settings: {
        initialScore: initialSettings.initialScore ?? DEFAULT_SETTINGS.initialScore,
        initialLevel: initialSettings.initialLevel ?? DEFAULT_SETTINGS.initialLevel,
        difficulty: initialSettings.difficulty ?? DEFAULT_SETTINGS.difficulty,
        soundEnabled: true,
        musicEnabled: true
      }
    });
  }, [dispatch, initialSettings, clearInput]);
  
  // Fetch questions from the server
  const fetchQuestions = async (count = 5, level = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}${QUESTIONS_API_ENDPOINT}?count=${count}&level=${level}&unique=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions. Using local generation instead.');
      }
      
      const data = await response.json();
      if (data.success && data.data && data.data.questions) {
        return data.data.questions;
      } else {
        throw new Error('Invalid question data format');
      }
    } catch (error) {
      console.warn('Error fetching questions from server:', error);
      // Fallback to local question generation
      return Array.from({ length: count }, () => generateQuestion(level));
    }
  };
  
  return (
    <div className="math-asteroids-container">
      {/* Option 1: Canvas-based rendering */}
      <GameCanvas 
        gameState={gameState}
        onAsteroidExpired={handleAsteroidExpired}
      />
      
      {/* Option 2: DOM-based rendering (uncomment to use) */}
      {/* {gameState.isPlaying && !gameState.gameOver && (
        <AsteroidField
          asteroids={gameState.asteroids}
          onRemoveAsteroid={handleRemoveAsteroid}
        />
      )} */}
      
      {/* Game UI */}
      <div className="game-ui">
        {/* API Error Message */}
        {apiError && (
          <div className="api-error">
            <p>{apiError}</p>
            <button 
              className="error-dismiss-button" 
              onClick={() => setApiError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Start Screen */}
        {!gameState.isPlaying && !gameState.gameOver && (
          <div className="start-screen">
            <h1>Math Asteroids</h1>
            <p>Solve math problems to destroy asteroids!</p>
            
            {/* Show high score if available */}
            {(gameState.highScore > 0 || serverHighScore > 0) && (
              <div className="high-score-display">
                <p>Your High Score: {Math.max(gameState.highScore, serverHighScore)}</p>
                {isLoading && <span className="loading-spinner"></span>}
              </div>
            )}
            
            {/* Authentication status message */}
            <div className="auth-status">
              {!authState.isAuthenticated ? (
                <p className="guest-message">
                  Playing as guest. <a href={ROUTES.LOGIN}>Login</a> to save your high scores permanently.
                </p>
              ) : (
                <p className="user-message">
                  Logged in as {authState.user?.username || 'User'}. Your scores will be saved.
                </p>
              )}
            </div>
            
            <button className="start-button" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}
        
        {/* Game Over Screen */}
        {gameState.gameOver && (
          <div className="game-over-screen">
            <h1>Game Over</h1>
            <p>Your Score: {gameState.score}</p>
            <p>High Score: {Math.max(gameState.highScore, serverHighScore)}</p>
            
            {!authState.isAuthenticated ? (
              <div className="guest-score-message">
                <p>Your score was saved locally. <a href={ROUTES.LOGIN}>Login</a> to save permanently.</p>
              </div>
            ) : isLoading ? (
              <div className="saving-score">
                <span className="loading-spinner"></span>
                <p>Saving score...</p>
              </div>
            ) : (
              <div className="score-saved-message">
                <p>Score saved to your profile!</p>
              </div>
            )}
            
            <button className="restart-button" onClick={startGame}>
              Play Again
            </button>
          </div>
        )}
        
        {/* In-Game HUD */}
        {gameState.isPlaying && !gameState.gameOver && (
          <div className="game-hud">
            <div className="score-display">
              <div>Score: {gameState.score}</div>
              <div>High Score: {Math.max(gameState.highScore, serverHighScore)}</div>
              
              {/* Guest indicator during gameplay */}
              {!authState.isAuthenticated && (
                <div className="guest-indicator">
                  <span className="guest-icon">👤</span>
                  <span className="guest-text">Guest Mode</span>
                  <Link to={ROUTES.LOGIN} className="login-link" state={{ from: location.pathname }}>
                    Login to save scores
                  </Link>
                </div>
              )}
            </div>
            
            {/* Player Input */}
            <form className="input-container" onSubmit={handleSubmit}>
              <input
                type="text"
                className={`answer-input ${!isValid ? 'input-error' : ''}`}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type answer..."
                autoFocus
              />
              {errorMessage && (
                <div className="input-error-message">{errorMessage}</div>
              )}
              <button 
                type="submit" 
                className="submit-button"
                disabled={!isValid || !inputValue.trim()}
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathAsteroids; 