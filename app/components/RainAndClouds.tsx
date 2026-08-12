"use client";

import React, { useEffect, useRef, useState } from "react";

export default function RainAndClouds() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

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
      const length = Math.random() * 8 + 6;
      drops.push({
        x: Math.random() * (width + 500) - 100,
        y: Math.random() * height,
        length: length,
        speed: Math.random() * 10 + 12,
        opacity: Math.random() * 0.22 + 0.1,
        slant: length * 0.75,
        width: Math.random() * 0.8 + 0.6,
      });
    }

    // Lightning bolt coordinates state
    let activeBolt: Array<{ x: number; y: number }> | null = null;
    let activeBranch: Array<{ x: number; y: number }> | null = null;
    let boltTimer = 0;
    let timerId: NodeJS.Timeout;

    // Trigger lightning roughly every 15 seconds (12s - 18s interval)
    const scheduleNextLightning = () => {
      const delay = Math.random() * 6000 + 12000;
      return setTimeout(() => {
        triggerLightning();
        timerId = scheduleNextLightning();
      }, delay);
    };

    const triggerLightning = () => {
      // Trigger sky flash overlay
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 250);

      // Generate lightning bolt coordinates inside the window area (middle sky)
      const startX = width * (Math.random() * 0.25 + 0.45); // Window sky bounds
      const startY = height * 0.05;
      const endY = height * 0.52;

      const segments = 6;
      const mainPoints = [{ x: startX, y: startY }];
      let currentX = startX;
      let currentY = startY;
      const segH = (endY - startY) / segments;

      for (let i = 0; i < segments; i++) {
        currentY += segH;
        currentX += (Math.random() - 0.5) * 45;
        mainPoints.push({ x: currentX, y: currentY });
      }

      activeBolt = mainPoints;

      // Branch bolt
      if (mainPoints.length > 3) {
        const branchStart = mainPoints[2];
        activeBranch = [
          branchStart,
          { x: branchStart.x + (Math.random() - 0.5) * 30 + 20, y: branchStart.y + 30 },
          { x: branchStart.x + (Math.random() - 0.5) * 40 + 35, y: branchStart.y + 60 },
        ];
      }

      boltTimer = 16;
    };

    timerId = scheduleNextLightning();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";

      // Draw Rain Drops
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        ctx.lineWidth = drop.width;
        ctx.strokeStyle = `rgba(195, 220, 255, ${drop.opacity})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.slant, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= drop.speed * 0.75;

        if (drop.y > height || drop.x < -100) {
          drop.y = -drop.length - Math.random() * 50;
          drop.x = Math.random() * (width + 500);
        }
      }

      // Draw Lightning Bolt inside the window area
      if (activeBolt && boltTimer > 0) {
        ctx.save();
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(activeBolt[0].x, activeBolt[0].y);
        for (let i = 1; i < activeBolt.length; i++) {
          ctx.lineTo(activeBolt[i].x, activeBolt[i].y);
        }
        ctx.stroke();

        if (activeBranch) {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(220, 240, 255, 0.85)";
          ctx.beginPath();
          ctx.moveTo(activeBranch[0].x, activeBranch[0].y);
          for (let i = 1; i < activeBranch.length; i++) {
            ctx.lineTo(activeBranch[i].x, activeBranch[i].y);
          }
          ctx.stroke();
        }

        ctx.restore();
        boltTimer--;
        if (boltTimer <= 0) {
          activeBolt = null;
          activeBranch = null;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden select-none">
      {/* Lightning Flash Overlay (Flashes light over the window skyline) */}
      <div
        className={`absolute inset-0 z-20 bg-white/20 transition-opacity duration-150 ${
          isFlashing ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Slow Moving Storm Clouds Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[3%] -left-[450px] w-[850px] h-[180px] bg-gradient-to-r from-transparent via-[#5c6899]/35 to-transparent blur-2xl animate-cloud-slow" />
        <div className="absolute top-[12%] -left-[600px] w-[1000px] h-[240px] bg-gradient-to-r from-transparent via-[#45507d]/40 to-transparent blur-3xl animate-cloud-medium" />
        <div className="absolute top-[22%] -left-[350px] w-[750px] h-[160px] bg-gradient-to-r from-transparent via-[#6b78a8]/30 to-transparent blur-xl animate-cloud-fast" />
        <div className="absolute top-[5%] -left-[300px] w-[450px] h-[100px] bg-[#4a5585]/20 rounded-full blur-lg animate-cloud-slow" />
        <div className="absolute top-[15%] -left-[200px] w-[550px] h-[120px] bg-[#59669c]/25 rounded-full blur-xl animate-cloud-medium" />
      </div>

      {/* Animated Canvas Rain Drops & Lightning Strike */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full" />
    </div>
  );
}
