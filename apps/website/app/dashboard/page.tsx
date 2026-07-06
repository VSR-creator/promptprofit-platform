import Link from "next/link";
import { getWorkspaceDashboard } from "@/lib/dashboard/get-workspace-dashboard";
import { getWorkspaceContext } from "@/lib/workspace/get-workspace-context";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const workspace = await getWorkspaceContext();
  const dashboard = await getWorkspaceDashboard(workspace.workspaceId);

  const cards = [
    {
      label: "Connected websites",
      value: dashboard.metrics.websites,
      detail: "Properties sending conversion intelligence",
    },
    {
      label: "Tracked sessions",
      value: dashboard.metrics.sessions,
      detail: "Visitor journeys recorded",
    },
    {
      label: "Captured leads",
      value: dashboard.metrics.leads,
      detail: "Contacts ready for follow-up",
    },
    {
      label: "Conversion rate",
      value: `${dashboard.metrics.conversionRate}%`,
      detail: "Leads divided by tracked sessions",
    },
    {
      label: "High-intent sessions",
      value: dashboard.metrics.highIntentSessions,
      detail: "Sessions scoring 60 or above",
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600 via-violet-700 to-slate-950 p-6 text-white shadow-2xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">
            {workspace.workspaceName} · Conversion intelligence
          </p>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Conversion command center
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100 sm:text-base">
                See how attention becomes qualified opportunity across your
                connected websites.
              </p>
            </div>

            <Link
              href="/dashboard/leads"
              className="inline-flex w-fit rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Open lead queue
            </Link>
          </div>
        </header>

        <section
          aria-label="Conversion metrics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
        >
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-5 text-slate-500">
                {card.detail}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                Revenue opportunity queue
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                Latest captured leads
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              {dashboard.recentLeads.length} recent lead
              {dashboard.recentLeads.length === 1 ? "" : "s"}
            </p>
          </div>

          {dashboard.recentLeads.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-lg font-semibold text-slate-950">
                No leads captured yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When a visitor completes a conversion flow, their lead will
                appear here with the page and context that created it.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Lead</th>
                    <th className="px-6 py-4 font-semibold">Website</th>
                    <th className="px-6 py-4 font-semibold">Source page</th>
                    <th className="px-6 py-4 font-semibold">Captured</th>
                    <th className="px-6 py-4 font-semibold">Flow</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {dashboard.recentLeads.map((lead) => (
                    <tr key={lead.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">
                          {lead.email}
                        </p>
                        {typeof lead.metadata.name === "string" &&
                        lead.metadata.name.trim() ? (
                          <p className="mt-1 text-sm text-slate-500">
                            {lead.metadata.name}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {lead.websiteName}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {lead.sourcePage}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(lead.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {typeof lead.metadata.flowId === "string"
                          ? lead.metadata.flowId
                          : "Conversion flow"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
