# Project Pivot: From Gambling to Math Education

This document summarizes all the changes made to pivot the "Project Shooting Star" from a gambling/betting platform to a math education platform.

## Concept Changes

- **Original Concept**: Online gambling platform with betting games
- **New Concept**: Math education platform with interactive math games

## Key Terminology Changes

| Original Term | New Term | Files Updated |
|--------------|----------|---------------|
| balance | score | User.js, profileController.js, profile.ts, Dashboard.tsx |
| betting | learning progress | README.md, backend/README.md |
| gambling/betting | math education | README.md, backend/README.md |
| Coin Flip, Slots, Roulette, Blackjack | Addition, Multiplication, Equations, Memory | Dashboard.tsx, routes/index.ts |
| balance-card, balance-label, balance-amount | score-card, score-label, score-amount | App.css |
| /balance/update | /score/update | profile.js |
| profileController.js | mathGameController.js | File renamed and updated |
| updateBalance | updateScore | profileController.js, profile.js |

## Files Changed

1. **Backend Models**:
   - `backend/src/models/User.js`: Updated `balance` field to `score`

2. **Backend Controllers**:
   - `backend/src/controllers/profileController.js` → `backend/src/controllers/mathGameController.js`: 
     - Renamed file and updated all occurrences of `balance` to `score`
     - Renamed `updateBalance` to `updateScore` 
   - `backend/src/controllers/auth.controller.js`: Changed default `balance` to `score`
   - `backend/src/controllers/users.controller.js`: Updated references from `balance` to `score`

3. **Backend Routes**:
   - `backend/src/routes/profile.js`: Updated to use mathGameController and changed route path

4. **Frontend Components**:
   - `project-shooting-star/src/pages/Dashboard.tsx`: 
     - Replaced gambling games with math games
     - Updated balance card to score card
     - Changed formatCurrency to formatNumber
   - `project-shooting-star/src/types/profile.ts`: Changed `balance` to `score` in UserProfile interface

5. **CSS Styles**:
   - `project-shooting-star/src/App.css`: Updated classes from balance-related to score-related

6. **Routes**:
   - `project-shooting-star/src/routes/index.ts`: Changed game routes from casino games to math games

7. **Documentation**:
   - `README.md`: Updated project description and features
   - `backend/README.md`: Updated project description and API routes
   - `backend/scripts/api-generator.js`: Updated example resource names
   - `backend/scripts/test-setup.js`: Updated test data
   - `backend/src/docs/example.js`: Updated example data
   - `backend/scripts/doc-generator.js`: Updated documentation templates

## Next Steps

1. Create actual math game components to replace the gambling games
2. Implement leaderboards for educational progress
3. Develop achievement system for learning milestones
4. Add educational content and learning tracks
5. Integrate with educational standards and curriculums 