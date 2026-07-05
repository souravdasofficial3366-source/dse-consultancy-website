const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
const requestTimeoutMs = 8_000;

type RecaptchaResponse = {
  success?: boolean;
};

export function isRecaptchaRequired() {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

export async function verifyRecaptcha(token: unknown): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return true;
  }

  const responseToken = String(token || "").trim();
  if (!responseToken) {
    return false;
  }

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
    throw new Error(`reCAPTCHA returned HTTP ${response.status}.`);
  }

  const result = (await response.json()) as RecaptchaResponse;
  return result.success === true;
}
