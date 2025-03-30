/**
 * Single Digit Question Generator
 * Generates math questions with single-digit operations
 */
import { Question } from './questionGenerator';

/**
 * Supported operators
 */
export type Operator = '+' | '-' | '×' | '÷';

/**
 * Get random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random operator
 */
export function getRandomOperator(): Operator {
  const operators: Operator[] = ['+', '-', '×', '÷'];
  return operators[Math.floor(Math.random() * operators.length)];
}

/**
 * Generate a single-digit arithmetic question
 * Returns a question with text and answer
 */
export function generateSingleDigitQuestion(): Question {
  const operator = getRandomOperator();
  let a: number, b: number;
  
  switch (operator) {
    case '+': // Addition
      a = getRandomInt(1, 9);
      b = getRandomInt(1, 9);
      return {
        text: `${a} + ${b}`,
        answer: a + b
      };
      
    case '-': // Subtraction
      // Ensure non-negative result
      b = getRandomInt(1, 9);
      a = getRandomInt(b, 9);
      return {
        text: `${a} - ${b}`,
        answer: a - b
      };
      
    case '×': // Multiplication
      a = getRandomInt(1, 9);
      b = getRandomInt(1, 9);
      return {
        text: `${a} × ${b}`,
        answer: a * b
      };
      
    case '÷': // Division
      // Ensure whole number result
      b = getRandomInt(1, 9);
      const result = getRandomInt(1, 9);
      a = b * result;
      return {
        text: `${a} ÷ ${b}`,
        answer: result
      };
      
    default:
      // Fallback to addition
      a = getRandomInt(1, 9);
      b = getRandomInt(1, 9);
      return {
        text: `${a} + ${b}`,
        answer: a + b
      };
  }
}

/**
 * Generate a set of unique single-digit questions
 * (no duplicate answers)
 */
export function generateUniqueSingleDigitQuestions(count: number): Question[] {
  const questions: Question[] = [];
  const usedAnswers = new Set<number>();
  
  let attempts = 0;
  const maxAttempts = count * 10; // Avoid infinite loops
  
  while (questions.length < count && attempts < maxAttempts) {
    attempts++;
    const question = generateSingleDigitQuestion();
    
    if (!usedAnswers.has(question.answer)) {
      usedAnswers.add(question.answer);
      questions.push(question);
    }
  }
  
  return questions;
} 