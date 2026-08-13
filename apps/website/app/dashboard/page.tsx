import Link from "next/link";
import LeadActionPanel from "./leads/LeadActionPanel";

import {
  getLeadResponseQueue,
  type LeadQueueItem,
} from "@/lib/dashboard/get-lead-response-queue";
import { getWorkspaceContext } from "@/lib/workspace/get-workspace-context";

export const dynamic = "force-dynamic";

function secondsSinceCapture(capturedAt: string) {
  return Math.max(
    0,
    Math.round((Date.now() - new Date(capturedAt).getTime()) / 1000),
  );
}

function formatAge(capturedAt: string) {
  const seconds = secondsSinceCapture(capturedAt);

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h`;
  }

  return `${Math.floor(hours / 24)}d`;
}

function responseState(lead: LeadQueueItem) {
  if (lead.firstContactedAt) {
    const seconds = Math.round(
      (new Date(lead.firstContactedAt).getTime() -
        new Date(lead.capturedAt).getTime()) /
        1000,
    );

    return seconds <= 120
      ? {
          label: `Responded in ${seconds}s`,
          tone: "bg-emerald-50 text-emerald-700",
        }
      : {
          label: `SLA breached: ${Math.round(seconds / 60)}m`,
          tone: "bg-red-50 text-red-700",
        };
  }

  const age = secondsSinceCapture(lead.capturedAt);

  if (age > 120) {
    return {
      label: "SLA at risk",
      tone: "bg-red-50 text-red-700",
    };
  }

  return {
    label: "Needs response",
    tone: "bg-amber-50 text-amber-700",
  };
}

function priorityScore(lead: LeadQueueItem) {
  const age = secondsSinceCapture(lead.capturedAt);

  let score = lead.intentScore;

  if (!lead.firstContactedAt) {
    score += 100;

    if (age > 120) {
      score += 100;
    } else if (age > 60) {
      score += 50;
    }
  }

  return score;
}

function sortForSales(leads: LeadQueueItem[]) {
  return [...leads].sort((a, b) => {
    const aScore = priorityScore(a);
    const bScore = priorityScore(b);

    if (aScore !== bScore) {
      return bScore - aScore;
    }

    return new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime();
  });
}

export default async function DashboardPage() {
  const workspace = await getWorkspaceContext();
  const leads = await getLeadResponseQueue(workspace.workspaceId);
  const priorityLeads = sortForSales(leads);

  const newLeads = leads.filter((lead) => !lead.firstContactedAt).length;

  const contacted = leads.filter((lead) =>
    Boolean(lead.firstContactedAt),
  ).length;

  const urgent = leads.filter((lead) => {
    if (lead.firstContactedAt) {
      return false;
    }

    return secondsSinceCapture(lead.capturedAt) > 120;
  }).length;

  const highIntent = leads.filter((lead) => lead.intentScore >= 60).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
                {workspace.workspaceName} � Sales Workspace
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Respond to demand.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Your highest-priority captured opportunities are here. Respond
                quickly, make the human connection, and record the outcome.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/leads"
                className="inline-flex items-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Full lead queue
              </Link>

              <Link
                href="/dashboard/websites"
                className="inline-flex items-center rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Websites
              </Link>
            </div>
          </div>
        </header>

        <section
          aria-label="Sales workspace metrics"
          className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Awaiting response
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{newLeads}</p>
            <p className="mt-1 text-sm text-slate-500">
              Leads requiring human follow-up
            </p>
          </article>

          <article className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">SLA attention</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{urgent}</p>
            <p className="mt-1 text-sm text-slate-500">
              Waiting longer than two minutes
            </p>
          </article>

          <article className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">High intent</p>
            <p className="mt-2 text-3xl font-bold text-violet-700">
              {highIntent}
            </p>
            <p className="mt-1 text-sm text-slate-500">Intent score of 60+</p>
          </article>

          <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Contacted</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {contacted}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Human responses recorded
            </p>
          </article>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                  Response queue
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight">
                  What needs your attention?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Highest-priority opportunities appear first.
                </p>
              </div>

              <span className="text-sm font-medium text-slate-500">
                {priorityLeads.length} lead
                {priorityLeads.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {priorityLeads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                ?
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Your response queue is clear.
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                New captured leads will appear here automatically when visitors
                submit their details.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Lead</th>
                    <th className="px-6 py-4 font-semibold">Intent</th>
                    <th className="px-6 py-4 font-semibold">Captured</th>
                    <th className="px-6 py-4 font-semibold">Response</th>
                    <th className="px-6 py-4 font-semibold">Source</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {priorityLeads.map((lead) => {
                    const state = responseState(lead);

                    return (
                      <tr
                        key={lead.leadId}
                        className="align-middle transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-950">
                            {lead.name || "Website lead"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {lead.email}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                              lead.intentScore >= 60
                                ? "bg-violet-100 text-violet-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {lead.intentScore}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-950">
                            {formatAge(lead.capturedAt)} ago
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(lead.capturedAt).toLocaleString("en-ZA")}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${state.tone}`}
                          >
                            {state.label}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {lead.sourcePage}
                        </td>

                        <td className="px-6 py-5">
                          <LeadActionPanel
                            leadId={lead.leadId}
                            workspaceId={workspace.workspaceId}
                            status={lead.status}
                            nextAction={lead.nextAction}
                            nextActionAt={lead.nextActionAt}
                            firstContactedAt={lead.firstContactedAt}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Sales rule
            </p>
            <h3 className="mt-2 font-bold">Respond before analysing.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The primary job of this workspace is to make sure captured demand
              receives a human response quickly.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              SLA
            </p>
            <h3 className="mt-2 font-bold">Two-minute response target.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The response clock begins when the visitor submits their details.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Outcome discipline
            </p>
            <h3 className="mt-2 font-bold">Record the human response.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Only mark a lead contacted after a real call, email, or WhatsApp
              response.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}






