import { ConversionFlow } from "./flows";

export const defaultFlows: ConversionFlow[] = [
  {
    id: "hot-lead-flow",
    intent: "hot",
    startStep: "step1",
    steps: {
      step1: {
        id: "step1",
        type: "message",
        content: "Looks like you're serious about results.",
      },
      step2: {
        id: "step2",
        type: "question",
        content: "Do you want a faster way to get there?",
        next: "step3",
      },
      step3: {
        id: "step3",
        type: "cta",
        content: "Let’s build your strategy. Click to continue.",
      },
    },
  },
];
