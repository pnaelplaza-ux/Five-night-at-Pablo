import { GameState, CAMERAS, Enemy } from "@/hooks/use-game-engine";

// Image mappings
import friend1Img from '@assets/WA_1771869060539_1771870866599.jpeg';
import friend2Img from '@assets/IMG-20251221-WA0015_1771870866643.jpg';
import friend3Img from '@assets/IMG-20251221-WA0028_1771870866656.jpg';
import friend4Img from '@assets/WA_1771868918600_1771870866666.jpeg';

const ENEMY_IMAGES: Record<string, string> = {
  friend1Img: friend1Img,
  friend2Img: friend2Img,
  friend3Img: friend3Img,
  friend4Img: friend4Img
};

interface MonitorUIProps {
  state: GameState;
  setCamera: (camId: string) => void;
  toggleMonitor: () => void;
}

export function MonitorUI({ state, setCamera, toggleMonitor }: MonitorUIProps) {
  if (!state.monitorOpen) return null;

  // Find enemies in current camera
  const enemiesInCam = Object.values(state.enemies).filter(e => e.location === state.currentCamera);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Heavy static when monitor is open */}
      <div 
        className={`static-noise static-heavy z-10 ${state.staticIntensity > 0.6 ? 'opacity-100' : 'opacity-40'}`} 
        style={{ opacity: state.staticIntensity }}
      />
      
      {/* Camera Feed Area */}
      <div className="relative flex-1 m-4 md:m-12 border-2 border-muted-foreground overflow-hidden rounded-lg shadow-[0_0_30px_rgba(0,0,0,1)]">
        {/* Background Room Image Placeholder - Industrial grit */}
        <div className="absolute inset-0 bg-zinc-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-black mix-blend-multiply">
           {/* Grid lines to look like technical blueprint/camera */}
           <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
        </div>

        {/* Camera Name Indicator */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />
          <h2 className="text-3xl font-display tracking-widest text-white text-glow">
            {CAMERAS.find(c => c.id === state.currentCamera)?.name || 'UNKNOWN'}
          </h2>
        </div>

        {/* Render Enemies */}
        {enemiesInCam.map((enemy, idx) => (
          <div 
            key={enemy.id} 
            className="absolute z-10 transform-gpu glitch-effect"
            style={{
              left: `${20 + (idx * 20)}%`,
              top: '20%',
              width: '40%',
              maxWidth: '300px',
              filter: 'grayscale(60%) contrast(1.5) brightness(0.8)',
              mixBlendMode: 'luminosity'
            }}
          >
            <img 
              src={ENEMY_IMAGES[enemy.image]} 
              alt={enemy.name}
              className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(0,255,0,0.2)]"
            />
          </div>
        ))}
      </div>

      {/* Map & Camera Buttons Overlay */}
      <div className="absolute bottom-8 right-8 z-30 w-72 h-64 bg-black/60 border border-white/20 p-4 rounded backdrop-blur-sm">
        <h3 className="text-white/50 text-sm font-display mb-2 border-b border-white/20 pb-1">MAP LAYOUT</h3>
        <div className="relative w-full h-full">
           {/* Stylized Map Lines */}
           <div className="absolute top-1/4 left-1/2 w-1 h-32 bg-white/20 -translate-x-1/2" />
           <div className="absolute top-1/2 left-1/4 w-32 h-1 bg-white/20" />

           {/* Cam Buttons - Positioned manually to look like a map */}
           <CamButton id="CAM1" state={state} setCamera={setCamera} className="top-0 left-1/2 -translate-x-1/2" />
           <CamButton id="CAM2" state={state} setCamera={setCamera} className="top-1/4 left-1/2 -translate-x-1/2" />
           <CamButton id="CAM3" state={state} setCamera={setCamera} className="top-1/2 left-0" />
           <CamButton id="CAM4" state={state} setCamera={setCamera} className="top-1/2 right-0" />
           <CamButton id="CAM5" state={state} setCamera={setCamera} className="bottom-4 left-1/4" />
           <CamButton id="CAM6" state={state} setCamera={setCamera} className="bottom-4 right-1/4" />
        </div>
      </div>
      
      {/* Monitor Flip Button (Close) */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-64 h-16 bg-white/5 border border-white/30 rounded flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
        onMouseEnter={toggleMonitor}
      >
        <span className="text-xl font-display tracking-widest text-white/70">X CLOSE SYSTEM</span>
      </div>
    </div>
  );
}

function CamButton({ id, state, setCamera, className }: { id: string, state: GameState, setCamera: (id: string)=>void, className: string }) {
  const isActive = state.currentCamera === id;
  return (
    <button
      onClick={() => setCamera(id)}
      className={`absolute px-3 py-1 font-display text-lg border-2 transition-all ${
        isActive 
          ? 'bg-foreground text-black border-foreground shadow-[0_0_10px_var(--foreground)]' 
          : 'bg-black text-white border-white/50 hover:bg-white/20'
      } ${className}`}
    >
      {id}
    </button>
  );
}
