/**
 * Math Asteroids Game
 * Main entry point for the Math Asteroids game
 */

// Export game components
export { GameCanvas } from './components/GameCanvas';

// Export game hooks
export { useAsteroidManager } from './hooks/useAsteroidManager';
export { default as useGameState } from './hooks/useGameState';

// Export game utilities
export { generateQuestion } from './utils/questionGenerator';
export { generateSingleDigitQuestion } from './utils/singleDigitGenerator';
export * from './utils/gameConfig';

// Export types
export * from './types';

import MathAsteroids from './MathAsteroids';

export default MathAsteroids; 