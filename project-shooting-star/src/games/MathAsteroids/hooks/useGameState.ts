/**
 * Math Asteroids Game State Hook
 * 
 * Note: This implementation requires the uuid package:
 * npm install uuid
 * npm install @types/uuid --save-dev
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package
import { Asteroid, GameAction, GameSettings, GameState } from '../types';
import { DEFAULT_SETTINGS, GAME_MECHANICS, getAdjustedDifficulty, getLevelFromScore } from '../utils/gameConfig';
import { generateQuestion } from '../utils/questionGenerator';

/**
 * Initial game state
 */
export const initialGameState: GameState = {
  score: DEFAULT_SETTINGS.initialScore,
  level: DEFAULT_SETTINGS.initialLevel,
  asteroids: [],
  gameOver: false,
  isPlaying: false,
  playerInput: '',
  highScore: 0,
  maxAsteroids: 1,
  spawnRate: 3000,
  lastSpawnTime: 0,
  startTime: 0,
  elapsedTime: 0,
  isPaused: false,
  asteroidCount: 0
};

/**
 * Game reducer for managing state transitions
 */
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const settings = action.settings || {};
      const initialScore = settings.initialScore ?? DEFAULT_SETTINGS.initialScore;
      const initialLevel = settings.initialLevel ?? DEFAULT_SETTINGS.initialLevel;
      
      return {
        ...initialGameState,
        score: initialScore,
        level: initialLevel,
        isPlaying: true,
        gameOver: false,
        startTime: Date.now(),
        highScore: state.highScore, // Preserve high score
        maxAsteroids: initialLevel + 1,
        spawnRate: 3000 / initialLevel
      };
    }
    
    case 'END_GAME': {
      // Update high score if current score is higher
      const newHighScore = Math.max(state.score, state.highScore);
      
      return {
        ...state,
        gameOver: true,
        isPlaying: false,
        highScore: newHighScore
      };
    }
    
    case 'PAUSE_GAME': {
      return {
        ...state,
        isPaused: true
      };
    }
    
    case 'RESUME_GAME': {
      return {
        ...state,
        isPaused: false
      };
    }
    
    case 'ADD_ASTEROID': {
      return {
        ...state,
        asteroids: [...state.asteroids, action.asteroid]
      };
    }
    
    case 'SET_ASTEROIDS': {
      return {
        ...state,
        asteroids: action.asteroids
      };
    }
    
    case 'DESTROY_ASTEROID': {
      // Mark asteroid as exploding
      const updatedAsteroids = state.asteroids.map(asteroid => 
        asteroid.id === action.asteroidId
          ? { ...asteroid, isExploding: true }
          : asteroid
      );
      
      return {
        ...state,
        asteroids: updatedAsteroids
      };
    }
    
    case 'REMOVE_ASTEROID': {
      // Mark asteroid as destroyed
      const updatedAsteroids = state.asteroids.map(asteroid => 
        asteroid.id === action.id
          ? { ...asteroid, isDestroyed: true }
          : asteroid
      );
      
      return {
        ...state,
        asteroids: updatedAsteroids
      };
    }
    
    case 'UPDATE_ASTEROIDS': {
      // Update asteroids based on elapsed time
      const updatedAsteroids = state.asteroids.map(asteroid => {
        if (asteroid.isExploding || asteroid.isDestroyed) {
          return asteroid;
        }
        
        // Update asteroid position
        const newPosition = {
          x: asteroid.position.x + asteroid.speed.x * (action.deltaTime / 1000),
          y: asteroid.position.y + asteroid.speed.y * (action.deltaTime / 1000)
        };
        
        // Update timer
        const newTimeLeft = asteroid.timeLeft - action.deltaTime;
        
        return {
          ...asteroid,
          position: newPosition,
          timeLeft: newTimeLeft
        };
      });
      
      return {
        ...state,
        asteroids: updatedAsteroids
      };
    }
    
    case 'SET_PLAYER_INPUT': {
      return {
        ...state,
        playerInput: action.input
      };
    }
    
    case 'SUBMIT_ANSWER': {
      // Check if there's an input
      if (!state.playerInput.trim()) {
        return state;
      }
      
      const playerAnswer = parseInt(state.playerInput, 10);
      
      // Find matching asteroids
      const matchingAsteroids = state.asteroids.filter(
        asteroid => 
          !asteroid.isExploding && 
          !asteroid.isDestroyed && 
          asteroid.correctAnswer === playerAnswer
      );
      
      if (matchingAsteroids.length === 0) {
        // Incorrect answer: deduct points
        console.log(`Incorrect answer: ${playerAnswer}`);
        const newScore = Math.max(0, state.score - 1);
        
        // Check if score dropped to 0 (game over)
        if (newScore === 0) {
          return {
            ...state,
            score: newScore,
            playerInput: '',
            gameOver: true,
            isPlaying: false,
            highScore: Math.max(state.highScore, state.score)
          };
        }
        
        return {
          ...state,
          score: newScore,
          playerInput: ''
        };
      }
      
      // Correct answer: add points for each matching asteroid
      console.log(`Correct answer: ${playerAnswer} - Destroying ${matchingAsteroids.length} asteroid(s)`);
      
      const newScore = state.score + matchingAsteroids.length;
      
      // Calculate new level based on score
      const newLevel = Math.min(5, Math.floor(newScore / 10) + 1);
      
      // Mark all matching asteroids as exploding
      const updatedAsteroids = state.asteroids.map(asteroid => {
        if (matchingAsteroids.some(a => a.id === asteroid.id)) {
          return { ...asteroid, isExploding: true };
        }
        return asteroid;
      });
      
      return {
        ...state,
        score: newScore,
        level: newLevel,
        maxAsteroids: newLevel + 1,
        spawnRate: 3000 / newLevel,
        asteroids: updatedAsteroids,
        playerInput: '',
      };
    }
    
    case 'UPDATE_SCORE': {
      const newScore = state.score + action.delta;
      
      // Check for game over
      if (newScore <= 0) {
        return {
          ...state,
          score: 0,
          gameOver: true,
          isPlaying: false,
          highScore: Math.max(state.highScore, state.score)
        };
      }
      
      // Calculate new level based on score
      const newLevel = Math.min(5, Math.floor(newScore / 10) + 1);
      
      return {
        ...state,
        score: newScore,
        level: newLevel,
        maxAsteroids: newLevel + 1,
        spawnRate: 3000 / newLevel
      };
    }
    
    case 'UPDATE_HIGH_SCORE': {
      return {
        ...state,
        highScore: action.highScore
      };
    }
    
    case 'UPDATE_GAME_TIME': {
      return {
        ...state,
        elapsedTime: action.elapsedTime
      };
    }
    
    case 'RESET_GAME': {
      return {
        ...initialGameState,
        highScore: state.highScore // Preserve high score
      };
    }
    
    default:
      return state;
  }
};

/**
 * Custom hook for game state management
 */
const useGameState = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  
  return {
    gameState,
    dispatch
  };
};

export default useGameState; 