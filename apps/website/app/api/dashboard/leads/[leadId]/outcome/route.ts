import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const updateOutcomeSchema = z.object({
  workspaceId: z.string().uuid(),
});

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { leadId } = await context.params;

    const parsed = updateOutcomeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid outcome update payload" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const now = new Date().toISOString();

    const { data: outcome, error: outcomeError } = await supabase
      .from("pp_lead_outcomes")
      .update({
        status: "contacted",
        first_contacted_at: now,
        updated_at: now,
      })
      .eq("lead_id", leadId)
      .eq("workspace_id", parsed.data.workspaceId)
      .is("first_contacted_at", null)
      .select("lead_id, status, first_contacted_at")
      .maybeSingle();

    if (outcomeError) {
      console.error("PromptProfit outcome update failed:", outcomeError);

      return NextResponse.json(
        { ok: false, error: "Unable to update lead outcome" },
        { status: 500 },
      );
    }

    if (!outcome) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead outcome was not found, was already contacted, or you do not have access.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      outcome: {
        leadId: outcome.lead_id,
        status: outcome.status,
        firstContactedAt: outcome.first_contacted_at,
      },
    });
  } catch (error) {
    console.error("PromptProfit outcome route failed:", error);

    return NextResponse.json(
      { ok: false, error: "Unable to process lead outcome update" },
      { status: 500 },
    );
  }
}
