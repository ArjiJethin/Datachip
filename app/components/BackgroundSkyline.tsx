"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function BackgroundSkyline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax target & current values for smooth spring/lerp interpolation
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Mouse normalized coordinates relative to center (-0.5 to +0.5)
      const normX = e.clientX / windowWidth - 0.5;
      const normY = e.clientY / windowHeight - 0.5;

      // Subtle parallax range: X +/- 15px, Y +/- 10px (opposing direction for depth)
      targetXRef.current = normX * -30;
      targetYRef.current = normY * -20;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const animate = () => {
      // Smooth lerp interpolation factor (0.05 for smooth floating motion)
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.05;
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.05;

      if (containerRef.current) {
        containerRef.current.style.transform = `scale(1.07) translate3d(${currentXRef.current}px, ${currentYRef.current}px, 0px)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 w-full h-full transition-transform duration-75 ease-out"
    >
      <Image
        src="/assets/Layer2.webp?v=2"
        alt="City night skyline background"
        fill
        priority
        unoptimized
        quality={100}
        sizes="100vw"
        className="object-cover object-center pointer-events-none pixelated"
      />
    </div>
  );
}
