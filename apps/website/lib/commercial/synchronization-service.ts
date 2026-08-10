import { supabaseAdmin } from "@/lib/supabase/admin";

export class CommercialSynchronizationService {
  async recordSdkInstalled(websiteId: string) {
    const timestamp = new Date().toISOString();

    return supabaseAdmin
      .from("websites")
      .update({
        installation_status: "INSTALLED",

        activation_state: "INSTALLED",

        sdk_installed_at: timestamp,

        installed_at: timestamp,
      })
      .eq("id", websiteId);
  }

  async recordEvent() {}

  async recordSession() {}

  async recordDecision() {}

  async recordLead() {}

  async refreshWebsite() {}
}

export const commercialSync = new CommercialSynchronizationService();
