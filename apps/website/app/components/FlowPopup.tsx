"use client";

import { useEffect, useState } from "react";

export default function FlowPopup() {
  const [step, setStep] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setStep(e.detail);
    };

    window.addEventListener("pp-flow", handler);

    return () => {
      window.removeEventListener("pp-flow", handler);
    };
  }, []);

  if (!step) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-xl w-80 shadow-lg">
      <p className="mb-3">{step.content}</p>

      {step.type === "cta" && (
        <button className="bg-white text-black px-3 py-1 rounded">
          Continue
        </button>
      )}
    </div>
  );
}
