'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import type { Shot } from '@/types';
import { X, Circle } from 'lucide-react';

interface CourtProps {
  onShot: (coords: { x: number; y: number }) => void;
  shots: Shot[];
}

export function Court({ onShot, shots }: CourtProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCourtClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;

    onShot({ x: relativeX, y: relativeY });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto aspect-[1000/940] cursor-crosshair"
      onClick={handleCourtClick}
    >
      <Image
        src="/cancha.png"
        alt="Cancha de baloncesto"
        layout="fill"
        objectFit="contain"
        priority
      />
      {shots.map((shot) => (
        <div
          key={shot.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${shot.x}%`, top: `${shot.y}%` }}
        >
          {shot.made ? (
            <Circle className="w-4 h-4 text-green-500 fill-green-500/50" />
          ) : (
            <X className="w-4 h-4 text-red-500" />
          )}
        </div>
      ))}
    </div>
  );
}
