import React, { useMemo } from 'react';
import { Asteroid as AsteroidType } from '../types';
import { Explosion } from './Animation';

interface AsteroidProps {
  asteroid: AsteroidType;
  onExplosionComplete: (id: string) => void;
}

/**
 * Asteroid component that renders an individual asteroid
 */
export const Asteroid: React.FC<AsteroidProps> = ({ 
  asteroid, 
  onExplosionComplete 
}) => {
  const { 
    id, 
    position, 
    size, 
    question, 
    timeLeft, 
    maxTime, 
    isExploding 
  } = asteroid;
  
  // Calculate time ratio for color and urgency effects
  const timeRatio = Math.max(0, timeLeft / maxTime);
  
  // Generate asteroid shape vertices for a more realistic look
  const asteroidVertices = useMemo(() => {
    const vertexCount = 10;
    const angleStep = (Math.PI * 2) / vertexCount;
    const roughness = 0.3; // How rough/jagged the asteroid looks (0-1)
    
    return Array.from({ length: vertexCount }, (_, i) => {
      const angle = i * angleStep;
      const distance = size * (1 + (Math.random() * roughness * 2 - roughness));
      
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      };
    });
  }, [size]);
  
  // Convert vertices to SVG path
  const asteroidPath = useMemo(() => {
    if (asteroidVertices.length === 0) return '';
    
    const commands = asteroidVertices.map((vertex, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command}${vertex.x},${vertex.y}`;
    });
    
    return commands.join(' ') + 'Z'; // Z closes the path
  }, [asteroidVertices]);
  
  // Handle explosion animation completion
  const handleExplosionComplete = () => {
    onExplosionComplete(id);
  };
  
  // Calculate colors based on time remaining
  const fillColor = `rgb(${Math.floor(255 * (1 - timeRatio))}, ${Math.floor(255 * timeRatio)}, 50)`;
  
  // Use explosion component if asteroid is exploding
  if (isExploding) {
    return (
      <Explosion
        x={position.x}
        y={position.y}
        size={size}
        onAnimationComplete={handleExplosionComplete}
      />
    );
  }
  
  return (
    <div
      className="asteroid"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Asteroid body */}
      <svg
        width={size * 2}
        height={size * 2}
        viewBox="-50 -50 100 100"
        style={{ position: 'absolute', top: -size, left: -size }}
      >
        <path
          d={asteroidPath}
          fill={fillColor}
          stroke="#ffffff"
          strokeWidth="2"
        />
      </svg>
      
      {/* Question text */}
      <div
        className="asteroid-question"
        style={{
          position: 'absolute',
          width: size * 2,
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {question}
      </div>
      
      {/* Timer bar */}
      <div
        className="timer-bar-background"
        style={{
          position: 'absolute',
          bottom: -size - 10,
          left: -size,
          width: size * 2,
          height: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          transform: 'translate(0, 100%)'
        }}
      >
        <div
          className="timer-bar-fill"
          style={{
            width: `${timeRatio * 100}%`,
            height: '100%',
            backgroundColor: fillColor
          }}
        />
      </div>
    </div>
  );
}; 