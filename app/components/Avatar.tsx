"use client";

import React, { useState } from "react";
import { useAudio } from "./AudioContext";

// Dev toggle flag: set to true in code during development if you want to inspect translucent hitboxes
const SHOW_HIGHLIGHT_BOXES = false;

export default function Avatar() {
  const { setActiveTab, playBeep } = useAudio();
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

  const handleNavigate = (tab: string, hash: string) => {
    playBeep();
    setActiveTab(tab);
    window.location.hash = hash;
  };

  return (
    <div
      className="absolute z-12 select-none flex items-end justify-start"
      style={{
        left: "28.5%",
        bottom: "clamp(6.5%, 9.8vh, 11%)",
        width: "clamp(270px, 27.8vw, 490px)",
      }}
    >
      <div className="relative w-full h-auto pointer-events-auto">
        {/* Avatar Base / Hover Image */}
        {/* Swaps to AvatarHover.png when user hovers over the avatar body (not laptop or phone) */}
        <img
          src={hoveredTarget === "ABOUT" ? "/assets/AvatarHover.png" : "/assets/Avatar.png"}
          alt="Arji Jethin Pixel Avatar"
          className={`w-full h-auto block pixelated transition-all duration-300 ${hoveredTarget === "ABOUT"
            ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]"
            : hoveredTarget === "PROJECTS"
              ? "drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]"
              : hoveredTarget === "CONTACT"
                ? "drop-shadow-[0_0_8px_rgba(192,132,252,0.35)]"
                : "drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
            }`}
        />

        {/* 1. CLICK TARGET: AVATAR BODY & CHAIR -> ABOUT */}
        <div
          onClick={() => handleNavigate("ABOUT", "#about")}
          onMouseEnter={() => setHoveredTarget("ABOUT")}
          onMouseLeave={() => setHoveredTarget(null)}
          className="absolute left-6 top-0 w-[49%] h-full cursor-pointer rounded-lg group"
        >
          {/* Dev-only translucent box overlay */}
          {SHOW_HIGHLIGHT_BOXES && (
            <div className="absolute inset-0 bg-[#fbbf24]/10 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}

          {/* Always Visible Hover Tooltip Badge */}
          <div className="absolute top-[35%] left-[22%] opacity-0 group-hover:opacity-100 transition-opacity bg-[#080913]/90 border border-[#fbbf24]/70 text-[#fbbf24] text-[9px] md:text-[10px] font-['Silkscreen',monospace] px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap backdrop-blur-sm">
            ABOUT ME ↗
          </div>
        </div>

        {/* 2. CLICK TARGET: LAPTOP -> PROJECTS */}
        <div
          onClick={() => handleNavigate("PROJECTS", "#projects")}
          onMouseEnter={() => setHoveredTarget("PROJECTS")}
          onMouseLeave={() => setHoveredTarget(null)}
          className="absolute left-[49%] top-[30%] w-[34%] h-[47%] cursor-pointer rounded-lg group"
        >
          {/* Dev-only translucent box overlay */}
          {SHOW_HIGHLIGHT_BOXES && (
            <div className="absolute inset-0 bg-[#38bdf8]/10 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}

          {/* Always Visible Hover Tooltip Badge */}
          <div className="absolute top-[18%] left-[15%] opacity-0 group-hover:opacity-100 transition-opacity bg-[#080913]/90 border border-[#38bdf8]/70 text-[#38bdf8] text-[9px] md:text-[10px] font-['Silkscreen',monospace] px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap backdrop-blur-sm">
            MY PROJECTS ↗
          </div>
        </div>

        {/* 3. CLICK TARGET: PHONE -> CONTACT */}
        <div
          onClick={() => handleNavigate("CONTACT", "#contact")}
          onMouseEnter={() => setHoveredTarget("CONTACT")}
          onMouseLeave={() => setHoveredTarget(null)}
          className="absolute left-[76.5%] top-[68%] w-[20%] h-[25%] cursor-pointer rounded-lg group"
        >
          {/* Dev-only translucent box overlay */}
          {SHOW_HIGHLIGHT_BOXES && (
            <div className="absolute inset-0 bg-[#c084fc]/15 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}

          {/* Always Visible Hover Tooltip Badge */}
          <div className="absolute -top-7 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#080913]/90 border border-[#c084fc]/70 text-[#c084fc] text-[9px] md:text-[10px] font-['Silkscreen',monospace] px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap backdrop-blur-sm">
            CONTACT ↗
          </div>
        </div>
      </div>
    </div>
  );
}
