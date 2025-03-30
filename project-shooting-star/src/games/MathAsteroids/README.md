/**
 * Math Asteroids Game
 * An educational math game with dynamic difficulty
 */

# Math Asteroids

## Game Rules

### Core Mechanics
- Math questions appear on asteroids floating across the screen
- Each asteroid has a countdown timer
- Answer questions correctly to destroy asteroids
- When an asteroid's timer reaches zero, the game ends
- Score points by answering questions correctly

### Scoring System
- +1 point for each correct answer
- -1 point for each incorrect answer 
- Game over when score reaches 0 or any asteroid's timer expires

### Dynamic Difficulty Scaling
- Difficulty increases as your score rises
- Higher scores will spawn more asteroids simultaneously
- Asteroids move faster at higher difficulty levels
- Time to answer questions decreases at higher levels

#### Difficulty Progression by Score:
- **Beginner (0-19 points)**: 1-2 asteroids, normal speed
- **Intermediate (20-39 points)**: 2-3 asteroids, 10% faster, 10% less time
- **Advanced (40-59 points)**: 2-4 asteroids, 20% faster, 20% less time
- **Expert (60-79 points)**: 3-5 asteroids, 30% faster, 30% less time
- **Master (80+ points)**: 3-6 asteroids, 40% faster, 40% less time

### Math Question Types by Level:
- **Level 1**: Addition with numbers 1-10
- **Level 2**: Addition and subtraction with numbers 1-20
- **Level 3**: Addition, subtraction, and multiplication with numbers 1-25
- **Level 4**: Addition, subtraction, multiplication, and division with numbers 1-50
- **Level 5**: Multiplication, division, and mixed operations with numbers 5-20

## Data Structures

### Asteroid
```typescript
interface Asteroid {
  id: string;             // Unique identifier
  question: string;       // The math question (e.g., "3 + 4")
  correctAnswer: number;  // The answer (e.g., 7)
  timeLeft: number;       // Countdown in milliseconds
  position: {             // Position on screen
    x: number;
    y: number;
  };
  speed: {                // Movement velocity
    x: number;
    y: number;
  };
  size: number;           // Asteroid size in pixels
  difficulty: number;     // Question difficulty (1-5)
  isExploding: boolean;   // Flag for explosion animation
  isDestroyed: boolean;   // Flag for removed asteroids
  createdAt: number;      // Timestamp when created
}
```

### GameState
```typescript
interface GameState {
  score: number;          // Player's current score
  asteroids: Asteroid[];  // Active asteroids
  gameOver: boolean;      // Game over flag
  isPlaying: boolean;     // Game active flag
  level: number;          // Current level (1-5)
  playerInput: string;    // Current input from player
  highScore: number;      // Highest score achieved
  maxAsteroids: number;   // Maximum concurrent asteroids
  spawnRate: number;      // Milliseconds between spawns
  isPaused: boolean;      // Game pause state
}
```

## State Management
- Game state is managed using React's `useState` and `useEffect` hooks
- A reducer pattern handles various game actions
- Custom hooks separate game logic from rendering
- `useGameState`: Manages the core game state
- `useAsteroidManager`: Handles asteroid creation, movement, and destruction

## Game Loop Flow
1. Initialize game state
2. Set up animation loop with `requestAnimationFrame`
3. Update asteroid positions and timers
4. Check for expired asteroids
5. Check for game over conditions
6. Render game objects
7. Process player input
8. Repeat until game over

## Implementation Notes
- All gambling references have been removed from the codebase
- The game focuses entirely on educational math content
- Asteroid spawn rate and difficulty scale dynamically with player performance
- Question difficulty increases with level advancement
- Time limits create an engaging challenge while promoting quick mental math
- Single-digit questions are available for beginners

# Question Generation

## Single-Digit Arithmetic

The game includes a specialized single-digit arithmetic question generator (`singleDigitGenerator.ts`) that creates math problems with single-digit operations. This generator is particularly useful for Level 1 of the game and for younger players.

### Features

- Generates addition, subtraction, multiplication, and division questions
- Uses only single-digit numbers (1-9)
- Ensures subtraction results are never negative
- Ensures division results are always whole numbers
- Can generate sets of questions with unique answers

### Example Questions

- Addition: `3 + 4 = 7`
- Subtraction: `8 - 5 = 3`
- Multiplication: `6 × 7 = 42`
- Division: `12 ÷ 4 = 3`

### Integration

The single-digit generator is integrated into the main question generator system and is selected automatically for Level 1 difficulty. The questions progressively become more complex as the player advances through levels.

### API

```typescript
// Generate a single question
const question = generateSingleDigitQuestion();
console.log(question.text);  // e.g., "7 + 2"
console.log(question.answer); // e.g., 9

// Generate multiple unique questions
const uniqueQuestions = generateUniqueSingleDigitQuestions(5);
```

