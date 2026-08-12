import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { installationService } from "@/lib/installation/installation-service";
import { commercialSync } from "@/lib/commercial/synchronization-service";

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
        {
          verified: false,
          stage: "query",
          error,
        },
        { status: 500 },
      );
    }

    if (!website) {
      return NextResponse.json(
        {
          verified: false,
          stage: "lookup",
        },
        { status: 404 },
      );
    }

    await installationService.verifyInstallation(website.id);

    const { error: syncError } =
      await commercialSync.recordSdkInstalled(website.id);

    if (syncError) {
      console.error(
        "[COMMERCIAL SYNC] SDK installation synchronization failed:",
        syncError,
      );

      return NextResponse.json(
        {
          verified: false,
          stage: "commercial_sync",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      verified: true,
      stage: "commercial_activation",
    });
  } catch (err) {
    console.error("[VERIFY] Unexpected:", err);

    return NextResponse.json(
      {
        verified: false,
        stage: "exception",
      },
      { status: 500 },
    );
  }
}
