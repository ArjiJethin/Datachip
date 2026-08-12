"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isPlayingCassette: boolean;
  toggleCassette: () => void;
  isAudioStarted: boolean;
  startAudio: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlayingCassette: false,
  toggleCassette: () => { },
  isAudioStarted: false,
  startAudio: () => { },
});

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlayingCassette, setIsPlayingCassette] = useState(false);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const thunderAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create ambient thunderstorm audio player
    const audio = new Audio("/assets/Classic Thunderstorm.mp3");
    audio.loop = true;
    audio.volume = 0.8;
    thunderAudioRef.current = audio;

    const handleFirstInteraction = () => {
      if (thunderAudioRef.current && thunderAudioRef.current.paused) {
        thunderAudioRef.current.play().catch(() => { });
        setIsAudioStarted(true);
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      if (thunderAudioRef.current) {
        thunderAudioRef.current.pause();
      }
    };
  }, []);

  // Smooth Volume Dulling/Fading when Cassette Music is Toggled
  useEffect(() => {
    const audio = thunderAudioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    // Target 15% sound when cassette plays, 100% sound when cassette is off
    const targetVolume = isPlayingCassette ? 0.15 : 0.8;
    const step = 0.05;

    fadeIntervalRef.current = setInterval(() => {
      if (Math.abs(audio.volume - targetVolume) < step) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      } else if (audio.volume < targetVolume) {
        audio.volume = Math.min(1.0, audio.volume + step);
      } else {
        audio.volume = Math.max(0.15, audio.volume - step);
      }
    }, 60);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [isPlayingCassette]);

  const toggleCassette = () => {
    if (!isAudioStarted && thunderAudioRef.current && thunderAudioRef.current.paused) {
      thunderAudioRef.current.play().catch(() => { });
      setIsAudioStarted(true);
    }
    setIsPlayingCassette((prev) => !prev);
  };

  const startAudio = () => {
    if (thunderAudioRef.current && thunderAudioRef.current.paused) {
      thunderAudioRef.current.play().catch(() => { });
      setIsAudioStarted(true);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlayingCassette, toggleCassette, isAudioStarted, startAudio }}>
      {children}
    </AudioContext.Provider>
  );
}
