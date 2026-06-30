import { generateAIMessage } from "./aiClient";
import { IntentLevel } from "./intelligence";

export interface CopyContext {
  intent: IntentLevel;
  score: number;
  path: string;
  eventCount: number;
}

/**
 * Now fully AI-driven (via adapter layer)
 */
export async function generateCopy(ctx: CopyContext): Promise<string> {
  return await generateAIMessage(ctx);
}
