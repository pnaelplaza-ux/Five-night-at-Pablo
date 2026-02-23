import { useEffect, useRef } from 'react';
import phoneAudio1 from '@assets/ElevenLabs_2026-02-23T19_14_55_Phone_guy_eleven_v3_1771870805260.mp3';
import phoneAudio2 from '@assets/ElevenLabs_2026-02-23T19_16_37_Phone_guy_eleven_v3_1771870805211.mp3';

interface AudioPlayerProps {
  night: number;
  isPlaying: boolean;
}

export function AudioPlayer({ night, isPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      return;
    }

    if (isPlaying) {
      const src = night === 1 ? phoneAudio1 : phoneAudio2;
      
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.volume = 0.8;
      } else {
        audioRef.current.src = src;
      }

      // Need user interaction first usually, but assuming play from menu
      audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [night, isPlaying]);

  return null;
}
