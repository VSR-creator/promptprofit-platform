import { supabaseAdmin } from "@/lib/supabase/admin";

export type ConnectedWebsite = {
  id: string;
  name: string;
  domain: string;
  publicKey: string;
  isActive: boolean;
  firstEventAt: string | null;
  createdAt: string;
};

export async function getConnectedWebsites(workspaceId: string) {
  const { data, error } = await supabaseAdmin
    .from("websites")
    .select("id, name, domain, public_key, is_active, first_event_at, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load connected websites.");
  }

  return (data ?? []).map(
    (website): ConnectedWebsite => ({
      id: website.id,
      name: website.name,
      domain: website.domain,
      publicKey: website.public_key,
      isActive: website.is_active,
      firstEventAt: website.first_event_at,
      createdAt: website.created_at,
    }),
  );
}
