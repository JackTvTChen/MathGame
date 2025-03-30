import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context';
import { ROUTES, PROTECTED_ROUTES } from './routes';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Debug from './pages/Debug';
import PrivateRoute from './components/PrivateRoute';
import Nav from './components/Nav';
import MathAsteroids from './games/MathAsteroids';

// Define routes configuration
const routeConfig = [
  // Public routes (accessible to all users)
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    protected: false,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
    protected: false,
  },
  {
    path: '/debug',
    element: <Debug />,
    protected: false,
  },
  {
    path: ROUTES.GAMES.MATH_ASTEROIDS,
    element: <MathAsteroids />,
    protected: false, // Public game that doesn't require login
  },
  // Protected routes (require authentication)
  {
    path: ROUTES.HOME,
    element: <Home />,
    protected: true,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
    protected: true,
  },
  // Catch-all route
  {
    path: '*',
    element: <NotFound />,
    protected: false,
  },
];

// Root component with routes
const AppRoutes = () => {
  const { state } = useAuth();
  const { isLoading } = state;

  // Show a loading state while checking authentication
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Nav />
      <div className="content">
        <Routes>
          {/* Map through route configuration */}
          {routeConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.protected ? (
                  <PrivateRoute>{route.element}</PrivateRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
          
          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={ROUTES.HOME} replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

// Main App component wrapping providers
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
