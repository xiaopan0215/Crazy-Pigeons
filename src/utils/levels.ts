import { LevelConfig } from '@/types';

const generateLevels = (count: number): Record<number, LevelConfig> => {
  const levels: Record<number, LevelConfig> = {};
  
  for (let i = 1; i <= count; i++) {
    let difficulty: 'easy' | 'normal' | 'hard' = 'easy';
    let targetProjectiles = 6 + Math.floor((i - 1) / 2) * 2; // Increase every 2 levels
    let rotationSpeed = 0.02 + (i * 0.002);
    let speedVariation = false;
    
    if (i > 5) {
        difficulty = 'normal';
        speedVariation = true;
    }
    if (i > 12) {
        difficulty = 'hard';
        rotationSpeed += 0.02;
    }
    
    levels[i] = {
      id: i,
      name: `Level ${i}`,
      difficulty,
      targetProjectiles: Math.min(targetProjectiles, 20), // Cap at 20
      initialAmmo: Math.min(targetProjectiles, 20),
      rotationSpeed,
      rotationDirection: i % 2 === 0 ? 1 : -1,
      speedVariation,
      unlocked: i === 1,
      bestStars: 0
    };
  }
  return levels;
};

export const LEVELS: Record<number, LevelConfig> = generateLevels(24);
