import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ websiteId: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { websiteId } = await context.params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: website, error } = await supabase
    .from("websites")
    .select("id, activation_state, activated_at, first_event_at")
    .eq("id", websiteId)
    .maybeSingle();

  if (error || !website) {
    return NextResponse.json({ error: "Website not found." }, { status: 404 });
  }

  return NextResponse.json({
    website: {
      id: website.id,
      activationState: website.activation_state,
      activatedAt: website.activated_at,
      firstEventAt: website.first_event_at,
    },
  });
}
