import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Star } from 'lucide-react';
import clsx from 'clsx';
import { useGameStore } from '@/store/gameStore';
import { LEVELS } from '@/utils/levels';

const LevelSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { levels: storeLevels } = useGameStore();
  
  // Merge static config with dynamic store data
  const levelsList = Object.values(LEVELS).map(config => ({
    ...config,
    unlocked: storeLevels[config.id]?.unlocked ?? (config.id === 1),
    stars: storeLevels[config.id]?.stars ?? 0
  })).sort((a, b) => a.id - b.id);

  const LevelButton = ({ level, navigate }: { level: any, navigate: any }) => {
    const { id, unlocked, stars } = level;
    // Highlight the latest unlocked level that hasn't been completed yet (or just the highest unlocked)
    // Actually, let's just highlight the highest unlocked level.
    const highestUnlockedId = Math.max(...levelsList.filter(l => l.unlocked).map(l => l.id));
    const isCurrent = id === highestUnlockedId;

    return (
      <button
        onClick={() => unlocked && navigate(`/game/${id}`)}
        className={clsx(
          "w-full aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200",
          unlocked 
            ? (isCurrent 
                ? "bg-[#311B92] text-white shadow-[0_6px_0_#1A0F55] translate-y-[-2px]" 
                : "bg-[#FFCA28] text-white shadow-[0_4px_0_#FFA000] hover:bg-[#FFC107]")
            : "bg-[#E0E0E0] text-gray-400 shadow-[0_4px_0_#BDBDBD]",
          unlocked && "active:translate-y-[4px] active:shadow-none"
        )}
        disabled={!unlocked}
      >
        {unlocked ? (
          <>
            <div className="flex gap-0.5 absolute top-2">
              {[1, 2, 3].map(s => (
                <Star 
                  key={s} 
                  size={12} 
                  fill={s <= stars ? (isCurrent ? "#FFD700" : "white") : "none"} 
                  className={isCurrent ? "text-[#FFD700]" : "text-white"} 
                  strokeWidth={s <= stars ? 0 : 2}
                />
              ))}
            </div>
            <span className={clsx("font-black mt-3", isCurrent ? "text-4xl" : "text-3xl")}>{id}</span>
          </>
        ) : (
          <Lock size={28} strokeWidth={2.5} className="text-gray-400/50" />
        )}
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative h-full">
      {/* Header */}
      <div className="relative bg-[#FFCA28] pt-8 pb-14 px-4 shadow-sm z-10 shrink-0">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-0 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <h1 className="text-3xl font-black text-[#212121]">关卡选择</h1>
          
          {/* Top Right Stats */}
          <div className="absolute right-0 flex items-center gap-1 bg-white/30 rounded-full px-3 py-1 shadow-sm">
             <span className="font-bold text-black text-lg">{Math.max(...levelsList.filter(l => l.unlocked).map(l => l.id))}</span>
             <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-[12px] text-white">🚩</div>
          </div>
        </div>

        {/* Scalloped Edge Effect using CSS radial-gradient */}
        <div 
          className="absolute bottom-[-10px] left-0 right-0 h-[20px] bg-transparent bg-repeat-x"
          style={{
            backgroundImage: 'radial-gradient(circle at 10px 0, transparent 10px, white 10.5px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 10px',
            transform: 'rotate(180deg)'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-8 pb-20 scrollbar-hide">
        {/* Easy Levels */}
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">简单</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {levelsList.filter(l => l.difficulty === 'easy').map((level) => (
                    <LevelButton key={level.id} level={level} navigate={navigate} />
                ))}
            </div>
        </div>

        {/* Normal Levels */}
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">普通</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {levelsList.filter(l => l.difficulty === 'normal').map((level) => (
                    <LevelButton key={level.id} level={level} navigate={navigate} />
                ))}
            </div>
        </div>

        {/* Hard Levels */}
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">困难</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {levelsList.filter(l => l.difficulty === 'hard').map((level) => (
                    <LevelButton key={level.id} level={level} navigate={navigate} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelectPage;
