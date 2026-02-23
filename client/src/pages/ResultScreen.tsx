import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSubmitScore } from "@/hooks/use-leaderboard";
import { CRTContainer } from "./GameRoom";

export default function ResultScreen() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<'win' | 'gameover'>('gameover');
  const [stats, setStats] = useState({ night: 1, energy: 0 });
  const [playerName, setPlayerName] = useState("");
  const submitScore = useSubmitScore();

  useEffect(() => {
    const res = sessionStorage.getItem('pablos_result') as 'win' | 'gameover';
    const statStr = sessionStorage.getItem('pablos_stats');
    if (res) setResult(res);
    if (statStr) setStats(JSON.parse(statStr));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || submitScore.isPending) return;

    submitScore.mutate(
      {
        playerName: playerName.trim(),
        survivedNights: result === 'win' ? stats.night : stats.night - 1,
        remainingEnergy: Math.floor(stats.energy)
      },
      {
        onSuccess: () => {
          // If won night 1, unlock night 2
          if (result === 'win' && stats.night === 1) {
            localStorage.setItem('pablos_unlocked_night', '2');
          }
          setLocation('/leaderboard');
        }
      }
    );
  };

  const handleSkip = () => {
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
            ENTER PERSONNEL RECORD
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-display text-muted-foreground mb-2 uppercase tracking-widest">
                Guard Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={15}
                required
                className="w-full bg-black border-2 border-zinc-700 p-4 text-xl font-display text-foreground uppercase tracking-widest focus:outline-none focus:border-foreground transition-colors"
                placeholder="TYPE NAME..."
              />
            </div>
            
            <div className="flex gap-4">
               <div className="flex-1 bg-black/50 p-3 rounded border border-zinc-800">
                 <span className="block text-xs text-muted-foreground">NIGHTS</span>
                 <span className="text-xl font-display text-white">{result === 'win' ? stats.night : stats.night - 1}</span>
               </div>
               <div className="flex-1 bg-black/50 p-3 rounded border border-zinc-800">
                 <span className="block text-xs text-muted-foreground">ENERGY</span>
                 <span className="text-xl font-display text-white">{Math.floor(stats.energy)}%</span>
               </div>
            </div>

            <button
              type="submit"
              disabled={submitScore.isPending || !playerName.trim()}
              className="w-full py-4 mt-2 bg-foreground text-black font-display text-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_15px_var(--foreground)] hover:shadow-[0_0_25px_white]"
            >
              {submitScore.isPending ? 'TRANSMITTING...' : 'SUBMIT RECORD'}
            </button>
            
            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 text-muted-foreground font-display hover:text-white transition-colors"
            >
              SKIP & RETURN TO MENU
            </button>
          </form>
        </div>

      </div>
    </CRTContainer>
  );
}
