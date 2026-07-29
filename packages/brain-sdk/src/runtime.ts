import { EventBuffer } from "./buffer";
import { getSession } from "./session";
import type { BrainEvent } from "./index";

export class RuntimeController {
  private static instance: RuntimeController | null = null;

  private eventBuffer: EventBuffer | null = null;
  private verified = false;
  private events: BrainEvent[] = [];

  private constructor() {}

  static getInstance(): RuntimeController {
    if (!RuntimeController.instance) {
      RuntimeController.instance = new RuntimeController();
    }

    return RuntimeController.instance;
  }

  getSession() {
    return getSession();
  }

  getEventBuffer() {
    return this.eventBuffer;
  }

  setEventBuffer(buffer: EventBuffer) {
    this.eventBuffer = buffer;
  }

  isVerified() {
    return this.verified;
  }

  setVerified(value: boolean) {
    this.verified = value;
  }

  pushEvent(event: BrainEvent) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}
