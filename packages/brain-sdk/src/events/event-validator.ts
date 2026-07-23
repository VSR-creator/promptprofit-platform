import { BrainEventEnvelope } from "./event-envelope";

export function validateEvent(event: BrainEventEnvelope): boolean {
  return (
    event.type !== undefined &&
    event.sessionId.length > 0 &&
    event.visitorId.length > 0 &&
    event.page.length > 0
  );
}
