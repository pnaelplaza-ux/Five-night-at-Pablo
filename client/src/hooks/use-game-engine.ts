import { useState, useEffect, useCallback, useRef } from 'react';

// Rooms configuration
export const CAMERAS = [
  { id: 'CAM1A', name: 'Show Stage' },
  { id: 'CAM1B', name: 'Dining Area' },
  { id: 'CAM1C', name: 'Pirate Cove' },
  { id: 'CAM2A', name: 'West Hall' },
  { id: 'CAM2B', name: 'West Hall Corner' },
  { id: 'CAM3', name: 'Supply Closet' },
  { id: 'CAM4A', name: 'East Hall' },
  { id: 'CAM4B', name: 'East Hall Corner' },
  { id: 'CAM5', name: 'Backstage' },
  { id: 'CAM6', name: 'Kitchen' },
  { id: 'CAM7', name: 'Restrooms' },
];

export type EnemyId = 'freddy' | 'bonnie' | 'chica' | 'foxy';

export interface Enemy {
  id: EnemyId;
  name: string;
  image: string;
  location: string;
  aggression: number; // 1-20
  doorTimer: number; // Time spent at door before attacking
  foxyStage?: number; // 0-3 for Foxy
  isBroken?: boolean; // If they broke the buttons
}

export interface GameState {
  status: 'menu' | 'playing' | 'jumpscare' | 'gameover' | 'win';
  night: number;
  time: number; // 0 (12AM) to 6 (6AM)
  energy: number; // 100.0 to 0.0
  powerOut: boolean;
  
  // Office interactables
  doors: { left: boolean; right: boolean };
  lights: { left: boolean; right: boolean };
  buttonsBroken: { left: boolean; right: boolean };
  monitorOpen: boolean;
  currentCamera: string;
  lookBehind: boolean;
  isRotating: boolean;
  
  // Entities
  enemies: Record<EnemyId, Enemy>;
  jumpscareEnemy: EnemyId | null;
  staticIntensity: number;
  rareBonnieEvent: boolean;
}

const INITIAL_ENEMIES: Record<EnemyId, Enemy> = {
  freddy: { id: 'freddy', name: 'Freddy', image: 'freddyImg', location: 'CAM1A', aggression: 0, doorTimer: 0 },
  bonnie: { id: 'bonnie', name: 'Bonnie', image: 'bonnieImg', location: 'CAM1A', aggression: 0, doorTimer: 0 },
  chica: { id: 'chica', name: 'Chica', image: 'chicaImg', location: 'CAM1A', aggression: 0, doorTimer: 0 },
  foxy: { id: 'foxy', name: 'Foxy', image: 'foxyImg', location: 'CAM1C', aggression: 0, doorTimer: 0, foxyStage: 0 },
};

// 1 in-game hour = 60 real seconds.
// Tick every 1 second
const TICK_RATE_MS = 1000;
const SECONDS_PER_HOUR = 60; 
const TOTAL_HOURS = 6;

