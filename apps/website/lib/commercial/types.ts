export type CommercialStatus =
  | "CREATED"
  | "INSTALLED"
  | "TRACKING"
  | "ACTIVE"
  | "LIVE"
  | "STALE";

export interface WebsiteHealth {
  score: number;

  sdkInstalled: boolean;

  receivingEvents: boolean;

  receivingSessions: boolean;

  decisionEngine: boolean;

  leadCapture: boolean;
}
