import { getSession } from "./session";
import { calculateIntent } from "./intelligence";
import { shouldTrigger } from "./triggers";
import { flowEngine } from "./flowEngine";
import { EventBuffer } from "./buffer";
import { verifyInstallation } from "./browser/verify";

export type EventType = "page_view" | "click" | "scroll" | "form_submit";

export interface BrainEvent {
  id: string;
  type: EventType;
  timestamp: number;
  path: string;
  sessionId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

class EventBus {
  private events: BrainEvent[] = [];
  private eventBuffer: EventBuffer | null = null;
  private verified = false;

  private getEventBuffer(): EventBuffer | null {
    if (typeof window === "undefined") return null;

    if (this.eventBuffer) {
      return this.eventBuffer;
    }

    const session = getSession();

    this.eventBuffer = new EventBuffer({
      apiBase:
        process.env.NEXT_PUBLIC_PROMPTPROFIT_API_BASE ?? window.location.origin,
      siteKey:
        process.env.NEXT_PUBLIC_PROMPTPROFIT_SITE_KEY ??
        "f5630a25b93446bda951fb78e818e753",
      sessionId: session.sessionId,
      visitorId: session.userId,
      flushIntervalMs: 3000,
      maxBatchSize: 20,
    });

    return this.eventBuffer;
  }

  /**
   * Verifies the SDK installation once per page load.
   */
  private async verifySdk() {
    if (this.verified) {
      return;
    }

    this.verified = true;

    if (typeof window === "undefined") {
      return;
    }

    try {
      await verifyInstallation({
        publicKey:
          process.env.NEXT_PUBLIC_PROMPTPROFIT_SITE_KEY ??
          "f5630a25b93446bda951fb78e818e753",
        sdkVersion: "1.0.0",
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error("[PromptProfit] SDK verification failed", error);
    }
  }

  emit(event: BrainEvent) {
    const session = getSession();

    const enriched: BrainEvent = {
      ...event,
      sessionId: session.sessionId,
      userId: session.userId,
    };

    void this.verifySdk();

    this.events.push(enriched);

    this.getEventBuffer()?.push({
      type: enriched.type,
      data: {
        id: enriched.id,
        path: enriched.path,
        timestamp: enriched.timestamp,
        sessionId: enriched.sessionId,
        userId: enriched.userId,
        metadata: enriched.metadata ?? {},
      },
      clientTimestamp: new Date(enriched.timestamp).toISOString(),
    });

    const state = calculateIntent(this.events);
    console.log("[Brain INTELLIGENCE]", state);

    const trigger = shouldTrigger(state);

    if (trigger) {
      const flow = flowEngine.start(state.intent);

      if (flow && typeof window !== "undefined") {
        console.log("[FLOW STARTED]", flow.step);

        window.dispatchEvent(
          new CustomEvent("pp-flow", {
            detail: flow.step,
          }),
        );
      }
    }
  }

  getEvents() {
    return this.events;
  }

  destroy() {
    this.eventBuffer?.destroy();
    this.eventBuffer = null;
    this.events = [];
  }
}

export const Brain = new EventBus();

export { getSession } from "./session";
