import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface RouteProps {
  params: Promise<{
    websiteId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { websiteId } = await params;

  const { data: website, error } = await supabaseAdmin
    .from("websites")
    .select(
      `
      id,
      installation_status,
      installed_at,
      last_seen_at,
      total_events
      `,
    )
    .eq("id", websiteId)
    .single();

  if (error || !website) {
    return NextResponse.json(
      {
        success: false,
        error: "Website not found",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({
    success: true,
    installationStatus: website.installation_status,
    installedAt: website.installed_at,
    lastSeenAt: website.last_seen_at,
    totalEvents: website.total_events,
  });
}
