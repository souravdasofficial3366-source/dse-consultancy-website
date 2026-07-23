"use client";

import { Fragment } from "react";
import type { CSSProperties, PointerEvent } from "react";

type MonthlyManagementBentoProps = {
  items: ReadonlyArray<readonly [string, string]>;
};

const artworkIcons = [
  "location_on",
  "travel_explore",
  "calendar_month",
  "tag",
  "smart_display",
  "reviews",
  "celebration",
  "chat",
  "monitoring"
] as const;

type BentoStyle = CSSProperties & {
  "--bento-index": number;
  "--pointer-x": string;
  "--pointer-y": string;
  "--rotate-x": string;
  "--rotate-y": string;
};

export function MonthlyManagementBento({ items }: MonthlyManagementBentoProps) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    card.style.setProperty("--pointer-x", `${x * 100}%`);
    card.style.setProperty("--pointer-y", `${y * 100}%`);
    card.style.setProperty("--rotate-x", `${(0.5 - y) * 5}deg`);
    card.style.setProperty("--rotate-y", `${(x - 0.5) * 6}deg`);
  }

  function resetPointer(event: PointerEvent<HTMLElement>) {
    const card = event.currentTarget;
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  }

  return (
    <div className="social-management-bento" aria-label="Monthly social media and SEO management services">
      {items.map(([title, text], index) => {
        const titleParts = title.split("/");
        const style: BentoStyle = {
          "--bento-index": index,
          "--pointer-x": "50%",
          "--pointer-y": "50%",
          "--rotate-x": "0deg",
          "--rotate-y": "0deg"
        };

        return (
          <article
            className="social-management-bento-card"
            key={title}
            onPointerLeave={resetPointer}
            onPointerMove={handlePointerMove}
            style={style}
            tabIndex={0}
          >
            <span className="social-management-bento-glow" aria-hidden="true" />
            <div className="social-management-bento-art" aria-hidden="true">
              <span className="social-management-art-orbit orbit-one" />
              <span className="social-management-art-orbit orbit-two" />
              <span className="material-symbols-outlined">{artworkIcons[index]}</span>
              <span className="social-management-art-chip chip-one" />
              <span className="social-management-art-chip chip-two" />
              <span className="social-management-art-chip chip-three" />
            </div>
            <div className="social-management-bento-copy">
              <h3>
                {titleParts.map((part, partIndex) => (
                  <Fragment key={`${title}-${part}`}>
                    {part}
                    {partIndex < titleParts.length - 1 ? <><span aria-hidden="true">/</span><wbr /></> : null}
                  </Fragment>
                ))}
              </h3>
              <p>{text}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
