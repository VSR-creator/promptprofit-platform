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

  return response.json();
}
