import { useEffect, useRef } from 'react';
import phoneAudio1 from '../assets/ElevenLabs_2026-02-23T19_14_55_Phone_guy_eleven_v3_1771870805260.mp3';
import phoneAudio2 from '../assets/ElevenLabs_2026-02-23T19_16_37_Phone_guy_eleven_v3_1771870805211.mp3';
import phoneRing from '../assets/fnaf-phone-ringing-sound_1771872460573.mp3';
import camOpen from '../assets/fnaf-open-camera-sound_1771872460573.mp3';
import doorSlam from '../assets/door-slamming-fnaf-1-sound-effects_1771872460573.mp3';
import fnaf2Ambience from '../assets/fnaf2-ambience_1771872491384.mp3';
import animatronicAtDoor from '../assets/animatronic-in-door_1771872460573.mp3';
import jumpscareSound from '../assets/Screamer_like_fnaf_4-1771872293897_1771872491384.mp3';

interface AudioPlayerProps {
  night: number;
  time: number;
  status: string;
  monitorOpen: boolean;
  doors: { left: boolean; right: boolean };
  lights: { left: boolean; right: boolean };
  enemyAtLeft: boolean;
  enemyAtRight: boolean;
  powerOut: boolean;
}

export function AudioPlayer({ 
  night, 
  time, 
  status, 
  monitorOpen, 
  doors, 
  lights, 
  enemyAtLeft, 
  enemyAtRight,
  powerOut
}: AudioPlayerProps) {
  const phoneAudioRef = useRef<HTMLAudioElement | null>(null);
  const ringRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const doorAnimatronicRef = useRef<HTMLAudioElement | null>(null);

  // Phone Call & Ringing
  useEffect(() => {
    if (status !== 'playing' || powerOut) {
      if (phoneAudioRef.current) phoneAudioRef.current.pause();
      if (ringRef.current) ringRef.current.pause();
      return;
    }

    if (time === 0) {
      // Start ringing first
      if (!ringRef.current) {
        ringRef.current = new Audio(phoneRing);
        ringRef.current.loop = true;
      }
      ringRef.current.play().catch(() => {});

      // After 3 seconds of ringing, start the call
      const timer = setTimeout(() => {
        if (ringRef.current) ringRef.current.pause();
        
        const src = night === 1 ? phoneAudio1 : phoneAudio2;
        if (!phoneAudioRef.current) {
          phoneAudioRef.current = new Audio(src);
        } else {
          phoneAudioRef.current.src = src;
        }
        phoneAudioRef.current.play().catch(() => {});
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (ringRef.current) ringRef.current.pause();
      };
    }
  }, [night, time, status, powerOut]);

  // Camera Sound
  useEffect(() => {
    if (status === 'playing' && !powerOut) {
      const audio = new Audio(camOpen);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, [monitorOpen, status, powerOut]);

  // Door Slam
  const prevDoors = useRef(doors);
  useEffect(() => {
    if (status === 'playing' && !powerOut) {
      if (doors.left !== prevDoors.current.left || doors.right !== prevDoors.current.right) {
        const audio = new Audio(doorSlam);
        audio.play().catch(() => {});
      }
    }
    prevDoors.current = doors;
  }, [doors, status, powerOut]);

  // Ambience & Animatronic at Door Sound
  useEffect(() => {
    const isEnemyVisible = (enemyAtLeft && lights.left && !doors.left) || (enemyAtRight && lights.right && !doors.right);

    if (status === 'playing' && !powerOut && isEnemyVisible) {
      // Start FNaF 2 Ambience
      if (!ambienceRef.current) {
        ambienceRef.current = new Audio(fnaf2Ambience);
        ambienceRef.current.loop = true;
      }
      ambienceRef.current.play().catch(() => {});

      // Start Animatronic at Door Sound
      if (!doorAnimatronicRef.current) {
        doorAnimatronicRef.current = new Audio(animatronicAtDoor);
        doorAnimatronicRef.current.loop = true;
      }
      doorAnimatronicRef.current.play().catch(() => {});
    } else {
      if (ambienceRef.current) ambienceRef.current.pause();
      if (doorAnimatronicRef.current) doorAnimatronicRef.current.pause();
    }
  }, [status, powerOut, enemyAtLeft, enemyAtRight, lights, doors]);

  // Jumpscare
  useEffect(() => {
    if (status === 'jumpscare') {
      const audio = new Audio(jumpscareSound);
      audio.play().catch(() => {});
    }
  }, [status]);

  return null;
}
