import { BrainEvent } from "./index";

export type IntentLevel = "cold" | "warm" | "hot";

export interface SessionState {
  score: number;
  intent: IntentLevel;
}

/**
 * Simple heuristic scoring engine (MVP version)
 */
export function calculateIntent(events: BrainEvent[]): SessionState {
  let score = 0;

  for (const event of events) {
    switch (event.type) {
      case "page_view":
        score += 1;
        break;

      case "scroll":
        score += 2;
        break;

      case "click":
        score += 3;
        break;

      case "form_submit":
        score += 10;
        break;
    }

    // Time-based weighting (recent actions matter more)
    const age = Date.now() - event.timestamp;
    if (age < 10000) score += 1;
  }

  let intent: IntentLevel = "cold";

  if (score > 15) intent = "hot";
  else if (score > 7) intent = "warm";

  return { score, intent };
}
