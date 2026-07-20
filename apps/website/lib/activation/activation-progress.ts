import { ActivationState } from "./activation-state";

/**
 * Progress percentage for each activation state.
 *
 * This is the ONLY place progress percentages
 * should ever be defined.
 */
export const ACTIVATION_PROGRESS: Record<ActivationState, number> = {
  [ActivationState.PILOT_PURCHASED]: 5,

  [ActivationState.WORKSPACE_CREATED]: 15,

  [ActivationState.WEBSITE_REGISTERED]: 25,

  [ActivationState.INSTALLATION_SELECTED]: 40,

  [ActivationState.INSTALLER_ASSIGNED]: 45,

  [ActivationState.SDK_INSTALLED]: 55,

  [ActivationState.FIRST_EVENT_RECEIVED]: 70,

  [ActivationState.WEBSITE_ACTIVATED]: 80,

  [ActivationState.FLOW_CONFIGURED]: 90,

  [ActivationState.NOTIFICATIONS_CONFIGURED]: 95,

  [ActivationState.LIVE]: 100,
};

/**
 * Returns the progress percentage for an activation state.
 */
export function getActivationProgress(state: ActivationState): number {
  return ACTIVATION_PROGRESS[state] ?? 0;
}
