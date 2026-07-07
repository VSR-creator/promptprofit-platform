import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ACTIVE_WORKSPACE_COOKIE = "pp_active_workspace";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const workspaceId =
    typeof body?.workspaceId === "string" ? body.workspaceId : null;

  if (!workspaceId) {
    return NextResponse.json(
      { error: "A workspace is required." },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: membership, error } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !membership) {
    return NextResponse.json(
      { error: "You do not have access to this workspace." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(ACTIVE_WORKSPACE_COOKIE, workspaceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