export function useGameEngine() {
  const [state, setState] = useState<GameState>({
    status: 'menu',
    night: 1,
    time: 0,
    energy: 100,
    powerOut: false,
    doors: { left: false, right: false },
    lights: { left: false, right: false },
    buttonsBroken: { left: false, right: false },
    monitorOpen: false,
    currentCamera: 'CAM1A',
    lookBehind: false,
    isRotating: false,
    enemies: { ...INITIAL_ENEMIES },
    jumpscareEnemy: null,
    staticIntensity: 0.3,
    rareBonnieEvent: false,
  });

  const tickRef = useRef<number>(0);

  const startGame = useCallback((night: number) => {
    setState({
      status: 'playing',
      night,
      time: 0,
      energy: 100,
      powerOut: false,
      doors: { left: false, right: false },
      lights: { left: false, right: false },
      buttonsBroken: { left: false, right: false },
      monitorOpen: false,
      currentCamera: 'CAM1A',
      lookBehind: false,
      isRotating: false,
      enemies: {
        freddy: { ...INITIAL_ENEMIES.freddy, aggression: night >= 3 ? night * 2 : 0 },
        bonnie: { ...INITIAL_ENEMIES.bonnie, aggression: night * 3 },
        chica: { ...INITIAL_ENEMIES.chica, aggression: night * 2 },
        foxy: { ...INITIAL_ENEMIES.foxy, aggression: night + 1 },
      },
      jumpscareEnemy: null,
      staticIntensity: 0.3,
      rareBonnieEvent: false,
    });
    tickRef.current = 0;
  }, []);

  const triggerJumpscare = useCallback((enemyId: EnemyId) => {
    setState(s => ({
      ...s,
      status: 'jumpscare',
      jumpscareEnemy: enemyId,
      monitorOpen: false,
      staticIntensity: 1.0,
    }));
    
    setTimeout(() => {
      setState(s => ({ ...s, status: 'gameover' }));
    }, 2500);
  }, []);

  // Actions
  const toggleDoor = useCallback((side: 'left' | 'right') => {
    setState(s => {
      if (s.powerOut || s.status !== 'playing' || s.buttonsBroken[side]) return s;
      return { ...s, doors: { ...s.doors, [side]: !s.doors[side] } };
    });
  }, []);

  const toggleLight = useCallback((side: 'left' | 'right') => {
    setState(s => {
      if (s.powerOut || s.status !== 'playing' || s.buttonsBroken[side]) return s;
      const newLights = { left: false, right: false };
      newLights[side] = !s.lights[side];
      return { ...s, lights: newLights };
    });
  }, []);

  const toggleMonitor = useCallback(() => {
    setState(s => {
      if (s.powerOut || s.status !== 'playing' || s.lookBehind) return s;
      return { ...s, monitorOpen: !s.monitorOpen, lights: { left: false, right: false } };
    });
  }, []);

  const setCamera = useCallback((camId: string) => {
    setState(s => {
      if (!s.monitorOpen || s.status !== 'playing') return s;
      if (s.currentCamera === camId) return s;
      return { ...s, currentCamera: camId, staticIntensity: 0.8 };
    });
  }, []);

  const setLookBehind = useCallback((val: boolean) => {
    setState(s => {
      if (s.monitorOpen || s.status !== 'playing') return s;
      return { ...s, lookBehind: val };
    });
  }, []);

  // Main Game Loop
  useEffect(() => {
    if (state.status !== 'playing') return;

    const interval = setInterval(() => {
      tickRef.current++;
      
      setState(prev => {
        let next = { ...prev };

        // 1. Time progression
        if (tickRef.current % SECONDS_PER_HOUR === 0) {
          next.time += 1;
          if (next.time >= TOTAL_HOURS) {
            next.status = 'win';
            return next;
          }
        }

        // 2. Power Drain
        if (!next.powerOut) {
          let usage = 1;
          if (next.doors.left) usage++;
          if (next.doors.right) usage++;
          if (next.lights.left) usage++;
          if (next.lights.right) usage++;
          if (next.monitorOpen) usage++;

          next.energy = Math.max(0, next.energy - (usage * 0.12));

          if (next.energy <= 0) {
            next.powerOut = true;
            next.doors = { left: false, right: false };
            next.lights = { left: false, right: false };
            next.monitorOpen = false;
            
            setTimeout(() => {
              triggerJumpscare('freddy');
            }, Math.random() * 10000 + 5000);
          }
        }

        // 3. Enemy AI Movement
        if (tickRef.current % 5 === 0 && !next.powerOut) {
          const updatedEnemies = { ...next.enemies };
          
          Object.keys(updatedEnemies).forEach(key => {
            const e = updatedEnemies[key as EnemyId];
            if (e.aggression === 0) return;

            const roll = Math.floor(Math.random() * 20) + 1;
            
            if (roll <= e.aggression) {
              if (e.id === 'foxy') {
                if (e.foxyStage! < 3) {
                   e.foxyStage!++;
                } else if (e.foxyStage === 3) {
                   // Run!
                   e.location = 'DOOR_L';
                   e.foxyStage = 0;
                }
              } else if (e.location !== 'DOOR_L' && e.location !== 'DOOR_R') {
                if (e.id === 'bonnie') {
                  const path = ['CAM1A', 'CAM1B', 'CAM5', 'CAM2A', 'CAM3', 'CAM2B', 'DOOR_L'];
                  const idx = path.indexOf(e.location);
                  if (idx > -1 && idx < path.length - 1) e.location = path[idx + 1];
                } else if (e.id === 'chica') {
                  const path = ['CAM1A', 'CAM1B', 'CAM7', 'CAM4A', 'CAM4B', 'DOOR_R'];
                  const idx = path.indexOf(e.location);
                  if (idx > -1 && idx < path.length - 1) e.location = path[idx + 1];
                } else if (e.id === 'freddy') {
                   const path = ['CAM1A', 'CAM1B', 'CAM7', 'CAM4A', 'CAM4B', 'DOOR_R'];
                   const idx = path.indexOf(e.location);
                   if (idx > -1 && idx < path.length - 1) e.location = path[idx + 1];
                }
              }
            }
          });
          next.enemies = updatedEnemies;
        }

        // 4. Door Attack & Button Breaking
        const updatedEnemies = { ...next.enemies };
        Object.keys(updatedEnemies).forEach(key => {
          const e = updatedEnemies[key as EnemyId];
          if (e.location === 'DOOR_L' || e.location === 'DOOR_R') {
            e.doorTimer++;
            const side = e.location === 'DOOR_L' ? 'left' : 'right';
            const isClosed = next.doors[side];
            
            if (isClosed) {
              if (e.doorTimer > 6) {
                e.location = 'CAM1A'; 
                e.doorTimer = 0;
              }
            } else {
              // Chance to break buttons if door is open and they are there
              if (e.doorTimer > 3 && Math.random() < 0.2) {
                next.buttonsBroken[side] = true;
                next.lights[side] = false;
              }

              if (e.doorTimer > 5) {
                next.monitorOpen = false;
                triggerJumpscare(e.id);
              }
            }
          }
        });
        next.enemies = updatedEnemies;

        // Rare Bonnie Event
        if (tickRef.current % 10 === 0 && !next.rareBonnieEvent && state.night >= 2 && Math.random() < 0.05) {
            next.rareBonnieEvent = true;
        }

        if (next.staticIntensity > 0.3) {
           next.staticIntensity = Math.max(0.3, next.staticIntensity - 0.05);
        }

        return next;
      });
    }, TICK_RATE_MS);

    return () => clearInterval(interval);
  }, [state.status, triggerJumpscare]);

  return {
    state,
    startGame,
    toggleDoor,
    toggleLight,
    toggleMonitor,
    setCamera,
    setLookBehind,
    quitToMenu: () => setState(s => ({ ...s, status: 'menu' }))
  };
}
