"use client";

import { useEffect } from "react";

const validPalettes = new Set(["violet", "amber", "neon", "blaze"]);

export function HomePalettePreview() {
  useEffect(() => {
    const homepage = document.querySelector<HTMLElement>(".consultancy-home");
    const root = document.documentElement;
    const params = new URLSearchParams(window.location.search);
    const palette = params.get("palette") ?? "blaze";

    if (!homepage) return;

    if (palette && validPalettes.has(palette)) {
      homepage.dataset.homePalette = palette;
      root.dataset.homePalette = palette;
    } else {
      homepage.removeAttribute("data-home-palette");
      root.removeAttribute("data-home-palette");
    }

    return () => {
      root.removeAttribute("data-home-palette");
    };
  }, []);

  return null;
}
