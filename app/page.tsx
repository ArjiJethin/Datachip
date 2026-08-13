import Image from "next/image";
import Footer from "./components/Footer";
import RainAndClouds from "./components/RainAndClouds";
import Navbar from "./components/Navbar";
import PhotoFrame from "./components/PhotoFrame";
import BackgroundSkyline from "./components/BackgroundSkyline";
import Avatar from "./components/Avatar";
import { AudioProvider } from "./components/AudioContext";

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

        {/* Layer 1: Foreground Ultra-Wide Room Environment */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <Image
            src="/assets/Layer1.webp?v=2"
            alt="Foreground wide room environment"
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            className="object-cover object-center pointer-events-none pixelated"
          />
        </div>

        {/* Avatar Sitting at Desk */}
        <Avatar />

        {/* Interactive Hanging Photo Frames */}
        <PhotoFrame />

        {/* Pixel Art Footer Bar */}
        <Footer />
      </main>
    </AudioProvider>
  );
}