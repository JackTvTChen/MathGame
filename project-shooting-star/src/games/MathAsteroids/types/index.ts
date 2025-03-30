/**
 * Math Asteroids Game Data Types
 */

/**
 * Represents a single asteroid with a math question
 */
export interface Asteroid {
  id: string;             // Unique identifier
  question: string;       // The math question (e.g., "3 + 4")
  correctAnswer: number;  // The answer (e.g., 7)
  timeLeft: number;       // Countdown in seconds
  position: {             // Position on screen
    x: number;
    y: number;
  };
  speed: {                // Movement velocity
    x: number;
    y: number;
  };
  size: number;           // Asteroid size (radius in px)
  difficulty: number;     // Question difficulty (1-5)
  isExploding: boolean;   // Flag for explosion animation
  isDestroyed: boolean;   // Flag for removed asteroids
  createdAt: number;      // Timestamp when created
}

/**
 * Difficulty level parameters
 */
export interface DifficultyLevel {
  maxAsteroids: number;   // Maximum simultaneous asteroids
  minSpeed: number;       // Minimum asteroid speed
  maxSpeed: number;       // Maximum asteroid speed
  spawnRate: number;      // Milliseconds between spawns
  timeLimit: number;      // Seconds before asteroid expires
  questionTypes: QuestionType[];  // Available question types
}

/**
 * Question type with operation and range
 */
export interface QuestionType {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'singleDigit';
  minValue: number;       // Minimum value for operands
  maxValue: number;       // Maximum value for operands
}

/**
 * Main game state
 */
export interface GameState {
  score: number;                // Player's current score
  asteroids: Asteroid[];        // Active asteroids
  gameOver: boolean;            // Game over flag
  isPlaying: boolean;           // Game active flag
  level: number;                // Current difficulty level (1-5)
  playerInput: string;          // Current input from player
  highScore: number;            // Highest score achieved
  asteroidCount: number;        // Current number of asteroids to spawn
  maxAsteroids: number;         // Maximum simultaneous asteroids
  spawnRate: number;            // Milliseconds between spawns
  lastSpawnTime: number;        // Timestamp of last asteroid spawn
  startTime: number;            // Timestamp when game started
  elapsedTime: number;          // Time elapsed since game start (seconds)
  isPaused: boolean;            // Game pause state
}

/**
 * Game settings that can be adjusted
 */
export interface GameSettings {
  initialScore: number;         // Starting score (default: 3)
  initialLevel: number;         // Starting level (default: 1)
  soundEnabled: boolean;        // Sound effects toggle
  musicEnabled: boolean;        // Background music toggle
  difficulty: 'easy' | 'normal' | 'hard'; // Overall difficulty setting
}

/**
 * Game action types for state reducer
 */
export type GameAction =
  | { type: 'START_GAME'; settings?: Partial<GameSettings> }
  | { type: 'END_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'ADD_ASTEROID'; asteroid: Asteroid }
  | { type: 'SET_ASTEROIDS'; asteroids: Asteroid[] }
  | { type: 'DESTROY_ASTEROID'; asteroidId: string }
  | { type: 'REMOVE_ASTEROID'; id: string }
  | { type: 'UPDATE_ASTEROIDS'; deltaTime: number }
  | { type: 'SET_PLAYER_INPUT'; input: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'UPDATE_SCORE'; delta: number }
  | { type: 'UPDATE_HIGH_SCORE'; highScore: number }
  | { type: 'UPDATE_GAME_TIME'; elapsedTime: number }
  | { type: 'RESET_GAME' };

/**
 * Index of Math Asteroids game types
 */

// Question types supported by the game
export type QuestionType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'singleDigit';

// Game difficulty levels
export type Difficulty = 'easy' | 'normal' | 'hard';

// Basic position interface
export interface Position {
  x: number;
  y: number;
}

// Asteroid interface
export interface Asteroid {
  id: string;
  position: Position;
  speed: Position;
  size: number;
  question: string;
  correctAnswer: number;
  timeLeft: number;
  maxTime: number;
  isExploding: boolean;
  isDestroyed: boolean;
}

// Game state interface
export interface GameState {
  score: number;
  level: number;
  asteroids: Asteroid[];
  gameOver: boolean;
  isPlaying: boolean;
  playerInput: string;
  highScore: number;
  maxAsteroids: number;
  spawnRate: number;
  lastSpawnTime: number;
  startTime: number;
  elapsedTime: number;
  isPaused: boolean;
  asteroidCount: number;
}

// Game settings interface
export interface GameSettings {
  initialScore?: number;
  initialLevel?: number;
  difficulty?: Difficulty;
  soundEnabled?: boolean;
  musicEnabled?: boolean;
}

// Game action types for the reducer
export type GameAction =
  | { type: 'START_GAME'; settings?: GameSettings }
  | { type: 'END_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'ADD_ASTEROID'; asteroid: Asteroid }
  | { type: 'SET_ASTEROIDS'; asteroids: Asteroid[] }
  | { type: 'DESTROY_ASTEROID'; asteroidId: string }
  | { type: 'REMOVE_ASTEROID'; id: string }
  | { type: 'UPDATE_ASTEROIDS'; deltaTime: number }
  | { type: 'SET_PLAYER_INPUT'; input: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'UPDATE_SCORE'; delta: number }
  | { type: 'UPDATE_HIGH_SCORE'; highScore: number }
  | { type: 'UPDATE_GAME_TIME'; elapsedTime: number }
  | { type: 'RESET_GAME' };

// API Response Types
export interface ApiUserData {
  id: string;
  username: string;
  email: string;
  score: number;
  role: string;
}

export interface ApiProfileResponse {
  success: boolean;
  data?: {
    user: ApiUserData;
  };
  error?: {
    message: string;
  };
}

export interface ApiScoreUpdateResponse {
  success: boolean;
  data?: {
    user: ApiUserData;
  };
  error?: {
    message: string;
  };
} 