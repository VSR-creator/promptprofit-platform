import { ActivationState } from "./activation-state";

/**
 * Canonical activation lifecycle.
 *
 * This file defines the ONLY valid progression
 * through customer activation.
 */

export const ACTIVATION_TRANSITIONS: Record<
  ActivationState,
  ActivationState | null
> = {
  [ActivationState.PILOT_PURCHASED]: ActivationState.WORKSPACE_CREATED,

  [ActivationState.WORKSPACE_CREATED]: ActivationState.WEBSITE_REGISTERED,

  [ActivationState.WEBSITE_REGISTERED]: ActivationState.INSTALLATION_SELECTED,

  [ActivationState.INSTALLATION_SELECTED]: ActivationState.INSTALLER_ASSIGNED,

  [ActivationState.INSTALLER_ASSIGNED]: ActivationState.SDK_INSTALLED,

  [ActivationState.SDK_INSTALLED]: ActivationState.FIRST_EVENT_RECEIVED,

  [ActivationState.FIRST_EVENT_RECEIVED]: ActivationState.WEBSITE_ACTIVATED,

  [ActivationState.WEBSITE_ACTIVATED]: ActivationState.FLOW_CONFIGURED,

  [ActivationState.FLOW_CONFIGURED]: ActivationState.NOTIFICATIONS_CONFIGURED,

  [ActivationState.NOTIFICATIONS_CONFIGURED]: ActivationState.LIVE,

  [ActivationState.LIVE]: null,
};

/**
 * Returns the next valid activation state.
 */
export function getNextActivationState(
  state: ActivationState,
): ActivationState | null {
  return ACTIVATION_TRANSITIONS[state];
}
