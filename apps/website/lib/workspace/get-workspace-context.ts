import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type WorkspaceContext = {
  userId: string;
  workspaceId: string;
  workspaceName: string;
  role: string;
};

type MembershipRow = {
  workspace_id: string;
  role: string;
  workspaces: { id: string; name: string } | { id: string; name: string }[] | null;
};

export async function getWorkspaceContext(): Promise<WorkspaceContext> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to access this workspace.");
  }

  const { data, error } = await supabaseAdmin
    .from("workspace_members")
    .select(`
      workspace_id,
      role,
      workspaces (
        id,
        name
      )
    `)
    .eq("user_id", user.id)
    .limit(1);

  const membership = (data?.[0] ?? null) as MembershipRow | null;

  if (error || !membership) {
    throw new Error("No workspace membership was found for this account.");
  }

  const workspace = Array.isArray(membership.workspaces)
    ? membership.workspaces[0]
    : membership.workspaces;

  if (!workspace) {
    throw new Error("The workspace linked to this account could not be loaded.");
  }

  return {
    userId: user.id,
    workspaceId: membership.workspace_id,
    workspaceName: workspace.name,
    role: membership.role,
  };
}
