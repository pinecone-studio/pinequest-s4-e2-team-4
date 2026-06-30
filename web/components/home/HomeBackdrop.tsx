"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

type HomeBackdropProps = {
  active: boolean;
};

const animationCycleMs = 36000;
const animationStartedAt = Date.now();

export default function HomeBackdrop({ active }: HomeBackdropProps) {
  const motionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!motionRef.current) {
      return;
    }

    const elapsedMs = (Date.now() - animationStartedAt) % animationCycleMs;
    motionRef.current.style.animationDelay = `-${elapsedMs / 1000}s`;
  }, []);

  if (!active) {
    return <div className="absolute inset-0 bg-[linear-gradient(135deg,#edf7f4,#d6ece7_45%,#f7fbff)]" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={motionRef} className="mongolia-bg-motion absolute inset-0">
        <Image
          src="/intro.PNG"
          alt="Mongolian mountain nature background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#06221f]/45 backdrop-blur-[1px]" />
    </div>
  );
}
