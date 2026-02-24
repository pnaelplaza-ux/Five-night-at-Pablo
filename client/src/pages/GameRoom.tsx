import { useEffect } from "react";
import { useLocation } from "wouter";
// Remplacement des @/ par des chemins relatifs
import { useGameEngine } from "../hooks/use-game-engine";
import { OfficeRoom } from "../components/OfficeRoom";
import { MonitorUI } from "../components/MonitorUI";
import { GameHud } from "../components/GameHud";
import { Jumpscare } from "../components/Jumpscare";
import { AudioPlayer } from "../components/AudioPlayer";

// Reusable CRT layout wrapper
export function CRTContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {children}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <div className="static-noise" />
    </div>
  );
}

export default function GameRoom() {
  const [, setLocation] = useLocation();
  const { state, startGame, toggleDoor, toggleLight, toggleMonitor, setCamera, setLookBehind, quitToMenu } = useGameEngine();

  useEffect(() => {
    if (state.status === 'menu') {
      const nightStr = sessionStorage.getItem('pablos_night') || '1';
      startGame(parseInt(nightStr, 10));
    }
  }, [state.status, startGame]);

  useEffect(() => {
    if (state.status === 'gameover') {
      sessionStorage.setItem('pablos_result', 'gameover');
      sessionStorage.setItem('pablos_stats', JSON.stringify({ night: state.night, energy: state.energy }));
      setLocation('/result');
    } else if (state.status === 'win') {
      sessionStorage.setItem('pablos_result', 'win');
      sessionStorage.setItem('pablos_stats', JSON.stringify({ night: state.night, energy: state.energy }));
      setLocation('/result');
    }
  }, [state.status, state.night, state.energy, setLocation]);

  if (state.status === 'menu') {
    return <div className="bg-black w-screen h-screen" />; 
  }

  const enemyAtLeft = !!Object.values(state.enemies).find(e => e.location === 'DOOR_L');
  const enemyAtRight = !!Object.values(state.enemies).find(e => e.location === 'DOOR_R');

  return (
    <CRTContainer>
      <AudioPlayer 
        night={state.night} 
        time={state.time}
        status={state.status}
        monitorOpen={state.monitorOpen}
        doors={state.doors}
        lights={state.lights}
        enemyAtLeft={enemyAtLeft}
        enemyAtRight={enemyAtRight}
        powerOut={state.powerOut}
      />

      <OfficeRoom 
        state={state} 
        toggleDoor={toggleDoor} 
        toggleLight={toggleLight} 
        toggleMonitor={toggleMonitor}
        setLookBehind={setLookBehind}
      />
      
      <MonitorUI 
        state={state} 
        setCamera={setCamera} 
        toggleMonitor={toggleMonitor} 
      />
      
      <GameHud state={state} />
      
      <Jumpscare enemyId={state.jumpscareEnemy} />

      <button 
        onClick={quitToMenu}
        className="absolute top-4 left-4 z-50 text-white/30 hover:text-white font-display text-sm"
      >
        ESC
      </button>
    </CRTContainer>
  );
}
