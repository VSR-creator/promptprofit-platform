import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { installationService } from "@/lib/installation/installation-service";

export async function POST(request: Request) {
  const { publicKey } = await request.json();

  const supabase = await createSupabaseServerClient();

  const { data: website, error } = await supabase
    .from("websites")
    .select("id")
    .eq("public_key", publicKey)
    .maybeSingle();

  if (error || !website) {
    return NextResponse.json({ verified: false }, { status: 404 });
  }

  await installationService.verifyInstallation(website.id);

  return NextResponse.json({
    verified: true,
  });
}
