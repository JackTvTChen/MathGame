import React, { useCallback } from 'react';
import { Asteroid as AsteroidType } from '../types';
import { Asteroid } from './Asteroid';

interface AsteroidFieldProps {
  asteroids: AsteroidType[];
  onRemoveAsteroid: (id: string) => void;
}

/**
 * AsteroidField component to render and manage multiple asteroids
 */
export const AsteroidField: React.FC<AsteroidFieldProps> = ({ 
  asteroids, 
  onRemoveAsteroid 
}) => {
  // Handle when an explosion animation is complete
  const handleExplosionComplete = useCallback((id: string) => {
    onRemoveAsteroid(id);
  }, [onRemoveAsteroid]);
  
  return (
    <div className="asteroid-field" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Render all active asteroids */}
      {asteroids.map(asteroid => 
        !asteroid.isDestroyed && (
          <Asteroid
            key={asteroid.id}
            asteroid={asteroid}
            onExplosionComplete={handleExplosionComplete}
          />
        )
      )}
    </div>
  );
}; 