"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render?: (
        container: HTMLElement,
        options: {
          sitekey: string;
          action: "lead_form";
          appearance: "always";
          size: "compact" | "flexible";
          theme: "auto";
          retry: "auto";
          "refresh-expired": "auto";
          "refresh-timeout": "auto";
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": (errorCode: string) => void;
          "timeout-callback": () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export function TurnstileField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLInputElement>(null);
  const retryTimerRef = useRef<number | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
      }
    },
    []
  );

  if (!siteKey) {
    return null;
  }

  const turnstileSiteKey = siteKey;

  function updateResponse(token = "") {
    if (responseRef.current) {
      responseRef.current.value = token;
    }
  }

  function renderWidget(attempt = 0) {
    if (!containerRef.current || widgetIdRef.current !== null) {
      return;
    }

    if (typeof window.turnstile?.render !== "function") {
      if (attempt < 40) {
        retryTimerRef.current = window.setTimeout(() => renderWidget(attempt + 1), 100);
      }
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: turnstileSiteKey,
      action: "lead_form",
      appearance: "always",
      size: window.matchMedia("(max-width: 420px)").matches ? "compact" : "flexible",
      theme: "auto",
      retry: "auto",
      "refresh-expired": "auto",
      "refresh-timeout": "auto",
      callback: updateResponse,
      "expired-callback": () => updateResponse(),
      "error-callback": () => updateResponse(),
      "timeout-callback": () => updateResponse()
    });
  }

  return (
    <div className="turnstile-wrap">
      <Script
        id="cloudflare-turnstile"
        onReady={renderWidget}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={containerRef} />
      <input defaultValue="" name="turnstile_token" ref={responseRef} type="hidden" />
    </div>
  );
}
