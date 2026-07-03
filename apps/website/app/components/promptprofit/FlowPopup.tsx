"use client";

import { FormEvent, useEffect, useState } from "react";

type FlowStep = {
  id: string;
  type: "message" | "lead_capture";
  message: string;
};

type PromptProfitDecision = {
  decisionType: "none" | "show_flow";
  flowId: string | null;
  reason?: string;
  confidence?: number;
  flow?: {
    id: string;
    currentStepIndex: number;
    steps: FlowStep[];
  } | null;
};

export default function FlowPopup() {
  const [decision, setDecision] = useState<PromptProfitDecision | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    function handleDecision(event: Event) {
      const customEvent = event as CustomEvent<PromptProfitDecision>;
      const nextDecision = customEvent.detail;

      console.log("[PromptProfit FlowPopup received decision]", nextDecision);

      if (
        nextDecision?.decisionType === "show_flow" &&
        nextDecision.flowId === "warm-visitor-lead-capture-v1" &&
        nextDecision.flow
      ) {
        setDecision(nextDecision);
        setStepIndex(nextDecision.flow.currentStepIndex ?? 0);
        setDismissed(false);
        setSubmitted(false);
      }
    }

    window.addEventListener("pp-decision", handleDecision);

    return () => {
      window.removeEventListener("pp-decision", handleDecision);
    };
  }, []);

  if (!decision?.flow || dismissed) {
    return null;
  }

  const currentStep = decision.flow.steps[stepIndex];

  if (!currentStep) {
    return null;
  }

  function closePopup() {
    setDismissed(true);
  }

  function nextStep() {
    const isLastStep = stepIndex >= decision.flow!.steps.length - 1;

    if (isLastStep) {
      closePopup();
      return;
    }

    setStepIndex((current) => current + 1);
  }

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-[2147483647] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promptprofit-flow-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 rounded-full px-2 py-1 text-xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close popup"
        >
          ×
        </button>

        {!submitted && currentStep.type === "message" && (
          <>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              PromptProfit
            </p>

            <h2
              id="promptprofit-flow-title"
              className="pr-8 text-2xl font-bold tracking-tight text-slate-950"
            >
              {currentStep.message}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              See how intelligent visitor engagement can help your website
              convert more of the people already arriving.
            </p>

            <button
              type="button"
              onClick={nextStep}
              className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Show me how it works
            </button>
          </>
        )}

        {!submitted && currentStep.type === "lead_capture" && (
          <>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              PromptProfit
            </p>

            <h2
              id="promptprofit-flow-title"
              className="pr-8 text-2xl font-bold tracking-tight text-slate-950"
            >
              {currentStep.message}
            </h2>

            <form onSubmit={handleLeadSubmit} className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Work email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Request a conversion walkthrough
              </button>
            </form>
          </>
        )}

        {submitted && (
          <>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Request received
            </p>

            <h2
              id="promptprofit-flow-title"
              className="pr-8 text-2xl font-bold tracking-tight text-slate-950"
            >
              Thank you — we will be in touch.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              We will use your details to arrange a PromptProfit conversion
              walkthrough.
            </p>

            <button
              type="button"
              onClick={closePopup}
              className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
