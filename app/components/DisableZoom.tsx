"use client";

import { useEffect } from "react";

export default function DisableZoom() {
  useEffect(() => {
    // 1. Prevent Keyboard Zoom Shortcuts (Ctrl +, Ctrl -, Ctrl 0, Cmd +, Cmd -, Cmd 0)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key;
        const code = e.code;
        if (
          key === "+" ||
          key === "=" ||
          key === "-" ||
          key === "_" ||
          key === "0" ||
          code === "Equal" ||
          code === "Minus" ||
          code === "Digit0" ||
          code === "NumpadAdd" ||
          code === "NumpadSubtract" ||
          code === "Numpad0"
        ) {
          e.preventDefault();
        }
      }
    };

    // 2. Prevent Mouse Wheel Zoom (Ctrl + Wheel / Pinch trackpad)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // 3. Prevent Touch Pinch Gestures
    const handleGesture = (e: Event) => e.preventDefault();
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    // 4. Counteract Browser Menu Zoom (e.g. Chrome / Edge / Firefox Menu 125%, 150%, 80%)
    const initialDPR = window.devicePixelRatio || 1;

    const enforceScale = () => {
      const currentDPR = window.devicePixelRatio || 1;
      const scaleRatio = initialDPR / currentDPR;

      const mainEl = (document.querySelector("main") || document.body) as HTMLElement;

      if (Math.abs(scaleRatio - 1) > 0.01) {
        // Apply inverse zoom / transform to lock view scale to 100%
        if ("zoom" in document.body.style) {
          (document.body.style as unknown as Record<string, string>).zoom = `${scaleRatio * 100}%`;
        } else if (mainEl) {
          mainEl.style.transform = `scale(${scaleRatio})`;
          mainEl.style.transformOrigin = "top left";
          mainEl.style.width = `${100 / scaleRatio}vw`;
          mainEl.style.height = `${100 / scaleRatio}vh`;
        }
      } else {
        if ("zoom" in document.body.style) {
          (document.body.style as unknown as Record<string, string>).zoom = "100%";
        }
        if (mainEl) {
          mainEl.style.transform = "none";
          mainEl.style.width = "100vw";
          mainEl.style.height = "100vh";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("gesturestart", handleGesture);
    window.addEventListener("gesturechange", handleGesture);
    window.addEventListener("gestureend", handleGesture);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("resize", enforceScale);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", enforceScale);
    }

    enforceScale();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("gesturestart", handleGesture);
      window.removeEventListener("gesturechange", handleGesture);
      window.removeEventListener("gestureend", handleGesture);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", enforceScale);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", enforceScale);
      }
    };
  }, []);

  return null;
}
