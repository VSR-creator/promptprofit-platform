import { getSession } from "./session";
import { EventBuffer } from "./buffer";
import { verifyInstallation } from "./browser/verify";

declare global {
  interface Window {
    __PROMPTPROFIT_EVENT_BUFFER__?: EventBuffer;
  }
}
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
    if (typeof window === "undefined") {
      return null;
    }

    if (this.eventBuffer) {
      return this.eventBuffer;
    }

    if (window.__PROMPTPROFIT_EVENT_BUFFER__) {
      this.eventBuffer = window.__PROMPTPROFIT_EVENT_BUFFER__;
      return this.eventBuffer;
    }

    const session = getSession();

    const buffer = new EventBuffer({
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

    window.__PROMPTPROFIT_EVENT_BUFFER__ = buffer;
    this.eventBuffer = buffer;

    return buffer;
  }

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
  public trackPageView() {
    if (typeof window === "undefined") {
      return;
    }

    this.emit({
      id: crypto.randomUUID(),
      type: "page_view",
      timestamp: Date.now(),
      path: window.location.pathname,
      metadata: {
        title: document.title,
        url: window.location.href,
      },
    });
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

declare global {
  interface Window {
    __PROMPTPROFIT_BRAIN__?: EventBus;
  }
}

const runtime =
  typeof window === "undefined"
    ? new EventBus()
    : (window.__PROMPTPROFIT_BRAIN__ ??= new EventBus());

export const Brain = runtime;

export { getSession } from "./session";

export * from "./session-state";
