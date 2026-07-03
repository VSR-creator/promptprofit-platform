"use client";

import { FormEvent, useEffect, useState } from "react";

type FlowStep = {
  id?: string;
  type?: string;
  content?: string;
  question?: string;
};

type Screen = "question" | "capture" | "success";

export default function FlowPopup() {
  const [step, setStep] = useState<FlowStep | null>(null);
  const [screen, setScreen] = useState<Screen>("question");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const handleFlow = (event: Event) => {
      const customEvent = event as CustomEvent<FlowStep>;

      setStep(customEvent.detail ?? {});
      setScreen("question");
      setEmail("");
      setName("");
    };

    const handleClose = () => {
      setStep(null);
    };

    window.addEventListener("pp-flow", handleFlow);
    window.addEventListener("pp-flow-close", handleClose);

    return () => {
      window.removeEventListener("pp-flow", handleFlow);
      window.removeEventListener("pp-flow-close", handleClose);
    };
  }, []);

  if (!step) return null;

  const close = () => setStep(null);

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    window.dispatchEvent(
      new CustomEvent("pp-lead-captured", {
        detail: {
          name: name.trim(),
          email: email.trim(),
          source: "conversion-flow",
          flowId: step.id ?? "website-demo",
        },
      }),
    );

    setScreen("success");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="PromptProfit conversion assistant"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
        <div className="bg-slate-950 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                PromptProfit Intelligence
              </p>
              <p className="mt-1 text-sm text-slate-300">
                A faster route to your next conversion
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className="rounded-full px-2 py-1 text-xl leading-none text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {screen === "question" && (
            <>
              <p className="text-sm font-medium text-violet-600">
                You are in the right place.
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {step.question ??
                  step.content ??
                  "Want to see where your website may be losing ready-to-buy visitors?"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Get a focused conversion opportunity scan and a practical next
                step for turning more visits into enquiries.
              </p>

              <button
                type="button"
                onClick={() => setScreen("capture")}
                className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                Show me the opportunity scan
              </button>

              <button
                type="button"
                onClick={close}
                className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
              >
                Not right now
              </button>
            </>
          )}

          {screen === "capture" && (
            <>
              <p className="text-sm font-medium text-violet-600">
                Get your next best conversion move
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Where should we send your website opportunity scan?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                We will send a concise breakdown of the strongest conversion
                opportunities we can identify.
              </p>

              <form onSubmit={submitLead} className="mt-6 space-y-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    First name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Work email
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700"
                >
                  Send my conversion scan
                </button>
              </form>

              <button
                type="button"
                onClick={() => setScreen("question")}
                className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
              >
                Back
              </button>
            </>
          )}

          {screen === "success" && (
            <div className="py-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                ✓
              </div>

              <p className="mt-6 text-sm font-medium text-violet-600">
                Request received
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Your conversion opportunity scan is on its way.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                We will use your details to send the next best step for turning
                more website attention into revenue.
              </p>

              <button
                type="button"
                onClick={close}
                className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Continue exploring
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
