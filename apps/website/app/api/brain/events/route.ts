import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const eventSchema = z.object({
  type: z.enum(["page_view", "scroll", "click", "form_submit"]),
  data: z.record(z.string(), z.unknown()).default({}),
  clientTimestamp: z.string().datetime(),
});

const payloadSchema = z.object({
  siteKey: z.string().min(16),
  sessionId: z.string().uuid(),
  visitorId: z.string().uuid(),
  events: z.array(eventSchema).min(1).max(50),
});

type PromptProfitEvent = z.infer<typeof eventSchema>;

function normalizeHost(value: string | null) {
  if (!value) return null;

  let host = value.trim().toLowerCase();

  if (host.startsWith("http://") || host.startsWith("https://")) {
    try {
      host = new URL(host).hostname;
    } catch {
      host = host.replace("https://", "").replace("http://", "").split("/")[0];
    }
  }

  host = host.split(":")[0];

  if (host.startsWith("www.")) {
    host = host.slice(4);
  }

  return host;
}

function isAllowedOrigin(request: Request, websiteDomain: string) {
  const originHost = normalizeHost(request.headers.get("origin"));
  const refererHost = normalizeHost(request.headers.get("referer"));
  const expectedDomain = normalizeHost(websiteDomain);
  const candidateHost = originHost || refererHost;

  if (!candidateHost || !expectedDomain) return false;

  return (
    candidateHost === "localhost" ||
    candidateHost === "127.0.0.1" ||
    candidateHost === expectedDomain
  );
}

function calculateIntentScore(events: PromptProfitEvent[]) {
  let score = 0;

  for (const event of events) {
    if (event.type === "page_view") score += 5;

    if (event.type === "scroll") {
      const depth = Number(event.data.depth ?? 0);

      if (depth >= 75) score += 15;
      else if (depth >= 50) score += 10;
      else if (depth >= 25) score += 5;
    }

    if (event.type === "click") score += 15;
    if (event.type === "form_submit") score += 40;
  }

  return score;
}

function getDecision(intentScore: number) {
  if (intentScore >= 30) {
    return {
      decisionType: "show_flow",
      flowId: "warm-visitor-lead-capture-v1",
      reason: "Visitor behavior indicates meaningful engagement.",
      confidence: 0.8,
      flow: {
        id: "warm-visitor-lead-capture-v1",
        title: "Need help choosing the right solution?",
        message: "Tell us what you are trying to achieve and we will point you in the right direction.",
        primaryAction: {
          label: "Get help",
          action: "open_conversation",
        },
        secondaryAction: {
          label: "Not now",
          action: "dismiss",
        },
      },
    };
  }

  return {
    decisionType: "none",
    flowId: null,
    reason: "Visitor has not reached the engagement threshold.",
    confidence: 0.95,
    flow: null,
  };
}

export async function POST(request: Request) {
  try {
    const parsed = payloadSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid event payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { siteKey, sessionId, visitorId, events } = parsed.data;

    const { data: website, error: websiteError } = await supabaseAdmin
      .from("websites")
      .select("id, workspace_id, domain, is_active")
      .eq("public_key", siteKey)
      .single();

    if (websiteError || !website || !website.is_active) {
      return NextResponse.json(
        { ok: false, error: "Unknown or inactive website" },
        { status: 401 }
      );
    }

    if (!isAllowedOrigin(request, website.domain)) {
      return NextResponse.json(
        { ok: false, error: "Origin is not allowed for this website" },
        { status: 403 }
      );
    }

    const intentScore = calculateIntentScore(events);
    const decision = getDecision(intentScore);

    const eventRows = events.map((event) => ({
      website_id: website.id,
      session_id: sessionId,
      event_type: event.type,
      event_data: event.data,
      client_timestamp: event.clientTimestamp,
    }));
    const { error: insertError } = await supabaseAdmin
      .from("pp_events")
      .insert(eventRows);

    if (insertError) {
      console.error("PromptProfit event insert failed:", insertError);

      return NextResponse.json(
        { ok: false, error: "Unable to store events" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      websiteId: website.id,
      sessionId,
      visitorId,
      receivedEvents: events.length,
      intentScore,
      intentLevel:
        intentScore >= 30 ? "high_intent" : intentScore >= 15 ? "warm" : "cold",
      decision,
    });
  } catch (error) {
    console.error("PromptProfit event ingestion failed:", error);

    return NextResponse.json(
      { ok: false, error: "Unable to process events" },
      { status: 500 }
    );
  }
}



