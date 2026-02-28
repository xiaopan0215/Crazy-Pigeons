export interface LevelConfig {
  id: number;
  name: string;
  difficulty: 'easy' | 'normal' | 'hard';
  targetProjectiles: number;
  initialAmmo: number;
  rotationSpeed: number;
  rotationDirection: 1 | -1; // 1 for clockwise, -1 for counter-clockwise
  speedVariation: boolean;
  unlocked: boolean;
  bestStars: number;
}

export interface GameProgress {
  currentLevel: number;
  totalStars: number;
  unlockedLevels: number[];
  levelData: Record<number, LevelData>;
}

export interface LevelData {
  bestStars: number;
  completed: boolean;
  attempts: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}
