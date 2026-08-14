"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioContext";

interface FrameConfig {
  id: number;
  src: string;
  alt: string;
  left: string;
  top: string;
  chainHeightPct: number;
  leftHookPct: number;
  rightHookPct: number;
}

const FRAMES: FrameConfig[] = [
  {
    id: 1,
    src: "/assets/FotoFrame1.png",
    alt: "01 Skill Tree Photo Frame",
    left: "5.5%",
    top: "0px",
    chainHeightPct: 4.8,
    leftHookPct: 17.0,
    rightHookPct: 82.6,
  },
  {
    id: 2,
    src: "/assets/FotoFrame2.png",
    alt: "02 Journey Log Photo Frame",
    left: "22%",
    top: "28.7%",
    chainHeightPct: 4.4,
    leftHookPct: 18.5,
    rightHookPct: 81.5,
  },
  {
    id: 3,
    src: "/assets/FotoFrame3.png",
    alt: "03 Side Quests Photo Frame",
    left: "4%",
    top: "45.7%",
    chainHeightPct: 4.4,
    leftHookPct: 18.5,
    rightHookPct: 81.5,
  },
];

// Track global pointer velocity across the window so whenever a photo frame
// is entered, we know the exact velocity vector of the cursor as it moves across it.
const globalPointer = {
  x: 0,
  y: 0,
  time: 0,
  vx: 0,
};

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      const now = performance.now();
      if (globalPointer.time > 0) {
        const dt = Math.max(8, now - globalPointer.time);
        const dx = e.clientX - globalPointer.x;
        const instantVx = (dx / dt) * 1000;
        globalPointer.vx = globalPointer.vx * 0.3 + instantVx * 0.7;
      }
      globalPointer.x = e.clientX;
      globalPointer.y = e.clientY;
      globalPointer.time = now;
    },
    { passive: true }
  );
}

