import { promises as fs } from "node:fs";
import path from "node:path";

export type LeadInput = {
  owner_name: string;
  phone_number: string;
  email_address: string;
  shop_type: string;
  pricing_package: string;
  city_town: string;
  privacy_consent: boolean;
  source_path?: string;
};

export type LeadResult = {
  stored: boolean;
  alerts: {
    email: boolean;
    sms: boolean;
  };
};

const phoneRegex = /^[6-9][0-9]{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestTimeoutMs = 8_000;
const packageOptions = new Set([
  "Essential – ₹3,999 + GST",
  "Dynamic – ₹6,999 + GST",
  "Advanced – ₹8,999 + GST"
]);

export class LeadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeadValidationError";
  }
}

function requiredText(
  value: unknown,
  label: string,
  minimumLength: number,
  maximumLength: number
) {
  const text = String(value || "").trim();

  if (text.length < minimumLength) {
    throw new LeadValidationError(`Please enter your ${label}.`);
  }

  if (text.length > maximumLength) {
    throw new LeadValidationError(`${label.charAt(0).toUpperCase() + label.slice(1)} is too long.`);
  }

  return text;
}

export function cleanLead(input: unknown): LeadInput {
  if (!input || typeof input !== "object") {
    throw new LeadValidationError("Please fill the form.");
  }

  const value = input as Record<string, unknown>;

  if (String(value.website || "").trim()) {
    throw new LeadValidationError("Please try again.");
  }

  const sourcePath = String(value.source_path || "/").trim();
  const lead: LeadInput = {
    owner_name: requiredText(value.owner_name, "name", 2, 80),
    phone_number: String(value.phone_number || "").replace(/\D/g, ""),
    email_address: requiredText(value.email_address, "email address", 5, 254).toLowerCase(),
    shop_type: requiredText(value.shop_type, "business type", 2, 80),
    pricing_package: requiredText(value.pricing_package, "pricing package", 2, 80),
    city_town: requiredText(value.city_town, "city or town", 2, 80),
    privacy_consent: value.privacy_consent === true,
    source_path: sourcePath.startsWith("/") && sourcePath.length <= 200 ? sourcePath : "/"
  };

  if (!phoneRegex.test(lead.phone_number)) {
    throw new LeadValidationError("Please enter a valid 10 digit mobile number.");
  }

  if (!emailRegex.test(lead.email_address)) {
    throw new LeadValidationError("Please enter a valid email address.");
  }

  if (!packageOptions.has(lead.pricing_package)) {
    throw new LeadValidationError("Please select a valid pricing package.");
  }

  if (!lead.privacy_consent) {
    throw new LeadValidationError("Please agree so we can contact you.");
  }

  return lead;
}

export async function saveLead(lead: LeadInput): Promise<boolean> {
  const googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const googleSheetsWebhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (googleSheetsWebhookUrl && googleSheetsWebhookSecret) {
    const response = await fetch(googleSheetsWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret: googleSheetsWebhookSecret,
        lead
      }),
      redirect: "follow",
      signal: AbortSignal.timeout(requestTimeoutMs)
    });

    if (!response.ok) {
      throw new Error(`Google Sheets returned HTTP ${response.status}.`);
    }

    const result = (await response.json()) as { ok?: boolean; error?: string };
    if (!result.ok) {
      throw new Error(result.error || "Google Sheets did not accept the lead.");
    }

    return true;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(requestTimeoutMs)
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Lead could not be saved: ${details}`);
    }

    return true;
  }

  if (process.env.NODE_ENV !== "production") {
    const logPath = path.join(process.cwd(), "work", "leads.jsonl");
    await fs.mkdir(path.dirname(logPath), { recursive: true });
    await fs.appendFile(logPath, `${JSON.stringify({ ...lead, created_at: new Date().toISOString() })}\n`);
    return true;
  }

  return false;
}

export async function sendLeadEmail(lead: LeadInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_ALERT_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "leads@dseconsultancy.in";

  if (!apiKey || !to) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
      body: JSON.stringify({
      from,
      to,
      subject: `New DSE lead: ${lead.shop_type} in ${lead.city_town}`,
      text: [
        "New website enquiry",
        "",
        `Owner: ${lead.owner_name}`,
        `Phone: ${lead.phone_number}`,
        `Email: ${lead.email_address}`,
        `Business: ${lead.shop_type}`,
        `Package: ${lead.pricing_package}`,
        `City/Town: ${lead.city_town}`,
        `Source: ${lead.source_path || "/"}`,
        `Consent: ${lead.privacy_consent ? "Yes" : "No"}`
      ].join("\n")
      }),
      signal: AbortSignal.timeout(requestTimeoutMs)
  });

  return response.ok;
}

export async function sendLeadSms(lead: LeadInput): Promise<boolean> {
  const webhookUrl = process.env.SMS_WEBHOOK_URL;
  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.SMS_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_SECRET}` }
        : {})
    },
    body: JSON.stringify({
      message: `New DSE lead: ${lead.owner_name}, ${lead.phone_number}, ${lead.email_address}, ${lead.shop_type}, ${lead.pricing_package}, ${lead.city_town}`,
      lead
    }),
    signal: AbortSignal.timeout(requestTimeoutMs)
  });

  return response.ok;
}

export async function handleLead(input: unknown): Promise<LeadResult> {
  const lead = cleanLead(input);
  const stored = await saveLead(lead);

  const [email, sms] = await Promise.all([
    sendLeadEmail(lead).catch(() => false),
    sendLeadSms(lead).catch(() => false)
  ]);

  return { stored, alerts: { email, sms } };
}
