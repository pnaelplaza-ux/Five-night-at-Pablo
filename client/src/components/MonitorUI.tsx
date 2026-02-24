import { GameState, CAMERAS, Enemy } from "@/hooks/use-game-engine";
import stageImg from '@assets/FNAF_1_Stage_Empty_1771921278226.png';
import diningImg from '@assets/FNAF_1_Dining_Hall_Empty_1771921278213.png';
import coveImg from "@assets/FNAF_1_Pirate's_Cove_Foxy_is_Gone_1771921278201.png";
import westHallImg from "@assets/FNAF_1_West_Hall_Dark_1771921278189.png";
import westHallCornerImg from "@assets/FNAF_1_West_Hall_Corner_Normal_1771921278175.png";
import supplyClosetImg from "@assets/FNAF_1_Supply_Closet_Empty_1771921278160.png";
import eastHallImg from "@assets/FNAF_1_East_Hall_Empty_1771921278149.png";
import bathroomImg from "@assets/FNAF_1_Camera_7_Bathroom_Empty_1771921278135.png";

// Image mappings for enemies
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

const ROOM_IMAGES: Record<string, string> = {
  CAM1A: stageImg,
  CAM1B: diningImg,
  CAM1C: coveImg,
  CAM2A: westHallImg,
  CAM2B: westHallCornerImg,
  CAM3: supplyClosetImg,
  CAM4A: eastHallImg,
  CAM4B: eastHallImg, // Placeholder for corner
  CAM5: stageImg, // Backstage placeholder
  CAM6: diningImg, // Kitchen placeholder
  CAM7: bathroomImg,
};

interface MonitorUIProps {
  state: GameState;
  setCamera: (camId: string) => void;
  toggleMonitor: () => void;
}

export function MonitorUI({ state, setCamera, toggleMonitor }: MonitorUIProps) {
  if (!state.monitorOpen) return null;

  const enemiesInCam = Object.values(state.enemies).filter(e => e.location === state.currentCamera);
  const currentRoomImg = ROOM_IMAGES[state.currentCamera];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div 
        className={`static-noise static-heavy z-10 ${state.staticIntensity > 0.6 ? 'opacity-100' : 'opacity-40'}`} 
        style={{ opacity: state.staticIntensity }}
      />
      
      <div className="relative flex-1 m-4 md:m-12 border-2 border-muted-foreground overflow-hidden rounded-lg shadow-[0_0_30px_rgba(0,0,0,1)]">
        {currentRoomImg && (
          <img 
            src={currentRoomImg} 
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
            alt="Room Feed"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />
          <h2 className="text-3xl font-display tracking-widest text-white text-glow uppercase">
            {CAMERAS.find(c => c.id === state.currentCamera)?.name || 'UNKNOWN'}
          </h2>
        </div>

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

      <div className="absolute bottom-8 right-8 z-30 w-80 h-72 bg-black/60 border border-white/20 p-4 rounded backdrop-blur-sm scale-90">
        <h3 className="text-white/50 text-xs font-display mb-2 border-b border-white/20 pb-1">MAP LAYOUT</h3>
        <div className="relative w-full h-full grid grid-cols-4 grid-rows-4 gap-1">
           <CamButton id="CAM1A" state={state} setCamera={setCamera} className="col-start-2 row-start-1" />
           <CamButton id="CAM1B" state={state} setCamera={setCamera} className="col-start-2 row-start-2" />
           <CamButton id="CAM1C" state={state} setCamera={setCamera} className="col-start-1 row-start-2" />
           <CamButton id="CAM5" state={state} setCamera={setCamera} className="col-start-1 row-start-1" />
           <CamButton id="CAM7" state={state} setCamera={setCamera} className="col-start-3 row-start-2" />
           <CamButton id="CAM3" state={state} setCamera={setCamera} className="col-start-1 row-start-3" />
           <CamButton id="CAM2A" state={state} setCamera={setCamera} className="col-start-1 row-start-4" />
           <CamButton id="CAM2B" state={state} setCamera={setCamera} className="col-start-2 row-start-4" />
           <CamButton id="CAM4A" state={state} setCamera={setCamera} className="col-start-4 row-start-4" />
           <CamButton id="CAM4B" state={state} setCamera={setCamera} className="col-start-3 row-start-4" />
           <CamButton id="CAM6" state={state} setCamera={setCamera} className="col-start-4 row-start-3" />
        </div>
      </div>
      
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-64 h-16 bg-white/5 border border-white/30 rounded flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
        onClick={toggleMonitor}
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
      className={`px-2 py-1 font-display text-xs border transition-all ${
        isActive 
          ? 'bg-foreground text-black border-foreground' 
          : 'bg-black text-white border-white/50 hover:bg-white/20'
      } ${className}`}
    >
      {id}
    </button>
  );
}
