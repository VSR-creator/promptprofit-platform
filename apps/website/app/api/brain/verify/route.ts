import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { installationService } from "@/lib/installation/installation-service";

export async function POST(request: Request) {
  try {
    const { publicKey } = await request.json();

    console.log("[VERIFY] Public Key:", publicKey);

    const supabase = supabaseAdmin;

    const { data: website, error } = await supabase
      .from("websites")
      .select("id, name, public_key")
      .eq("public_key", publicKey)
      .maybeSingle();

    console.log("[VERIFY] Website:", website);
    console.log("[VERIFY] Error:", error);

    if (error) {
      return NextResponse.json(
        { verified: false, stage: "query", error },
        { status: 500 },
      );
    }

    if (!website) {
      return NextResponse.json(
        { verified: false, stage: "lookup" },
        { status: 404 },
      );
    }

    await installationService.verifyInstallation(website.id);

    return NextResponse.json({
      verified: true,
    });
  } catch (err) {
    console.error("[VERIFY] Unexpected:", err);

    return NextResponse.json(
      { verified: false, stage: "exception" },
      { status: 500 },
    );
  }
}
