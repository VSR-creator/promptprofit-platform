import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const diagnosticSchema = z.object({
  businessType: z.string().min(2).max(120),
  websiteOrInstagram: z.string().url().max(2048),
  mainOffer: z.string().min(2).max(500),
  desiredAction: z.string().min(2).max(300),
  biggestIssue: z.string().min(2).max(1000),
  email: z.string().email().max(320),
  source: z.string().max(100).optional(),
  campaign: z.string().max(100).optional(),
  entryPoint: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = diagnosticSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please complete the required fields.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const { data: diagnostic, error } = await supabaseAdmin
      .from("launch_diagnostics")
      .insert({
        business_type: data.businessType.trim(),
        website_or_instagram: data.websiteOrInstagram.trim(),
        main_offer: data.mainOffer.trim(),
        desired_action: data.desiredAction.trim(),
        biggest_issue: data.biggestIssue.trim(),
        email: data.email.trim().toLowerCase(),
        source: data.source ?? "launch_site",
        campaign: data.campaign ?? "instagram_launch",
        entry_point: data.entryPoint ?? "free_diagnostic",
        metadata: {
          submitted_at: new Date().toISOString(),
        },
      })
      .select("id")
      .single();

    if (error) {
      console.error("Launch diagnostic insert failed:", error);

      return NextResponse.json(
        { ok: false, error: "We could not save your diagnostic. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        diagnosticId: diagnostic.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Launch diagnostic route failed:", error);

    return NextResponse.json(
      { ok: false, error: "We could not process your diagnostic." },
      { status: 500 },
    );
  }
}
