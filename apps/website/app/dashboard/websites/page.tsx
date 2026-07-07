import Link from "next/link";
import ConnectWebsiteForm from "./ConnectWebsiteForm";
import { getWorkspaceContext } from "@/lib/workspace/get-workspace-context";
import { getConnectedWebsites } from "@/lib/websites/get-connected-websites";

export const dynamic = "force-dynamic";

export default async function WebsitesPage() {
  const workspace = await getWorkspaceContext();
  const websites = await getConnectedWebsites(workspace.workspaceId);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-violet-700 hover:text-violet-900"
        >
          ← Dashboard
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
            PromptProfit installation
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Connect a client website
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Each connected website receives its own public key. That key lets
            PromptProfit identify incoming visitor activity without exposing
            workspace credentials.
          </p>
        </header>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-bold">Add a website</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use the root domain only. For example: physishealth.co.za.
          </p>
          <div className="mt-5">
            <ConnectWebsiteForm />
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                Connected properties
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Website keys and installation status
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {websites.length} connected
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {websites.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
                No websites connected yet.
              </div>
            ) : (
              websites.map((website) => {
                const snippet = `<script src="https://YOUR-PROMPTPROFIT-DOMAIN/brain.js" data-promptprofit-key="${website.publicKey}" defer></script>`;

                return (
                  <article
                    key={website.id}
                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{website.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {website.domain}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          website.firstEventAt
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {website.firstEventAt
                          ? "Receiving events"
                          : "Awaiting first event"}
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-800">
                        Public website key
                      </p>
                      <code className="mt-2 block overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-sm text-violet-200">
                        {website.publicKey}
                      </code>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-800">
                        Installation snippet
                      </p>
                      <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-emerald-200">
                        <code>{snippet}</code>
                      </pre>
                      <p className="mt-3 text-sm text-slate-600">
                        Add this before the closing &lt;/head&gt; tag on{" "}
                        {website.domain}.
                      </p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
