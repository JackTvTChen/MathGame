import { generateQuestion, generateSingleDigitQuestion, generateUniqueSingleDigitQuestions } from './questionGenerator';
import { generateSingleDigitQuestion as singleDigitGenerator } from './singleDigitGenerator';

describe('Question Generator Tests', () => {
  describe('generateQuestion', () => {
    test('generates addition questions for level 1', () => {
      const question = generateQuestion(1);
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('answer');
      expect(typeof question.text).toBe('string');
      expect(typeof question.answer).toBe('number');
    });

    test('generates questions with correct difficulty for each level', () => {
      // Test multiple levels
      for (let level = 1; level <= 5; level++) {
        const question = generateQuestion(level);
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('answer');

        // Ensure the answer is a number
        expect(typeof question.answer).toBe('number');
        expect(Number.isFinite(question.answer)).toBe(true);
      }
    });

    test('handles invalid level input gracefully', () => {
      // Test with invalid levels
      const invalidLevels = [0, -1, 6, NaN, Infinity];
      
      invalidLevels.forEach(level => {
        const question = generateQuestion(level as number);
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('answer');
        expect(typeof question.answer).toBe('number');
      });
    });
  });

  describe('Single Digit Question Generation', () => {
    test('generates valid single digit questions', () => {
      const question = singleDigitGenerator();
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('answer');
      expect(typeof question.text).toBe('string');
      expect(typeof question.answer).toBe('number');
    });

    test('generates addition questions with correct answers', () => {
      // Force 10 addition operations
      for (let i = 0; i < 10; i++) {
        const question = singleDigitGenerator('addition');
        
        // Extract operands from question text (format: "a + b")
        const [a, b] = question.text.split('+').map(n => parseInt(n.trim()));
        
        expect(a).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThanOrEqual(9);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(9);
        expect(question.answer).toBe(a + b);
      }
    });

    test('generates subtraction questions with non-negative answers', () => {
      // Force 10 subtraction operations
      for (let i = 0; i < 10; i++) {
        const question = singleDigitGenerator('subtraction');
        
        // Extract operands from question text (format: "a - b")
        const [a, b] = question.text.split('-').map(n => parseInt(n.trim()));
        
        expect(a).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThanOrEqual(9);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(9);
        expect(a).toBeGreaterThanOrEqual(b); // Ensure a >= b for non-negative results
        expect(question.answer).toBe(a - b);
        expect(question.answer).toBeGreaterThanOrEqual(0);
      }
    });

    test('generates multiplication questions with correct answers', () => {
      // Force 10 multiplication operations
      for (let i = 0; i < 10; i++) {
        const question = singleDigitGenerator('multiplication');
        
        // Extract operands from question text (format: "a × b" or "a x b")
        const parts = question.text.includes('×') 
          ? question.text.split('×') 
          : question.text.split('x');
        
        const [a, b] = parts.map(n => parseInt(n.trim()));
        
        expect(a).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThanOrEqual(9);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(9);
        expect(question.answer).toBe(a * b);
      }
    });

    test('generates division questions with integer answers', () => {
      // Force 10 division operations
      for (let i = 0; i < 10; i++) {
        const question = singleDigitGenerator('division');
        
        // Extract operands from question text (format: "a ÷ b")
        const [a, b] = question.text.split('÷').map(n => parseInt(n.trim()));
        
        expect(b).toBeGreaterThan(0); // No division by zero
        expect(b).toBeLessThanOrEqual(9);
        expect(question.answer).toBe(a / b);
        expect(Number.isInteger(question.answer)).toBe(true); // Answer must be an integer
      }
    });

    test('generates unique questions with no duplicate answers', () => {
      // Generate 5 unique questions
      const count = 5;
      const questions = generateUniqueSingleDigitQuestions(count);
      
      // Check count
      expect(questions.length).toBe(count);
      
      // Check for uniqueness
      const answers = questions.map(q => q.answer);
      const uniqueAnswers = [...new Set(answers)];
      expect(uniqueAnswers.length).toBe(count); // All answers should be unique
    });

    test('handles edge case when requesting more unique questions than possible', () => {
      // Request an unreasonably high number of unique questions
      const questions = generateUniqueSingleDigitQuestions(1000, 'addition', 1, 3);
      
      // Should return as many unique questions as possible
      // For single digit addition with numbers 1-3, max possible unique answers = 9
      expect(questions.length).toBeLessThanOrEqual(9);
      
      // Verify answers are unique
      const answers = questions.map(q => q.answer);
      const uniqueAnswers = [...new Set(answers)];
      expect(uniqueAnswers.length).toBe(questions.length);
    });
  });

  describe('Edge Cases', () => {
    test('ensures no division by zero', () => {
      for (let i = 0; i < 50; i++) {
        const question = singleDigitGenerator('division');
        const [_, divisor] = question.text.split('÷').map(n => parseInt(n.trim()));
        expect(divisor).not.toBe(0);
      }
    });

    test('ensures no negative answers in subtraction', () => {
      for (let i = 0; i < 50; i++) {
        const question = singleDigitGenerator('subtraction');
        expect(question.answer).toBeGreaterThanOrEqual(0);
      }
    });

    test('handles maximum attempt limits for unique questions', () => {
      // Extremely limited range that can only produce a few unique answers
      const questions = generateUniqueSingleDigitQuestions(20, 'addition', 1, 2);
      
      // Only (1+1, 1+2, 2+1, 2+2) possible, so max 3 unique answers (2, 3, 4)
      expect(questions.length).toBeLessThanOrEqual(3);
      
      // Verify answers are unique
      const answers = questions.map(q => q.answer);
      const uniqueAnswers = [...new Set(answers)];
      expect(uniqueAnswers.length).toBe(questions.length);
    });
  });
}); 