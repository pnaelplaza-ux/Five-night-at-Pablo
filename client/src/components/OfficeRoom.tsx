import { GameState } from "@/hooks/use-game-engine";

// Image mappings
import friend1Img from '@assets/WA_1771869060539_1771870866599.jpeg';
import friend2Img from '@assets/IMG-20251221-WA0015_1771870866643.jpg';

const ENEMY_IMAGES: Record<string, string> = {
  friend1Img: friend1Img,
  friend2Img: friend2Img,
};

interface OfficeRoomProps {
  state: GameState;
  toggleDoor: (side: 'left' | 'right') => void;
  toggleLight: (side: 'left' | 'right') => void;
  toggleMonitor: () => void;
}

export function OfficeRoom({ state, toggleDoor, toggleLight, toggleMonitor }: OfficeRoomProps) {
  // Check if enemies are at doors
  const enemyAtLeft = Object.values(state.enemies).find(e => e.location === 'DOOR_L');
  const enemyAtRight = Object.values(state.enemies).find(e => e.location === 'DOOR_R');

  const powerOutClasses = state.powerOut ? "brightness-[0.1] saturate-50" : "";

  return (
    <div className={`relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden transition-all duration-1000 ${powerOutClasses}`}>
      
      {/* 3D Perspective Container for the room */}
      <div className="relative w-[120vw] h-[120vh] max-w-none flex items-center justify-between px-[10vw]" style={{ perspective: '1000px' }}>
        
        {/* LEFT WALL / DOOR */}
        <div className="relative w-1/4 h-3/4 bg-zinc-900 border-r-8 border-zinc-800 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.8)] flex items-center" style={{ transform: 'rotateY(30deg)' }}>
           {/* Doorway opening */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-[80%] bg-black overflow-hidden">
              {/* Enemy in doorway (visible if light is on) */}
              {enemyAtLeft && state.lights.left && !state.doors.left && (
                 <img 
                   src={ENEMY_IMAGES[enemyAtLeft.image] || friend1Img} 
                   alt="Enemy Left" 
                   className="absolute bottom-0 left-0 w-full h-auto object-cover filter brightness-150 contrast-125 glitch-effect"
                 />
              )}
              
              {/* The Door Panel itself */}
              <div 
                className={`absolute top-0 left-0 w-full h-full bg-zinc-700 border-4 border-zinc-600 shadow-[inset_0_0_20px_black] ${state.doors.left ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in`}
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.2) 40px, rgba(0,0,0,0.2) 80px)' }}
              />
           </div>
           
           {/* Button Panel Left */}
           <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-16 bg-zinc-800 border-2 border-zinc-700 p-2 rounded flex flex-col gap-4 shadow-xl">
             <button 
               onClick={() => toggleDoor('left')}
               className={`w-full h-12 rounded border-2 font-display text-xs ${state.doors.left ? 'bg-primary border-primary shadow-[0_0_15px_var(--primary)] text-white' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
             >DOOR</button>
             <button 
               onClick={() => toggleLight('left')}
               className={`w-full h-12 rounded border-2 font-display text-xs ${state.lights.left ? 'bg-white border-white shadow-[0_0_20px_white] text-black' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
             >LIGHT</button>
           </div>
        </div>

        {/* CENTER DESK (Just visual element) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 bg-zinc-800 border-t-4 border-zinc-700 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.9)] z-20 flex justify-center pt-8">
           <div className="w-64 h-32 bg-black border-4 border-zinc-900 rounded flex items-center justify-center opacity-80">
              <span className="text-primary font-display text-xs animate-pulse opacity-50">NO SIGNAL</span>
           </div>
        </div>

        {/* RIGHT WALL / DOOR */}
        <div className="relative w-1/4 h-3/4 bg-zinc-900 border-l-8 border-zinc-800 shadow-[inset_20px_0_50px_rgba(0,0,0,0.8)] flex items-center" style={{ transform: 'rotateY(-30deg)' }}>
            {/* Doorway opening */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4/5 h-[80%] bg-black overflow-hidden">
              {/* Enemy in doorway */}
              {enemyAtRight && state.lights.right && !state.doors.right && (
                 <img 
                   src={ENEMY_IMAGES[enemyAtRight.image] || friend2Img} 
                   alt="Enemy Right" 
                   className="absolute bottom-0 right-0 w-full h-auto object-cover filter brightness-150 contrast-125 glitch-effect"
                 />
              )}

              {/* The Door Panel itself */}
              <div 
                className={`absolute top-0 left-0 w-full h-full bg-zinc-700 border-4 border-zinc-600 shadow-[inset_0_0_20px_black] ${state.doors.right ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in`}
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.2) 40px, rgba(0,0,0,0.2) 80px)' }}
              />
           </div>

           {/* Button Panel Right */}
           <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-16 bg-zinc-800 border-2 border-zinc-700 p-2 rounded flex flex-col gap-4 shadow-xl">
             <button 
               onClick={() => toggleDoor('right')}
               className={`w-full h-12 rounded border-2 font-display text-xs ${state.doors.right ? 'bg-primary border-primary shadow-[0_0_15px_var(--primary)] text-white' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
             >DOOR</button>
             <button 
               onClick={() => toggleLight('right')}
               className={`w-full h-12 rounded border-2 font-display text-xs ${state.lights.right ? 'bg-white border-white shadow-[0_0_20px_white] text-black' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
             >LIGHT</button>
           </div>
        </div>

      </div>

      {/* Center Light Illumination Effect */}
      {(state.lights.left || state.lights.right) && !state.powerOut && (
         <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay" />
      )}

      {/* Monitor Hover Bar */}
      {!state.powerOut && (
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-64 h-16 bg-white/5 border border-white/20 rounded flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-sm"
          onMouseEnter={toggleMonitor}
        >
          <span className="text-xl font-display tracking-widest text-white/70">^ OPEN SYSTEM</span>
        </div>
      )}
    </div>
  );
}