The generator is designed to be easily extensible for future question types and difficulty levels.

## Math Asteroids Game

An educational game that helps players practice arithmetic by shooting down math problem asteroids.

### Game Rules

1. **Objective**: Solve math problems to destroy asteroids before they reach the bottom of the screen.
2. **Gameplay**:
   - Asteroids with math problems appear at the top of the screen and move downward.
   - Each asteroid contains a math problem (e.g., "3 + 4").
   - Players must enter the correct answer in the input field and submit.
   - If the answer is correct, the asteroid explodes.
   - If any asteroid reaches the bottom of the screen or its timer runs out, the game ends.
3. **Scoring**:
   - Correctly answering a problem earns points.
   - The game gets progressively harder with more asteroids and more difficult problems.
   - High scores are saved for returning players.

### Data Structures

#### Game State
The game state includes:
- Player's score
- Current level
- Active asteroids
- Game status (playing, paused, game over)
- Input field value
- High score

#### Asteroid
Each asteroid has:
- Position (x, y)
- Speed
- Math question
- Correct answer
- Time remaining
- Visual state (normal, exploding, destroyed)

### Testing & Quality Assurance

#### Edge Cases Handled

1. **Non-numeric Input**:
   - The input field only accepts numeric characters
   - All non-numeric keypresses are filtered out
   - Empty submissions are ignored

2. **Multiple Matching Answers**:
   - If multiple asteroids have the same answer, they all explode when that answer is submitted
   - Points are awarded for each asteroid destroyed

3. **Score Protection**:
   - Score cannot go below zero
   - Wrong answers reduce score with a safety check to prevent negative scores

4. **Timer Precision**:
   - Time calculations use `deltaTime` to ensure consistent gameplay regardless of frame rate
   - All animations and movements are time-based rather than frame-based

#### Testing Strategy

1. **Unit Tests**:
   - Question generation is thoroughly tested for all operations
   - Tests ensure no division by zero is possible
   - Tests verify that subtraction always produces non-negative results
   - Tests for proper difficulty scaling

2. **Performance Testing**:
   - Animation performance is maintained even with many asteroids
   - Canvas rendering optimizations include:
     - Only drawing active elements
     - Using requestAnimationFrame for smooth animations
     - Cleaning up destroyed asteroids to prevent memory issues

3. **Manual QA Checklist**:
   - Rapid input testing
   - Multiple simultaneous asteroids
   - Testing across different device performances
   - Screen size responsiveness

### Performance Considerations

1. **Rendering Optimization**:
   - Canvas-based rendering for efficiency
   - Object pooling for asteroid creation/destruction
   - Limited particle effects to maintain frame rate

2. **State Management**:
   - Efficient React hooks prevent unnecessary re-renders
   - Memoized calculations for asteroid paths and collisions

3. **Memory Management**:
   - Automatic cleanup of destroyed asteroids
   - Limited history of previous game states

### Installation & Usage

1. **Installation**:
   ```bash
   npm install
   ```

2. **Running the Game**:
   ```bash
   npm run dev
   ```

3. **Building for Production**:
   ```bash
   npm run build
   ```

### Developer Notes

- The game uses HTML Canvas for rendering
- React hooks handle state management
- TypeScript ensures type safety throughout the codebase
- Jest is used for automated testing 

# Guest Play and UI Distinctions

Math Asteroids now supports guest play mode with distinct UI elements that clearly communicate authentication status and features.

## Guest vs. Authenticated UI

### Navigation Bar
- **Guest Banner**: Non-authenticated users see a "Playing as Guest" banner in the navigation bar with a login link
- **User Section**: Authenticated users see their username and a logout button
- **Game Menu**: All users see the Math Asteroids link, but other games are only shown to authenticated users

### Game Interface
- **Guest Indicator**: During gameplay, guest users see a "Guest Mode" indicator with a login link
- **Start Screen**: Different welcome messages appear based on authentication status
- **Game Over Screen**: Guests are prompted to login to save scores permanently, while authenticated users see confirmation of saved scores

### Dashboard
- **Featured Game**: Math Asteroids is highlighted as a featured game available to all users
- **Premium Games**: Other math games are presented as premium features exclusive to registered users

## Implementation Details

The UI adapts based on authentication state:

```jsx
{!authState.isAuthenticated ? (
  <div className="guest-indicator">
    <span className="guest-icon">👤</span>
    <span className="guest-text">Guest Mode</span>
    <Link to={ROUTES.LOGIN} className="login-link">
      Login to save scores
    </Link>
  </div>
) : (
  <div className="user-indicator">
    <span className="username">{authState.user?.username}</span>
  </div>
)}
```

## Data Handling

- **Guests**: Scores saved to localStorage, available only on the current device
- **Authenticated Users**: Scores saved to server database, accessible across devices
- **Question Generation**: Both guest and authenticated users can access the question API 