"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectWebsiteForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to connect the website.");
      }

      const websiteId = payload?.website?.id;

      if (typeof websiteId !== "string" || !websiteId) {
        throw new Error("Website was created, but no installation link was returned.");
      }

      router.push(`/dashboard/websites/${websiteId}/install`);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to connect the website.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
      <label>
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Website name
        </span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Physis Health"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
        />
      </label>

      <label>
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Domain
        </span>
        <input
          required
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          placeholder="example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
        />
      </label>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating…" : "Continue to install"}
        </button>
      </div>

      {message ? (
        <p className="md:col-span-3 text-sm font-medium text-red-600">
          {message}
        </p>
      ) : null}
    </form>
  );
}
