"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { TurnstileField } from "@/components/forms/TurnstileField";
import {
  formatInr,
  formatLeadPackageOption,
  websitePackages
} from "@/data/service-pricing";

type LeadFormMode = "website" | "general";

type LeadFormProps = {
  sourcePath?: string;
  city?: string;
  businessType?: string;
  mode?: LeadFormMode;
};

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const businessOptions = [
  "Pre-schooling",
  "Salon",
  "Clinic",
  "E-commerce store",
  "Transport and logistics",
  "Restaurant",
  "Pharmacy",
  "Education (LMS/School/College/Tuition Centre)",
  "Hardware shop",
  "Real estate business",
  "Other local business"
];

export function LeadForm({
  sourcePath = "/",
  city,
  businessType,
  mode = "website"
}: LeadFormProps) {
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "loading", message: "Sending your details..." });

    const payload = {
      owner_name: formData.get("owner_name"),
      phone_number: formData.get("phone_number"),
      email_address: formData.get("email_address"),
      shop_type: formData.get("shop_type"),
      pricing_package: formData.get("pricing_package"),
      form_context: mode,
      city_town: formData.get("city_town"),
      message: formData.get("message"),
      privacy_consent: formData.get("privacy_consent") === "on",
      turnstile_token: formData.get("turnstile_token"),
      source_path: sourcePath,
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
        message: "Thank you. Our team will call you soon."
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Please try again."
      });
    }
  }

  return (
    <form aria-busy={state.status === "loading"} className="lead-form" onSubmit={onSubmit}>
      <label aria-hidden="true" className="form-trap">
        Website
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </label>
      <div className="field-grid">
        <label>
          Your name
          <input
            autoComplete="name"
            maxLength={80}
            name="owner_name"
            placeholder="Your name"
            required
            type="text"
          />
        </label>
        <label>
          Mobile number
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
        <label className="field-full">
          Email address
          <input
            autoComplete="email"
            maxLength={254}
            name="email_address"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>
        <label className="field-full">
          Business type
          <select defaultValue={businessType || ""} name="shop_type" required>
            <option disabled value="">
              Select your business
            </option>
            {businessOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        {mode === "website" ? (
          <label className="field-full">
            Preferred package
            <select defaultValue="" name="pricing_package" required>
              <option disabled value="">
                Select a pricing package
              </option>
              {websitePackages.map((item) => {
                const option = formatLeadPackageOption(item);
                return (
                  <option key={item.id} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </label>
        ) : null}
        <label className="field-full">
          City or town
          <input
            autoComplete="address-level2"
            defaultValue={city && city !== "your town" ? city : ""}
            maxLength={80}
            name="city_town"
            placeholder="Example: Kolkata"
            required
            type="text"
          />
        </label>
        <label className="field-full">
          How can we help?
          <textarea
            maxLength={1000}
            name="message"
            placeholder="Tell us what you need help with"
            required
            rows={4}
          />
        </label>
      </div>
      <label className="consent-row">
        <input name="privacy_consent" required type="checkbox" />
        <span>
          {mode === "general"
            ? "I agree that DSE Consultancy can store my details and contact me about digital services."
            : "I agree that DSE Consultancy can store my details and contact me about my website."}
        </span>
      </label>
      <TurnstileField />
      <button className="primary-button" disabled={state.status === "loading"} type="submit">
        {state.status === "loading"
          ? "Please wait..."
          : mode === "general"
            ? "Request A Call Back"
            : `Book your website from ${formatInr(websitePackages[0].price)}`}
      </button>
      <p className="form-note">No spam. We only use your details to call you back.</p>
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
