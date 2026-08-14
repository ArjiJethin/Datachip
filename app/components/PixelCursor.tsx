"use client";

import React, { useEffect, useRef, useState } from "react";

// ============================================================================
// COLOR PALETTE (From Reference Sheet Section 7)
// ============================================================================
const PALETTE = {
  white: "#FFFFFF",
  softLavender: "#D8D6FF",
  lightViolet: "#A786FA",
  cosmicPurple: "#7C5CFF",
  cyan: "#4FD1FF",
  gold: "#FFD166",
  magenta: "#FF66C7",
  green: "#7CFFA1",
};

// Context variant color mappings
const CONTEXT_THEMES: Record<
  string,
  { core: string; glow: string; accent: string; orbit: string }
> = {
  navigation: {
    core: PALETTE.white,
    glow: PALETTE.gold,
    accent: PALETTE.gold,
    orbit: "#FFE399",
  },
  "photo-frame": {
    core: PALETTE.white,
    glow: "#F7C5FF",
    accent: PALETTE.gold,
    orbit: "#F7C5FF",
  },
  jwst: {
    core: PALETTE.white,
    glow: PALETTE.cyan,
    accent: PALETTE.cyan,
    orbit: "#8FE5FF",
  },
  "eridian-clock": {
    core: PALETTE.white,
    glow: PALETTE.cosmicPurple,
    accent: PALETTE.lightViolet,
    orbit: PALETTE.lightViolet,
  },
  social: {
    core: PALETTE.white,
    glow: PALETTE.green,
    accent: PALETTE.green,
    orbit: "#B2FFC8",
  },
  button: {
    core: PALETTE.white,
    glow: PALETTE.magenta,
    accent: PALETTE.magenta,
    orbit: "#FFA3DC",
  },
  default: {
    core: PALETTE.white,
    glow: PALETTE.cosmicPurple,
    accent: PALETTE.cyan,
    orbit: PALETTE.softLavender,
  },
};

// ============================================================================
// PARTICLE INTERFACES & POOLING
// ============================================================================
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number; // 1, 2, or 3
  color: string;
  maxLife: number; // in ms
  age: number; // in ms
  isBurst: boolean;
  isSparkle: boolean;
}

