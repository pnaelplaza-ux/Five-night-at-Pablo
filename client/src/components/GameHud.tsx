import { GameState } from "@/hooks/use-game-engine";

interface GameHudProps {
  state: GameState;
}

export function GameHud({ state }: GameHudProps) {
  // Calculate usage level 1-5
  let usage = 1;
  if (state.doors.left) usage++;
  if (state.doors.right) usage++;
  if (state.lights.left) usage++;
  if (state.lights.right) usage++;
  if (state.monitorOpen) usage++;

  return (
    <>
      {/* Top Right: Time */}
      <div className="absolute top-4 right-8 text-right z-40 select-none">
        <h1 className="text-5xl md:text-6xl font-display text-glow">
          {state.time === 0 ? 12 : state.time} AM
        </h1>
        <h2 className="text-2xl md:text-3xl text-muted-foreground mt-1">Night {state.night}</h2>
      </div>

      {/* Bottom Left: Power */}
      <div className="absolute bottom-6 left-8 z-40 select-none">
        <h2 className="text-3xl font-display mb-1 text-glow">
          Power left: {Math.max(0, Math.floor(state.energy))}%
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xl font-display text-muted-foreground">Usage:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(level => (
              <div 
                key={level}
                className={`w-3 h-6 rounded-sm ${
                  level <= usage 
                    ? level > 3 ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-foreground shadow-[0_0_8px_var(--foreground)]' 
                    : 'bg-muted border border-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
