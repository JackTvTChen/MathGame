import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context';
import { ROUTES } from '../routes';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Games</h3>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to={ROUTES.DASHBOARD} 
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.GAMES.COIN_FLIP} 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Coin Flip
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.GAMES.SLOTS} 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Slots
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.GAMES.ROULETTE} 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Roulette
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.GAMES.BLACKJACK} 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Blackjack
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to={ROUTES.PROFILE} className={({ isActive }) => isActive ? 'active' : ''}>
          Profile
        </NavLink>
        <NavLink to={ROUTES.SETTINGS} className={({ isActive }) => isActive ? 'active' : ''}>
          Settings
        </NavLink>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 