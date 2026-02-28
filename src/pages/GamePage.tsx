import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pause, Star } from 'lucide-react';
import GameEngine from '@/components/game/GameEngine';
import { LEVELS } from '@/utils/levels';
import { useGameStore } from '@/store/gameStore';

const GamePage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const id = Number(levelId);
  const level = LEVELS[id];
  const { completeLevel } = useGameStore();

  const [remainingAmmo, setRemainingAmmo] = useState(level?.initialAmmo || 0);
  const [stars, setStars] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!level) {
      navigate('/levels');
    } else {
        // Show tutorial only for Level 1
        if (id === 1) {
            setShowTutorial(true);
            const timer = setTimeout(() => setShowTutorial(false), 4000); // Hide after 4s
            return () => clearTimeout(timer);
        }
    }
  }, [level, navigate, id]);

  if (!level) return null;

  const handleGameOver = (success: boolean, earnedStars: number) => {
    if (success) {
        completeLevel(id, earnedStars);
    }
    
    setTimeout(() => {
        navigate(`/result/${success ? 'success' : 'fail'}`, { state: { levelId: id, stars: earnedStars } });
    }, 1000);
  };

  return (
    <div className="flex-1 bg-[#DCE775] relative flex flex-col h-full overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-black/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[1px] border-black/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-[1px] border-black/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
      </div>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 pt-8 pointer-events-none">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="w-10 h-10 border-2 border-gray-600 rounded-full flex items-center justify-center text-gray-600 bg-white/50 pointer-events-auto active:scale-95 transition-transform"
        >
          <Pause size={20} fill="currentColor" />
        </button>
        
        {/* Stars Progress */}
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <Star 
                key={i} 
                size={24} 
                className={i <= stars ? "text-yellow-500 fill-yellow-500" : "text-black/20 fill-black/20"} 
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-black">{id}</span>
          <div className="w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
             <span className="text-xs font-bold text-white">{remainingAmmo}</span>
          </div>
        </div>
      </div>

      {/* Game Engine */}
      <div className="flex-1">
        <GameEngine 
            level={level} 
            onGameOver={handleGameOver} 
            onUpdateAmmo={setRemainingAmmo}
            onUpdateStars={setStars}
            isPaused={isPaused}
        />
      </div>

      {/* Pause Menu Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl flex flex-col gap-4 items-center shadow-2xl animate-pop-in">
                <h2 className="text-3xl font-black mb-4 text-gray-800">已暂停</h2>
                <button 
                    onClick={() => setIsPaused(false)}
                    className="bg-[#66BB6A] hover:bg-[#4CAF50] text-white px-10 py-4 rounded-full font-bold shadow-[0_4px_0_#388E3C] active:translate-y-[2px] active:shadow-none transition-all w-48 text-lg"
                >
                    继续游戏
                </button>
                <button 
                    onClick={() => navigate('/levels')}
                    className="bg-[#FF7043] hover:bg-[#F4511E] text-white px-10 py-4 rounded-full font-bold shadow-[0_4px_0_#D84315] active:translate-y-[2px] active:shadow-none transition-all w-48 text-lg"
                >
                    退出关卡
                </button>
            </div>
        </div>
      )}

      {/* Tutorial Hand Overlay */}
      {showTutorial && !isPaused && (
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
            <div className="absolute bottom-[20%] animate-bounce">
                <div className="bg-black/70 text-white px-6 py-3 rounded-full text-xl font-bold mb-4 shadow-lg backdrop-blur-sm">
                    点击屏幕发射!
                </div>
            </div>
            <div className="absolute bottom-[10%] opacity-80 animate-ping">
                <div className="w-16 h-16 rounded-full border-4 border-white"></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
