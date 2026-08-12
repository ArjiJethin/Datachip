"use client";

import React, { useEffect, useRef } from "react";

export default function RainAndClouds() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // 450 short, transparent rain drops falling at a steep diagonal angle
    const dropCount = 450;
    const drops: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      slant: number;
      width: number;
    }> = [];

    for (let i = 0; i < dropCount; i++) {
      const length = Math.random() * 8 + 6; // Short rain streaks (6px - 14px)
      drops.push({
        x: Math.random() * (width + 500) - 100,
        y: Math.random() * height,
        length: length,
        speed: Math.random() * 10 + 12,
        opacity: Math.random() * 0.22 + 0.20, // Subtle transparency (0.08 - 0.30)
        slant: length * 0.75, // Steep diagonal angle matching reference image
        width: Math.random() * 0.8 + 0.6,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        ctx.lineWidth = drop.width;
        ctx.strokeStyle = `rgba(195, 220, 255, ${drop.opacity})`;
        ctx.beginPath();
        // Slanted rain vector: top-right to bottom-left
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.slant, drop.y + drop.length);
        ctx.stroke();

        // Move rain drop along the diagonal angle
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.75;

        // Reset drop when off screen
        if (drop.y > height || drop.x < -100) {
          drop.y = -drop.length - Math.random() * 50;
          drop.x = Math.random() * (width + 500);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden select-none">
      {/* Slow Moving Clouds Layer - Lighter/misty gradients to stand out against the dark sky */}
      <div className="absolute inset-0 z-0">
        {/* High Altitude Cloud Mist */}
        <div className="absolute top-[3%] -left-[450px] w-[850px] h-[180px] bg-gradient-to-r from-transparent via-[#5c6899]/35 to-transparent blur-2xl animate-cloud-slow" />

        {/* Main Floating Storm Cloud */}
        <div className="absolute top-[12%] -left-[600px] w-[1000px] h-[240px] bg-gradient-to-r from-transparent via-[#45507d]/40 to-transparent blur-3xl animate-cloud-medium" />

        {/* Lower Cloud Patch */}
        <div className="absolute top-[22%] -left-[350px] w-[750px] h-[160px] bg-gradient-to-r from-transparent via-[#6b78a8]/30 to-transparent blur-xl animate-cloud-fast" />

        {/* Soft Cloud Shapes for extra visibility */}
        <div className="absolute top-[5%] -left-[300px] w-[450px] h-[100px] bg-[#4a5585]/20 rounded-full blur-lg animate-cloud-slow" />
        <div className="absolute top-[15%] -left-[200px] w-[550px] h-[120px] bg-[#59669c]/25 rounded-full blur-xl animate-cloud-medium" />
      </div>

      {/* Animated Canvas Rain Drops */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full" />
    </div>
  );
}
