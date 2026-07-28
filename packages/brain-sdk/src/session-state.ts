export enum SessionState {
  NEW = "NEW",

  VERIFIED = "VERIFIED",

  COLLECTING_EVENTS = "COLLECTING_EVENTS",

  INTENT_EVALUATED = "INTENT_EVALUATED",

  DECISION_CREATED = "DECISION_CREATED",

  POPUP_DISPLAYED = "POPUP_DISPLAYED",

  LEAD_CAPTURED = "LEAD_CAPTURED",

  OUTCOME_RECORDED = "OUTCOME_RECORDED",

  COMPLETED = "COMPLETED",
}

export const SESSION_STATE_ORDER: SessionState[] = [
  SessionState.NEW,
  SessionState.VERIFIED,
  SessionState.COLLECTING_EVENTS,
  SessionState.INTENT_EVALUATED,
  SessionState.DECISION_CREATED,
  SessionState.POPUP_DISPLAYED,
  SessionState.LEAD_CAPTURED,
  SessionState.OUTCOME_RECORDED,
  SessionState.COMPLETED,
];

export function hasReachedState(
  current: SessionState,
  target: SessionState,
): boolean {
  return (
    SESSION_STATE_ORDER.indexOf(current) >= SESSION_STATE_ORDER.indexOf(target)
  );
}
