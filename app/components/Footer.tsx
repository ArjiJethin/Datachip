"use client";

import React from "react";
import Image from "next/image";
import { useAudio } from "./AudioContext";

export default function Footer() {
  const { isPlayingCassette: isPlaying, toggleCassette: setIsPlaying } = useAudio();

  // Array of 14 wave bar classnames for the audio waveform visualizer player
  const waveBars = [
    "wave-bar-1", "wave-bar-2", "wave-bar-3", "wave-bar-4",
    "wave-bar-5", "wave-bar-6", "wave-bar-7", "wave-bar-8",
    "wave-bar-9", "wave-bar-10", "wave-bar-11", "wave-bar-12",
    "wave-bar-13", "wave-bar-14"
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 w-full h-[74px] bg-[#080913]/95 backdrop-blur-md border-t border-[#151728] text-[#cbd5e1] select-none">
      {/* Centered content container */}
      <div className="h-full max-w-6xl mx-auto flex items-center justify-center gap-6 md:gap-10 lg:gap-14 px-4">

        {/* ================= 1. NOW PLAYING & CASSETTE SECTION ================= */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Left: Track Text Info */}
          <div className="flex flex-col justify-center space-y-0.5">
            {/* Header */}
            <div className="flex items-center gap-1.5 text-[#9b95c9] font-['Silkscreen',monospace] text-[10px] tracking-wider uppercase">
              <span className="text-[#a78bfa] text-xs">♫</span>
              <span>NOW PLAYING</span>
            </div>

            {/* Song Title */}
            <div className="font-['Pixelify_Sans',monospace] text-xs md:text-sm font-semibold text-[#f1f5f9] tracking-wide">
              Night Drive
            </div>

            {/* Artist */}
            <div className="font-['Pixelify_Sans',monospace] text-[11px] text-[#8f96b3]">
              - wave to earth
            </div>
          </div>

          {/* Right: Larger Cassette Graphic + Wave Player Below It */}
          <div className="flex flex-col items-center shrink-0">
            {/* Cassette Graphic - Balanced top offset */}
            <div
              className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 -mt-9 md:-mt-11"
              onClick={setIsPlaying}
              title={isPlaying ? "Click to Pause Cassette" : "Click to Play Cassette"}
            >
              <div className="relative w-[130px] h-[82px] md:w-[155px] md:h-[96px]">
                <Image
                  src="/assets/CasetteStatic.png"
                  alt="Cassette Tape"
                  fill
                  sizes="170px"
                  className="object-contain pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>

            {/* Audio Wave Player - Fully visible directly BELOW the cassette tape with decent gap */}
            <div className="flex items-center gap-0.5 pt-0.5">
              <div
                className="flex items-end gap-[1.5px] h-3.5 cursor-pointer"
                onClick={setIsPlaying}
                title={isPlaying ? "Click to Pause" : "Click to Play"}
              >
                {waveBars.map((barClass, idx) => (
                  <span
                    key={idx}
                    className={`w-[2px] rounded-xs transition-all duration-300 ${idx % 3 === 0
                      ? 'bg-[#38bdf8]'
                      : idx % 3 === 1
                        ? 'bg-[#818cf8]'
                        : 'bg-[#a78bfa]'
                      } ${isPlaying ? barClass : 'h-1'}`}
                  />
                ))}
              </div>
              <div className="text-[#3b4266] font-mono text-[8px] tracking-widest overflow-hidden whitespace-nowrap">
                ...............
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. LOCATION & MAP SECTION ================= */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Location Text Info */}
          <div className="flex flex-col justify-center space-y-0.5">
            {/* Header label */}
            <div className="flex items-center gap-1.5 text-[#9b95c9] font-['Silkscreen',monospace] text-[10px] tracking-wider uppercase">
              <span>LOCATION</span>
            </div>

            {/* City */}
            <div className="font-['Pixelify_Sans',monospace] text-xs md:text-sm text-[#f1f5f9] font-medium">
              Somewhere in Bangalore, IN
            </div>

            {/* Weather line */}
            <div className="flex items-center gap-2 font-['Pixelify_Sans',monospace] text-[11px] text-[#8f96b3]">
              <span className="text-xs">☁</span>
              <span>23°C</span>
              <span className="text-[#64748b]">Rainy</span>
            </div>
          </div>

          {/* Larger Map Graphic - Restored offset to -mt-12 md:-mt-16 as requested, angled */}
          <div className="relative shrink-0 -mt-12 md:-mt-16 rotate-[5deg]">
            <div className="relative w-[125px] h-[78px] md:w-[150px] md:h-[94px] transition-transform hover:scale-105">
              <Image
                src="/assets/MapStatic.png"
                alt="World Map"
                fill
                sizes="160px"
                className="object-contain pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* LATITUDE Tag Badge Overlay */}
            <div className="absolute -bottom-1 -right-2 bg-[#151433]/95 border border-[#4338ca]/70 text-[#c7d2fe] px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-['Silkscreen',monospace] tracking-wider uppercase shadow-lg flex items-center gap-1 rotate-[-5deg]">
              <span>LATITUDE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* ================= 3. STATUS & SOCIALS SECTION ================= */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Status text */}
          <div className="flex flex-col justify-center space-y-0.5">
            {/* Header label */}
            <div className="text-[#9b95c9] font-['Silkscreen',monospace] text-[10px] tracking-wider uppercase">
              STATUS <span className="text-[#4ade80]">•</span>
            </div>

            {/* Status lines */}
            <div className="font-['Pixelify_Sans',monospace] text-xs md:text-sm text-[#cbd5e1] leading-tight">
              <div>Building cool things</div>
              <div className="text-[#8f96b3]">and breaking bugs.</div>
            </div>
          </div>

          {/* Social Icons (Clean raw icons without background box) */}
          <div className="flex items-center gap-2.5 text-[#8f96b3] pl-1">
            <a
              href="https://github.com"
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
              href="https://linkedin.com"
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
              href="mailto:contact@example.com"
              className="p-0.5 hover:text-white transition-colors group"
              aria-label="Email"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
