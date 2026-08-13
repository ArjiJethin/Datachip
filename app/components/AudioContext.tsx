"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AudioContextType {
  isPlayingCassette: boolean;
  toggleCassette: () => void;
  isAudioStarted: boolean;
  startAudio: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  playBeep: () => void;
  playChainRattle: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlayingCassette: false,
  toggleCassette: () => { },
  isAudioStarted: false,
  startAudio: () => { },
  isMuted: false,
  toggleMute: () => { },
  activeTab: "HOME",
  setActiveTab: () => { },
  playBeep: () => { },
  playChainRattle: () => { },
});

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlayingCassette, setIsPlayingCassette] = useState(false);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("HOME");

  const thunderAudioRef = useRef<HTMLAudioElement | null>(null);
  const cassetteAudioRef = useRef<HTMLAudioElement | null>(null);
  const beepAudioRef = useRef<HTMLAudioElement | null>(null);
  const chainRattleAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastChainRattleTimeRef = useRef<number>(0);

  const playBeep = () => {
    if (isMuted) return;
    try {
      if (!beepAudioRef.current) {
        beepAudioRef.current = new Audio("/assets/Music/Beep.m4a");
        beepAudioRef.current.volume = 0.45;
      }
      beepAudioRef.current.currentTime = 0;
      beepAudioRef.current.play().catch(() => {});
    } catch (e) {
      // Ignore audio restriction if user hasn't interacted
    }
  };

  const playChainRattle = () => {
    if (isMuted) return;
    try {
      const now = Date.now();
      if (now - lastChainRattleTimeRef.current < 450) {
        return;
      }
      lastChainRattleTimeRef.current = now;

      if (!chainRattleAudioRef.current) {
        chainRattleAudioRef.current = new Audio("/assets/Music/ChainRattle.m4a");
        // Toned down by 25% (volume = 0.75)
        chainRattleAudioRef.current.volume = 0.75;
      }
      chainRattleAudioRef.current.currentTime = 0;
      chainRattleAudioRef.current.play().catch(() => {});
    } catch (e) {
      // Ignore audio restriction
    }
  };

  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (thunderAudioRef.current) thunderAudioRef.current.muted = next;
      if (cassetteAudioRef.current) cassetteAudioRef.current.muted = next;
      return next;
    });
  };

  useEffect(() => {
    if (thunderAudioRef.current) thunderAudioRef.current.muted = isMuted;
    if (cassetteAudioRef.current) cassetteAudioRef.current.muted = isMuted;
  }, [isMuted]);

  /**
   * -------------------------------------------------------
   * RAIN / THUNDER AUDIO
   * -------------------------------------------------------
   */

  const playRainAudio = () => {
    const thunder = thunderAudioRef.current;

    if (!thunder || !thunder.paused) {
      return;
    }

    thunder
      .play()
      .then(() => {
        setIsAudioStarted(true);
      })
      .catch(() => {
        // Browser blocked autoplay.
        // Interaction fallback will try again.
      });
  };

  /**
   * -------------------------------------------------------
   * INITIAL AUDIO SETUP
   * -------------------------------------------------------
   */

  useEffect(() => {
    // Create rain / thunder audio
    const thunderAudio = new Audio(
      "/assets/Music/Classic Thunderstorm.mp3"
    );

    thunderAudio.loop = true;
    thunderAudio.volume = 0.8;
    thunderAudio.preload = "auto";

    thunderAudioRef.current = thunderAudio;

    // Create cassette audio
    const cassetteAudio = new Audio(
      encodeURI(
        "/assets/Music/Bones (feat. Jófriður) - Low Roar.mp3"
      )
    );

    cassetteAudio.loop = true;

    // Cassette music volume
    cassetteAudio.volume = 0.6;

    cassetteAudio.preload = "auto";

    cassetteAudioRef.current = cassetteAudio;

    /**
     * ---------------------------------------------------
     * AUTO START RAIN
     * ---------------------------------------------------
     *
     * Try to start the rain automatically after 2.5 sec.
     *
     * If the browser allows autoplay:
     *     → Rain starts automatically.
     *
     * If the browser blocks it:
     *     → Interaction listeners below try again.
     */

    const rainTimer = setTimeout(() => {
      playRainAudio();
    }, 2500);

    /**
     * ---------------------------------------------------
     * USER INTERACTION FALLBACK
     * ---------------------------------------------------
     *
     * We listen for several natural interactions so the
     * visitor doesn't necessarily have to click.
     *
     * Supported:
     *
     * - Pointer down
     * - Click
     * - Keyboard
     * - Touch
     * - Scroll
     * - Meaningful pointer movement
     */

    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;

    const removeInteractionListeners = () => {
      window.removeEventListener(
        "pointerdown",
        handleUserGesture
      );

      window.removeEventListener(
        "click",
        handleUserGesture
      );

      window.removeEventListener(
        "keydown",
        handleUserGesture
      );

      window.removeEventListener(
        "touchstart",
        handleUserGesture
      );

      window.removeEventListener(
        "scroll",
        handleUserGesture
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };

    const handleUserGesture = () => {
      playRainAudio();

      // Only remove the listeners if rain successfully started.
      // This prevents a failed autoplay attempt from permanently
      // disabling the fallback.
      setTimeout(() => {
        if (thunderAudioRef.current && !thunderAudioRef.current.paused) {
          removeInteractionListeners();
        }
      }, 50);
    };

    /**
     * Pointer movement requires actual movement instead of
     * triggering from the first tiny mouse event.
     */

    const handlePointerMove = (event: PointerEvent) => {
      if (lastPointerX === null || lastPointerY === null) {
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        return;
      }

      const distance = Math.hypot(
        event.clientX - lastPointerX,
        event.clientY - lastPointerY
      );

      // Require roughly 25px of movement.
      if (distance >= 15) {
        playRainAudio();

        setTimeout(() => {
          if (
            thunderAudioRef.current &&
            !thunderAudioRef.current.paused
          ) {
            removeInteractionListeners();
          }
        }, 50);

        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
      }
    };

    /**
     * Register interaction listeners.
     */

    window.addEventListener(
      "pointerdown",
      handleUserGesture
    );

    window.addEventListener(
      "click",
      handleUserGesture
    );

    window.addEventListener(
      "keydown",
      handleUserGesture
    );

    window.addEventListener(
      "touchstart",
      handleUserGesture
    );

    window.addEventListener(
      "scroll",
      handleUserGesture,
      { passive: true }
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    /**
     * ---------------------------------------------------
     * CLEANUP
     * ---------------------------------------------------
     */

    return () => {
      clearTimeout(rainTimer);

      removeInteractionListeners();

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      if (thunderAudioRef.current) {
        thunderAudioRef.current.pause();
        thunderAudioRef.current.currentTime = 0;
        thunderAudioRef.current = null;
      }

      if (cassetteAudioRef.current) {
        cassetteAudioRef.current.pause();
        cassetteAudioRef.current.currentTime = 0;
        cassetteAudioRef.current = null;
      }
    };
  }, []);

  /**
   * -------------------------------------------------------
   * CASSETTE PLAYBACK
   * -------------------------------------------------------
   */

  const toggleCassette = () => {
    const cassette = cassetteAudioRef.current;

    if (!cassette) {
      return;
    }

    /**
     * Start cassette
     */

    if (cassette.paused) {
      cassette
        .play()
        .then(() => {
          setIsPlayingCassette(true);
        })
        .catch(() => {
          // Playback blocked.
        });
    }

    /**
     * Stop cassette
     */

    else {
      cassette.pause();
      setIsPlayingCassette(false);
    }

    /**
     * The cassette click is also a legitimate user
     * interaction, so use it to attempt rain playback
     * if rain hasn't started yet.
     */

    playRainAudio();
  };

  /**
   * -------------------------------------------------------
   * RAIN VOLUME WHEN CASSETTE PLAYS
   * -------------------------------------------------------
   *
   * Cassette OFF:
   *     Rain = 80%
   *
   * Cassette ON:
   *     Rain = 32%
   *
   * Smooth fade between the two.
   */

  useEffect(() => {
    const thunder = thunderAudioRef.current;

    if (!thunder) {
      return;
    }

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const targetVolume = isPlayingCassette ? 0.32 : 0.8;

    const fadeStep = 0.05;
    const fadeSpeed = 60;

    fadeIntervalRef.current = setInterval(() => {
      const currentVolume = thunder.volume;

      /**
       * Reached target
       */

      if (Math.abs(currentVolume - targetVolume) <= fadeStep) {
        thunder.volume = targetVolume;

        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }

        return;
      }

      /**
       * Fade upward
       */

      if (currentVolume < targetVolume) {
        thunder.volume = Math.min(
          targetVolume,
          currentVolume + fadeStep
        );
      }

      /**
       * Fade downward
       */

      else {
        thunder.volume = Math.max(
          targetVolume,
          currentVolume - fadeStep
        );
      }
    }, fadeSpeed);

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };
  }, [isPlayingCassette]);

  /**
   * -------------------------------------------------------
   * MANUAL AUDIO START
   * -------------------------------------------------------
   */

  const startAudio = () => {
    playRainAudio();
  };

  /**
   * -------------------------------------------------------
   * PROVIDER
   * -------------------------------------------------------
   */

  return (
    <AudioContext.Provider
      value={{
        isPlayingCassette,
        toggleCassette,
        isAudioStarted,
        startAudio,
        isMuted,
        toggleMute,
        activeTab,
        setActiveTab,
        playBeep,
        playChainRattle,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}