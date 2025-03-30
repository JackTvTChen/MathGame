import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { ROUTES } from '../routes';
import './Nav.css';

const Nav: React.FC = () => {
  const { state, logout } = useAuth();
  const { isAuthenticated, user } = state;
  const location = useLocation();

  // Handle logout button click
  const handleLogout = () => {
    logout();
  };

  // Only render navigation if not on the login or register pages
  if ([ROUTES.LOGIN, ROUTES.REGISTER].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="main-nav">
      <div className="nav-left">
        <Link to={ROUTES.HOME} className="nav-logo">
          <span className="logo-text">ShootingStar</span>
        </Link>

        <div className="nav-links">
          <Link to={ROUTES.HOME} className="nav-link">Home</Link>
          
          {/* Games dropdown */}
          <div className="nav-dropdown">
            <button className="dropbtn">Games</button>
            <div className="dropdown-content">
              {/* Public game - always visible */}
              <Link to={ROUTES.GAMES.MATH_ASTEROIDS}>Math Asteroids</Link>
              
              {/* Protected games - only visible when authenticated */}
              {isAuthenticated && (
                <>
                  <Link to={ROUTES.GAMES.ADDITION}>Addition</Link>
                  <Link to={ROUTES.GAMES.MULTIPLICATION}>Multiplication</Link>
                  <Link to={ROUTES.GAMES.EQUATIONS}>Equations</Link>
                  <Link to={ROUTES.GAMES.MEMORY}>Memory</Link>
                </>
              )}
            </div>
          </div>
          
          {/* Show dashboard and profile only when authenticated */}
          {isAuthenticated && (
            <>
              <Link to={ROUTES.DASHBOARD} className="nav-link">Dashboard</Link>
              <Link to={ROUTES.PROFILE} className="nav-link">Profile</Link>
            </>
          )}
        </div>
      </div>

      <div className="nav-right">
        {/* Show guest banner when on the Math Asteroids page but not authenticated */}
        {!isAuthenticated && location.pathname === ROUTES.GAMES.MATH_ASTEROIDS && (
          <div className="guest-banner">
            Playing as Guest
            <Link to={ROUTES.LOGIN} className="login-button" state={{ from: location.pathname }}>
              Login to Save Scores
            </Link>
          </div>
        )}
        
        {isAuthenticated ? (
          <div className="user-section">
            <span className="username">Hello, {user?.username || 'User'}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link 
              to={ROUTES.LOGIN} 
              className="login-button"
              state={{ from: location.pathname }}
            >
              Login
            </Link>
            <Link to={ROUTES.REGISTER} className="register-button">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav; 