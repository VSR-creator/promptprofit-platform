import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const leadSchema = z.object({
  siteKey: z.string().min(1),
  sessionId: z.string().uuid(),
  email: z.string().email().max(320),
  sourcePage: z.string().min(1).max(2048),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export async function POST(request: Request) {
  try {
    const parsed = leadSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid lead payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { siteKey, sessionId, email, sourcePage, metadata } = parsed.data;
    const supabase = supabaseAdmin;

    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .select("id, name, domain, public_key, is_active")
      .eq("public_key", siteKey)
      .maybeSingle();

    if (websiteError) {
      console.error("PromptProfit website lookup failed:", websiteError);
      return NextResponse.json(
        { ok: false, error: "Unable to validate website" },
        { status: 500 },
      );
    }

    if (!website || !website.is_active) {
      return NextResponse.json(
        { ok: false, error: "Unknown or inactive site key" },
        { status: 404 },
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from("pp_sessions")
      .select("id, website_id")
      .eq("id", sessionId)
      .eq("website_id", website.id)
      .maybeSingle();

    if (sessionError) {
      console.error("PromptProfit session lookup failed:", sessionError);
      return NextResponse.json(
        { ok: false, error: "Unable to validate session" },
        { status: 500 },
      );
    }

    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Session does not belong to this website" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: lead, error: leadError } = await supabase
      .from("pp_leads")
      .upsert(
        {
          website_id: website.id,
          session_id: session.id,
          email: normalizedEmail,
          source_page: sourcePage,
          metadata: {
            ...metadata,
            capture_source: "promptprofit_flow",
            captured_at_client: new Date().toISOString(),
          },
        },
        {
          onConflict: "website_id,session_id,email",
        },
      )
      .select("id, email, created_at")
      .single();

    if (leadError) {
      console.error("PromptProfit lead insert failed:", leadError);
      return NextResponse.json(
        { ok: false, error: "Unable to save lead" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        lead: {
          id: lead.id,
          email: lead.email,
          createdAt: lead.created_at,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("PromptProfit lead route failed:", error);

    return NextResponse.json(
      { ok: false, error: "Unable to process lead" },
      { status: 500 },
    );
  }
}
