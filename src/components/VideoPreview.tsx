"use client";

import { useRef } from "react";
import Image from "next/image";

type Props = {
  previewUrl?: string | null;
  posterUrl?: string | null;
  className?: string;
};

export default function VideoPreview({ previewUrl, posterUrl, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const play = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play().catch(() => {});
    }
  };
  const pause = () => videoRef.current?.pause();

  return (
    <div onMouseEnter={play} onMouseLeave={pause} className={className}>
      {previewUrl ? (
        <video
          ref={videoRef}
          src={previewUrl || undefined}
          poster={posterUrl || undefined}
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          preload="metadata"
        />
      ) : (
        <Image
          src={posterUrl || ""}
          alt=""
          width={400}
          height={225}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
