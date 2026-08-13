import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const updateOutcomeSchema = z.object({
  workspaceId: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]).optional(),
  nextAction: z.string().trim().max(500).nullable().optional(),
  nextActionAt: z.string().datetime().nullable().optional(),
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

    const update: Record<string, unknown> = {};

    if (parsed.data.status !== undefined) {
      update.status = parsed.data.status;
    }

    if (parsed.data.nextAction !== undefined) {
      update.next_action = parsed.data.nextAction;
    }

    if (parsed.data.nextActionAt !== undefined) {
      update.next_action_at = parsed.data.nextActionAt;
    }

    /*
     * Preserve the original MVP invariant:
     * first_contacted_at is only written the first time
     * a lead transitions into contacted.
     */
    if (parsed.data.status === "contacted") {
      update.first_contacted_at = now;
    }

    update.updated_at = now;

    const { data: existingOutcome, error: lookupError } = await supabase
      .from("pp_lead_outcomes")
      .select("lead_id, status, first_contacted_at")
      .eq("lead_id", leadId)
      .eq("workspace_id", parsed.data.workspaceId)
      .maybeSingle();

    if (lookupError) {
      console.error("PromptProfit outcome lookup failed:", lookupError);

      return NextResponse.json(
        { ok: false, error: "Unable to find lead outcome" },
        { status: 500 },
      );
    }

    if (!existingOutcome) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Lead outcome was not found or you do not have access.",
        },
        { status: 404 },
      );
    }

    /*
     * Never overwrite the original contact timestamp.
     */
    if (existingOutcome.first_contacted_at) {
      delete update.first_contacted_at;
    }

    const { data: outcome, error: outcomeError } = await supabase
      .from("pp_lead_outcomes")
      .update(update)
      .eq("lead_id", leadId)
      .eq("workspace_id", parsed.data.workspaceId)
      .select(
        "lead_id, status, first_contacted_at, next_action, next_action_at",
      )
      .single();

    if (outcomeError) {
      console.error("PromptProfit outcome update failed:", outcomeError);

      return NextResponse.json(
        { ok: false, error: "Unable to update lead outcome" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      outcome: {
        leadId: outcome.lead_id,
        status: outcome.status,
        firstContactedAt: outcome.first_contacted_at,
        nextAction: outcome.next_action,
        nextActionAt: outcome.next_action_at,
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
