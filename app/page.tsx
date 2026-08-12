import Image from "next/image";
import Footer from "./components/Footer";
import RainAndClouds from "./components/RainAndClouds";

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-[#0b0c10] overflow-hidden select-none">
      {/* Layer 2: Background City Skyline View */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/assets/Layer2.webp?v=2"
          alt="City night skyline background"
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover object-center pointer-events-none pixelated"
        />
      </div>

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

      {/* Pixel Art Footer Bar */}
      <Footer />
    </main>
  );
}