import Link from "next/link";
import { getWorkspaceContext } from "@/lib/workspace/get-workspace-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workspace = await getWorkspaceContext();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-950">
      <header className="border-b border-white/10 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              PromptProfit Operator
            </p>
            <p className="mt-1 text-lg font-bold">{workspace.workspaceName}</p>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-slate-200 hover:bg-white/10 hover:text-white">
              Overview
            </Link>
            <Link href="/dashboard/leads" className="rounded-lg bg-violet-600 px-3 py-2 text-white hover:bg-violet-500">
              Lead queue
            </Link>
            <form action="/auth/signout" method="post">
              <button className="rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
