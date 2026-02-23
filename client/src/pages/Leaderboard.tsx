import { useLocation } from "wouter";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { CRTContainer } from "./GameRoom";

export default function Leaderboard() {
  const [, setLocation] = useLocation();
  const { data: scores, isLoading, error } = useLeaderboard();

  return (
    <CRTContainer>
      <div className="absolute inset-0 flex flex-col items-center p-8 md:p-16 overflow-y-auto">
        
        <h1 className="text-5xl md:text-7xl font-display text-foreground text-glow mb-2 text-center">
          COMPANY DATABASE
        </h1>
        <p className="text-muted-foreground font-display text-xl mb-12 tracking-widest text-center">
          TOP SECURITY GUARDS
        </p>

        <div className="w-full max-w-4xl bg-black/80 border-2 border-zinc-800 rounded-lg overflow-hidden backdrop-blur-md">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50 text-muted-foreground font-display uppercase tracking-widest">
            <div className="col-span-2 text-center">RANK</div>
            <div className="col-span-6">NAME</div>
            <div className="col-span-2 text-center">NIGHTS</div>
            <div className="col-span-2 text-center">ENERGY</div>
          </div>

          <div className="p-2">
            {isLoading && (
              <div className="p-8 text-center text-foreground font-display text-2xl animate-pulse">
                ACCESSING RECORDS...
              </div>
            )}
            
            {error && (
              <div className="p-8 text-center text-primary font-display text-2xl">
                DATABASE CORRUPTION DETECTED.
              </div>
            )}

            {scores && scores.length === 0 && (
              <div className="p-8 text-center text-muted-foreground font-display text-xl">
                NO RECORDS FOUND. BE THE FIRST.
              </div>
            )}

            {scores && scores.map((score, idx) => (
              <div 
                key={score.id}
                className="grid grid-cols-12 gap-4 p-4 items-center border-b border-zinc-900/50 hover:bg-zinc-900 transition-colors font-display text-xl"
              >
                <div className="col-span-2 text-center text-zinc-500">#{idx + 1}</div>
                <div className="col-span-6 text-white uppercase tracking-widest">{score.playerName}</div>
                <div className="col-span-2 text-center text-foreground">{score.survivedNights}</div>
                <div className="col-span-2 text-center text-blue-400">{score.remainingEnergy}%</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setLocation('/')}
          className="mt-12 px-8 py-4 bg-transparent border-2 border-foreground text-foreground font-display text-2xl hover:bg-foreground hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_25px_var(--foreground)]"
        >
          RETURN TO MAIN MENU
        </button>
      </div>
    </CRTContainer>
  );
}
