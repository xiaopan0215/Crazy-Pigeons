import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Home, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { LEVELS } from '@/utils/levels';

const ResultPage: React.FC = () => {
  const { status } = useParams<{ status: 'success' | 'fail' }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { levelId, stars } = location.state || { levelId: 1, stars: 0 };
  
  const isSuccess = status === 'success';
  const nextLevelId = Number(levelId) + 1;
  const hasNextLevel = !!LEVELS[nextLevelId];

  // Animation states
  const [showStar1, setShowStar1] = React.useState(false);
  const [showStar2, setShowStar2] = React.useState(false);
  const [showStar3, setShowStar3] = React.useState(false);

  React.useEffect(() => {
      if (isSuccess) {
          setTimeout(() => setShowStar1(true), 500);
          setTimeout(() => setShowStar2(true), 1000);
          setTimeout(() => setShowStar3(true), 1500);
      }
  }, [isSuccess]);

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-500 ${isSuccess ? 'bg-[#9575CD]' : 'bg-[#EF5350]'}`}>
      
      {/* Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[600px] h-[600px] border-[50px] border-black rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="w-[400px] h-[400px] border-[50px] border-black rounded-full absolute animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-sm">
        <h1 className="text-6xl font-black mb-8 text-white drop-shadow-md tracking-widest animate-bounce">
            {isSuccess ? '成功!' : '失败'}
        </h1>

        <div className="flex gap-4 mb-12 justify-center w-full">
            {[1, 2, 3].map(i => {
                const show = i === 1 ? showStar1 : i === 2 ? showStar2 : showStar3;
                const isEarned = i <= stars;
                
                return (
                <div key={i} className="relative transition-all duration-500 transform">
                    <div className={`transition-all duration-700 ${show ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-180'}`}>
                        <Star 
                            size={isEarned ? 80 : 64} 
                            fill={isSuccess && isEarned ? "#FFD700" : "#00000040"} 
                            className={`filter drop-shadow-lg ${isSuccess && isEarned ? "text-[#FFD700]" : "text-black/20"}`}
                            strokeWidth={0}
                        />
                    </div>
                </div>
                );
            })}
        </div>

        {/* Pigeon Character Result */}
        <div className="mb-12 relative">
             <div className={`w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-xl ${isSuccess ? 'animate-pulse' : 'animate-shake'}`}>
                <img 
                    src={isSuccess 
                        ? "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Q-version%20cartoon%20pigeon%20dancing%20to%20music%2C%20dynamic%20pose%2C%20wearing%20headphones%20and%20sunglasses%2C%20happy%20expression%2C%20musical%20notes%2C%20vibrant%20colors%2C%20vector%20style%2C%20white%20background&image_size=square"
                        : "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Q-version%20cartoon%20pigeon%20crying%20sadly%2C%20tears%2C%20dramatic%20expression%2C%20bandaged%2C%20vibrant%20colors%2C%20vector%20style%2C%20white%20background&image_size=square"
                    }
                    alt="Result Pigeon"
                    className="w-full h-full object-cover transform scale-110"
                />
             </div>
        </div>

        <div className="flex gap-6 items-center w-full justify-center">
            <button 
            onClick={() => navigate('/levels')}
            className="w-16 h-16 bg-[#FFCA28] hover:bg-[#FFC107] rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#FFA000] active:translate-y-[4px] active:shadow-none transition-all transform hover:scale-105"
            >
            <Home size={32} strokeWidth={3} />
            </button>
            
            <button 
            onClick={() => navigate(`/game/${levelId}`)}
            className="w-20 h-20 bg-[#29B6F6] hover:bg-[#03A9F4] rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#0288D1] active:translate-y-[4px] active:shadow-none transition-all transform hover:scale-105"
            >
            <RefreshCw size={40} strokeWidth={3} />
            </button>
            
            {isSuccess && hasNextLevel && (
                 <button 
                 onClick={() => navigate(`/game/${nextLevelId}`)}
                 className="w-20 h-20 bg-[#66BB6A] hover:bg-[#4CAF50] rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#388E3C] active:translate-y-[4px] active:shadow-none transition-all transform hover:scale-105 animate-pulse"
                 >
                    <ArrowRight size={40} strokeWidth={3} />
                 </button>
            )}
        </div>
      </div>
      
      <div className="absolute bottom-8 text-white/50 text-sm font-bold tracking-widest uppercase">
          点击重新开始
      </div>
    </div>
  );
};

export default ResultPage;
