import { supabaseAdmin } from "@/lib/supabase/admin";

export class CommercialSynchronizationService {
  async recordSdkInstalled(websiteId: string) {
    const timestamp = new Date().toISOString();

    return supabaseAdmin
      .from("websites")
      .update({
        installation_status: "INSTALLED",
        activation_state: "SNIPPET_INSTALLED",
        sdk_installed_at: timestamp,
        installed_at: timestamp,
        last_seen_at: timestamp,
      })
      .eq("id", websiteId);
  }

  async recordTrackingActivity(websiteId: string) {
    const timestamp = new Date().toISOString();

    const { count, error: countError } = await supabaseAdmin
      .from("pp_events")
      .select("id", { count: "exact", head: true })
      .eq("website_id", websiteId);

    if (countError) {
      console.error(
        "[COMMERCIAL SYNC] Event count failed:",
        countError,
      );

      return {
        data: null,
        error: countError,
      };
    }

    const totalEvents = count ?? 0;

    console.log("[COMMERCIAL SYNC] Tracking count:", {
      websiteId,
      totalEvents,
    });

    const result = await supabaseAdmin
      .from("websites")
      .update({
        activation_state: "TRACKING",
        last_seen_at: timestamp,
        total_events: totalEvents,
      })
      .eq("id", websiteId);

    console.log("[COMMERCIAL SYNC] Tracking update result:", {
      websiteId,
      totalEvents,
      error: result.error,
    });

    return result;
  }

  async recordSession() {}

  async recordDecision() {}

  async recordLead() {}

  async refreshWebsite() {}
}

export const commercialSync =
  new CommercialSynchronizationService();