export default function PixelCursor() {
  const [enabled, setEnabled] = useState(false);

  // Position & Movement Tracking
  const cursorPosRef = useRef({ x: -100, y: -100 });
  const renderPosRef = useRef({ x: -100, y: -100 });
  const isMovingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const spawnDistance = 3 + Math.random() * 5;

  // Hover & Context State
  const [hoverState, setHoverState] = useState<
    "IDLE" | "MOVING" | "HOVER_ENTER" | "HOVER_ACTIVE" | "HOVER_EXIT"
  >("IDLE");
  const hoverStateRef = useRef<
    "IDLE" | "MOVING" | "HOVER_ENTER" | "HOVER_ACTIVE" | "HOVER_EXIT"
  >("IDLE");
  const [contextVariant, setContextVariant] = useState<string>("default");
  const contextVariantRef = useRef<string>("default");
  const currentHoverElRef = useRef<HTMLElement | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click Burst State
  const [isClicking, setIsClicking] = useState(false);

  // Particle Pool
  const particlesRef = useRef<Particle[]>([]);
  const nextParticleIdRef = useRef(0);

  // DOM Container Ref for direct transform updates (High-perf 60 FPS)
  const cursorWrapperRef = useRef<HTMLDivElement>(null);
  const orbitRingRef = useRef<SVGSVGElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------------------------------
  // INITIALIZATION & POINTER CAPTURE
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Only enable on non-coarse pointer (desktop/mouse)
    if (typeof window !== "undefined") {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      if (isFinePointer) {
        setEnabled(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Detect mouse move & context
    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      isMovingRef.current = true;
      lastMoveTimeRef.current = now;

      // Element detection under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        // Check explicit data-cursor attribute first
        const customAttrEl = target.closest(
          "[data-cursor]"
        ) as HTMLElement | null;
        let detectedVariant: string | null = null;
        let interactiveEl: HTMLElement | null = null;

        if (customAttrEl) {
          detectedVariant = customAttrEl.getAttribute("data-cursor");
          interactiveEl = customAttrEl;
        } else {
          // Fallback semantic detection
          const interactive = target.closest(
            'a, button, [role="button"], input, select, textarea, .cursor-pointer'
          ) as HTMLElement | null;
          if (interactive) {
            interactiveEl = interactive;
            detectedVariant = "default";
          }
        }

        // Trigger Hover Enter ONLY ONCE when entering a new element
        if (interactiveEl && interactiveEl !== currentHoverElRef.current) {
          currentHoverElRef.current = interactiveEl;
          const variant = detectedVariant || "default";
          setContextVariant(variant);
          contextVariantRef.current = variant;

          setHoverState("HOVER_ENTER");
          hoverStateRef.current = "HOVER_ENTER";

          if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = setTimeout(() => {
            setHoverState("HOVER_ACTIVE");
            hoverStateRef.current = "HOVER_ACTIVE";
          }, 120);
        } else if (!interactiveEl && currentHoverElRef.current) {
          // Leaving interactive element
          currentHoverElRef.current = null;
          setHoverState("HOVER_EXIT");
          hoverStateRef.current = "HOVER_EXIT";

          if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = setTimeout(() => {
            const isMoving = performance.now() - lastMoveTimeRef.current < 100;
            const nextState = isMoving ? "MOVING" : "IDLE";
            setHoverState(nextState);
            hoverStateRef.current = nextState;
            setContextVariant("default");
            contextVariantRef.current = "default";
          }, 120);
        }
      }
    };

    // Click burst handler
    const handlePointerDown = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      setIsClicking(true);

      // Spawn Click Burst Particles (10-16 particles expanding radially)
      const burstCount = Math.floor(Math.random() * 7) + 10;
      const theme = CONTEXT_THEMES[contextVariantRef.current] || CONTEXT_THEMES.default;

      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const speed = Math.random() * 3.5 + 2.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = Math.random() > 0.5 ? 5 : 3;

        particlesRef.current.push({
          id: nextParticleIdRef.current++,
          x,
          y,
          vx,
          vy,
          size,
          color: i % 2 === 0 ? theme.glow : theme.core,
          maxLife: 240 + Math.random() * 80, // ~250-320ms
          age: 0,
          isBurst: true,
          isSparkle: Math.random() > 0.4,
        });
      }

      setTimeout(() => {
        setIsClicking(false);
      }, 220);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [enabled]);

  // --------------------------------------------------------------------------
  // 60 FPS RAF LOOP FOR CURSOR POSITION, TRAIL & PARTICLES
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!enabled) return;

    let animId: number;
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      // 1. Smoothly interpolate render position to cursor target
      const dx = cursorPosRef.current.x - renderPosRef.current.x;
      const dy = cursorPosRef.current.y - renderPosRef.current.y;

      renderPosRef.current.x += dx * 0.45;
      renderPosRef.current.y += dy * 0.45;

      const speed = Math.hypot(dx, dy);

      // Check if cursor stopped moving
      if (now - lastMoveTimeRef.current > 100) {
        isMovingRef.current = false;
        if (
          hoverStateRef.current !== "HOVER_ENTER" &&
          hoverStateRef.current !== "HOVER_ACTIVE" &&
          hoverStateRef.current !== "HOVER_EXIT"
        ) {
          if (hoverStateRef.current !== "IDLE") {
            setHoverState("IDLE");
            hoverStateRef.current = "IDLE";
          }
        }
      } else {
        if (
          hoverStateRef.current !== "HOVER_ENTER" &&
          hoverStateRef.current !== "HOVER_ACTIVE" &&
          hoverStateRef.current !== "HOVER_EXIT"
        ) {
          if (hoverStateRef.current !== "MOVING") {
            setHoverState("MOVING");
            hoverStateRef.current = "MOVING";
          }
        }
      }

      // 2. Direct DOM Transform Update (High performance)
      if (cursorWrapperRef.current) {
        cursorWrapperRef.current.style.transform = `translate3d(${renderPosRef.current.x}px, ${renderPosRef.current.y}px, 0px)`;
      }

      // 3. Shooting Star Trail Emission (Dynamic Directional Stream)
      const isHover =
        hoverStateRef.current === "HOVER_ACTIVE" ||
        hoverStateRef.current === "HOVER_ENTER";
      const maxTrailParticles = isHover ? 60 : 50;

      if (isMovingRef.current && speed > 0.8) {
        const currentTrailCount = particlesRef.current.filter(
          (p) => !p.isBurst
        ).length;

        if (currentTrailCount < maxTrailParticles) {
          const theme =
            CONTEXT_THEMES[contextVariantRef.current] || CONTEXT_THEMES.default;

          // Motion angle & opposite streaming direction
          const motionAngle = Math.atan2(dy, dx);
          const tailAngle = motionAngle + Math.PI;

          // Emit 2 particles per frame for a rich shooting star tail
          for (let k = 0; k < 2; k++) {
            const spreadAngle = tailAngle + (Math.random() - 0.5) * 0.5;
            const particleSpeed = (speed * 0.45) + Math.random() * 1.0 + 0.7;
            const vx = Math.cos(spreadAngle) * particleSpeed;
            const vy = Math.sin(spreadAngle) * particleSpeed;

            const isSparkle = Math.random() < 0.15;
            const size = isSparkle ? 4 : Math.random() < 0.55 ? 3 : 2;

            particlesRef.current.push({
              id: nextParticleIdRef.current++,


              x:
                renderPosRef.current.x +
                Math.cos(tailAngle) * spawnDistance +
                (Math.random() * 4 - 2),

              y:
                renderPosRef.current.y +
                Math.sin(tailAngle) * spawnDistance +
                (Math.random() * 4 - 2),
              vx,
              vy,
              size,
              color: isSparkle ? theme.accent : theme.glow,
              maxLife: 500 + Math.random() * 250,
              age: 0,
              isBurst: false,
              isSparkle,
            });
          }
        }
      }

      // 4. Update Particles
      const nextParticles: Particle[] = [];
      const pContainer = particlesContainerRef.current;

      if (pContainer) {
        let htmlStr = "";

        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          p.age += dt;
          if (p.age >= p.maxLife) continue;

          // Physics update
          p.x += (p.vx * dt) / 16;
          p.y += (p.vy * dt) / 16;
          const lifeRatio = 1 - p.age / p.maxLife;

          nextParticles.push(p);

          // Render particle div
          const opacity = Math.max(0, Math.min(1, lifeRatio * 1.0));
          const scale = p.isBurst
            ? Math.max(0.3, lifeRatio)
            : Math.max(0.15, lifeRatio * 1.25);

          if (p.size === 5) {
            // 5px glowing sparkle mini-star
            htmlStr += `<div style="position:absolute;left:${p.x - 2.5}px;top:${p.y - 2.5}px;width:5px;height:5px;background:${p.color};opacity:${opacity};transform:scale(${scale});box-shadow:0 0 6px ${p.color};pointer-events:none;image-rendering:pixelated;"></div>`;
          } else if (p.size === 3) {
            // 3px glowing shooting star particle
            htmlStr += `<div style="position:absolute;left:${p.x - 1.5}px;top:${p.y - 1.5}px;width:3px;height:3px;background:${p.color};opacity:${opacity};transform:scale(${scale});box-shadow:0 0 4px ${p.color};pointer-events:none;image-rendering:pixelated;"></div>`;
          } else {
            // 2px pixel particle
            htmlStr += `<div style="position:absolute;left:${p.x - 1}px;top:${p.y - 1}px;width:2px;height:2px;background:${p.color};opacity:${opacity};transform:scale(${scale});pointer-events:none;image-rendering:pixelated;"></div>`;
          }
        }

        pContainer.innerHTML = htmlStr;
      }

      particlesRef.current = nextParticles;

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [enabled]);

  if (!enabled) return null;

  const currentTheme =
    CONTEXT_THEMES[contextVariant] || CONTEXT_THEMES.default;

  // Reduced Hover & Click sizes by 40%:
  // Base/Idle: 20px, Hover Active: 26px (was 44px), Click Burst: 28px (was 48px)
  const isHoverActive =
    hoverState === "HOVER_ACTIVE" || hoverState === "HOVER_ENTER";
  const size = isClicking ? 28 : isHoverActive ? 26 : 20;

  return (
    <>
      {/* Dynamic Cursor Styles to hide standard cursor on fine-pointer devices */}
      <style jsx global>{`
        @media (pointer: fine) {
          body,
          body *,
          button,
          a,
          input,
          select,
          textarea {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Global Particle Overlay Layer */}
      <div
        ref={particlesContainerRef}
        className="fixed inset-0 z-[99998] pointer-events-none overflow-hidden"
      />

      {/* Primary Pixel Star Cursor Container */}
      <div
        ref={cursorWrapperRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none select-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
        style={{
          willChange: "transform",
        }}
      >
        {/* Orbiting Pixel Ring (Scaled 36x36px on hover) */}
        {isHoverActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin [animation-duration:4s]">
            <svg
              ref={orbitRingRef}
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              className="overflow-visible"
              style={{ shapeRendering: "crispEdges" }}
            >
              <defs>
                <filter id="orbit-dot-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor={currentTheme.orbit} floodOpacity="0.9" />
                </filter>
              </defs>
              <g filter="url(#orbit-dot-glow)">
                {/* 8-Dot Scaled Orbit Ring */}
                <rect x="16.5" y="1" width="3" height="3" fill={currentTheme.orbit} opacity="0.95" />
                <rect x="27" y="6" width="3" height="3" fill={currentTheme.orbit} opacity="0.85" />
                <rect x="32" y="16.5" width="3" height="3" fill={currentTheme.orbit} opacity="0.95" />
                <rect x="27" y="27" width="3" height="3" fill={currentTheme.orbit} opacity="0.85" />
                <rect x="16.5" y="32" width="3" height="3" fill={currentTheme.orbit} opacity="0.95" />
                <rect x="6" y="27" width="3" height="3" fill={currentTheme.orbit} opacity="0.85" />
                <rect x="1" y="16.5" width="3" height="3" fill={currentTheme.orbit} opacity="0.95" />
                <rect x="6" y="6" width="3" height="3" fill={currentTheme.orbit} opacity="0.85" />
              </g>
            </svg>
          </div>
        )}

        {/* Pixel Star Graphic */}
        <div
          className="relative flex items-center justify-center transition-all duration-150 ease-out"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full overflow-visible"
            style={{ shapeRendering: "crispEdges" }}
          >
            <defs>
              <filter id="pixel-star-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="2.2"
                  floodColor={currentTheme.glow}
                  floodOpacity="0.95"
                />
              </filter>
            </defs>

            <g filter="url(#pixel-star-glow)">
              {/* Outer Cardinal Points (Top, Bottom, Left, Right) */}
              <rect x="11" y="1" width="2" height="4" fill={currentTheme.glow} />
              <rect x="11" y="19" width="2" height="4" fill={currentTheme.glow} />
              <rect x="1" y="11" width="4" height="2" fill={currentTheme.glow} />
              <rect x="19" y="11" width="4" height="2" fill={currentTheme.glow} />

              {/* Diagonal Accent Dots (4 corners) */}
              <rect x="5" y="5" width="2" height="2" fill={currentTheme.accent} opacity="0.9" />
              <rect x="17" y="5" width="2" height="2" fill={currentTheme.accent} opacity="0.9" />
              <rect x="5" y="17" width="2" height="2" fill={currentTheme.accent} opacity="0.9" />
              <rect x="17" y="17" width="2" height="2" fill={currentTheme.accent} opacity="0.9" />

              {/* Inner Cross Body */}
              <rect x="10" y="5" width="4" height="14" fill={PALETTE.softLavender} />
              <rect x="5" y="10" width="14" height="4" fill={PALETTE.softLavender} />

              {/* Core Pixel Diamond */}
              <rect x="10" y="8" width="4" height="8" fill={currentTheme.core} />
              <rect x="8" y="10" width="8" height="4" fill={currentTheme.core} />

              {/* Bright Central Highlight */}
              <rect x="11" y="11" width="2" height="2" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
