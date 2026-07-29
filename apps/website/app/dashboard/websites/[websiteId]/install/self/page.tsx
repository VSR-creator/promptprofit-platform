import { supabaseAdmin } from "@/lib/supabase/admin";
import CopyButton from "@/app/components/install/CopyButton";
import VerifyInstallationButton from "@/app/components/install/VerifyInstallationButton";

interface SelfInstallPageProps {
  params: Promise<{
    websiteId: string;
  }>;
}

export default async function SelfInstallPage({
  params,
}: SelfInstallPageProps) {
  const { websiteId } = await params;

  const { data: website } = await supabaseAdmin
    .from("websites")
    .select("*")
    .eq("id", websiteId)
    .single();

  const sdkSnippet = `<script
  src="https://cdn.promptprofit.ai/sdk.js"
  data-site-key="${website?.public_key}">
</script>`;

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Self Installation</h1>

        <p className="mt-2 text-gray-600">
          Install PromptProfit on your website in less than five minutes.
        </p>

        <div className="mt-4 space-y-1">
          <p className="text-sm text-gray-500">Website: {website?.name}</p>

          <p className="text-sm text-gray-500">Domain: {website?.domain}</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="font-semibold">Installation Progress</p>

        <p className="text-sm text-gray-600">Step 1 of 5</p>

        <div className="mt-3 h-2 rounded bg-gray-200">
          <div className="h-2 w-1/5 rounded bg-blue-600" />
        </div>
      </div>

      <section className="space-y-4 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Step 1 — Copy your Site Key</h2>

        <code className="block rounded bg-gray-100 p-3">
          {website?.public_key}
        </code>

        <CopyButton value={website?.public_key ?? ""} />
      </section>

      <section className="space-y-4 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Step 2 — Copy SDK Script</h2>

        <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
          {sdkSnippet}
        </pre>

        <CopyButton value={sdkSnippet} />
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
          Step 3 — Paste Before &lt;/body&gt;
        </h2>

        <p className="mt-3 text-gray-600">
          Paste the SDK immediately before the closing {"</body>"} tag on every
          page.
        </p>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Step 4 — Publish Your Website</h2>

        <p className="mt-3 text-gray-600">
          Save your changes and publish your website.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Step 5 — Verify Installation</h2>

        <VerifyInstallationButton
          publicKey={website?.public_key ?? ""}
          websiteId={website.id}
        />
      </section>
    </main>
  );
}
