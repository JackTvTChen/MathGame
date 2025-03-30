/**
 * GameCanvas Component
 * Renders the game canvas and all visual game elements
 */

import React, { useRef, useEffect, useState } from 'react';
import { Asteroid, GameState } from '../types';
import { recordFrameTime, getPerformanceMetrics, getOptimizedSettings } from '../utils/performance';

interface GameCanvasProps {
  gameState: GameState;
  onAsteroidExpired: (asteroidId: string) => void;
  showPerformanceMetrics?: boolean;
}

// Canvas dimensions - should match GameCanvas
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Star background config
const NUM_STARS = 100;
const stars: { x: number; y: number; radius: number; opacity: number }[] = [];

// Initialize stars
for (let i = 0; i < NUM_STARS; i++) {
  stars.push({
    x: Math.random() * CANVAS_WIDTH,
    y: Math.random() * CANVAS_HEIGHT,
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.8 + 0.2
  });
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  onAsteroidExpired,
  showPerformanceMetrics = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const [performanceSettings, setPerformanceSettings] = useState({
    useSimpleRender: false,
    skipParticleEffects: false
  });
  
  // Setup canvas and start animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    let lastTime = 0;
    
    // Animation loop
    const animate = (currentTime: number) => {
      // Calculate time delta
      const deltaTime = lastTime ? currentTime - lastTime : 0;
      lastTime = currentTime;
      
      // Record frame time for performance monitoring
      if (deltaTime > 0) {
        recordFrameTime(deltaTime);
      }
      
      // Dynamically adjust settings based on performance
      if (gameState.isPlaying && showPerformanceMetrics) {
        const optimizedSettings = getOptimizedSettings(gameState.maxAsteroids);
        if (optimizedSettings.useSimpleRender !== performanceSettings.useSimpleRender ||
            optimizedSettings.skipParticleEffects !== performanceSettings.skipParticleEffects) {
          setPerformanceSettings(optimizedSettings);
        }
      }
      
      // Only render if game is playing
      if (gameState.isPlaying && !gameState.gameOver && !gameState.isPaused) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground(ctx);
        
        // Draw all asteroids and check for expired ones
        let hasExpiredAsteroid = false;
        
        gameState.asteroids.forEach(asteroid => {
          if (!asteroid.isDestroyed) {
            if (asteroid.isExploding) {
              // Skip particle effects if performance is an issue
              if (!performanceSettings.skipParticleEffects) {
                drawExplosion(ctx, asteroid);
              }
            } else {
              // Check if asteroid has expired (time <= 0)
              if (asteroid.timeLeft <= 0) {
                hasExpiredAsteroid = true;
              }
              
              // Draw asteroid
              drawAsteroid(ctx, asteroid, performanceSettings.useSimpleRender);
            }
          }
        });
        
        // Display performance metrics if enabled
        if (showPerformanceMetrics) {
          drawPerformanceMetrics(ctx);
        }
        
        // Handle game over if any asteroid expired
        if (hasExpiredAsteroid) {
          // Find the first expired asteroid for logging
          const expiredAsteroid = gameState.asteroids.find(a => 
            !a.isDestroyed && !a.isExploding && a.timeLeft <= 0
          );
          
          if (expiredAsteroid) {
            console.log(`Asteroid expired: ${expiredAsteroid.id}`);
            onAsteroidExpired(expiredAsteroid.id);
          }
        }
      }
      
      // Continue animation loop if game is still playing
      if (gameState.isPlaying && !gameState.gameOver) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup animation frame on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    gameState.isPlaying, 
    gameState.gameOver, 
    gameState.isPaused, 
    gameState.asteroids, 
    onAsteroidExpired, 
    showPerformanceMetrics,
    performanceSettings
  ]);
  
  // Draw background with stars
  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Fill background
    ctx.fillStyle = '#0a0a20';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw stars
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });
  };
  
  // Draw asteroid with question text
  const drawAsteroid = (
    ctx: CanvasRenderingContext2D, 
    asteroid: Asteroid, 
    useSimpleRender: boolean
  ) => {
    const { position, size, question, timeLeft, maxTime } = asteroid;
    
    // Calculate time ratio for color change (green to red)
    const timeRatio = Math.max(0, timeLeft / maxTime);
    const redComponent = Math.floor(255 * (1 - timeRatio));
    const greenComponent = Math.floor(255 * timeRatio);
    
    // Draw asteroid body - use simple circle for performance
    if (useSimpleRender) {
      // Simple circle asteroid (better performance)
      ctx.beginPath();
      ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${redComponent}, ${greenComponent}, 50)`;
      ctx.fill();
      
      // Simplified border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Detailed asteroid with jagged edges (more realistic but costlier)
      const vertexCount = 10;
      const angleStep = (Math.PI * 2) / vertexCount;
      const roughness = 0.3;
      
      ctx.beginPath();
      for (let i = 0; i < vertexCount; i++) {
        const angle = i * angleStep;
        const vertexSize = size * (1 + Math.sin(angle * 3 + asteroid.id.charCodeAt(0)) * roughness);
        const x = position.x + Math.cos(angle) * vertexSize;
        const y = position.y + Math.sin(angle) * vertexSize;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      ctx.fillStyle = `rgb(${redComponent}, ${greenComponent}, 50)`;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw question text
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(question, position.x, position.y);
    
    // Draw time remaining bar
    const barWidth = size * 2;
    const barHeight = 6;
    const barX = position.x - size;
    const barY = position.y + size + 10;
    
    // Background of time bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Actual time remaining
    ctx.fillStyle = `rgb(${redComponent}, ${greenComponent}, 50)`;
    ctx.fillRect(barX, barY, barWidth * timeRatio, barHeight);
  };
  
  // Draw explosion animation
  const drawExplosion = (ctx: CanvasRenderingContext2D, asteroid: Asteroid) => {
    const { position, size } = asteroid;
    
    // Draw explosion particles (simplified if performance is an issue)
    const particleCount = performanceSettings.useSimpleRender ? 6 : 12;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = size * 0.7;
      
      const particleX = position.x + Math.cos(angle) * distance;
      const particleY = position.y + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(particleX, particleY, size / 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(255, ${Math.random() * 100 + 155}, ${Math.random() * 50})`;
      ctx.fill();
    }
  };
  
  // Draw performance metrics
  const drawPerformanceMetrics = (ctx: CanvasRenderingContext2D) => {
    const metrics = getPerformanceMetrics();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 200, 70);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = metrics.fps < 30 ? '#ff5555' : '#55ff55';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    ctx.fillText(`FPS: ${metrics.fps}`, 20, 20);
    ctx.fillText(`Avg Frame Time: ${metrics.averageFrameTime.toFixed(2)}ms`, 20, 35);
    ctx.fillText(`Asteroids: ${gameState.asteroids.filter(a => !a.isDestroyed && !a.isExploding).length}`, 20, 50);
    ctx.fillText(`Rendering: ${performanceSettings.useSimpleRender ? 'Simple' : 'Detailed'}`, 20, 65);
  };
  
  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    />
  );
}; 