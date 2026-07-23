import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SaveEventRequest {
  websiteId: string;
  sessionId: string;
  eventType:
    | "page_view"
    | "scroll"
    | "click"
    | "exit_intent"
    | "flow_shown"
    | "flow_dismissed"
    | "lead_submitted";
  eventData: Record<string, unknown>;
  clientTimestamp: string;
}

export class EventRepository {
  async save(request: SaveEventRequest) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("pp_events").insert({
      website_id: request.websiteId,
      session_id: request.sessionId,
      event_type: request.eventType,
      event_data: request.eventData,
      client_timestamp: request.clientTimestamp,
    });

    if (error) {
      throw error;
    }
  }
}

export const eventRepository = new EventRepository();
