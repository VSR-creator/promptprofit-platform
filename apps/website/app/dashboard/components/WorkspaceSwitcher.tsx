"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type WorkspaceOption = {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  role: string;
};

export default function WorkspaceSwitcher({
  activeWorkspaceId,
  memberships,
}: {
  activeWorkspaceId: string;
  memberships: WorkspaceOption[];
}) {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  async function changeWorkspace(workspaceId: string) {
    if (workspaceId === activeWorkspaceId) return;

    setIsChanging(true);

    const response = await fetch("/api/workspace/active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId }),
    });

    if (response.ok) {
      router.refresh();
    }

    setIsChanging(false);
  }

  return (
    <label className="block">
      <span className="sr-only">Active workspace</span>
      <select
        value={activeWorkspaceId}
        disabled={isChanging}
        onChange={(event) => changeWorkspace(event.target.value)}
        className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-violet-400 disabled:opacity-60"
      >
        {memberships.map((membership) => (
          <option
            key={membership.workspaceId}
            value={membership.workspaceId}
            className="bg-slate-950 text-white"
          >
            {membership.workspaceName}
          </option>
        ))}
      </select>
    </label>
  );
}
