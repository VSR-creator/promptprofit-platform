export type BrainEvent = {
  type: string;
  data?: Record<string, unknown>;
  clientTimestamp?: string;
};

type EventBufferOptions = {
  apiBase: string;
  siteKey: string;
  sessionId: string;
  visitorId?: string;
  flushIntervalMs?: number;
  maxBatchSize?: number;
};

export class EventBuffer {
  private queue: BrainEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isFlushing = false;

  private readonly apiBase: string;
  private readonly siteKey: string;
  private readonly sessionId: string;
  private readonly visitorId?: string;
  private readonly flushIntervalMs: number;
  private readonly maxBatchSize: number;

  constructor(options: EventBufferOptions) {
    this.apiBase = options.apiBase.replace(/\/$/, "");
    this.siteKey = options.siteKey;
    this.sessionId = options.sessionId;
    this.visitorId = options.visitorId;
    this.flushIntervalMs = options.flushIntervalMs ?? 3000;
    this.maxBatchSize = options.maxBatchSize ?? 20;

    this.flushTimer = setInterval(() => {
      void this.flush();
    }, this.flushIntervalMs);

    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", this.handlePageHide);
    }
  }

  push(event: BrainEvent) {
    this.queue.push({
      ...event,
      clientTimestamp: event.clientTimestamp ?? new Date().toISOString(),
    });

    if (this.queue.length >= this.maxBatchSize) {
      void this.flush();
    }
  }

  async flush(useBeacon = false): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) {
      return;
    }

    this.isFlushing = true;
    const events = this.queue.splice(0, this.maxBatchSize);

    const payload = {
      siteKey: this.siteKey,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      events,
    };

    console.log("[BrainSDK FLUSH]", events);

    try {
      const url = `${this.apiBase}/api/brain/events`;
      const body = JSON.stringify(payload);

      if (
        useBeacon &&
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function"
      ) {
        const sent = navigator.sendBeacon(
          url,
          new Blob([body], { type: "application/json" }),
        );

        if (!sent) {
          throw new Error("sendBeacon failed");
        }

        return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        keepalive: useBeacon,
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `Event request failed: ${response.status} ${responseText}`,
        );
      }

      const result = await response.json();

      if (typeof window !== "undefined" && result?.decision?.flow) {
        window.dispatchEvent(
          new CustomEvent("pp-flow", {
            detail: result.decision.flow,
          }),
        );
      }
    } catch (error) {
      console.error("[PromptProfit] Event delivery failed.", error);
      this.queue.unshift(...events);
    } finally {
      this.isFlushing = false;
    }
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    if (typeof window !== "undefined") {
      window.removeEventListener("pagehide", this.handlePageHide);
    }

    void this.flush(true);
  }

  private handlePageHide = () => {
    void this.flush(true);
  };
}
