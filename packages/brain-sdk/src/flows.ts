import { IntentLevel } from "./intelligence";

export type FlowStepType = "message" | "question" | "cta";

export interface FlowStep {
  id: string;
  type: FlowStepType;
  content: string;
  next?: string;
}

export interface ConversionFlow {
  id: string;
  intent: IntentLevel;
  steps: Record<string, FlowStep>;
  startStep: string;
}
