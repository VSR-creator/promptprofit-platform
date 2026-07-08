import Link from "next/link";

type Props = {
  activationState: string;
};

export default function ActivationCard({
  activationState,
}: Props) {

  if (activationState === "LIVE") {
    return null;
  }

  const state = {
    PENDING: {
      title: "Install PromptProfit",
      description:
        "Your website has been created. Install the PromptProfit snippet to begin tracking visitors.",
      action: "Install SDK",
      href: "/dashboard/websites",
      colour: "border-violet-200 bg-violet-50",
    },

    SNIPPET_INSTALLED: {
      title: "Waiting for first visitor",
      description:
        "PromptProfit is connected. As soon as your first visitor arrives we'll activate your workspace automatically.",
      action: "View Website",
      href: "/dashboard/websites",
      colour: "border-amber-200 bg-amber-50",
    },

    TRACKING: {
      title: "Receiving visitor activity",
      description:
        "Great! Visitor events are arriving. The next milestone is capturing your first lead.",
      action: "Open Dashboard",
      href: "/dashboard",
      colour: "border-emerald-200 bg-emerald-50",
    },
  }[activationState] ?? {
      title: "Getting Started",
      description: "Complete setup to activate PromptProfit.",
      action: "Continue",
      href: "/dashboard/websites",
      colour: "border-slate-200 bg-white",
    };

  return (
    <section
      className={`mb-8 rounded-3xl border p-6 shadow-sm ${state.colour}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
            Activation
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {state.title}
          </h2>

          <p className="mt-2 max-w-2xl text-slate-600">
            {state.description}
          </p>
        </div>

        <Link
          href={state.href}
          className="inline-flex w-fit rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
        >
          {state.action}
        </Link>

      </div>
    </section>
  );
}
