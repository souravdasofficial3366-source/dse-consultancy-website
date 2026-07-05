import { NextResponse } from "next/server";
import { handleLead, LeadValidationError } from "@/lib/leads";
import { isRecaptchaRequired, verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { ok: false, message: "Please send the form as JSON." },
        { status: 415 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 8_192) {
      return NextResponse.json(
        { ok: false, message: "The form submission is too large." },
        { status: 413 }
      );
    }

    const payload = await request.json();
    const recaptchaIsValid = await verifyRecaptcha(
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>).recaptcha_token
        : undefined
    );

    if (isRecaptchaRequired() && !recaptchaIsValid) {
      return NextResponse.json(
        { ok: false, message: "Please complete the reCAPTCHA check and try again." },
        { status: 400 }
      );
    }

    const result = await handleLead(payload);

    if (!result.stored) {
      return NextResponse.json(
        {
          ok: false,
          message: "Lead storage is not connected yet. Please add database settings."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Thank you. We will call you soon.",
      result
    });
  } catch (error) {
    if (error instanceof LeadValidationError) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        { status: 400 }
      );
    }

    console.error("Lead submission failed", error);
    return NextResponse.json(
      {
        ok: false,
        message: "We could not send your details right now. Please try again."
      },
      { status: 500 }
    );
  }
}
