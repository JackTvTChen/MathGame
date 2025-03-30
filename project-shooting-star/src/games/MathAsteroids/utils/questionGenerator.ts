/**
 * Math Asteroids Question Generator
 * Generates mathematical questions at various difficulty levels
 */

import { QuestionType } from '../types';
import { DIFFICULTY_LEVELS } from './gameConfig';
import { generateSingleDigitQuestion } from './singleDigitGenerator';

/**
 * Standard question interface with text and answer
 */
export interface Question {
  text: string;       // The question text (e.g., "2 + 3")
  answer: number;     // The correct answer (e.g., 5)
}

/**
 * Operation type to ensure proper indexing
 */
export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'singleDigit';

/**
 * Generates a random integer between min and max (inclusive)
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Map of operation generators
 */
export const questionGenerators: Record<OperationType, any> = {
  // Addition (e.g., "3 + 5")
  addition: (min: number, max: number): Question => {
    const a = getRandomInt(min, max);
    const b = getRandomInt(min, max);
    return {
      text: `${a} + ${b}`,
      answer: a + b
    };
  },
  
  // Subtraction (e.g., "8 - 3")
  subtraction: (min: number, max: number): Question => {
    // Ensure a >= b to avoid negative results
    const b = getRandomInt(min, max);
    const a = getRandomInt(b, max);
    return {
      text: `${a} - ${b}`,
      answer: a - b
    };
  },
  
  // Multiplication (e.g., "4 × 6")
  multiplication: (min: number, max: number): Question => {
    const a = getRandomInt(min, max);
    const b = getRandomInt(min, max);
    return {
      text: `${a} × ${b}`,
      answer: a * b
    };
  },
  
  // Division (e.g., "15 ÷ 3")
  division: (min: number, max: number): Question => {
    // Ensure result is a whole number
    const b = getRandomInt(min, max);
    // Generate a that will give whole number result
    const result = getRandomInt(min, max);
    const a = b * result;
    return {
      text: `${a} ÷ ${b}`,
      answer: result
    };
  },
  
  // Mixed operations
  mixed: (min: number, max: number): Question => {
    const operations: OperationType[] = ['addition', 'subtraction', 'multiplication', 'division'];
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    return questionGenerators[randomOp](min, max);
  },
  
  // Single-digit operations (from singleDigitGenerator)
  singleDigit: (): Question => {
    return generateSingleDigitQuestion();
  }
};

/**
 * Predefined difficulty levels for questions
 */
export const difficultyLevels: Record<number, QuestionType[]> = {
  1: [{ operation: 'singleDigit', minValue: 1, maxValue: 9 }],
  2: [
    { operation: 'addition', minValue: 1, maxValue: 20 },
    { operation: 'subtraction', minValue: 1, maxValue: 20 }
  ],
  3: [
    { operation: 'addition', minValue: 5, maxValue: 25 },
    { operation: 'subtraction', minValue: 5, maxValue: 25 },
    { operation: 'multiplication', minValue: 1, maxValue: 10 }
  ],
  4: [
    { operation: 'addition', minValue: 10, maxValue: 50 },
    { operation: 'subtraction', minValue: 10, maxValue: 50 },
    { operation: 'multiplication', minValue: 2, maxValue: 12 },
    { operation: 'division', minValue: 1, maxValue: 10 }
  ],
  5: [
    { operation: 'multiplication', minValue: 5, maxValue: 15 },
    { operation: 'division', minValue: 2, maxValue: 12 },
    { operation: 'mixed', minValue: 5, maxValue: 20 }
  ]
};

/**
 * Get available operations based on level
 */
export const getAvailableOperations = (level: number): OperationType[] => {
  // Default to level 1 if invalid level provided
  const validLevel = level >= 1 && level <= 5 ? level : 1;
  
  // Get question types for this level
  const questionTypes = DIFFICULTY_LEVELS[validLevel]?.questionTypes || [];
  
  // Extract operation names and cast to OperationType
  return questionTypes.map(type => type.operation as OperationType);
};

/**
 * Generate a question based on the current level
 */
export const generateQuestion = (level: number): Question => {
  // Get appropriate operations for this level
  const operations = getAvailableOperations(level);
  
  // Select a random operation
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate question based on operation
  if (operation === 'singleDigit') {
    // Use the single digit generator
    return generateSingleDigitQuestion();
  }
  
  // Get difficulty range for this level
  const validLevel = level >= 1 && level <= 5 ? level : 1;
  const questionType = DIFFICULTY_LEVELS[validLevel]?.questionTypes.find(
    type => type.operation === operation
  ) || { minValue: 1, maxValue: 10 };
  
  // Use the standard question generator with appropriate min/max values
  return questionGenerators[operation](
    questionType.minValue,
    questionType.maxValue
  );
};

/**
 * Generate an array of unique questions
 */
export const generateUniqueQuestions = (count: number, level: number) => {
  const questions = [];
  const answers = new Set();
  
  // Attempt to generate unique questions (by answer)
  for (let i = 0; i < count * 2 && questions.length < count; i++) {
    const question = generateQuestion(level);
    
    // Only add if answer is unique
    if (!answers.has(question.answer)) {
      questions.push(question);
      answers.add(question.answer);
    }
  }
  
  return questions;
}; 