"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioContext";

interface LightningEvent {
  thunderTimeSec: number;
  lightningTimeSec: number;
  intensity: 1 | 2 | 3;
}

// 27 Thunder events from storm audio (600.4s loop) with pre-thunder lightning delays (1.0s - 1.8s)
const LIGHTNING_TIMELINE: LightningEvent[] = [
  { thunderTimeSec: 38.18, lightningTimeSec: 36.78, intensity: 3 },
  { thunderTimeSec: 51.60, lightningTimeSec: 50.40, intensity: 2 },
  { thunderTimeSec: 68.46, lightningTimeSec: 66.86, intensity: 3 },
  { thunderTimeSec: 80.93, lightningTimeSec: 79.63, intensity: 3 },
  { thunderTimeSec: 125.70, lightningTimeSec: 124.20, intensity: 1 },
  { thunderTimeSec: 140.80, lightningTimeSec: 139.70, intensity: 2 },
  { thunderTimeSec: 167.64, lightningTimeSec: 165.94, intensity: 1 },
  { thunderTimeSec: 196.97, lightningTimeSec: 195.72, intensity: 3 },
  { thunderTimeSec: 208.95, lightningTimeSec: 207.50, intensity: 3 },
  { thunderTimeSec: 219.20, lightningTimeSec: 218.05, intensity: 2 },
  { thunderTimeSec: 241.63, lightningTimeSec: 239.98, intensity: 1 },
  { thunderTimeSec: 249.95, lightningTimeSec: 248.60, intensity: 3 },
  { thunderTimeSec: 265.23, lightningTimeSec: 263.68, intensity: 3 },
  { thunderTimeSec: 318.06, lightningTimeSec: 316.86, intensity: 2 },
  { thunderTimeSec: 340.46, lightningTimeSec: 338.71, intensity: 1 },
  { thunderTimeSec: 383.18, lightningTimeSec: 381.78, intensity: 3 },
  { thunderTimeSec: 396.60, lightningTimeSec: 395.50, intensity: 2 },
  { thunderTimeSec: 413.46, lightningTimeSec: 411.86, intensity: 1 },
  { thunderTimeSec: 425.93, lightningTimeSec: 424.63, intensity: 3 },
  { thunderTimeSec: 470.71, lightningTimeSec: 469.21, intensity: 3 },
  { thunderTimeSec: 485.80, lightningTimeSec: 484.55, intensity: 2 },
  { thunderTimeSec: 512.63, lightningTimeSec: 511.18, intensity: 3 },
  { thunderTimeSec: 529.75, lightningTimeSec: 528.60, intensity: 1 },
  { thunderTimeSec: 541.97, lightningTimeSec: 540.32, intensity: 3 },
  { thunderTimeSec: 553.95, lightningTimeSec: 552.60, intensity: 3 },
  { thunderTimeSec: 564.20, lightningTimeSec: 563.10, intensity: 2 },
  { thunderTimeSec: 586.75, lightningTimeSec: 585.25, intensity: 3 },
];

export default function RainAndClouds() {
  const { isAudioStarted } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState<number>(0.2);

  // Trigger lightning function ref so timeline interval can invoke it safely
  const triggerLightningRef = useRef<((intensity: 1 | 2 | 3) => void) | null>(null);

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

    // Trigger lightning with 3 intensity levels
    const triggerLightning = (intensity: 1 | 2 | 3 = 2) => {
      // Intensity 1 = subtle flash, no main canvas bolt
      if (intensity === 1) {
        setFlashOpacity(0.18);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 140);
        activeBolt = null;
        activeBranch = null;
        return;
      }

      // Intensity 2 (normal) & Intensity 3 (strong)
      const flashPeak = intensity === 3 ? 0.5 : 0.25;
      const flashDuration = intensity === 3 ? 320 : 250;

      setFlashOpacity(flashPeak);
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), flashDuration);

      // Generate lightning bolt coordinates inside window area (middle sky)
      const startX = width * (Math.random() * 0.25 + 0.45); // Window sky bounds
      const startY = height * 0.05;
      const endY = height * 0.52;

      const segments = intensity === 3 ? 8 : 6;
      const mainPoints = [{ x: startX, y: startY }];
      let currentX = startX;
      let currentY = startY;
      const segH = (endY - startY) / segments;

      for (let i = 0; i < segments; i++) {
        currentY += segH;
        currentX += (Math.random() - 0.5) * (intensity === 3 ? 55 : 45);
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

      boltTimer = intensity === 3 ? 24 : 16;
    };

    triggerLightningRef.current = triggerLightning;

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
      triggerLightningRef.current = null;
    };
  }, []);

  // Soundtrack-Synchronized Lightning Timeline Scheduler
  useEffect(() => {
    if (!isAudioStarted) {
      return;
    }

    const startTime = Date.now();
    const LOOP_DURATION_MS = 600400; // 600.4s storm audio track length

    let lastFiredLoopIndex = -1;
    const firedEvents = new Set<number>();

    const checkTimeline = () => {
      const elapsedTotal = Date.now() - startTime;
      const currentLoopIndex = Math.floor(elapsedTotal / LOOP_DURATION_MS);
      const loopTimeSec = (elapsedTotal % LOOP_DURATION_MS) / 1000;

      // Reset fired events set when audio loop restarts
      if (currentLoopIndex !== lastFiredLoopIndex) {
        lastFiredLoopIndex = currentLoopIndex;
        firedEvents.clear();
      }

      // Check each scheduled lightning event in the timeline
      LIGHTNING_TIMELINE.forEach((event, idx) => {
        if (!firedEvents.has(idx) && loopTimeSec >= event.lightningTimeSec) {
          if (loopTimeSec - event.lightningTimeSec < 1.5) {
            triggerLightningRef.current?.(event.intensity);
          }
          firedEvents.add(idx);
        }
      });
    };

    const intervalId = setInterval(checkTimeline, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAudioStarted]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden select-none">
      {/* Lightning Flash Overlay (Flashes light over the window skyline) */}
      <div
        className="absolute inset-0 z-20 bg-white transition-opacity duration-150"
        style={{
          opacity: isFlashing ? flashOpacity : 0,
        }}
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
