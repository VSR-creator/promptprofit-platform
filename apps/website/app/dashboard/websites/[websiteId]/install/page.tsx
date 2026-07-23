import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import InstallationWizard from "./components/InstallationWizard";
import CopySnippetButton from "./CopySnippetButton";
import ActivationStatus from "./ActivationStatus";
type Props = {
  params: Promise<{ websiteId: string }>;
};

export const dynamic = "force-dynamic";

export default async function InstallWebsitePage({ params }: Props) {
  const { websiteId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: website, error } = await supabase
    .from("websites")
    .select("id, name, domain, public_key, activation_state")
    .eq("id", websiteId)
    .maybeSingle();

  if (error || !website) {
    notFound();
  }

  const snippet = `<script
  src="https://cdn.promptprofit.ai/sdk.js"
  data-key="${website.public_key}"
  defer
></script>`;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/websites"
          className="text-sm font-semibold text-violet-700 hover:text-violet-900"
        >
          ← Websites
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
            PromptProfit activation
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Install PromptProfit on {website.name}
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Copy this snippet and paste it just before the closing{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
              &lt;/body&gt;
            </code>{" "}
            tag on {website.domain}. Your connection activates automatically
            when PromptProfit receives its first visitor event.
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-800">
              Step 1 — Copy your website snippet
            </p>

            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-100">
              <code>{snippet}</code>
            </pre>

            <CopySnippetButton snippet={snippet} />
          </div>

          <ActivationStatus
            websiteId={website.id}
            initialState={website.activation_state}
          />

          <Link
            href="/dashboard"
            className="mt-8 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Return to dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
