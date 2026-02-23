import { useState, useEffect, useCallback, useRef } from 'react';

// Rooms configuration
export const CAMERAS = [
  { id: 'CAM1', name: 'Show Stage' },
  { id: 'CAM2', name: 'Dining Area' },
  { id: 'CAM3', name: 'West Hall' },
  { id: 'CAM4', name: 'East Hall' },
  { id: 'CAM5', name: 'Supply Closet' },
  { id: 'CAM6', name: 'Kitchen' },
];

export type EnemyId = 'pablo' | 'friend2' | 'friend3' | 'friend4';

export interface Enemy {
  id: EnemyId;
  name: string;
  image: string;
  location: string;
  aggression: number; // 1-20
  doorTimer: number; // Time spent at door before attacking
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
  monitorOpen: boolean;
  currentCamera: string;
  
  // Entities
  enemies: Record<EnemyId, Enemy>;
  jumpscareEnemy: EnemyId | null;
  staticIntensity: number;
}

const INITIAL_ENEMIES: Record<EnemyId, Enemy> = {
  pablo: { id: 'pablo', name: 'Pablo', image: 'friend1Img', location: 'CAM1', aggression: 0, doorTimer: 0 },
  friend2: { id: 'friend2', name: 'Friend 2', image: 'friend2Img', location: 'CAM1', aggression: 0, doorTimer: 0 },
  friend3: { id: 'friend3', name: 'Friend 3', image: 'friend3Img', location: 'CAM5', aggression: 0, doorTimer: 0 },
  friend4: { id: 'friend4', name: 'Friend 4', image: 'friend4Img', location: 'CAM6', aggression: 0, doorTimer: 0 },
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
    monitorOpen: false,
    currentCamera: 'CAM1',
    enemies: { ...INITIAL_ENEMIES },
    jumpscareEnemy: null,
    staticIntensity: 0.3,
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
      monitorOpen: false,
      currentCamera: 'CAM1',
      enemies: {
        pablo: { ...INITIAL_ENEMIES.pablo, aggression: night === 1 ? 3 : 8 },
        friend2: { ...INITIAL_ENEMIES.friend2, aggression: night === 1 ? 2 : 7 },
        friend3: { ...INITIAL_ENEMIES.friend3, aggression: night === 1 ? 0 : 5 }, // Inactive N1
        friend4: { ...INITIAL_ENEMIES.friend4, aggression: night === 1 ? 0 : 6 }, // Inactive N1
      },
      jumpscareEnemy: null,
      staticIntensity: 0.3,
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
    
    // End game shortly after jumpscare
    setTimeout(() => {
      setState(s => ({ ...s, status: 'gameover' }));
    }, 2500);
  }, []);

  // Actions
  const toggleDoor = useCallback((side: 'left' | 'right') => {
    setState(s => {
      if (s.powerOut || s.status !== 'playing') return s;
      return { ...s, doors: { ...s.doors, [side]: !s.doors[side] } };
    });
  }, []);

  const toggleLight = useCallback((side: 'left' | 'right') => {
    setState(s => {
      if (s.powerOut || s.status !== 'playing') return s;
      // Turn off other light if switching
      const newLights = { left: false, right: false };
      newLights[side] = !s.lights[side];
      return { ...s, lights: newLights };
    });
  }, []);

  const toggleMonitor = useCallback(() => {
    setState(s => {
      if (s.powerOut || s.status !== 'playing') return s;
      // Turn off lights when using monitor
      return { ...s, monitorOpen: !s.monitorOpen, lights: { left: false, right: false } };
    });
  }, []);

  const setCamera = useCallback((camId: string) => {
    setState(s => {
      if (!s.monitorOpen || s.status !== 'playing') return s;
      if (s.currentCamera === camId) return s; // Fix infinite flip
      return { ...s, currentCamera: camId, staticIntensity: 0.8 }; // Spike static on switch
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
          let usage = 1; // Base drain
          if (next.doors.left) usage++;
          if (next.doors.right) usage++;
          if (next.lights.left) usage++;
          if (next.lights.right) usage++;
          if (next.monitorOpen) usage++;

          // drain = usage * 0.12 per second
          next.energy = Math.max(0, next.energy - (usage * 0.12));

          if (next.energy <= 0) {
            next.powerOut = true;
            next.doors = { left: false, right: false };
            next.lights = { left: false, right: false };
            next.monitorOpen = false;
            
            // Freddy-style power out delay jumpscare
            setTimeout(() => {
              triggerJumpscare('pablo');
            }, Math.random() * 10000 + 5000);
          }
        }

        // 3. Enemy AI Movement
        // FNaF 1 Style: Movement rolls every few seconds
        if (tickRef.current % 5 === 0 && !next.powerOut) {
          const updatedEnemies = { ...next.enemies };
          
          Object.keys(updatedEnemies).forEach(key => {
            const e = updatedEnemies[key as EnemyId];
            if (e.aggression === 0) return;

            // Aggression roll (1-20). If random 1-20 is <= aggression, move!
            const roll = Math.floor(Math.random() * 20) + 1;
            
            if (roll <= e.aggression) {
              if (e.location === 'DOOR_L' || e.location === 'DOOR_R') {
                 // Already at door, handle separately or stay
              } else {
                // Movement logic
                if (e.id === 'pablo') {
                  const path = ['CAM1', 'CAM2', 'CAM3', 'DOOR_L'];
                  const idx = path.indexOf(e.location);
                  if (idx > -1 && idx < path.length - 1) e.location = path[idx + 1];
                } else if (e.id === 'friend2') {
                  const path = ['CAM1', 'CAM2', 'CAM4', 'DOOR_R'];
                  const idx = path.indexOf(e.location);
                  if (idx > -1 && idx < path.length - 1) e.location = path[idx + 1];
                } else if (e.id === 'friend3') {
                   const cams = ['CAM1', 'CAM5', 'CAM3', 'DOOR_L'];
                   const idx = cams.indexOf(e.location);
                   if (idx > -1 && idx < cams.length - 1) e.location = cams[idx + 1];
                } else if (e.id === 'friend4') {
                   const cams = ['CAM6', 'CAM4', 'DOOR_R'];
                   const idx = cams.indexOf(e.location);
                   if (idx > -1 && idx < cams.length - 1) e.location = cams[idx + 1];
                }
              }
            }
          });
          next.enemies = updatedEnemies;
        }

        // 4. Door Attack Logic (Every second)
        const updatedEnemies = { ...next.enemies };
        Object.keys(updatedEnemies).forEach(key => {
          const e = updatedEnemies[key as EnemyId];
          if (e.location === 'DOOR_L' || e.location === 'DOOR_R') {
            e.doorTimer++;
            const isClosed = e.location === 'DOOR_L' ? next.doors.left : next.doors.right;
            
            if (isClosed) {
              // Successfully blocked
              if (e.doorTimer > 5) {
                e.location = 'CAM1'; 
                e.doorTimer = 0;
              }
            } else {
              // Open door, attack!
              if (e.doorTimer > 4) {
                next.monitorOpen = false;
                triggerJumpscare(e.id);
              }
            }
          }
        });
        next.enemies = updatedEnemies;

        // 5. Static decay
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
    quitToMenu: () => setState(s => ({ ...s, status: 'menu' }))
  };
}
