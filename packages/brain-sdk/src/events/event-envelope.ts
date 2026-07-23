import { BrainEventType } from "./event-types";

export interface BrainEventEnvelope {
  type: BrainEventType;

  occurredAt: string;

  sessionId: string;

  visitorId: string;

  page: string;

  metadata: Record<string, unknown>;
}
