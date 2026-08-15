"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAudio } from "./AudioContext";

const NUM_WAVE_BARS = 30;

export default function Footer() {
  const {
    isPlayingCassette: isPlaying,
    toggleCassette: setIsPlaying,
    isMuted,
    toggleMute,
    isAudioStarted,
  } = useAudio();

  // Organic audio visualizer heights
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array.from({ length: NUM_WAVE_BARS }, (_, i) => {
      const center =
        1 -
        Math.abs(i - (NUM_WAVE_BARS - 1) / 2) /
        (NUM_WAVE_BARS / 2);

      // Deterministic initial values so server and client match
      return 25 + center * 35;
    })
  );

  // Keeps animation values outside React's render cycle
  const barHeightsRef = useRef<number[]>(barHeights);

  useEffect(() => {
    if (!isPlaying || isMuted) {
      return;
    }

    let animId: number;

    let currentHeights = [...barHeightsRef.current];

    let targetHeights = currentHeights.map((height, i) => {
      const center =
        1 -
        Math.abs(i - (NUM_WAVE_BARS - 1) / 2) /
        (NUM_WAVE_BARS / 2);

      return Math.max(
        15,
        Math.min(
          90,
          25 + center * 35 + Math.random() * 30
        )
      );
    });

    let lastTargetUpdate = performance.now();

    const animate = (time: number) => {
      if (time - lastTargetUpdate > 120) {
        lastTargetUpdate = time;

        targetHeights = targetHeights.map((_, i) => {
          const center =
            1 -
            Math.abs(i - (NUM_WAVE_BARS - 1) / 2) /
            (NUM_WAVE_BARS / 2);

          const baseHeight = 20 + center * 35;
          const variation = Math.random() * 40;

          return Math.max(
            12,
            Math.min(92, baseHeight + variation)
          );
        });
      }

      currentHeights = currentHeights.map((current, i) => {
        const target = targetHeights[i];

        return current + (target - current) * 0.12;
      });

      barHeightsRef.current = currentHeights;

      setBarHeights([...currentHeights]);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isMuted]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 w-full h-[74px] bg-[#080913]/95 backdrop-blur-md border-t border-[#151728] text-[#cbd5e1] select-none">
      {/* Content container */}
      <div className="h-full max-w-[94vw] xl:max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6">

        <div className="flex items-center justify-center gap-[clamp(1rem,2.5vw,3.5rem)] mx-auto">
          {/* ================= 1. NOW PLAYING & CASSETTE SECTION ================= */}
          <div className="flex items-center gap-2.5 md:gap-4">
            {/* Track Info */}
            <div className="flex flex-col justify-center space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#9b95c9] font-['Silkscreen',monospace] text-[9px] md:text-[10px] tracking-wider uppercase">
                <span className="text-[#a78bfa] text-xs">♫</span>
                <span>NOW PLAYING</span>
              </div>

              <div className="font-['Pixelify_Sans',monospace] text-xs md:text-sm font-semibold text-[#f1f5f9] tracking-wide">
                Bones (feat. Jófriður)
              </div>

              <div className="font-['Pixelify_Sans',monospace] text-[10px] md:text-[11px] text-[#8f96b3]">
                - Low Roar
              </div>
            </div>

            {/* Cassette Graphic + Full-Width Traveling Wave Visualizer Below */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 -mt-8 md:-mt-10"
                onClick={setIsPlaying}
                title={isPlaying ? "Click to Pause Cassette" : "Click to Play Cassette"}
              >
                <div className="relative w-[clamp(115px,9.5vw,155px)] h-[clamp(72px,6vw,96px)]">
                  <Image
                    src="/assets/home/CasetteStatic.png"
                    alt="Cassette Tape"
                    fill
                    sizes="170px"
                    className="object-contain pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>

              {/* UNIFORM LEFT-TO-RIGHT TRAVELING AUDIO WAVE VISUALIZER */}
              <div
                className="w-[clamp(115px,9.5vw,155px)] flex items-center justify-between pt-1 cursor-pointer group"
                onClick={setIsPlaying}
                title={isPlaying ? "Click to Pause" : "Click to Play"}
              >
                <div className="flex items-end justify-between gap-[1.5px] h-4 w-full px-0.5">
                  {barHeights.map((heightPct, idx) => {
                    const isActive = isPlaying && !isMuted;

                    // Smooth cyan-to-purple gradient based on position across the 30 bars
                    const progress = idx / (NUM_WAVE_BARS - 1);

                    return (
                      <span
                        key={idx}
                        className={`flex-1 rounded-xs ${isActive
                          ? "opacity-100 drop-shadow-[0_0_5px_rgba(56,189,248,0.6)]"
                          : "bg-[#64748b] opacity-50 grayscale"
                          }`}
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: isActive
                            ? `hsl(${190 + progress * 90}, 90%, 65%)` // Smoothly shifts from Cyan (190) to Purple/Pink (280)
                            : undefined,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ================= 2. LOCATION & MAP SECTION ================= */}
          <div className="flex items-center gap-2.5 md:gap-4">
            <div className="flex flex-col justify-center space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#9b95c9] font-['Silkscreen',monospace] text-[9px] md:text-[10px] tracking-wider uppercase">
                <span>LOCATION</span>
              </div>

              <div className="font-['Pixelify_Sans',monospace] text-xs md:text-sm text-[#f1f5f9] font-medium">
                Somewhere in Bangalore, IN
              </div>

              <div className="flex items-center gap-2 font-['Pixelify_Sans',monospace] text-[10px] md:text-[11px] text-[#8f96b3]">
                <span className="text-xs">☁</span>
                <span>23°C</span>
                <span className="text-[#64748b]">Rainy</span>
              </div>
            </div>

            <div className="relative shrink-0 -mt-10 md:-mt-14 rotate-[5deg]">
              <div className="relative w-[clamp(110px,9vw,150px)] h-[clamp(68px,5.6vw,94px)] transition-transform hover:scale-105">
                <Image
                  src="/assets/home/MapStatic.png"
                  alt="World Map"
                  fill
                  sizes="160px"
                  className="object-contain pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                />
              </div>

              <div className="absolute -bottom-1 -right-2 bg-[#151433]/95 border border-[#4338ca]/70 text-[#c7d2fe] px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-['Silkscreen',monospace] tracking-wider uppercase shadow-lg flex items-center gap-1 rotate-[-5deg]">
                <span>LATITUDE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* ================= 3. STATUS & SOCIALS SECTION ================= */}
          <div className="hidden sm:flex items-center gap-3 md:gap-5">
            <div className="flex flex-col justify-center space-y-0.5">
              <div className="text-[#9b95c9] font-['Silkscreen',monospace] text-[9px] md:text-[10px] tracking-wider uppercase">
                STATUS <span className="text-[#4ade80]">•</span>
              </div>

              <div className="font-['Pixelify_Sans',monospace] text-xs md:text-sm text-[#cbd5e1] leading-tight">
                <div>Building cool things</div>
                <div className="text-[#8f96b3]">and breaking bugs.</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#8f96b3] pl-1">
              <a
                href="https://github.com/ArjiJethin/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-0.5 hover:text-white transition-colors group"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/arjijethin/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-0.5 hover:text-white transition-colors group"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
              </a>

              <a
                href="https://mail.google.com/mail/u/0/?fs=1&to=arjijethin.ac0705@gmail.com&su=Interview+Opportunity+-+Arji+Jethin&body=Hello+Arji,%0A%0AI+reviewed+your+profile+and+would+like+to+discuss+a+potential+opportunity.+Please+let+me+know+a+convenient+time+to+connect.%0A%0AName:+%0ACompany:+%0APosition:+%0AEmail:+%0APhone:+%0A%0AKind+regards,&tf=cm"
                className="p-0.5 hover:text-white transition-colors group"
                aria-label="Email"
                target="blank"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ================= 4. MUTE / AUDIO CONTROL BUTTON ================= */}
        <div className="flex items-center pl-1 shrink-0">
          <button
            onClick={toggleMute}
            className="group relative flex items-center justify-center p-1.5 text-[#94a3b8] hover:text-[#f8fafc] opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? (
              <svg className="w-5 h-5 fill-current text-[#ef4444]" viewBox="0 0 24 24">
                <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H3v6h4l5 5v-6.71l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81l2.04 2.04a.996.996 0 101.41-1.41L5.04 3.63a.997.997 0 00-1.41 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-2.5 0c0-.84-.27-1.62-.73-2.26l1.5-1.5c.78 1.04 1.23 2.34 1.23 3.76 0 1.42-.45 2.72-1.23 3.76l-1.5-1.5c.46-.64.73-1.42.73-2.26zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : isPlaying || isAudioStarted ? (
              <div className="relative flex items-center justify-center">
                <svg className="w-5 h-5 fill-current text-[#38bdf8] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#38bdf8] animate-ping opacity-75" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#38bdf8]" />
              </div>
            ) : (
              <svg className="w-5 h-5 fill-current text-[#cbd5e1] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </footer>
  );
}
