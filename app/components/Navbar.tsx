"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("HOME");

  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "PROJECTS", href: "#projects" },
    { name: "ABOUT", href: "#about" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <div className="fixed -top-3 md:-top-4 right-4 md:right-8 z-30 select-none flex items-center gap-3">
      {/* StatBoard Frame Container */}
      <div className="relative w-[360px] md:w-[420px] shrink-0">
        {/* Pixel Art Frame Graphic */}
        <img
          src="/assets/StatBoard.png"
          alt="Navigation Panel"
          className="w-full h-auto pixelated block drop-shadow-xl pointer-events-none"
        />

        {/* TOP SCREEN DISPLAY: HOME, PROJECTS, ABOUT, CONTACT */}
        <div className="absolute top-[21%] left-[13%] right-[3%] h-[30%] flex items-center justify-between px-3 md:px-5">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <div key={item.name} className="relative flex flex-col items-center justify-center">
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`font-['Silkscreen',monospace] text-[10px] md:text-[12px] tracking-wider uppercase transition-colors cursor-pointer ${
                    isActive ? "text-[#f59e0b] font-bold" : "text-[#8f96b3] hover:text-white"
                  }`}
                >
                  {item.name}
                </button>

                {/* Glowing Amber Dot Indicator Under Active Tab */}
                {isActive && (
                  <div className="absolute -bottom-3.5 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-[0.5px] shadow-[0_0_8px_#f59e0b] animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM PANEL OVERLAYS */}
        <div className="absolute bottom-[10%] left-[13%] right-[3%] h-[36%] pointer-events-none">
          {/* Bottom Left Indicator Light Dot */}
          <div className="absolute left-[3%] bottom-[20%]">
            <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-[0.5px] shadow-[0_0_6px_#f59e0b] block" />
          </div>

          {/* Bottom Right LinkedIn Icon */}
          <div className="absolute right-[3%] bottom-[12%] pointer-events-auto">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8f96b3] hover:text-white transition-colors block"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 md:w-5.5 md:h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Settings Cogwheel Icon (Matching user's reference image: 8-tooth dual-tone gear) */}
      <button
        aria-label="Settings"
        className="group cursor-pointer shrink-0 p-1"
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:rotate-90 drop-shadow-md"
          viewBox="0 0 100 100"
        >
          {/* 8-Tooth Outer Gear Body */}
          <path
            d="M 43 8 L 57 8 L 60 21 C 65.5 23.2 70.5 26.5 74.8 30.8 L 87 25 L 95 38 L 84 46.5 C 85.5 52 85.5 58 84 63.5 L 95 72 L 87 85 L 74.8 79.2 C 70.5 83.5 65.5 86.8 60 89 L 57 102 L 43 102 L 40 89 C 34.5 86.8 29.5 83.5 25.2 79.2 L 13 85 L 5 72 L 16 63.5 C 14.5 58 14.5 52 16 46.5 L 5 38 L 13 25 L 25.2 30.8 C 29.5 26.5 34.5 23.2 40 21 Z"
            className="fill-[#94a3b8] group-hover:fill-white stroke-[#1e293b] stroke-[5] transition-colors"
            strokeLinejoin="round"
          />
          {/* Inner Center Circle Cutout */}
          <circle
            cx="50"
            cy="55"
            r="19"
            className="fill-[#080913] stroke-[#1e293b] stroke-[5]"
          />
        </svg>
      </button>
    </div>
  );
}
