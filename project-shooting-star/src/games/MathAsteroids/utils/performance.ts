/**
 * Performance utilities for Math Asteroids game
 * Provides tools to monitor and optimize game performance
 */

// Performance measurement flags
let performanceMonitoringEnabled = false;
let frameTimeHistory: number[] = [];
const MAX_FRAME_HISTORY = 60; // Store last 60 frames (approx 1 second at 60fps)

/**
 * Toggle performance monitoring
 */
export const togglePerformanceMonitoring = (enabled: boolean = true): void => {
  performanceMonitoringEnabled = enabled;
  frameTimeHistory = [];
};

/**
 * Record frame time for performance tracking
 */
export const recordFrameTime = (frameTime: number): void => {
  if (!performanceMonitoringEnabled) return;
  
  frameTimeHistory.push(frameTime);
  
  // Keep history limited to prevent memory issues
  if (frameTimeHistory.length > MAX_FRAME_HISTORY) {
    frameTimeHistory.shift();
  }
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = () => {
  if (!performanceMonitoringEnabled || frameTimeHistory.length === 0) {
    return { 
      averageFrameTime: 0, 
      fps: 0, 
      minFrameTime: 0, 
      maxFrameTime: 0 
    };
  }
  
  const sum = frameTimeHistory.reduce((acc, time) => acc + time, 0);
  const averageFrameTime = sum / frameTimeHistory.length;
  const fps = Math.round(1000 / averageFrameTime);
  const minFrameTime = Math.min(...frameTimeHistory);
  const maxFrameTime = Math.max(...frameTimeHistory);
  
  return {
    averageFrameTime,
    fps,
    minFrameTime,
    maxFrameTime
  };
};

/**
 * Detect performance issues
 */
export const hasPerformanceIssues = (): boolean => {
  if (!performanceMonitoringEnabled || frameTimeHistory.length < 10) {
    return false;
  }
  
  const { fps } = getPerformanceMetrics();
  return fps < 30; // Consider anything below 30fps problematic
};

/**
 * Optimize game settings based on detected performance
 */
export const getOptimizedSettings = (currentMaxAsteroids: number) => {
  if (!hasPerformanceIssues()) {
    // No performance issues, use standard settings
    return {
      maxAsteroids: currentMaxAsteroids,
      useSimpleRender: false,
      skipParticleEffects: false
    };
  }
  
  // Performance issues detected, adjust settings
  const { fps } = getPerformanceMetrics();
  
  if (fps < 15) {
    // Severe performance issues
    return {
      maxAsteroids: Math.max(1, Math.floor(currentMaxAsteroids * 0.5)),
      useSimpleRender: true,
      skipParticleEffects: true
    };
  } else if (fps < 25) {
    // Moderate performance issues
    return {
      maxAsteroids: Math.max(2, Math.floor(currentMaxAsteroids * 0.7)),
      useSimpleRender: false,
      skipParticleEffects: true
    };
  } else {
    // Minor performance issues
    return {
      maxAsteroids: currentMaxAsteroids,
      useSimpleRender: false,
      skipParticleEffects: true
    };
  }
};

/**
 * Clean up resources to prevent memory leaks
 */
export const cleanupResources = (unusedObjects: any[]): void => {
  // Remove references to help garbage collection
  for (let i = 0; i < unusedObjects.length; i++) {
    unusedObjects[i] = null;
  }
}; 