import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CRTContainer } from "./GameRoom";

export default function ResultScreen() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<'win' | 'gameover'>('gameover');
  const [stats, setStats] = useState({ night: 1, energy: 0 });

  useEffect(() => {
    const res = sessionStorage.getItem('pablos_result') as 'win' | 'gameover';
    const statStr = sessionStorage.getItem('pablos_stats');
    if (res) setResult(res);
    if (statStr) setStats(JSON.parse(statStr));
  }, []);

  const handleReturn = () => {
    if (result === 'win' && stats.night === 1) {
      localStorage.setItem('pablos_unlocked_night', '2');
    }
    setLocation('/');
  };

  return (
    <CRTContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/80">
        
        {result === 'win' ? (
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-9xl font-display text-foreground text-glow flicker-text">
              6:00 AM
            </h1>
            <p className="text-2xl text-foreground mt-4 font-display">
              You survived Night {stats.night}.
            </p>
          </div>
        ) : (
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-9xl font-display text-primary text-glow-red static-heavy bg-clip-text">
              GAME OVER
            </h1>
            <p className="text-2xl text-muted-foreground mt-4 font-display">
              They caught you.
            </p>
          </div>
        )}

        <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg max-w-md w-full shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-display text-white mb-6 text-center border-b border-zinc-700 pb-4">
            NIGHT SUMMARY
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
               <div className="flex-1 bg-black/50 p-3 rounded border border-zinc-800">
                 <span className="block text-xs text-muted-foreground">NIGHT</span>
                 <span className="text-xl font-display text-white">{stats.night}</span>
               </div>
               <div className="flex-1 bg-black/50 p-3 rounded border border-zinc-800">
                 <span className="block text-xs text-muted-foreground">ENERGY</span>
                 <span className="text-xl font-display text-white">{Math.floor(stats.energy)}%</span>
               </div>
            </div>

            <button
              onClick={handleReturn}
              className="w-full py-4 mt-2 bg-foreground text-black font-display text-xl hover:bg-white transition-colors uppercase tracking-widest shadow-[0_0_15_var(--foreground)] hover:shadow-[0_0_25px_white]"
            >
              RETURN TO MENU
            </button>
          </div>
        </div>

      </div>
    </CRTContainer>
  );
}
