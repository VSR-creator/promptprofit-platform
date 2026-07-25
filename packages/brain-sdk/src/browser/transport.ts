export interface BrainRequest {
  endpoint: string;
  payload: unknown;
}

export async function sendToBrain({ endpoint, payload }: BrainRequest) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Brain request failed (${response.status})`);
  }

  const result = await response.json();

  if (typeof window !== "undefined" && result?.decision?.flow) {
    window.dispatchEvent(
      new CustomEvent("pp-flow", {
        detail: result.decision.flow,
      }),
    );
  }

  return result;
}
