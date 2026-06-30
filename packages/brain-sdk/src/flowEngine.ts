import { defaultFlows } from "./defaultFlows";
import { IntentLevel } from "./intelligence";
import { generateCopy } from "./copyEngine";

class FlowEngine {
  private activeStep: string | null = null;

  start(intent: IntentLevel) {
    const flow = defaultFlows.find((f) => f.intent === intent);

    if (!flow) return null;

    this.activeStep = flow.startStep;

    const rawStep = flow.steps[this.activeStep];

    const enrichedStep = {
      ...rawStep,
      content: "Loading AI response...", // placeholder for async upgrade
    };

    return {
      flow,
      step: enrichedStep,
    };
  }

  next(flowId: string, currentStepId: string) {
    const flow = defaultFlows.find((f) => f.id === flowId);

    if (!flow) return null;

    const step = flow.steps[currentStepId];

    if (!step?.next) return null;

    this.activeStep = step.next;

    const nextRawStep = flow.steps[this.activeStep];

    const enrichedStep = {
      ...nextRawStep,
      content: generateCopy({
        intent: flow.intent,
        score: 0,
        path: "",
        eventCount: 0,
      }),
    };

    return {
      flow,
      step: enrichedStep,
    };
  }
}

export const flowEngine = new FlowEngine();
