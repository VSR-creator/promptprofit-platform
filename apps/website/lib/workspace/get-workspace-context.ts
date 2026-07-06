import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WorkspaceContext = {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  role: string;
  operatorName: string;
  operatorEmail: string;
};

export async function getWorkspaceContext(): Promise<WorkspaceContext> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: membership, error } = await supabase
    .from("workspace_members")
    .select(`
      role,
      workspaces!inner (
        id,
        name,
        slug
      ),
      profiles (
        full_name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !membership) {
    throw new Error("No workspace membership was found for this account.");
  }

  const workspace = Array.isArray(membership.workspaces)
    ? membership.workspaces[0]
    : membership.workspaces;

  const profile = Array.isArray(membership.profiles)
    ? membership.profiles[0]
    : membership.profiles;

  if (!workspace) {
    throw new Error("Workspace details could not be loaded.");
  }

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    workspaceSlug: workspace.slug,
    role: membership.role,
    operatorName: profile?.full_name?.trim() || user.email?.split("@")[0] || "Operator",
    operatorEmail: user.email ?? "",
  };
}
