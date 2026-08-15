"use client";

import React from "react";

export default function JWST() {
  return (
    <div
      data-cursor="jwst"
      className="absolute z-11 pointer-events-auto cursor-pointer select-none flex items-end justify-center"
      style={{
        left: "9%",
        top: "31.8%",
        height: "12.5%",
      }}
    >
      <img
        src="/assets/home/JWST.png"
        alt="James Webb Space Telescope Model"
        className="h-full w-auto block pixelated drop-shadow-[0_6px_12px_rgba(0,0,0,0.75)]"
      />
    </div>
  );
}
