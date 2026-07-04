"use client";

import { useState } from "react";

type Props = {
leadId: string;
workspaceId: string;
disabled?: boolean;
};

export default function MarkContactedButton({
leadId,
workspaceId,
disabled = false,
}: Props) {
const [saving, setSaving] = useState(false);
const [done, setDone] = useState(disabled);
const [error, setError] = useState<string | null>(null);

async function markContacted() {
setSaving(true);
setError(null);


try {
  const response = await fetch(
    `/api/dashboard/leads/${leadId}/outcome`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        status: "contacted",
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error ?? "Unable to mark lead contacted");
  }

  setDone(true);
  window.location.reload();
} catch (caught) {
  setError(
    caught instanceof Error ? caught.message : "Unable to update lead",
  );
} finally {
  setSaving(false);
}


}

if (done) {
return ( <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
Contacted </span>
);
}

return ( <div> <button
     type="button"
     onClick={markContacted}
     disabled={saving}
     className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
   >
{saving ? "Saving…" : "Mark contacted"} </button>


  {error ? (
    <p className="mt-2 max-w-48 text-xs text-red-600">{error}</p>
  ) : null}
</div>


);
}
