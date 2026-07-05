import { NextResponse } from "next/server";
import { handleLead, LeadValidationError } from "@/lib/leads";
import { verifyTurnstile } from "@/lib/turnstile";

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
    const turnstileResult = await verifyTurnstile(
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>).turnstile_token
        : undefined
    );

    if (!turnstileResult.ok) {
      const unavailable =
        turnstileResult.reason === "not_configured" ||
        turnstileResult.reason === "service_unavailable";
      return NextResponse.json(
        {
          ok: false,
          message: unavailable
            ? "Security verification is temporarily unavailable. Please try again shortly."
            : "Please complete the security check and try again."
        },
        { status: unavailable ? 503 : 400 }
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
