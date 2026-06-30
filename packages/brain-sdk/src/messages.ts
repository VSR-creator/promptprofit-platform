import { IntentLevel } from "./intelligence";

export function getMessage(intent: IntentLevel): string {
  switch (intent) {
    case "hot":
      return "Looks like you're ready. Want help turning this into results?";
    case "warm":
      return "You’re exploring — want a faster path to what you're looking for?";
    case "cold":
    default:
      return "Hey 👋 want help finding what you need faster?";
  }
}