function SingleHangingFrame({
  config,
}: {
  config: FrameConfig;
}) {
  const { playBeep, playChainRattle } = useAudio();

  const frameRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------
  // PHYSICS
  // ------------------------------------------------------------

  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const flexRef = useRef(0);

  // ------------------------------------------------------------
  // POINTER TRACKING
  // ------------------------------------------------------------

  const lastRattleTimeRef = useRef(0);

  const [motion, setMotion] = useState({
    angle: 0,
    flex: 0,
  });

  // ------------------------------------------------------------
  // RESPONSIVE CHAIN DIMENSIONS
  //
  // Reference scene: 1536 x 695
  // Frame width: 13.6% = 208.896px
  // ------------------------------------------------------------

  const chainAspectRatio =
    208.896 /
    (695 * (config.chainHeightPct / 100));

  // ------------------------------------------------------------
  // SPRING / AMBIENT ANIMATION
  // ------------------------------------------------------------

  useEffect(() => {
    let animId: number;

    const animate = () => {
      const timeSec = performance.now() / 1000;

      // ----------------------------------------------------------
      // Ambient idle sway
      //
      // Each frame gets a different phase so they don't move
      // together.
      // ----------------------------------------------------------

      const phase = config.id * 2.37;

      const idleAngle =
        Math.sin(timeSec * 1.2 + phase) * 0.45 +
        Math.cos(timeSec * 0.7 + phase * 1.5) * 0.25;

      // ----------------------------------------------------------
      // Spring physics
      // ----------------------------------------------------------

      const stiffness = 0.045;
      const damping = 0.86;

      const displacement =
        idleAngle - angleRef.current;

      velocityRef.current +=
        displacement * stiffness;

      velocityRef.current *= damping;

      angleRef.current +=
        velocityRef.current;

      // ----------------------------------------------------------
      // HARD ANGLE LIMIT
      //
      // Even if something produces a huge impulse, the frame
      // can never rotate beyond +/- 3 degrees.
      // ----------------------------------------------------------

      angleRef.current = Math.max(
        -3,
        Math.min(
          3,
          angleRef.current
        )
      );

      // ----------------------------------------------------------
      // SOFT CHAIN FLEX
      //
      // The chain should react to movement, but not bend wildly.
      // ----------------------------------------------------------

      const targetFlex =
        -velocityRef.current * 2.2 -
        angleRef.current * 0.45;

      flexRef.current +=
        (targetFlex - flexRef.current) * 0.12;

      setMotion({
        angle: angleRef.current,
        flex: flexRef.current,
      });

      animId =
        requestAnimationFrame(animate);
    };

    animId =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [config.id]);

  // ------------------------------------------------------------
  // POINTER ENTER
  //
  // Triggers sway physics impulse and chain rattle sound ONLY
  // when cursor moves ACROSS into the photo frame.
  // Movement inside / over the frame produces no force or sound.
  // ------------------------------------------------------------

  const handlePointerEnter = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const now = performance.now();
    let vx = globalPointer.vx;

    // Fallback if cursor entered vertically or at low horizontal velocity
    if (Math.abs(vx) < 30 && frameRef.current) {
      const rect = frameRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      vx = e.clientX < centerX ? 180 : -180;
    }

    // Physical impulse based on cursor velocity across the frame
    const impulse = Math.max(
      -1.1,
      Math.min(
        1.1,
        vx * 0.0035
      )
    );

    velocityRef.current += impulse;

    // Hard velocity limit
    velocityRef.current = Math.max(
      -2.2,
      Math.min(
        2.2,
        velocityRef.current
      )
    );

    // Play chain rattle sound when cursor moves across into frame
    if (now - lastRattleTimeRef.current > 180) {
      lastRattleTimeRef.current = now;
      playChainRattle();
    }
  };

  // ------------------------------------------------------------
  // CHAIN RENDERER
  // ------------------------------------------------------------

  const renderChain = (
    hookPct: number
  ) => {
    const chainHeight = 46;
    const chainWidth = 16;

    const topX =
      chainWidth / 2;

    const topY = 0;

    // Bottom hook follows the frame.
    const botX =
      chainWidth / 2 +
      motion.angle * 0.9;

    const botY =
      chainHeight;

    // ----------------------------------------------------------
    // Subtle counter-directional chain bend.
    // ----------------------------------------------------------

    const midX =
      (topX + botX) / 2 -
      motion.flex;

    const midY =
      chainHeight * 0.5;

    const numLinks = 5;

    const links = [];

    for (
      let i = 0;
      i <= numLinks;
      i++
    ) {
      const t =
        i / numLinks;

      const x =
        (1 - t) *
        (1 - t) *
        topX +
        2 *
        (1 - t) *
        t *
        midX +
        t *
        t *
        botX;

      const y =
        (1 - t) *
        (1 - t) *
        topY +
        2 *
        (1 - t) *
        t *
        midY +
        t *
        t *
        botY;

      const dx =
        2 *
        (1 - t) *
        (midX - topX) +
        2 *
        t *
        (botX - midX);

      const dy =
        2 *
        (1 - t) *
        (midY - topY) +
        2 *
        t *
        (botY - midY);

      const angleDeg =
        (Math.atan2(
          dy,
          dx
        ) *
          180) /
        Math.PI -
        90;

      links.push({
        x,
        y,
        angle: angleDeg,
        isFront:
          i % 2 === 0,
      });
    }

    return (
      <div
        className="absolute top-0 pointer-events-none"
        style={{
          left: `${hookPct}%`,
          transform:
            "translateX(-50%)",
          width: "8.09%",
          height: "100%",
        }}
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${chainWidth} ${chainHeight}`}
          preserveAspectRatio="none"
        >
          {/* Subtle chain curve */}
          <path
            d={`M ${topX} ${topY} Q ${midX} ${midY} ${botX} ${botY}`}
            fill="none"
            stroke="#1a120b"
            strokeWidth="2.5"
            opacity="0.3"
          />

          {links.map(
            (link, idx) => (
              <g
                key={idx}
                transform={`translate(${link.x}, ${link.y}) rotate(${link.angle})`}
              >
                {link.isFront ? (
                  <g
                    stroke="#1a120b"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="-4"
                      y="-5.5"
                      width="8"
                      height="11"
                      rx="3"
                      fill="#c28b38"
                    />

                    <rect
                      x="-2"
                      y="-3.5"
                      width="4"
                      height="7"
                      rx="2"
                      fill="#1a120b"
                    />

                    <rect
                      x="-3"
                      y="-4"
                      width="1.5"
                      height="8"
                      rx="0.75"
                      fill="#fef08a"
                      opacity="0.7"
                    />
                  </g>
                ) : (
                  <g
                    stroke="#1a120b"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="-2.5"
                      y="-6.5"
                      width="5"
                      height="13"
                      rx="2.5"
                      fill="#8c5e23"
                    />

                    <rect
                      x="-1.5"
                      y="-5"
                      width="1"
                      height="10"
                      rx="0.5"
                      fill="#fef08a"
                      opacity="0.5"
                    />
                  </g>
                )}
              </g>
            )
          )}
        </svg>
      </div>
    );
  };

  // ------------------------------------------------------------
  // COMPONENT
  // ------------------------------------------------------------

  return (
    <div
      data-cursor="photo-frame"
      className="absolute z-20 select-none flex flex-col items-center pointer-events-auto"
      style={{
        left: config.left,
        top: config.top,
        width: "13.6%",
      }}
      onPointerEnter={
        handlePointerEnter
      }
    >
      {/* ------------------------------------------------------
          CHAINS
          ------------------------------------------------------ */}

      <div
        className="w-full relative"
        style={{
          aspectRatio:
            `${chainAspectRatio}`,
        }}
      >
        {renderChain(
          config.leftHookPct
        )}

        {renderChain(
          config.rightHookPct
        )}
      </div>

      {/* ------------------------------------------------------
          FRAME
          ------------------------------------------------------ */}

      <div
        ref={frameRef}
        onClick={playBeep}
        className="relative w-full cursor-pointer select-none"
        style={{
          transform:
            `rotate(${motion.angle}deg)`,

          // Pivot at the hanging hooks.
          transformOrigin:
            "50% -100%",

          // Helps browser optimize the animated transform.
          willChange: "transform",
        }}
      >
        <img
          src={config.src}
          alt={config.alt}
          draggable={false}
          className="w-full h-auto block pixelated drop-shadow-[0_8px_12px_rgba(0,0,0,0.65)] hover:brightness-105 transition-all"
        />
      </div>
    </div>
  );
}

export default function PhotoFrame() {
  return (
    <>
      {FRAMES.map(
        (config) => (
          <SingleHangingFrame
            key={config.id}
            config={config}
          />
        )
      )}
    </>
  );
}