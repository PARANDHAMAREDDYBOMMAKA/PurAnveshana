"use client";
import { useState, useEffect } from 'react';

export function VideoPlayer({ src, title }: { src: string; title: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-slate-100 flex items-center justify-center">
        <div className="text-slate-400">Loading video...</div>
      </div>
    );
  }

  return (
    <video
      controls
      className="absolute top-0 left-0 w-full h-full object-cover"
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
