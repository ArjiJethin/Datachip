"use client";

import React from "react";

export default function EridianClock() {
  return (
    <div
      className="absolute z-11 pointer-events-none select-none flex items-end justify-center"
      style={{
        left: "27.5%",
        top: "66.5%",
        height: "9.4%",
      }}
    >
      <img
        src="/assets/EridianClock.png"
        alt="Eridian Clock"
        className="h-full w-auto block pixelated drop-shadow-[0_6px_12px_rgba(0,0,0,0.75)]"
      />
    </div>
  );
}
