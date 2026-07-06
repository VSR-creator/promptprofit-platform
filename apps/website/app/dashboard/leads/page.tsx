import Link from "next/link";
import MarkContactedButton from "./MarkContactedButton";
import {
  getLeadResponseQueue,
  type LeadQueueItem,
} from "@/lib/dashboard/get-lead-response-queue";
import { getWorkspaceContext } from "@/lib/workspace/get-workspace-context";

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

  return {
    label: "Awaiting first response",
    tone: "bg-amber-50 text-amber-700",
  };
}

export default async function LeadsPage() {
  const workspace = await getWorkspaceContext();
  const leads = await getLeadResponseQueue(workspace.workspaceId);

  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const contacted = leads.filter((lead) => lead.firstContactedAt).length;

  return (
    <div className="bg-slate-50 px-5 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-violet-700 hover:text-violet-900"
            >
              ← Dashboard
            </Link>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
              {workspace.workspaceName} · Lead response console
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Turn captured demand into conversations.
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              The two-minute clock begins when a visitor submits their details.
              Mark contact only after a real human call, email, or WhatsApp
              response.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-medium text-slate-500">New</p>
              <p className="text-2xl font-bold">{newLeads}</p>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-medium text-slate-500">Contacted</p>
              <p className="text-2xl font-bold">{contacted}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {leads.length === 0 ? (
            <div className="p-10 text-center text-slate-600">
              No captured leads yet. New conversion captures will appear here
              automatically.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Lead</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">Intent</th>
                    <th className="px-5 py-4">Captured</th>
                    <th className="px-5 py-4">Response status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const state = responseState(lead);

                    return (
                      <tr key={lead.leadId} className="align-middle">
                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {lead.name || "Website lead"}
                          </p>
                          <p className="text-sm text-slate-600">{lead.email}</p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {lead.sourcePage}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
                            {lead.intentScore}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {new Date(lead.capturedAt).toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${state.tone}`}
                          >
                            {state.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <MarkContactedButton
                            leadId={lead.leadId}
                            workspaceId={workspace.workspaceId}
                            disabled={Boolean(lead.firstContactedAt)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
