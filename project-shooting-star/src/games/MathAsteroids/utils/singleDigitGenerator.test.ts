/**
 * Tests for the Single-Digit Arithmetic Question Generator
 */

import { generateSingleDigitQuestion, generateUniqueSingleDigitQuestions } from './singleDigitGenerator';

describe('Single-Digit Question Generator', () => {
  describe('generateSingleDigitQuestion', () => {
    test('generates a question with text and answer properties', () => {
      const question = generateSingleDigitQuestion();
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('answer');
      expect(typeof question.text).toBe('string');
      expect(typeof question.answer).toBe('number');
    });

    test('generates addition questions with single-digit operands', () => {
      // Mock random to always return addition
      jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
      
      const question = generateSingleDigitQuestion();
      expect(question.text).toMatch(/^\d \+ \d$/);
      
      // Extract numbers from the question
      const [a, b] = question.text.split(' + ').map(Number);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(9);
      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(9);
      expect(question.answer).toBe(a + b);
      
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    test('generates subtraction questions with non-negative results', () => {
      // Mock random to always return subtraction
      jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
      
      const question = generateSingleDigitQuestion();
      expect(question.text).toMatch(/^\d - \d$/);
      
      // Extract numbers from the question
      const [a, b] = question.text.split(' - ').map(Number);
      expect(a).toBeGreaterThanOrEqual(b); // First number should be >= second
      expect(question.answer).toBe(a - b);
      
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    test('generates multiplication questions with single-digit factors', () => {
      // Mock random to always return multiplication
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
      
      const question = generateSingleDigitQuestion();
      expect(question.text).toMatch(/^\d × \d$/);
      
      // Extract numbers from the question
      const [a, b] = question.text.split(' × ').map(Number);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(9);
      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(9);
      expect(question.answer).toBe(a * b);
      
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    test('generates division questions with integer results', () => {
      // Mock random to always return division
      jest.spyOn(global.Math, 'random').mockReturnValue(0.8);
      
      const question = generateSingleDigitQuestion();
      expect(question.text).toMatch(/^\d+ ÷ \d$/);
      
      // Extract numbers from the question
      const [a, b] = question.text.split(' ÷ ').map(Number);
      expect(question.answer).toBe(a / b);
      expect(Number.isInteger(question.answer)).toBe(true);
      
      jest.spyOn(global.Math, 'random').mockRestore();
    });
  });

  describe('generateUniqueSingleDigitQuestions', () => {
    test('generates the requested number of unique questions', () => {
      const count = 5;
      const questions = generateUniqueSingleDigitQuestions(count);
      
      expect(questions).toHaveLength(count);
      
      // Check that all answers are unique
      const answers = questions.map(q => q.answer);
      const uniqueAnswers = new Set(answers);
      expect(uniqueAnswers.size).toBe(count);
    });

    test('handles case when unique questions exceed available combinations', () => {
      // There are limited single-digit combinations, so asking for too many
      // should return as many unique ones as possible
      const count = 100; // Much more than possible unique combinations
      const questions = generateUniqueSingleDigitQuestions(count);
      
      // Check that all answers are unique
      const answers = questions.map(q => q.answer);
      const uniqueAnswers = new Set(answers);
      expect(uniqueAnswers.size).toBe(questions.length);
      
      // We should have fewer than the requested count
      expect(questions.length).toBeLessThan(count);
    });
  });
}); 