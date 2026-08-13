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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("gesturestart", handleGesture);
    window.addEventListener("gesturechange", handleGesture);
    window.addEventListener("gestureend", handleGesture);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("gesturestart", handleGesture);
      window.removeEventListener("gesturechange", handleGesture);
      window.removeEventListener("gestureend", handleGesture);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
}

