import { eventRepository, SaveEventRequest } from "./event-repository";

export class EventService {
  /**
   * Records a browser event.
   */
  async recordEvent(request: SaveEventRequest): Promise<void> {
    // Future business rules live here.
    // Validation
    // AI enrichment
    // Activation
    // Decision engine

    await eventRepository.save(request);
  }
}

/**
 * Shared singleton.
 */
export const eventService = new EventService();
