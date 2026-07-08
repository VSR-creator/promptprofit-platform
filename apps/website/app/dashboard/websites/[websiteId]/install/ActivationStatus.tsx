"use client";

import { useEffect, useState } from "react";

type Props = {
  websiteId: string;
  initialState: string | null;
};

type ActivationResponse = {
  website?: {
    activationState?: string | null;
    activatedAt?: string | null;
    firstEventAt?: string | null;
  };
};

export default function ActivationStatus({
  websiteId,
  initialState,
}: Props) {
  const [state, setState] = useState(initialState ?? "PENDING");
  const [firstEventAt, setFirstEventAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      try {
        const response = await fetch(
          `/api/websites/${websiteId}/activation`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ActivationResponse;

        if (cancelled || !payload.website) {
          return;
        }

        setState(payload.website.activationState ?? "PENDING");
        setFirstEventAt(payload.website.firstEventAt ?? null);
      } catch {
        // Keep the last known state and retry on the next interval.
      }
    }

    void checkStatus();

    const interval = window.setInterval(checkStatus, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [websiteId]);

  const isLive =
    state === "TRACKING" ||
    state === "ACTIVE" ||
    state === "ACTIVATED" ||
    Boolean(firstEventAt);

  if (isLive) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-950">
          PromptProfit is live
        </p>
        <p className="mt-1 text-sm leading-6 text-emerald-800">
          Your website is sending visitor activity. The conversion command
          center is now ready to capture and route demand.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <p className="font-semibold text-amber-950">
        Waiting for your first visitor
      </p>
      <p className="mt-1 text-sm leading-6 text-amber-800">
        Paste the snippet, publish your website, then open the site in a new
        tab. This page checks automatically every few seconds.
      </p>
    </div>
  );
}
