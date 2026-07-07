import Link from "next/link";
import { getWorkspaceContext } from "@/lib/workspace/get-workspace-context";
import WorkspaceSwitcher from "./components/WorkspaceSwitcher";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workspace = await getWorkspaceContext();

  return (
    <>
      <nav className="border-b border-white/10 bg-slate-950 px-5 py-4 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="font-bold tracking-tight text-white"
            >
              PromptProfit OS
            </Link>

            <div className="hidden h-5 w-px bg-white/15 sm:block" />

            <div className="hidden gap-4 text-sm text-slate-300 sm:flex">
              <Link href="/dashboard" className="hover:text-white">
                Overview
              </Link>
              <Link href="/dashboard/leads" className="hover:text-white">
                Lead response
              </Link>
              <Link href="/dashboard/websites" className="hover:text-white">
                Websites
              </Link>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <WorkspaceSwitcher
              activeWorkspaceId={workspace.workspaceId}
              memberships={workspace.memberships}
            />
          </div>
        </div>
      </nav>

      {children}
    </>
  );
}