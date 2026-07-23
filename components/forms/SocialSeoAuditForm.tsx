"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { TurnstileField } from "@/components/forms/TurnstileField";
import { SOCIAL_SEO_AUDIT_PACKAGE } from "@/data/service-pricing";

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const businessOptions = [
  "Clinic / doctor / dentist",
  "Salon / spa / beauty studio",
  "Coaching centre / school / institute",
  "Restaurant / cafe / cloud kitchen",
  "Real estate / interior / architect",
  "Local service provider",
  "Retail shop",
  "Small ecommerce brand",
  "Other local business"
];

export function SocialSeoAuditForm() {
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "loading", message: "Sending your audit request..." });

    const payload = {
      owner_name: formData.get("owner_name"),
      phone_number: formData.get("phone_number"),
      email_address: formData.get("email_address") || "",
      shop_type: formData.get("shop_type"),
      pricing_package: SOCIAL_SEO_AUDIT_PACKAGE,
      form_context: "audit",
      city_town: formData.get("city_town"),
      privacy_consent: formData.get("privacy_consent") === "on",
      turnstile_token: formData.get("turnstile_token"),
      source_path: "/social-media-management-plus-seo",
      website: formData.get("website")
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Please check the form and try again.");
      }

      form.reset();
      window.turnstile?.reset();
      setState({
        status: "success",
        message: "Thank you. We will review your Google and social presence before calling."
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Please try again."
      });
    }
  }

  return (
    <form aria-busy={state.status === "loading"} className="social-audit-form" onSubmit={onSubmit}>
      <label aria-hidden="true" className="form-trap">
        Website
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </label>
      <label>
        Business name
        <input
          autoComplete="organization"
          maxLength={80}
          name="owner_name"
          placeholder="Your business name"
          required
          type="text"
        />
      </label>
      <div className="social-form-grid">
        <label>
          City
          <input
            autoComplete="address-level2"
            maxLength={80}
            name="city_town"
            placeholder="Kolkata"
            required
            type="text"
          />
        </label>
        <label>
          Business type
          <select defaultValue="" name="shop_type" required>
            <option disabled value="">
              Select type
            </option>
            {businessOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        WhatsApp number
        <input
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          name="phone_number"
          pattern="[6-9][0-9]{9}"
          placeholder="10 digit number"
          required
          type="tel"
        />
      </label>
      <label className="social-consent-row">
        <input name="privacy_consent" required type="checkbox" />
        <span>Yes, DSE Consultancy can store these details and contact me about my audit.</span>
      </label>
      <TurnstileField />
      <button className="social-form-button" disabled={state.status === "loading"} type="submit">
        {state.status === "loading" ? "Please wait..." : "Book an Appointment"}
      </button>
      <p className="social-form-note">We review your Google and social pages before calling.</p>
      {state.message ? (
        <p
          aria-live="polite"
          className={`form-status ${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
