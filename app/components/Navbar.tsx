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

      {/* Settings Cogwheel Icon (Standalone gray icon without box background) */}
      <button
        aria-label="Settings"
        className="text-[#8f96b3] hover:text-white transition-all duration-300 cursor-pointer shrink-0 hover:rotate-90 p-1"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 fill-current drop-shadow-md" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6-3.6z" />
        </svg>
      </button>
    </div>
  );
}
