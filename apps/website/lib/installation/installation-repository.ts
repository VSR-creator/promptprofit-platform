import { createSupabaseServerClient } from "@/lib/supabase/server";
import { InstallationMethod } from "./installation-types";

export interface InstallationRecord {
  id: string;
  workspaceId: string;
  websiteId: string;
  installationMethod: InstallationMethod;
  installerName: string | null;
  installerEmail: string | null;
  sdkInstalled: boolean;
  sdkVerified: boolean;
  firstEventReceived: boolean;
  installationCompleted: boolean;
  installedAt: string | null;
  verifiedAt: string | null;
  firstEventAt: string | null;
  metadata: Record<string, unknown>;
}

export class InstallationRepository {
  /**
   * Returns the installation for a website.
   */
  async getByWebsiteId(websiteId: string): Promise<InstallationRecord | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("pp_installations")
      .select("*")
      .eq("website_id", websiteId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      workspaceId: data.workspace_id,
      websiteId: data.website_id,
      installationMethod: data.installation_method,
      installerName: data.installer_name,
      installerEmail: data.installer_email,
      sdkInstalled: data.sdk_installed,
      sdkVerified: data.sdk_verified,
      firstEventReceived: data.first_event_received,
      installationCompleted: data.installation_completed,
      installedAt: data.installed_at,
      verifiedAt: data.verified_at,
      firstEventAt: data.first_event_at,
      metadata: data.metadata ?? {},
    };
  }

  /**
   * Creates or updates an installation.
   */
  async save(record: {
    workspaceId: string;
    websiteId: string;
    installationMethod: InstallationMethod;
  }) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("pp_installations")
      .upsert(
        {
          workspace_id: record.workspaceId,
          website_id: record.websiteId,
          installation_method: record.installationMethod,
        },
        {
          onConflict: "website_id",
        },
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

/**
 * Shared singleton.
 */
export const installationRepository = new InstallationRepository();
