import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ACTIVE_WORKSPACE_COOKIE = "pp_active_workspace";

export type WorkspaceContext = {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  role: string;
  memberships: Array<{
    workspaceId: string;
    workspaceName: string;
    workspaceSlug: string;
    role: string;
  }>;
};

type MembershipRow = {
  workspace_id: string;
  role: string;
  workspaces:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null;
};

export async function getWorkspaceContext(): Promise<WorkspaceContext> {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must sign in to access a workspace.");
  }

  const { data, error } = await supabaseAdmin
    .from("workspace_members")
    .select(`
      workspace_id,
      role,
      workspaces!inner (
        id,
        name,
        slug
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load workspace membership: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("No workspace membership was found for this account.");
  }

  const memberships = (data as MembershipRow[])
    .map((membership) => {
      const workspace = Array.isArray(membership.workspaces)
        ? membership.workspaces[0]
        : membership.workspaces;

      if (!workspace) return null;

      return {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        role: membership.role,
      };
    })
    .filter(
      (
        membership,
      ): membership is WorkspaceContext["memberships"][number] =>
        membership !== null,
    );

  if (memberships.length === 0) {
    throw new Error("No valid workspace membership was found.");
  }

  const requestedWorkspaceId = cookieStore.get(ACTIVE_WORKSPACE_COOKIE)?.value;

  const activeWorkspace =
    memberships.find(
      (membership) => membership.workspaceId === requestedWorkspaceId,
    ) ?? memberships[0];

  return {
    workspaceId: activeWorkspace.workspaceId,
    workspaceName: activeWorkspace.workspaceName,
    workspaceSlug: activeWorkspace.workspaceSlug,
    role: activeWorkspace.role,
    memberships,
  };
}
