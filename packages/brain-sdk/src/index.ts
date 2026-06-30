import { getSession } from "./session";
import { eventBuffer } from "./buffer";
import { calculateIntent } from "./intelligence";
import { shouldTrigger } from "./triggers";
import { flowEngine } from "./flowEngine";

export type EventType = "page_view" | "click" | "scroll" | "form_submit";

export interface BrainEvent {
  id: string;
  type: EventType;
  timestamp: number;
  path: string;
  sessionId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class EventBus {
  private events: BrainEvent[] = [];

  emit(event: BrainEvent) {
    const session = getSession();

    const enriched: BrainEvent = {
      ...event,
      sessionId: session.sessionId,
      userId: session.userId,
    };

    this.events.push(enriched);
    eventBuffer.add(enriched);

    const state = calculateIntent(this.events);

    console.log("[Brain INTELLIGENCE]", state);

    const trigger = shouldTrigger(state);

    if (trigger) {
      const flow = flowEngine.start(state.intent);

      if (flow) {
        console.log("[FLOW STARTED]", flow.step);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("pp-flow", {
              detail: flow.step,
            }),
          );
        }
      }
    }
  }

  getEvents() {
    return this.events;
  }
}

export const Brain = new EventBus();
