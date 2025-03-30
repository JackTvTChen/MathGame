/**
 * Game Reducer
 * Handles state updates for the Math Asteroids game
 */

import { GameAction, GameState } from '../types';
import { DEFAULT_SETTINGS, GAME_MECHANICS, getAdjustedDifficulty, getLevelFromScore, getSpawnSettingsForScore } from '../utils/gameConfig';

// Initial game state
export const initialGameState: GameState = {
  score: DEFAULT_SETTINGS.initialScore,
  asteroids: [],
  gameOver: false,
  isPlaying: false,
  level: DEFAULT_SETTINGS.initialLevel,
  playerInput: '',
  highScore: 0,
  asteroidCount: 0,
  maxAsteroids: 1,
  spawnRate: 3000,
  lastSpawnTime: 0,
  startTime: 0,
  elapsedTime: 0,
  isPaused: false
};

/**
 * Game reducer function
 */
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const settings = action.settings || {};
      const initialScore = settings.initialScore ?? DEFAULT_SETTINGS.initialScore;
      const initialLevel = settings.initialLevel ?? DEFAULT_SETTINGS.initialLevel;
      
      // Get initial difficulty settings
      const difficultySettings = getAdjustedDifficulty(
        initialLevel,
        settings.difficulty ?? DEFAULT_SETTINGS.difficulty
      );
      
      // Get initial spawn settings
      const spawnSettings = getSpawnSettingsForScore(initialScore);
      
      // Calculate initial max asteroids based on both level and score
      const baseMaxAsteroids = difficultySettings.maxAsteroids;
      const adjustedMaxAsteroids = Math.max(
        baseMaxAsteroids,
        spawnSettings.maxCount + 1 // Add buffer for more challenging gameplay
      );
      
      return {
        ...initialGameState,
        score: initialScore,
        level: initialLevel,
        isPlaying: true,
        gameOver: false,
        startTime: Date.now(),
        highScore: state.highScore, // Preserve high score
        maxAsteroids: adjustedMaxAsteroids,
        spawnRate: difficultySettings.spawnRate
      };
    }
    
    case 'END_GAME': {
      // Update high score if current score is higher
      const newHighScore = Math.max(state.score, state.highScore);
      
      return {
        ...state,
        isPlaying: false,
        gameOver: true,
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
        asteroids: [...state.asteroids, action.asteroid],
        lastSpawnTime: Date.now(),
        asteroidCount: state.asteroidCount + 1
      };
    }
    
    case 'SET_ASTEROIDS': {
      return {
        ...state,
        asteroids: action.asteroids
      };
    }
    
    case 'DESTROY_ASTEROID': {
      // Find the asteroid to destroy
      const asteroidIndex = state.asteroids.findIndex(a => a.id === action.asteroidId);
      
      if (asteroidIndex === -1) {
        // Asteroid not found
        return state;
      }
      
      // Mark asteroid as exploding but keep it in the array for animation
      const updatedAsteroids = [...state.asteroids];
      updatedAsteroids[asteroidIndex] = {
        ...updatedAsteroids[asteroidIndex],
        isExploding: true,
        timeLeft: 1000 // 1 second explosion animation
      };
      
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
      // Clear input regardless of outcome
      const playerInput = state.playerInput.trim();
      
      // Convert player input to a number
      const playerAnswer = parseFloat(playerInput);
      
      // Invalid input (not a number)
      if (isNaN(playerAnswer)) {
        return {
          ...state,
          playerInput: ''
        };
      }
      
      // Check if any asteroid's answer matches the player's answer
      // We use a small epsilon for floating point comparison to account for precision issues
      const EPSILON = 0.0001;
      
      // Find all matching asteroids (not just the first one)
      const matchingAsteroids = state.asteroids.filter(
        asteroid => !asteroid.isExploding && 
                    Math.abs(asteroid.correctAnswer - playerAnswer) < EPSILON
      );
      
      // No matching asteroids found - wrong answer
      if (matchingAsteroids.length === 0) {
        console.log(`Wrong answer: ${playerAnswer} - No matching asteroid`);
        // Wrong answer: deduct points
        const newScore = state.score + GAME_MECHANICS.wrongAnswerPoints;
        
        // Check if score drops below game over threshold
        const gameOver = newScore <= GAME_MECHANICS.gameOverScore;
        
        return {
          ...state,
          score: newScore,
          gameOver,
          playerInput: '',
        };
      }
      
      // Correct answer: add points for each matching asteroid
      console.log(`Correct answer: ${playerAnswer} - Destroying ${matchingAsteroids.length} asteroid(s)`);
      
      // Calculate points based on number of matching asteroids
      const pointsGained = GAME_MECHANICS.correctAnswerPoints * matchingAsteroids.length;
      const newScore = state.score + pointsGained;
      
      // Calculate new level based on score
      const newLevel = getLevelFromScore(newScore);
      const diffSettings = getAdjustedDifficulty(newLevel, DEFAULT_SETTINGS.difficulty);
      
      // Get updated spawn settings based on new score
      const spawnSettings = getSpawnSettingsForScore(newScore);
      
      // Dynamically adjust maxAsteroids based on both level and score
      const baseMaxAsteroids = diffSettings.maxAsteroids;
      const adjustedMaxAsteroids = Math.max(
        baseMaxAsteroids,
        spawnSettings.maxCount + 1 // Add buffer for more challenging gameplay
      );
      
      // Mark all matching asteroids as exploding
      const updatedAsteroids = state.asteroids.map(asteroid => {
        // If this asteroid matches, mark it for explosion
        const isMatch = !asteroid.isExploding && 
                        Math.abs(asteroid.correctAnswer - playerAnswer) < EPSILON;
        
        if (isMatch) {
          return {
            ...asteroid,
            isExploding: true,
            timeLeft: 1000 // 1 second explosion animation
          };
        }
        
        // Otherwise, leave it unchanged
        return asteroid;
      });
      
      return {
        ...state,
        score: newScore,
        level: newLevel,
        maxAsteroids: adjustedMaxAsteroids,
        spawnRate: diffSettings.spawnRate,
        asteroids: updatedAsteroids,
        playerInput: '',
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