const verificationUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const requestTimeoutMs = 8_000;

type TurnstileResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export type TurnstileVerification =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "action_mismatch"
        | "hostname_mismatch"
        | "invalid"
        | "missing_token"
        | "not_configured"
        | "service_unavailable";
    };

function allowedHostnames() {
  return String(process.env.TURNSTILE_ALLOWED_HOSTNAMES || "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
}

export async function verifyTurnstile(token: unknown): Promise<TurnstileVerification> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return process.env.NODE_ENV === "production"
      ? { ok: false, reason: "not_configured" }
      : { ok: true };
  }

  const responseToken = String(token || "").trim();
  if (!responseToken) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        secret,
        response: responseToken
      }),
      signal: AbortSignal.timeout(requestTimeoutMs)
    });

    if (!response.ok) {
      return { ok: false, reason: "service_unavailable" };
    }

    const result = (await response.json()) as TurnstileResponse;
    if (result.success !== true) {
      return { ok: false, reason: "invalid" };
    }

    if (result.action !== "lead_form") {
      return { ok: false, reason: "action_mismatch" };
    }

    const hostname = String(result.hostname || "").toLowerCase();
    const hostnames = allowedHostnames();
    if (!hostname || hostnames.length === 0 || !hostnames.includes(hostname)) {
      return { ok: false, reason: "hostname_mismatch" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "service_unavailable" };
  }
}
