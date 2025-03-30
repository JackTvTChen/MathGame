/**
 * Math Asteroids Game Configuration
 * Contains all settings and default values for the game
 */

import { DifficultyLevel, GameSettings, Difficulty } from '../types';

/**
 * Default game settings
 */
export const DEFAULT_SETTINGS: GameSettings = {
  initialScore: 0,
  initialLevel: 1,
  difficulty: 'normal' as Difficulty,
  soundEnabled: true,
  musicEnabled: true
};

/**
 * Canvas dimensions and settings
 */
export const CANVAS_CONFIG = {
  width: 800,             // Canvas width in pixels
  height: 600,            // Canvas height in pixels
  backgroundColor: '#0a0a20', // Dark blue space background
  starCount: 100          // Number of background stars
};

/**
 * Canvas dimensions - alternative constant with uppercase naming
 */
export const CANVAS_DIMENSIONS = {
  WIDTH: 800,             // Canvas width in pixels
  HEIGHT: 600,            // Canvas height in pixels
  BACKGROUND: '#0a0a20',  // Dark blue space background
  STAR_COUNT: 100         // Number of background stars
};

/**
 * Game mechanics constants
 */
export const GAME_MECHANICS = {
  gameTickMs: 16, // ~60fps
  timePerAsteroid: 10000, // 10 seconds in ms
  timeBonusPerCorrectAnswer: 2000, // 2 seconds bonus per correct answer
  scorePerAsteroid: 1,
  penaltyPerMiss: -1,
  asteroidSize: 40,
  asteroidBaseSpeed: 0.05 // pixels per ms
};

/**
 * Difficulty level settings
 */
export const DIFFICULTY_LEVELS: Record<Difficulty, {
  maxAsteroids: number,
  speedMultiplier: number,
  timeMultiplier: number
}> = {
  easy: {
    maxAsteroids: 3,
    speedMultiplier: 0.7,
    timeMultiplier: 1.3 // More time per asteroid
  },
  normal: {
    maxAsteroids: 5,
    speedMultiplier: 1.0,
    timeMultiplier: 1.0
  },
  hard: {
    maxAsteroids: 7,
    speedMultiplier: 1.3,
    timeMultiplier: 0.7 // Less time per asteroid
  }
};

/**
 * Difficulty mode multipliers
 * Adjust game parameters based on selected difficulty
 */
export const DIFFICULTY_MULTIPLIERS = {
  easy: {
    timeLimit: 1.25,      // 25% more time
    spawnRate: 1.25,      // 25% slower spawning
    speed: 0.75           // 25% slower asteroids
  },
  normal: {
    timeLimit: 1.0,       // Standard time
    spawnRate: 1.0,       // Standard spawn rate
    speed: 1.0            // Standard speed
  },
  hard: {
    timeLimit: 0.75,      // 25% less time
    spawnRate: 0.75,      // 25% faster spawning
    speed: 1.25           // 25% faster asteroids
  }
};

/**
 * Spawn settings based on score ranges
 */
export const SPAWN_SETTINGS = [
  {
    // Beginner level (0-19 points)
    scoreRange: [0, 19],
    minCount: 1,
    maxCount: 2,
    speedMultiplier: 0.8,
    timeMultiplier: 1.2
  },
  {
    // Intermediate level (20-49 points)
    scoreRange: [20, 49],
    minCount: 2,
    maxCount: 3,
    speedMultiplier: 1.0,
    timeMultiplier: 1.0
  },
  {
    // Advanced level (50-99 points)
    scoreRange: [50, 99],
    minCount: 2,
    maxCount: 4,
    speedMultiplier: 1.2,
    timeMultiplier: 0.9
  },
  {
    // Expert level (100-199 points)
    scoreRange: [100, 199],
    minCount: 3,
    maxCount: 5,
    speedMultiplier: 1.4,
    timeMultiplier: 0.8
  },
  {
    // Master level (200+ points)
    scoreRange: [200, Infinity],
    minCount: 4,
    maxCount: 6,
    speedMultiplier: 1.6,
    timeMultiplier: 0.7
  }
];

/**
 * Get spawn settings based on current score
 */
export function getSpawnSettingsForScore(score: number) {
  const settings = SPAWN_SETTINGS.find(
    setting => score >= setting.scoreRange[0] && score <= setting.scoreRange[1]
  );
  
  return settings || SPAWN_SETTINGS[0]; // Default to first level if no match
}

/**
 * Get number of asteroids to spawn based on score
 */
export function getSpawnCount(score: number) {
  const settings = getSpawnSettingsForScore(score);
  return Math.floor(
    Math.random() * (settings.maxCount - settings.minCount + 1) + settings.minCount
  );
}

/**
 * Get difficulty level from numeric score
 */
export function getLevelFromScore(score: number): number {
  if (score < 10) return 1;
  if (score < 30) return 2;
  if (score < 60) return 3;
  if (score < 100) return 4;
  return 5;
}

/**
 * Get adjusted difficulty settings based on level and difficulty
 */
export function getAdjustedDifficulty(level: number, difficulty: Difficulty) {
  const baseSettings = DIFFICULTY_LEVELS[difficulty];
  const levelFactor = Math.min(1 + (level - 1) * 0.2, 2); // Cap at 2x for level 5
  
  return {
    maxAsteroids: Math.floor(baseSettings.maxAsteroids * levelFactor),
    speedMultiplier: baseSettings.speedMultiplier * (1 + (level - 1) * 0.1),
    timeMultiplier: baseSettings.timeMultiplier * (1 - (level - 1) * 0.05),
    spawnRate: Math.max(3000 - (level - 1) * 500, 1000) // Faster spawns at higher levels
  };
} 