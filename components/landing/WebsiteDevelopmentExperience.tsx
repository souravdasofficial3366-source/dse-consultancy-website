"use client";

import { useEffect, useRef } from "react";

export function WebsiteDevelopmentExperience() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".website-development-page");
    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const revealNodes = [...page.querySelectorAll<HTMLElement>("[data-wd-reveal]")];
    const frameIds = new Map<Element, number>();

    page.classList.add("wd-motion-ready");

    const revealImmediately = () => revealNodes.forEach((node) => node.classList.add("is-visible"));
    const observer =
      typeof window.IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) =>
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  observer?.unobserve(entry.target);
                }
              }),
            { threshold: 0.13, rootMargin: "0px 0px -7%" }
          )
        : null;

    if (reducedMotion.matches || !observer) revealImmediately();
    else revealNodes.forEach((node) => observer.observe(node));

    const updatePointer = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const target = event.currentTarget as HTMLElement;
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const previousFrame = frameIds.get(target);
      if (previousFrame) cancelAnimationFrame(previousFrame);
      frameIds.set(
        target,
        requestAnimationFrame(() => {
          target.style.setProperty("--wd-pointer-x", `${x * 100}%`);
          target.style.setProperty("--wd-pointer-y", `${y * 100}%`);
          if (target.matches("[data-wd-tilt]")) {
            target.style.setProperty("--wd-tilt-x", `${(0.5 - y) * 6}deg`);
            target.style.setProperty("--wd-tilt-y", `${(x - 0.5) * 6}deg`);
          }
        })
      );
    };

    const resetPointer = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.removeProperty("--wd-tilt-x");
      target.style.removeProperty("--wd-tilt-y");
    };

    const updateMagnet = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const target = event.currentTarget as HTMLElement;
      const bounds = target.getBoundingClientRect();
      target.style.setProperty(
        "--wd-magnet-x",
        `${(event.clientX - bounds.left - bounds.width / 2) * 0.1}px`
      );
      target.style.setProperty(
        "--wd-magnet-y",
        `${(event.clientY - bounds.top - bounds.height / 2) * 0.1}px`
      );
    };

    const resetMagnet = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.removeProperty("--wd-magnet-x");
      target.style.removeProperty("--wd-magnet-y");
    };

    const pointerNodes = [
      ...page.querySelectorAll<HTMLElement>("[data-wd-spotlight], [data-wd-tilt]")
    ];
    const magneticNodes = [
      ...page.querySelectorAll<HTMLElement>("[data-wd-magnetic], .lead-form button")
    ];

    pointerNodes.forEach((node) => {
      node.addEventListener("pointermove", updatePointer);
      node.addEventListener("pointerleave", resetPointer);
    });
    magneticNodes.forEach((node) => {
      node.addEventListener("pointermove", updateMagnet);
      node.addEventListener("pointerleave", resetMagnet);
    });

    return () => {
      observer?.disconnect();
      frameIds.forEach((id) => cancelAnimationFrame(id));
      pointerNodes.forEach((node) => {
        node.removeEventListener("pointermove", updatePointer);
        node.removeEventListener("pointerleave", resetPointer);
      });
      magneticNodes.forEach((node) => {
        node.removeEventListener("pointermove", updateMagnet);
        node.removeEventListener("pointerleave", resetMagnet);
      });
      page.classList.remove("wd-motion-ready");
    };
  }, []);

  return null;
}
