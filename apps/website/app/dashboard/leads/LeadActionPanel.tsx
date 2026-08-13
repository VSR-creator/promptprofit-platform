"use client";

import { useState } from "react";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost";

type Props = {
  leadId: string;
  workspaceId: string;
  status: LeadStatus;
  nextAction: string | null;
  nextActionAt: string | null;
  firstContactedAt: string | null;
};

const ACTIONS = [
  "Call lead",
  "WhatsApp lead",
  "Email lead",
  "Follow up",
  "Qualify lead",
  "Send quote",
  "Schedule consultation",
];

export default function LeadActionPanel({
  leadId,
  workspaceId,
  status,
  nextAction,
  nextActionAt,
  firstContactedAt,
}: Props) {
  const [currentStatus, setCurrentStatus] =
    useState<LeadStatus>(status);

  const [currentAction, setCurrentAction] =
    useState(nextAction ?? "");

  const [currentActionAt, setCurrentActionAt] =
    useState(
      nextActionAt
        ? new Date(nextActionAt).toISOString().slice(0, 16)
        : "",
    );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/leads/${leadId}/outcome`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workspaceId,
            status: currentStatus,
            nextAction: currentAction || null,
            nextActionAt: currentActionAt
              ? new Date(currentActionAt).toISOString()
              : null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ?? "Unable to update lead",
        );
      }

      setSaved(true);
      window.location.reload();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to update lead",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Status
        </label>

        <select
          value={currentStatus}
          onChange={(event) => {
            setCurrentStatus(event.target.value as LeadStatus);
            setSaved(false);
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Next action
        </label>

        <select
          value={currentAction}
          onChange={(event) => {
            setCurrentAction(event.target.value);
            setSaved(false);
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">No next action</option>

          {ACTIONS.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Follow-up
        </label>

        <input
          type="datetime-local"
          value={currentActionAt}
          onChange={(event) => {
            setCurrentActionAt(event.target.value);
            setSaved(false);
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save sales update"}
      </button>

      {firstContactedAt ? (
        <p className="text-xs text-emerald-700">
          First response recorded.
        </p>
      ) : null}

      {saved ? (
        <p className="text-xs text-emerald-700">
          Sales update saved.
        </p>
      ) : null}

      {error ? (
        <p className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
