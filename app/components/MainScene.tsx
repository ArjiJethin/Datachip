"use client";

import React from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import BackgroundSkyline from "./BackgroundSkyline";
import RainAndClouds from "./RainAndClouds";
import ViewportSize from "./ViewportSize";
import EridianClock from "./EridianClock";
import JWST from "./JWST";
import Avatar from "./Avatar";
import PhotoFrame from "./PhotoFrame";
import Footer from "./Footer";
import { useAudio } from "./AudioContext";

export default function MainScene() {
  const { activeTab } = useAudio();

  const isProjects = activeTab === "PROJECTS";

  return (
    <main className="relative w-screen h-screen bg-[#0b0c10] overflow-hidden select-none">
      {/* Top-Right Pixel Art Navigation Panel */}
      <Navbar />

      {/* Layer 2: Parallax Background City Skyline / Project View */}
      <BackgroundSkyline
        src={isProjects ? "/assets/project/layer2.png" : "/assets/home/Layer2.webp?v=2"}
        alt={isProjects ? "Project background environment" : "City night skyline background"}
      />

      {/* Layer 1.5: Weather Effect Layer (Rain + Slow-Moving Clouds) */}
      <RainAndClouds />

      {/* Layer 1: Foreground Responsive Scene Container (1536x695 Coordinate System) */}
      <div className="scene-container z-10 pointer-events-none">
        {/* Foreground Ultra-Wide Room / Project Environment Image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src={isProjects ? "/assets/project/layer1.png" : "/assets/home/Layer1.webp?v=2"}
            alt={isProjects ? "Project wide room environment" : "Foreground wide room environment"}
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            className="object-cover object-center pointer-events-none pixelated transition-opacity duration-300"
          />
        </div>

        {/* Home Section Interactive Assets */}
        {!isProjects && (
          <>
            {/* Eridian Clock Standing on Bookshelf Shelf */}
            <EridianClock />

            {/* James Webb Space Telescope Model on Upper Bookshelf Shelf */}
            <JWST />

            {/* Avatar Sitting at Desk */}
            <Avatar />

            {/* Interactive Hanging Photo Frames */}
            <PhotoFrame />
          </>
        )}
      </div>

      <ViewportSize />

      {/* Pixel Art Footer Bar */}
      <Footer />
    </main>
  );
}
