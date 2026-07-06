import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ diagnosticId: string }> },
) {
  const { diagnosticId } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("launch_diagnostics")
    .select(
      "id, business_type, website_or_instagram, main_offer, desired_action, biggest_issue, created_at",
    )
    .eq("id", diagnosticId)
    .maybeSingle();

  if (error) {
    console.error("Diagnostic lookup failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to retrieve diagnostic" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Diagnostic not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, diagnostic: data });
}
