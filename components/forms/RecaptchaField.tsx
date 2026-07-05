import Script from "next/script";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function RecaptchaField() {
  if (!siteKey) {
    return null;
  }

  return (
    <div className="recaptcha-wrap">
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      <div className="g-recaptcha" data-sitekey={siteKey} />
    </div>
  );
}
