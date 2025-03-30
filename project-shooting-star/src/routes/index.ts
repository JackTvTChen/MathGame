// Define route paths as constants to avoid typos and enable easy changes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  GAMES: {
    ADDITION: '/games/addition',
    MULTIPLICATION: '/games/multiplication',
    EQUATIONS: '/games/equations',
    MEMORY: '/games/memory',
    MATH_ASTEROIDS: '/games/math-asteroids', // Public game that doesn't require authentication
  },
  // Add more routes as needed
};

// Define which routes should be protected (require authentication)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
  ROUTES.GAMES.ADDITION,
  ROUTES.GAMES.MULTIPLICATION,
  ROUTES.GAMES.EQUATIONS,
  ROUTES.GAMES.MEMORY,
  // MATH_ASTEROIDS is intentionally not included to allow guest play
  // Add more protected routes as needed
];

// Redirect paths based on authentication state
export const getRedirectPath = (isAuthenticated: boolean, requestedPath: string): string => {
  // If not authenticated and trying to access a protected route
  if (!isAuthenticated && PROTECTED_ROUTES.includes(requestedPath)) {
    return ROUTES.LOGIN;
  }
  
  // If authenticated and trying to access login/register
  if (isAuthenticated && [ROUTES.LOGIN, ROUTES.REGISTER].includes(requestedPath)) {
    return ROUTES.DASHBOARD;
  }
  
  // No redirection needed
  return requestedPath;
}; 