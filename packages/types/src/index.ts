export type EventType = "page_view" | "click" | "scroll" | "form_submit";

export interface WebsiteEvent {
  id: string;
  type: EventType;
  timestamp: number;
  page: string;
}
