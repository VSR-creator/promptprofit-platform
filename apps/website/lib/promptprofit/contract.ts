export const PROMPTPROFIT_EVENT_TYPES = [
"page_view",
"scroll",
"click",
"exit_intent",
"flow_shown",
"flow_dismissed",
"lead_submitted",
] as const;

export type PromptProfitEventType =
(typeof PROMPTPROFIT_EVENT_TYPES)[number];

export type PromptProfitDecision = {
decisionType: "show_flow";
flowId: string;
payload: {
title: string;
body: string;
ctaLabel: string;
dismissLabel: string;
};
};

export type PromptProfitEventResponse = {
ok: true;
intentScore: number;
decision: PromptProfitDecision | null;
};

export type PromptProfitConfigResponse = {
ok: true;
website: {
id: string;
domain: string;
};
config: {
enabled: boolean;
eventBatchLimit: number;
flushIntervalMs: number;
};
};
