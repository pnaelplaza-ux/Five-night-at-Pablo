import { GameState } from "@/hooks/use-game-engine";
import officeBackImg from '../assets/office_back.png';

// Image mappings
import freddyImg from '../assets/WA_1771869060539_1771870866599.jpeg';
import bonnieImg from '../assets/IMG-20251221-WA0015_1771870866643.jpg';
import chicaImg from '../assets/IMG-20251221-WA0028_1771870866656.jpg';
import foxyImg from '../assets/WA_1771868918600_1771870866666.jpeg';

const ENEMY_IMAGES: Record<string, string> = {
  freddyImg,
  bonnieImg,
  chicaImg,
  foxyImg
};

interface OfficeRoomProps {
  state: GameState;
  toggleDoor: (side: 'left' | 'right') => void;
  toggleLight: (side: 'left' | 'right') => void;
  toggleMonitor: () => void;
  setLookBehind: (val: boolean) => void;
}

export function OfficeRoom({ state, toggleDoor, toggleLight, toggleMonitor, setLookBehind }: OfficeRoomProps) {
  const enemyAtLeft = Object.values(state.enemies).find(e => e.location === 'DOOR_L');
  const enemyAtRight = Object.values(state.enemies).find(e => e.location === 'DOOR_R');

  const powerOutClasses = state.powerOut ? "brightness-[0.1] saturate-50" : "";

  return (
    <div className={`relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden transition-all duration-700 ${powerOutClasses}`}>
      
      <div className={`relative w-[150vw] h-[100vh] flex items-center justify-between px-[10vw] transition-transform duration-500 ease-in-out ${state.lookBehind ? '-translate-x-1/2' : 'translate-x-0'}`}>
        
        {/* OFFICE FRONT VIEW */}
        <div className="relative min-w-full h-full flex items-center justify-between px-[5vw]">
           {/* LEFT WALL / DOOR */}
           <div className="relative w-1/4 h-3/4 bg-zinc-900 border-r-8 border-zinc-800 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.8)] flex items-center" style={{ transform: 'rotateY(25deg)' }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-[80%] bg-black overflow-hidden">
                 {enemyAtLeft && state.lights.left && !state.doors.left && (
                    <img 
                      src={ENEMY_IMAGES[enemyAtLeft.image]} 
                      alt="Enemy Left" 
                      className="absolute bottom-0 left-0 w-full h-auto object-cover filter brightness-150 contrast-125 glitch-effect"
                    />
                 )}
                 <div 
                   className={`absolute top-0 left-0 w-full h-full bg-zinc-700 border-4 border-zinc-600 shadow-[inset_0_0_20px_black] ${state.doors.left ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in`}
                   style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.2) 40px, rgba(0,0,0,0.2) 80px)' }}
                 />
              </div>
              
              <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-16 bg-zinc-800 border-2 border-zinc-700 p-2 rounded flex flex-col gap-4 shadow-xl">
                <button 
                  onClick={() => toggleDoor('left')}
                  className={`w-full h-12 rounded border-2 font-display text-[10px] ${state.buttonsBroken.left ? 'bg-zinc-950 border-red-900 text-red-900 cursor-not-allowed' : state.doors.left ? 'bg-primary border-primary shadow-[0_0_15px_var(--primary)] text-white' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
                  disabled={state.buttonsBroken.left}
                >DOOR</button>
                <button 
                  onClick={() => toggleLight('left')}
                  className={`w-full h-12 rounded border-2 font-display text-[10px] ${state.buttonsBroken.left ? 'bg-zinc-950 border-red-900 text-red-900 cursor-not-allowed' : state.lights.left ? 'bg-white border-white shadow-[0_0_20px_white] text-black' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
                  disabled={state.buttonsBroken.left}
                >LIGHT</button>
              </div>
           </div>

           {/* CENTER DESK */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 bg-zinc-800 border-t-4 border-zinc-700 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.9)] z-20 flex justify-center pt-8">
              <div className="w-64 h-32 bg-black border-4 border-zinc-900 rounded flex items-center justify-center opacity-80">
                 <span className="text-primary font-display text-xs animate-pulse opacity-50">SYSTEM ACTIVE</span>
              </div>
           </div>

           {/* RIGHT WALL / DOOR */}
           <div className="relative w-1/4 h-3/4 bg-zinc-900 border-l-8 border-zinc-800 shadow-[inset_20px_0_50px_rgba(0,0,0,0.8)] flex items-center" style={{ transform: 'rotateY(-25deg)' }}>
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4/5 h-[80%] bg-black overflow-hidden">
                 {enemyAtRight && state.lights.right && !state.doors.right && (
                    <img 
                      src={ENEMY_IMAGES[enemyAtRight.image]} 
                      alt="Enemy Right" 
                      className="absolute bottom-0 right-0 w-full h-auto object-cover filter brightness-150 contrast-125 glitch-effect"
                    />
                 )}
                 <div 
                   className={`absolute top-0 left-0 w-full h-full bg-zinc-700 border-4 border-zinc-600 shadow-[inset_0_0_20px_black] ${state.doors.right ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in`}
                   style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.2) 40px, rgba(0,0,0,0.2) 80px)' }}
                 />
              </div>

              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-16 bg-zinc-800 border-2 border-zinc-700 p-2 rounded flex flex-col gap-4 shadow-xl">
                <button 
                  onClick={() => toggleDoor('right')}
                  className={`w-full h-12 rounded border-2 font-display text-[10px] ${state.buttonsBroken.right ? 'bg-zinc-950 border-red-900 text-red-900 cursor-not-allowed' : state.doors.right ? 'bg-primary border-primary shadow-[0_0_15px_var(--primary)] text-white' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
                  disabled={state.buttonsBroken.right}
                >DOOR</button>
                <button 
                  onClick={() => toggleLight('right')}
                  className={`w-full h-12 rounded border-2 font-display text-[10px] ${state.buttonsBroken.right ? 'bg-zinc-950 border-red-900 text-red-900 cursor-not-allowed' : state.lights.right ? 'bg-white border-white shadow-[0_0_20px_white] text-black' : 'bg-zinc-900 border-zinc-700 text-muted-foreground'}`}
                  disabled={state.buttonsBroken.right}
                >LIGHT</button>
              </div>
           </div>
        </div>

        {/* OFFICE BACK VIEW (BEHIND CHAIR) */}
        <div className="relative min-w-full h-full bg-black overflow-hidden">
           <img src={officeBackImg} className="absolute inset-0 w-full h-full object-cover" alt="Office Back" />
           {state.rareBonnieEvent && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <img src={bonnieImg} className="w-1/2 h-auto animate-pulse" alt="Bonnie Behind" />
              </div>
           )}
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex gap-8 scale-75 md:scale-100">
         <button 
           className="px-6 py-2 bg-white/10 border border-white/30 rounded font-display text-white hover:bg-white/20 transition-all"
           onClick={() => setLookBehind(!state.lookBehind)}
         >
           {state.lookBehind ? 'LOOK FRONT' : 'LOOK BEHIND'}
         </button>
         {!state.lookBehind && !state.powerOut && (
           <button 
             className="px-6 py-2 bg-white/10 border border-white/30 rounded font-display text-white hover:bg-white/20 transition-all"
             onClick={toggleMonitor}
           >
             OPEN SYSTEM
           </button>
         )}
      </div>

      {(state.lights.left || state.lights.right) && !state.powerOut && (
         <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay" />
      )}
    </div>
  );
}
