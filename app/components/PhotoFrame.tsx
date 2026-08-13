"use client";

import React, { useEffect, useRef, useState } from "react";

interface FrameConfig {
  id: number;
  src: string;
  alt: string;
  left: string;
  top: string;
  chainHeight: number;
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
    chainHeight: 46,
    leftHookPct: 17.0,
    rightHookPct: 82.6,
  },
  {
    id: 2,
    src: "/assets/FotoFrame2.png",
    alt: "02 Journey Log Photo Frame",
    left: "22.5%",
    top: "28.7%",
    chainHeight: 42,
    leftHookPct: 18.5,
    rightHookPct: 81.5,
  },
  {
    id: 3,
    src: "/assets/FotoFrame3.png",
    alt: "03 Side Quests Photo Frame",
    left: "5.5%",
    top: "45.7%",
    chainHeight: 42,
    leftHookPct: 18.5,
    rightHookPct: 81.5,
  },
];

function SingleHangingFrame({ config }: { config: FrameConfig }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef<boolean>(false);
  const lastMouseXRef = useRef<number | null>(null);

  // Physics refs for independent frame swaying
  const angleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const flexRef = useRef<number>(0);

  const [motion, setMotion] = useState({ angle: 0, flex: 0 });

  useEffect(() => {
    let animId: number;

    const animate = () => {
      const stiffness = 0.05;
      const damping = 0.84;

      // Spring physics towards target angle
      const displacement = targetAngleRef.current - angleRef.current;
      const force = displacement * stiffness;

      velocityRef.current = (velocityRef.current + force) * damping;
      angleRef.current += velocityRef.current;

      // Dynamic counter-directional chain curvature flex (-flex)
      const targetFlex = -velocityRef.current * 4.8 - angleRef.current * 1.1;
      flexRef.current += (targetFlex - flexRef.current) * 0.2;

      // Decay target angle when cursor leaves or stops moving
      if (!isHoveringRef.current) {
        targetAngleRef.current += (0 - targetAngleRef.current) * 0.08;
      }

      setMotion({
        angle: angleRef.current,
        flex: flexRef.current,
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    isHoveringRef.current = true;
    if (lastMouseXRef.current !== null) {
      const deltaX = e.clientX - lastMouseXRef.current;
      const push = Math.max(-3.5, Math.min(3.5, deltaX * 0.22));
      targetAngleRef.current = push;
    }
    lastMouseXRef.current = e.clientX;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    lastMouseXRef.current = null;
    targetAngleRef.current = 0;
  };

  const renderChain = (hookPct: number) => {
    const chainHeight = config.chainHeight;
    const chainWidth = 16;

    const topX = chainWidth / 2;
    const topY = 0;

    // Bottom hook point moves with frame sway
    const botX = chainWidth / 2 + motion.angle * 0.9;
    const botY = chainHeight;

    // Mid control point flexes IN OPPOSITE DIRECTION (-flex)
    const midX = (topX + botX) / 2 - motion.flex;
    const midY = chainHeight * 0.5;

    const numLinks = 5;
    const links = [];

    for (let i = 0; i <= numLinks; i++) {
      const t = i / numLinks;
      const x = (1 - t) * (1 - t) * topX + 2 * (1 - t) * t * midX + t * t * botX;
      const y = (1 - t) * (1 - t) * topY + 2 * (1 - t) * t * midY + t * t * botY;

      const dx = 2 * (1 - t) * (midX - topX) + 2 * t * (botX - midX);
      const dy = 2 * (1 - t) * (midY - topY) + 2 * t * (botY - midY);
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI - 90;

      links.push({ x, y, angle: angleDeg, isFront: i % 2 === 0 });
    }

    return (
      <div
        className="absolute top-0 pointer-events-none"
        style={{
          left: `${hookPct}%`,
          transform: "translateX(-50%)",
          width: `${chainWidth}px`,
          height: `${chainHeight}px`,
        }}
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${chainWidth} ${chainHeight}`}
        >
          <path
            d={`M ${topX} ${topY} Q ${midX} ${midY} ${botX} ${botY}`}
            fill="none"
            stroke="#1a120b"
            strokeWidth="2.5"
            opacity="0.3"
          />

          {links.map((link, idx) => (
            <g
              key={idx}
              transform={`translate(${link.x}, ${link.y}) rotate(${link.angle})`}
            >
              {link.isFront ? (
                <g stroke="#1a120b" strokeWidth="1.8" strokeLinejoin="round">
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
                <g stroke="#1a120b" strokeWidth="1.8" strokeLinejoin="round">
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
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div
      className="absolute z-20 select-none flex flex-col items-center"
      style={{
        left: config.left,
        top: config.top,
        width: "11.5vw",
        maxWidth: "195px",
        minWidth: "135px",
      }}
    >
      {/* Chains container */}
      <div className="w-full relative" style={{ height: `${config.chainHeight}px` }}>
        {renderChain(config.leftHookPct)}
        {renderChain(config.rightHookPct)}
      </div>

      {/* Frame image container */}
      <div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full cursor-pointer transition-transform duration-75 ease-out"
        style={{
          transform: `rotate(${motion.angle}deg)`,
          transformOrigin: `50% -${config.chainHeight}px`,
        }}
      >
        <img
          src={config.src}
          alt={config.alt}
          className="w-full h-auto block pixelated drop-shadow-[0_8px_12px_rgba(0,0,0,0.65)] hover:brightness-105 transition-all"
        />
      </div>
    </div>
  );
}

export default function PhotoFrame() {
  return (
    <>
      {FRAMES.map((config) => (
        <SingleHangingFrame key={config.id} config={config} />
      ))}
    </>
  );
}
