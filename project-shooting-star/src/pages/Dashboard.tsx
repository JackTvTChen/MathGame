import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { ROUTES } from '../routes';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useAuth();
  
  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // ... fetch profile data logic ...
        
        // Simulated profile data
        setProfileData({
          username: state.user?.username || 'User',
          stats: {
            mathGames: 12,
            problemsSolved: 48,
            streak: 3
          }
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [state.user]);
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  if (isLoading) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Track your progress and play educational games</p>
      </header>
      
      <main className="dashboard-content">
        {error ? (
          <div className="error-card">
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-button">
              Try Again
            </button>
          </div>
        ) : profileData ? (
          <>
            <div className="profile-summary">
              <h2>Hello, {profileData.username}!</h2>
              <div className="stats-cards">
                <div className="stat-card">
                  <h3>{profileData.stats.mathGames}</h3>
                  <p>Games Played</p>
                </div>
                <div className="stat-card">
                  <h3>{profileData.stats.problemsSolved}</h3>
                  <p>Problems Solved</p>
                </div>
                <div className="stat-card">
                  <h3>{profileData.stats.streak} Days</h3>
                  <p>Current Streak</p>
                </div>
              </div>
            </div>
            
            {/* Featured Game - Available to all users */}
            <div className="featured-game-section">
              <h2>Featured Game</h2>
              <div className="featured-game-card">
                <div className="featured-game-content">
                  <h3>Math Asteroids</h3>
                  <p>Destroy asteroids by solving math problems in this fast-paced arcade game!</p>
                  <ul className="feature-list">
                    <li>Improve mental math skills</li>
                    <li>Track your high scores</li>
                    <li>Adjustable difficulty levels</li>
                  </ul>
                  <Link to={ROUTES.GAMES.MATH_ASTEROIDS} className="play-button featured">
                    Play Now
                  </Link>
                </div>
                <div className="featured-game-image">
                  {/* Placeholder for game image */}
                  <div className="game-image-placeholder">
                    <span className="asteroid-icon">☄️</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Premium Games - Only for registered users */}
            <div className="games-section">
              <h2>Premium Math Games</h2>
              <p className="premium-description">
                These games are exclusively available to registered users.
              </p>
              <div className="games-grid">
                <div className="game-card">
                  <h3>Addition Challenge</h3>
                  <p>Test your addition skills with rapid-fire questions!</p>
                  <Link to={ROUTES.GAMES.ADDITION} className="play-button">Play Now</Link>
                </div>
                <div className="game-card">
                  <h3>Multiplication Master</h3>
                  <p>Multiply your way to the top of the leaderboard!</p>
                  <Link to={ROUTES.GAMES.MULTIPLICATION} className="play-button">Play Now</Link>
                </div>
                <div className="game-card">
                  <h3>Equation Solver</h3>
                  <p>Solve equations against the clock!</p>
                  <Link to={ROUTES.GAMES.EQUATIONS} className="play-button">Play Now</Link>
                </div>
                <div className="game-card">
                  <h3>Math Memory</h3>
                  <p>Match equations with their answers!</p>
                  <Link to={ROUTES.GAMES.MEMORY} className="play-button">Play Now</Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="error-card">
            <h3>No Profile Data</h3>
            <p>Could not load your profile information.</p>
            <button onClick={handleRefresh} className="retry-button">
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 