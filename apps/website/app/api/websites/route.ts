import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const createWebsiteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  domain: z.string().trim().min(3).max(255),
});

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createWebsiteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a website name and valid domain." },
      { status: 400 },
    );
  }

  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) {
    return NextResponse.json(
      { error: "You do not have permission to connect a website." },
      { status: 403 },
    );
  }

  const domain = normalizeDomain(parsed.data.domain);

  if (!domain.includes(".") || domain.length < 3) {
    return NextResponse.json(
      { error: "Enter a valid domain, such as example.com." },
      { status: 400 },
    );
  }

  const { data: existing } = await supabaseAdmin
    .from("websites")
    .select("id")
    .eq("workspace_id", membership.workspace_id)
    .eq("domain", domain)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "This domain is already connected to your workspace." },
      { status: 409 },
    );
  }

  const { data: website, error: insertError } = await supabaseAdmin
    .from("websites")
    .insert({
      workspace_id: membership.workspace_id,
      name: parsed.data.name,
      domain,
    })
    .select("id, name, domain, public_key, is_active, created_at")
    .single();

  if (insertError || !website) {
    return NextResponse.json(
      { error: "Unable to connect this website. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ website }, { status: 201 });
}
