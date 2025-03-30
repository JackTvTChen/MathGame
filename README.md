# Project Shooting Star

A full-stack math education platform with a React frontend and Node.js backend.

## Overview

Project Shooting Star is a modern web application for interactive math learning. It features a responsive frontend built with React, TypeScript, and Vite, and a robust backend API built with Node.js, Express, and MongoDB.

## Project Structure

This project is organized as a monorepo with three key package.json files:

```
project-shooting-star/
├── package.json           # Root package.json for project orchestration
├── backend/               # Node.js Express API
│   └── package.json       # Backend-specific dependencies
└── project-shooting-star/ # React frontend
    └── package.json       # Frontend-specific dependencies
```

### Package Management Structure

This project uses a monorepo approach with multiple package.json files:

1. **Root package.json**: Orchestrates the entire project with scripts that coordinate between frontend and backend. Contains shared dependencies and development utilities.

2. **Backend package.json**: Contains Express, MongoDB, and other backend-specific dependencies.

3. **Frontend package.json**: Contains React, TypeScript, and other frontend-specific dependencies.

### Running Scripts

All development scripts can be run from the root directory:

- `npm run dev`: Start both frontend and backend development servers
- `npm run build`: Build the frontend for production and lint the backend
- `npm run start`: Run the production version of both servers
- `npm run lint`: Run linters for both frontend and backend
- `npm run test`: Run backend tests
- `npm run project`: Launch the interactive project manager

## Features

- 🔐 **User Authentication**: Secure login, registration, and JWT-based auth
- 👤 **User Profiles**: User information and score management
- 🎮 **Math Games**: Various educational math games
- 📊 **Progress Tracking**: Track learning progress and achievements
- 📈 **Leaderboards**: Compete with other players (coming soon)

## Tech Stack

### Frontend
- **React**: UI library
- **TypeScript**: Type safety
- **React Router**: Routing
- **Context API**: State management
- **CSS Modules**: Styling
- **Vite**: Build tool and dev server

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **Jest**: Testing

## Development Utilities

The project includes several utilities to streamline development:

### Project Manager

The most powerful tool in the toolkit is the Project Manager, a comprehensive interactive CLI tool that provides a unified interface for all project operations:

```
npm run project
```

This launches an interactive menu with the following features:

- **Project Status**: Quick overview of your project state
- **Configuration Management**: Environment variable management
- **API Development**: Generate API endpoints and documentation
- **Testing**: Run and manage tests
- **Development**: Start servers and perform development tasks
- **Database**: Seed and manage database operations
- **Deployment**: Build and deploy your application

The Project Manager combines all other utilities into a single, easy-to-use interface.

### Backend Utilities
- **Configuration Helper**: Manage environment variables
- **API Generator**: Generate RESTful API endpoints
- **Test Setup**: Configure and run tests
- **Documentation Generator**: Create API documentation

### Frontend Utilities
- **Component Generator**: Create new React components (coming soon)
- **API Client Generator**: Generate frontend API clients (coming soon)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (v4+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/project-shooting-star.git
   cd project-shooting-star
   ```

2. Install all dependencies (root, frontend, and backend):
   ```
   npm run install-all
   ```

3. Set up environment variables:
   ```
   # In the backend directory
   cp .env.example .env
   
   # In the frontend directory (project-shooting-star)
   cp .env.example .env
   ```

4. Start the development servers:
   ```
   # In the project root
   npm run dev
   ```

This will start both the frontend (port 5173) and backend (port 3000) development servers.

## Verification

To verify your setup is working properly:

1. Run `npm run lint` to check for code style issues
2. Run `npm run test` to execute backend tests
3. Run `npm run build` to build the frontend and check for errors

If all commands complete successfully, your monorepo structure is correctly set up.

## Troubleshooting

### ESLint Plugin Conflicts

If you encounter ESLint errors about duplicate plugins:

```
ESLint couldn't determine the plugin "prettier" uniquely.
```

Fix by removing one of the plugin installations:

```bash
# Option 1: Remove from root node_modules
rm -rf node_modules/eslint-plugin-prettier

# Option 2: Remove from backend node_modules
rm -rf backend/node_modules/eslint-plugin-prettier

# Then reinstall dependencies
npm run install-all
```

### Port Already in Use

If you see errors like `Error: listen EADDRINUSE: address already in use :::3000`:

1. Find and stop the process using the port:
   ```bash
   lsof -i:3000
   kill -9 <PID>
   ```

2. Alternatively, modify the port in your backend environment variables.

## Scripts

### Root Project
- `npm run dev`: Start both frontend and backend development servers
- `npm run start`: Run the production version of both servers
- `npm run build`: Build the frontend for production and lint the backend
- `npm run lint`: Run linters for both frontend and backend
- `npm run test`: Run backend tests
- `npm run install-all`: Install dependencies for root, frontend, and backend
- `npm run config`: Run configuration helper
- `npm run generate-api`: Generate API components
- `npm run test-setup`: Set up testing environment
- `npm run docs`: Generate API documentation
- `npm run project`: Launch the interactive project manager

### Backend
See the [backend README](./backend/README.md) for backend-specific scripts.

### Frontend
See the frontend README for frontend-specific scripts.

## Documentation

- **API Documentation**: Available after running `npm run docs swagger`
- **Backend README**: [View backend documentation](./backend/README.md)
- **Frontend README**: Available in the project-shooting-star directory

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 