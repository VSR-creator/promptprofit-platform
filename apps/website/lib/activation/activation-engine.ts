import { getNextActivationState } from "./activation-machine";
import { getActivationProgress } from "./activation-progress";
import { ActivationState } from "./activation-state";
import { ActivationSnapshot, InstallationMethod } from "./activation-types";

/**
 * PromptProfit Activation Engine
 *
 * The core engine responsible  for customer activation.
 */
export class ActivationEngine {
  /**
   * Creates an activation snapshot.
   */
  getSnapshot(params: {
    workspaceId: string;
    websiteId: string;
    currentState: ActivationState;
    installationMethod?: InstallationMethod;
  }): ActivationSnapshot {
    const nextState = getNextActivationState(params.currentState);

    return {
      workspaceId: params.workspaceId,
      websiteId: params.websiteId,

      currentState: params.currentState,

      nextState,

      progress: getActivationProgress(params.currentState),

      completed: params.currentState === ActivationState.LIVE,

      installationMethod: params.installationMethod,
    };
  }

  /**
   * True when activation is complete.
   */
  isComplete(state: ActivationState): boolean {
    return state === ActivationState.LIVE;
  }

  /**
   * Returns the next activation state.
   */
  getNextState(state: ActivationState): ActivationState | null {
    return getNextActivationState(state);
  }

  /**
   * Returns activation progress.
   */
  getProgress(state: ActivationState): number {
    return getActivationProgress(state);
  }
}

/**
 * Shared singleton.
 */
export const activationEngine = new ActivationEngine();
