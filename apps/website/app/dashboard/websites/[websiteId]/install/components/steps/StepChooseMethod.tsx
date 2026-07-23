import { ActivationSnapshot } from "@/lib/activation";

type Props = {
  snapshot: ActivationSnapshot;
};

export default function StepChooseMethod({ snapshot }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          How would you like to install PromptProfit?
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Choose the option that best matches how your website is managed. You
          can change this later if needed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <button className="rounded-2xl border p-8 text-left transition hover:border-violet-500 hover:shadow-lg">
          <h2 className="text-xl font-semibold">I'll install it myself</h2>

          <p className="mt-3 text-slate-600">
            I have access to my website or Google Tag Manager and can add the
            PromptProfit snippet myself.
          </p>

          <div className="mt-6 font-semibold text-violet-600">Continue →</div>
        </button>

        <button className="rounded-2xl border p-8 text-left transition hover:border-violet-500 hover:shadow-lg">
          <h2 className="text-xl font-semibold">
            My web agency will install it
          </h2>

          <p className="mt-3 text-slate-600">
            My website is managed by a developer, agency, or hosting provider.
            We'll generate everything they need.
          </p>

          <div className="mt-6 font-semibold text-violet-600">Continue →</div>
        </button>
      </div>
    </div>
  );
}
