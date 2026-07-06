import Link from "next/link";
import { notFound } from "next/navigation";
import { classifyDiagnostic } from "@/lib/diagnostic-classifier";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ThankYouPageProps = {
  searchParams: Promise<{ diagnosticId?: string }>;
};

export default async function ThankYouPage({
  searchParams,
}: ThankYouPageProps) {
  const { diagnosticId } = await searchParams;

  if (!diagnosticId) {
    notFound();
  }

  const { data: diagnostic } = await supabaseAdmin
    .from("launch_diagnostics")
    .select(
      "id, business_type, website_or_instagram, main_offer, desired_action, biggest_issue",
    )
    .eq("id", diagnosticId)
    .maybeSingle();

  if (!diagnostic) {
    notFound();
  }

  const result = classifyDiagnostic({
    businessType: diagnostic.business_type,
    websiteOrInstagram: diagnostic.website_or_instagram,
    mainOffer: diagnostic.main_offer,
    desiredAction: diagnostic.desired_action,
    biggestIssue: diagnostic.biggest_issue,
  });

  return (
    <main className="diagnostic-page">
      <div className="container diagnostic-shell success-shell">
        <div className="eyebrow">DIAGNOSTIC RESULT</div>

        <p className="result-label">{result.eyebrow}</p>
        <h1>{result.title}</h1>
        <p>{result.summary}</p>

        <section className="result-card">
          <h2>What this suggests</h2>
          <p>{result.likelyLeak}</p>

          <h3>Your first checks</h3>
          <ul>
            {result.whatToCheck.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="result-card result-card-accent">
          <div className="eyebrow">THE NEXT USEFUL STEP</div>
          <h2>Confirm the leak before rebuilding anything.</h2>
          <p>{result.auditBridge}</p>
          <p>
            The launch-batch Profit Leak Audit is currently available at the
            regional price shown at checkout.
          </p>

          <Link className="button button-primary" href="/profit-leak-audit">
            Review the Profit Leak Audit
          </Link>
        </section>

        <Link className="text-link" href="/">
          Return to PromptProfit
        </Link>
      </div>
    </main>
  );
}
