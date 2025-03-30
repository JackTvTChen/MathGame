/**
 * useAsteroidManager Hook
 * Manages the creation, updating, and removal of asteroids
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed: npm install uuid @types/uuid
import { Asteroid, GameState, GameAction } from '../types';
import { 
  CANVAS_DIMENSIONS, 
  GAME_MECHANICS, 
  getSpawnCount, 
  getSpawnSettingsForScore 
} from '../utils/gameConfig';
import { generateQuestion, Question } from '../utils/questionGenerator';
import { API_BASE_URL } from '../../../utils/apiConfig';

// Canvas dimensions - should match GameCanvas
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Asteroid sizes
const MIN_ASTEROID_SIZE = 30;
const MAX_ASTEROID_SIZE = 50;

// Time limits
const BASE_TIME_LIMIT = 10000; // 10 seconds in ms

interface AsteroidManagerProps {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
  isPlaying: boolean;
  gameOver: boolean;
}

// Cache for server-fetched questions
let questionCache: Array<{ text: string, answer: number }> = [];
const QUESTIONS_API_ENDPOINT = '/api/game/questions';

/**
 * Custom hook to manage asteroids in the game
 */
export const useAsteroidManager = ({
  gameState,
  dispatch,
  isPlaying,
  gameOver
}: AsteroidManagerProps) => {
  const lastUpdateTime = useRef<number>(Date.now());
  
  /**
   * Fetch questions from the server and cache them
   */
  const ensureQuestionCache = useCallback(async (level: number) => {
    // If we have enough cached questions, don't fetch more
    if (questionCache.length >= 10) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${QUESTIONS_API_ENDPOINT}?count=20&level=${level}&unique=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      if (data.success && data.data && data.data.questions) {
        // Add new questions to the cache
        questionCache = [
          ...questionCache,
          ...data.data.questions
        ];
      }
    } catch (error) {
      console.warn('Error fetching questions, will use local generation:', error);
    }
  }, []);
  
  /**
   * Get a question - either from cache or generate locally
   */
  const getQuestion = useCallback((level: number) => {
    // Try to get a question from the cache
    if (questionCache.length > 0) {
      const randomIndex = Math.floor(Math.random() * questionCache.length);
      const question = questionCache[randomIndex];
      
      // Remove the used question from cache
      questionCache = questionCache.filter((_, index) => index !== randomIndex);
      
      return question;
    }
    
    // Fallback to local question generation
    return generateQuestion(level);
  }, []);
  
  /**
   * Update positions and timers for all asteroids
   */
  const updateAsteroids = useCallback(() => {
    if (!isPlaying || gameOver) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime.current;
    lastUpdateTime.current = currentTime;
    
    // Find any expired asteroids
    const expiredAsteroids = gameState.asteroids.filter(
      a => !a.isDestroyed && !a.isExploding && a.timeLeft <= 0
    );
    
    // End game if any asteroid expired
    if (expiredAsteroids.length > 0) {
      console.log(`Game over! Asteroid timer expired`, expiredAsteroids[0]);
      dispatch({ type: 'END_GAME' });
      return;
    }
    
    // Update all asteroids with the time delta
    dispatch({ type: 'UPDATE_ASTEROIDS', deltaTime });
    
    // Clean up destroyed asteroids after some time
    const activeSteroids = gameState.asteroids.filter(
      a => !a.isDestroyed && !a.isExploding
    );
    
    if (activeSteroids.length === 0 && gameState.asteroids.length > 20) {
      // Clean up old asteroids to prevent memory issues
      const newAsteroids = gameState.asteroids.slice(-10);
      dispatch({ type: 'SET_ASTEROIDS', asteroids: newAsteroids });
    }
  }, [dispatch, gameState.asteroids, isPlaying, gameOver]);
  
  /**
   * Create a new asteroid with randomized properties
   */
  const spawnAsteroid = useCallback(async () => {
    if (!isPlaying || gameOver) return;
    
    // Ensure we have questions in cache
    await ensureQuestionCache(gameState.level);
    
    // Get current difficulty settings based on score
    const spawnSettings = getSpawnSettingsForScore(gameState.score);
    
    // Random size with level-based scaling
    const size = Math.floor(
      Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE) + MIN_ASTEROID_SIZE
    );
    
    // Random starting position (only along the top)
    const horizontalPadding = size * 2;
    const x = Math.random() * (CANVAS_WIDTH - horizontalPadding * 2) + horizontalPadding;
    const y = -size; // Start just above the canvas
    
    // Get a question - either from cache or generate locally
    const questionObj = getQuestion(gameState.level);
    
    // Calculate time limit based on difficulty
    const timeMultiplier = spawnSettings.timeMultiplier || 1;
    const timeLimit = BASE_TIME_LIMIT * timeMultiplier;
    
    // Calculate movement speed based on difficulty
    const speedBase = 30 + (gameState.level * 5); // Base speed increases with level
    const speedMultiplier = spawnSettings.speedMultiplier || 1;
    const speedY = (speedBase * speedMultiplier) / 1000; // Convert to pixels per ms
    
    // Create the asteroid
    const newAsteroid: Asteroid = {
      id: uuidv4(),
      position: { x, y },
      speed: { 
        x: 0, // No horizontal movement
        y: speedY  // Only move downward
      },
      size,
      question: questionObj.text,
      correctAnswer: questionObj.answer,
      timeLeft: timeLimit,
      maxTime: timeLimit,
      isExploding: false,
      isDestroyed: false,
      difficulty: gameState.level,
      createdAt: Date.now()
    };
    
    // Add the asteroid to the game state
    dispatch({ type: 'ADD_ASTEROID', asteroid: newAsteroid });
    
    return newAsteroid;
  }, [dispatch, gameState.level, gameState.score, isPlaying, gameOver, getQuestion, ensureQuestionCache]);
  
  /**
   * Spawn multiple asteroids based on current score
   */
  const spawnMultipleAsteroids = useCallback(() => {
    if (!isPlaying || gameOver) return;
    
    // Get active asteroid count
    const activeAsteroids = gameState.asteroids.filter(
      a => !a.isDestroyed && !a.isExploding
    ).length;
    
    // Get spawn count based on current score
    const currentSpawnCount = getSpawnCount(gameState.score);
    
    // Only spawn if we don't exceed the max asteroid count
    const maxAllowed = Math.min(currentSpawnCount, gameState.maxAsteroids);
    const needToSpawn = Math.max(0, maxAllowed - activeAsteroids);
    
    // Spawn needed asteroids
    for (let i = 0; i < needToSpawn; i++) {
      spawnAsteroid();
    }
  }, [gameState.asteroids, gameState.maxAsteroids, gameState.score, spawnAsteroid, isPlaying, gameOver]);
  
  // Update the game animation loop to use the new multi-spawn logic
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    let animationFrameId: number;
    let lastSpawnWaveTime = 0;
    
    // Main animation loop
    const gameLoop = (timestamp: number) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp;
      }
      
      // Calculate time difference
      const deltaTime = timestamp - lastUpdateTime.current;
      lastUpdateTime.current = timestamp;
      
      // Update asteroid positions and timers
      updateAsteroids();
      
      // Check if we should spawn a new wave of asteroids
      const now = Date.now();
      const timeSinceLastWave = now - lastSpawnWaveTime;
      
      if (timeSinceLastWave > gameState.spawnRate) {
        spawnMultipleAsteroids();
        lastSpawnWaveTime = now;
      }
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    animationFrameId = requestAnimationFrame(gameLoop);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, gameOver, updateAsteroids, spawnMultipleAsteroids, gameState.spawnRate]);
  
  // Destroy an asteroid when a correct answer is given
  const destroyAsteroid = useCallback((asteroidId: string) => {
    dispatch({
      type: 'DESTROY_ASTEROID',
      asteroidId
    });
    
    // Remove asteroid from state after animation
    setTimeout(() => {
      dispatch({
        type: 'REMOVE_ASTEROID',
        id: asteroidId
      });
    }, 1000); // 1 second for explosion animation
  }, [dispatch]);
  
  // Reset all asteroids
  const resetAsteroids = useCallback(() => {
    dispatch({
      type: 'SET_ASTEROIDS',
      asteroids: []
    });
    
    lastUpdateTime.current = Date.now();
  }, [dispatch]);
  
  return {
    updateAsteroids,
    spawnAsteroid,
    spawnMultipleAsteroids,
    destroyAsteroid,
    resetAsteroids
  };
}; 