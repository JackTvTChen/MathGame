import React, { useEffect, useState } from 'react';

interface ExplosionProps {
  x: number;
  y: number;
  size: number;
  onAnimationComplete: () => void;
}

/**
 * Explosion animation component
 * Renders a particle explosion effect when an asteroid is destroyed
 */
export const Explosion: React.FC<ExplosionProps> = ({ 
  x, 
  y, 
  size, 
  onAnimationComplete 
}) => {
  const [frame, setFrame] = useState(0);
  const totalFrames = 12; // Total number of animation frames
  
  // Run animation sequence
  useEffect(() => {
    if (frame >= totalFrames) {
      onAnimationComplete();
      return;
    }
    
    // Advance animation frame
    const timer = setTimeout(() => {
      setFrame(frame + 1);
    }, 50); // 50ms per frame = ~20fps
    
    return () => clearTimeout(timer);
  }, [frame, onAnimationComplete, totalFrames]);
  
  // Calculate particle properties based on current frame
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = (frame / totalFrames) * size * 2;
    const opacity = 1 - frame / totalFrames;
    
    // Calculate position
    const particleX = x + Math.cos(angle) * distance;
    const particleY = y + Math.sin(angle) * distance;
    
    // Calculate size (shrinks over time)
    const particleSize = size * 0.25 * (1 - frame / totalFrames);
    
    return { x: particleX, y: particleY, size: particleSize, opacity };
  });
  
  return (
    <div className="explosion-container" style={{ position: 'absolute', pointerEvents: 'none' }}>
      {particles.map((particle, index) => (
        <div
          key={index}
          className="explosion-particle"
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: `rgba(255, ${150 + Math.random() * 100}, 50, ${particle.opacity})`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}; 