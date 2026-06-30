import { buildPrompt, PromptContext } from "./promptBuilder";

/**
 * AI layer abstraction
 * (Swap this with OpenAI / local model later)
 */
export async function generateAIMessage(ctx: PromptContext): Promise<string> {
  const prompt = buildPrompt(ctx);

  // 🔥 MOCK AI RESPONSE (replace later with GPT API)
  console.log("[AI PROMPT]", prompt);

  if (ctx.intent === "hot") {
    return "You're ready — want help turning this into results today?";
  }

  if (ctx.intent === "warm") {
    return "You're close — want a faster way to get there?";
  }

  return "Want to see how you can improve your results faster?";
}
