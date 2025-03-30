/**
 * Demonstration of the Single-Digit Question Generator
 * 
 * This file shows how to use the generator and displays examples
 * of each type of question it can produce.
 */

import { generateSingleDigitQuestion, generateUniqueSingleDigitQuestions } from '../utils/singleDigitGenerator';

// Example usage of the generator
const runDemo = () => {
  console.log("Single-Digit Math Question Generator Demo");
  console.log("=========================================");
  
  // Generate and display 10 random questions
  console.log("\nRandom Questions:");
  for (let i = 0; i < 10; i++) {
    const question = generateSingleDigitQuestion();
    console.log(`Question ${i+1}: ${question.text} = ${question.answer}`);
  }
  
  // Generate a set of unique questions
  console.log("\nUnique Questions (no duplicate answers):");
  const uniqueQuestions = generateUniqueSingleDigitQuestions(5);
  uniqueQuestions.forEach((question, index) => {
    console.log(`Question ${index+1}: ${question.text} = ${question.answer}`);
  });
  
  // Demonstrate integration with game
  console.log("\nGame Integration Example:");
  console.log("When an asteroid is created, it gets assigned a question:");
  
  const asteroid1 = {
    id: "asteroid-1",
    position: { x: 100, y: 200 },
    speed: 50,
    size: 60,
    ...generateSingleDigitQuestion()
  };
  
  const asteroid2 = {
    id: "asteroid-2",
    position: { x: 300, y: 150 },
    speed: 70,
    size: 50,
    ...generateSingleDigitQuestion()
  };
  
  console.log(asteroid1);
  console.log(asteroid2);
  
  // Demonstrate checking an answer
  console.log("\nAnswer Checking Example:");
  const question = generateSingleDigitQuestion();
  console.log(`Question: ${question.text}`);
  
  const correctAnswer = question.answer;
  const wrongAnswer = correctAnswer + 1;
  
  console.log(`User enters ${correctAnswer}. Correct? ${correctAnswer === question.answer}`);
  console.log(`User enters ${wrongAnswer}. Correct? ${wrongAnswer === question.answer}`);
};

// Export the demo function
export { runDemo }; 