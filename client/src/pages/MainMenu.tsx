import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CRTContainer } from "./GameRoom";

// Main Menu specific assets can be just text to keep it ominous
export default function MainMenu() {
  const [, setLocation] = useLocation();
  const [unlockedNight, setUnlockedNight] = useState(1);
  const [showStatic, setShowStatic] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pablos_unlocked_night');
    if (saved) {
      setUnlockedNight(parseInt(saved, 10));
    }

    // Random heavy static blips on main menu
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setShowStatic(true);
        setTimeout(() => setShowStatic(false), 200 + Math.random() * 300);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePlay = (night: number) => {
    sessionStorage.setItem('pablos_night', night.toString());
    setLocation('/game');
  };

  return (
    <CRTContainer>
      {showStatic && <div className="static-noise static-heavy z-50" />}
      
      <div className="absolute inset-0 flex items-center p-8 md:p-24 bg-gradient-to-r from-black via-black/80 to-transparent">
        
        <div className="max-w-2xl flex flex-col gap-12 z-20">
          <div>
            <h1 className="text-6xl md:text-8xl font-display text-white font-bold leading-none tracking-tight">
              Five Nights at
              <br />
              <span className="text-primary text-glow-red flicker-text">Pablo's</span>
            </h1>
            <p className="text-muted-foreground font-sans mt-4 text-lg">
              Security Operations Terminal v2.1.4
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <MenuButton 
              text="NEW GAME (NIGHT 1)" 
              onClick={() => handlePlay(1)} 
            />
            
            <MenuButton 
              text="CONTINUE (NIGHT 2)" 
              onClick={() => handlePlay(2)} 
              disabled={unlockedNight < 2}
              subtitle={unlockedNight < 2 ? "LOCKED - SURVIVE NIGHT 1" : undefined}
            />

            <MenuButton 
              text="COMPANY DATABASE" 
              onClick={() => setLocation('/leaderboard')} 
            />
          </div>
        </div>

      </div>
    </CRTContainer>
  );
}

function MenuButton({ text, onClick, disabled, subtitle }: { text: string, onClick: ()=>void, disabled?: boolean, subtitle?: string }) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`group text-left text-3xl font-display uppercase tracking-widest transition-all ${
          disabled 
            ? 'text-zinc-700 cursor-not-allowed' 
            : 'text-zinc-400 hover:text-white hover:pl-6 focus:outline-none focus:pl-6'
        }`}
      >
        <span className={`inline-block mr-4 opacity-0 transition-opacity ${!disabled && 'group-hover:opacity-100 group-focus:opacity-100'} text-primary`}>&gt;</span>
        {text}
      </button>
      {subtitle && <span className="text-primary/70 text-sm font-sans ml-8 mt-1">{subtitle}</span>}
    </div>
  );
}
