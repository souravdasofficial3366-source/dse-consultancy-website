"use client";

import type { PointerEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";

const PIXEL_COLUMNS = 12;
const PIXEL_ROWS = 5;
const PIXEL_COUNT = PIXEL_COLUMNS * PIXEL_ROWS;

type InteractiveFooterProps = {
  children: ReactNode;
};

export function InteractiveFooter({ children }: InteractiveFooterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  const renderPixelEnergy = () => {
    frameRef.current = null;

    const root = rootRef.current;
    const pointer = pointerRef.current;

    if (root && pointer) {
      root.style.setProperty("--footer-pointer-x", `${(pointer.x * 100).toFixed(2)}%`);
      root.style.setProperty("--footer-pointer-y", `${(pointer.y * 100).toFixed(2)}%`);
      root.dataset.pointerActive = "true";
    } else if (root) {
      root.dataset.pointerActive = "false";
    }

    const pixels = fieldRef.current?.children;
    if (!pixels) {
      return;
    }

    for (let index = 0; index < pixels.length; index += 1) {
      const pixel = pixels[index] as HTMLElement;
      let energy = 0;

      if (pointer) {
        const column = index % PIXEL_COLUMNS;
        const row = Math.floor(index / PIXEL_COLUMNS);
        const pixelX = (column + 0.5) / PIXEL_COLUMNS;
        const pixelY = (row + 0.5) / PIXEL_ROWS;
        const distance = Math.hypot((pixelX - pointer.x) * 1.2, pixelY - pointer.y);
        energy = Math.max(0, 1 - distance * 3.1);
      }

      pixel.style.setProperty("--pixel-energy", energy.toFixed(3));
    }
  };

  const schedulePixelUpdate = () => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(renderPixelEnergy);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
    };
    schedulePixelUpdate();
  };

  const handlePointerLeave = () => {
    pointerRef.current = null;
    schedulePixelUpdate();
  };

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      className="interactive-footer"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      ref={rootRef}
    >
      <div aria-hidden="true" className="interactive-footer-pixels" ref={fieldRef}>
        {Array.from({ length: PIXEL_COUNT }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="interactive-footer-content">{children}</div>
    </div>
  );
}
