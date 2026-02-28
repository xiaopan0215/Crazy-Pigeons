import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Bug, Unlock, Trophy, Trash2, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unlockLevel, completeLevel, resetProgress } = useGameStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current level ID if on game page
  const currentLevelId = location.pathname.startsWith('/game/') 
    ? Number(location.pathname.split('/')[2]) 
    : null;

  const handleWinLevel = () => {
    if (currentLevelId) {
      completeLevel(currentLevelId, 3); // Win with 3 stars
      navigate(`/result/success`, { state: { levelId: currentLevelId, stars: 3 } });
    }
  };

  const handleUnlockAll = () => {
    for (let i = 1; i <= 24; i++) {
      unlockLevel(i);
    }
    // Refresh page or re-render might be needed if store update isn't reactive enough (zustand usually is fine)
    if (location.pathname === '/levels') {
       navigate(0); // Force refresh to show unlocked levels immediately if needed, though react state should handle it
    }
  };

  if (process.env.NODE_ENV === 'production' && !window.location.search.includes('debug')) {
      return null; // Hide in production unless ?debug is present
  }

  return (
    <div className="absolute top-20 right-4 z-50 pointer-events-auto">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 bg-gray-800/80 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 active:scale-95 transition-all"
          title="Dev Tools"
        >
          <Bug size={20} />
        </button>
      ) : (
        <div className="bg-gray-800/90 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md w-48 flex flex-col gap-3 animate-in fade-in slide-in-from-right-10 duration-200">
          <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-1">
            <span className="font-bold text-sm text-green-400">Dev Tools</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {currentLevelId && (
            <button 
              onClick={handleWinLevel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <Trophy size={14} />
              一键通关 (3星)
            </button>
          )}

          <button 
            onClick={handleUnlockAll}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            <Unlock size={14} />
            解锁所有关卡
          </button>

          <button 
            onClick={() => {
                if(confirm('Reset all progress?')) {
                    resetProgress();
                    navigate('/');
                }
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            <Trash2 size={14} />
            重置存档
          </button>
        </div>
      )}
    </div>
  );
};

export default DevTools;
