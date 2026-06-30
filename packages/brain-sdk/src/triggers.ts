import { IntentLevel } from "./intelligence";

export type TriggerEvent = {
  intent: IntentLevel;
  score: number;
};

export function shouldTrigger(event: TriggerEvent): boolean {
  // Simple MVP rules (we refine later)
  if (event.intent === "hot") return true;

  if (event.intent === "warm" && event.score > 10) return true;

  return false;
}
