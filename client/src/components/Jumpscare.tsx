import { useState, useEffect } from "react";
// FIX : On utilise le chemin relatif pour l'image
import jumpscareImg from "../assets/WA_1771869060539_1771870866599.jpeg";

export function Jumpscare({ enemyId }: { enemyId: string | null }) {
  if (!enemyId) return null;

  return (
    <div className="absolute inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      <img 
        src={jumpscareImg} 
        className="w-full h-full object-cover animate-pulse scale-110"
        alt="JUMPSCARE"
      />
    </div>
  );
}
