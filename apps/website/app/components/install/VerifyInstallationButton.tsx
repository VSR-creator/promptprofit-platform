"use client";

import { useState } from "react";

interface Props {
  publicKey: string;
  websiteId: string;
}

export default function VerifyInstallationButton({ websiteId }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function verify() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/websites/${websiteId}/installation-status`,
      );

      const result = await response.json();

      if (!result.success) {
        setMessage("❌ Website not found.");
      } else if (result.installationStatus === "INSTALLED") {
        setMessage(`✅ Installed • ${result.totalEvents} events received`);
      } else {
        setMessage("⚠️ SDK not detected yet.");
      }
    } catch {
      setMessage("❌ Verification failed.");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <button
        onClick={verify}
        disabled={loading}
        className="rounded bg-green-600 px-6 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify Installation"}
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
