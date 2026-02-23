import { EnemyId } from "@/hooks/use-game-engine";

// Image mappings
import friend1Img from '@assets/WA_1771869060539_1771870866599.jpeg';
import friend2Img from '@assets/IMG-20251221-WA0015_1771870866643.jpg';
import friend3Img from '@assets/IMG-20251221-WA0028_1771870866656.jpg';
import friend4Img from '@assets/WA_1771868918600_1771870866666.jpeg';

const ENEMY_IMAGES: Record<string, string> = {
  pablo: friend1Img,
  friend2: friend2Img,
  friend3: friend3Img,
  friend4: friend4Img
};

interface JumpscareProps {
  enemyId: EnemyId | null;
}

export function Jumpscare({ enemyId }: JumpscareProps) {
  if (!enemyId) return null;

  const imgSrc = ENEMY_IMAGES[enemyId] || friend1Img;

  return (
    <div className="fixed inset-0 z-[99999] bg-black overflow-hidden flex items-center justify-center">
      <img 
        src={imgSrc} 
        alt="Jumpscare"
        className="w-full h-full object-cover animate-bounce"
        style={{
          filter: 'contrast(2) brightness(1.5) saturate(1.5)',
          animationDuration: '0.05s',
          transform: 'scale(1.2)'
        }}
      />
      <div className="absolute inset-0 bg-red-600 mix-blend-overlay animate-pulse" style={{ animationDuration: '0.1s' }} />
    </div>
  );
}
