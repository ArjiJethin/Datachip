import Image from "next/image";
import Footer from "./components/Footer";
import RainAndClouds from "./components/RainAndClouds";
import Navbar from "./components/Navbar";
import PhotoFrame from "./components/PhotoFrame";
import BackgroundSkyline from "./components/BackgroundSkyline";
import Avatar from "./components/Avatar";
import EridianClock from "./components/EridianClock";
import JWST from "./components/JWST";
import { AudioProvider } from "./components/AudioContext";
import ViewportSize from "./components/ViewportSize";

export default function Home() {
  return (
    <AudioProvider>
      <main className="relative w-screen h-screen bg-[#0b0c10] overflow-hidden select-none">
        {/* Top-Right Pixel Art Navigation Panel */}
        <Navbar />

        {/* Layer 2: Parallax Background City Skyline View */}
        <BackgroundSkyline />

        {/* Layer 1.5: Weather Effect Layer (Rain + Slow-Moving Clouds) */}
        <RainAndClouds />

        {/* Layer 1: Foreground Responsive Scene Container (1536x695 Coordinate System) */}
        <div className="scene-container z-10 pointer-events-none">
          {/* Foreground Ultra-Wide Room Image */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Image
              src="/assets/home/Layer1.webp?v=2"
              alt="Foreground wide room environment"
              fill
              priority
              unoptimized
              quality={100}
              sizes="100vw"
              className="object-cover object-center pointer-events-none pixelated"
            />
          </div>

          {/* Eridian Clock Standing on Bookshelf Shelf */}
          <EridianClock />

          {/* James Webb Space Telescope Model on Upper Bookshelf Shelf */}
          <JWST />

          {/* Avatar Sitting at Desk */}
          <Avatar />

          {/* Interactive Hanging Photo Frames */}
          <PhotoFrame />
        </div>

        {/* Pixel Art Footer Bar */}
        <Footer />
      </main>
    </AudioProvider>
  );
}