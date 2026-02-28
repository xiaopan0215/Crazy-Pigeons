import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Settings, Gift, LayoutGrid } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center relative overflow-hidden bg-[#E8F5E9]">
      {/* Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[#C8E6C9]/30"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#A5D6A7]/30"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#81C784]/30"></div>
        <div className="absolute w-[250px] h-[250px] rounded-full bg-[#66BB6A]/20"></div>
      </div>

      {/* Top Bar */}
      <div className="w-full flex justify-between items-start p-6 z-20">
        <button className="w-12 h-12 bg-[#26A69A] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform border-2 border-white/40">
          <Settings size={24} strokeWidth={2.5} />
        </button>

        <div className="mt-2 relative">
             <h1 
                className="text-5xl font-black tracking-wider text-white z-10 relative"
                style={{ 
                    WebkitTextStroke: '8px #FF9800', // Orange stroke
                    paintOrder: 'stroke fill',
                    filter: 'drop-shadow(0 4px 0px #E65100)' // Darker orange shadow
                }}
             >
                疯狂的鸽子
             </h1>
        </div>

        <button className="w-12 h-12 bg-[#42A5F5] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform border-2 border-white/40">
          <Gift size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Center Character Card */}
      <div className="flex-1 flex items-center justify-center z-10 w-full mb-10">
        <div className="bg-white p-4 rounded-3xl shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500 animate-bounce-slow">
             <div className="w-64 h-64 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center relative">
                {/* Music Notes Effect */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">🎵</div>
                <div className="absolute bottom-4 left-2 text-xl animate-pulse">🎶</div>
                <div className="absolute top-10 left-[-10px] text-lg animate-ping">♩</div>
                
                <img 
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Q-version%20cartoon%20pigeon%20dancing%20to%20music%2C%20dynamic%20pose%2C%20wearing%20headphones%20and%20sunglasses%2C%20happy%20expression%2C%20musical%20notes%2C%20vibrant%20colors%2C%20vector%20style%2C%20white%20background&image_size=square"
                  alt="Crazy Pigeon"
                  className="w-full h-full object-cover transform scale-90 hover:scale-105 transition-transform duration-300"
                />
             </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full relative h-32 flex items-center justify-center z-20">
        {/* Start Game Button (Centered) */}
        <button 
          onClick={() => navigate('/levels')}
          className="absolute left-1/2 -translate-x-1/2 bg-[#66BB6A] hover:bg-[#4CAF50] text-white font-black text-2xl py-4 pl-6 pr-10 rounded-full shadow-[0_6px_0_#2E7D32] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-4 group"
        >
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play fill="#66BB6A" className="text-[#66BB6A] ml-1" size={20} />
          </div>
          <span className="tracking-widest drop-shadow-sm">开始游戏</span>
        </button>
        
        {/* Grid/Menu Button (Bottom Right) */}
        <button 
            onClick={() => navigate('/levels')}
            className="absolute right-8 bg-[#FF7043] hover:bg-[#F4511E] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#D84315] active:shadow-none active:translate-y-[4px] transition-all border-2 border-white/30"
        >
          <LayoutGrid size={28} strokeWidth={2.5} />
        </button>
      </div>
      
      <div className="h-8 w-full"></div> {/* Bottom spacer */}
    </div>
  );
};

export default HomePage;
