import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LevelProgress {
  stars: number;
  unlocked: boolean;
}

interface GameState {
  levels: Record<number, LevelProgress>;
  unlockLevel: (levelId: number) => void;
  completeLevel: (levelId: number, stars: number) => void;
  resetProgress: () => void;
}

// Initial state: Level 1 unlocked, others locked
const INITIAL_LEVELS: Record<number, LevelProgress> = {};
for (let i = 1; i <= 20; i++) {
  INITIAL_LEVELS[i] = {
    stars: 0,
    unlocked: i === 1
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      levels: INITIAL_LEVELS,
      
      unlockLevel: (levelId) => set((state) => {
        const current = state.levels[levelId];
        if (current && current.unlocked) return state;
        
        return {
          levels: {
            ...state.levels,
            [levelId]: { ...state.levels[levelId], unlocked: true }
          }
        };
      }),

      completeLevel: (levelId, stars) => set((state) => {
        const current = state.levels[levelId];
        const newStars = Math.max(current?.stars || 0, stars);
        
        // Unlock next level
        const nextLevelId = levelId + 1;
        const nextLevel = state.levels[nextLevelId];
        
        const newLevels = {
          ...state.levels,
          [levelId]: { ...current, stars: newStars }
        };

        if (nextLevel && !nextLevel.unlocked) {
            newLevels[nextLevelId] = { ...nextLevel, unlocked: true };
        }

        return { levels: newLevels };
      }),

      resetProgress: () => set({ levels: INITIAL_LEVELS }),
    }),
    {
      name: 'crazy-pigeon-storage',
    }
  )
);
