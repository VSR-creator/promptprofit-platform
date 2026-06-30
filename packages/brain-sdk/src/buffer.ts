import { BrainEvent } from "./index";

class EventBuffer {
  private buffer: BrainEvent[] = [];
  private maxSize = 10;
  private flushInterval = 5000;

  constructor() {
    if (typeof window !== "undefined") {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  add(event: BrainEvent) {
    this.buffer.push(event);

    if (this.buffer.length >= this.maxSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;

    const payload = [...this.buffer];
    this.buffer = [];

    console.log("[BrainSDK FLUSH]", payload);

    try {
      await fetch("/api/brain/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Event flush failed (dev safe)", err);
    }
  }
}

export const eventBuffer = new EventBuffer();
