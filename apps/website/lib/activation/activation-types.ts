import { ActivationState } from "./activation-state";

/**
 * How the customer chose to install PromptProfit.
 */
export type InstallationMethod =
  | "self"
  | "agency"
  | "developer"
  | "hosting"
  | "other";

/**
 * Snapshot of a workspace's activation progress.
 * This is the object returned by the ActivationService.
 */
export interface ActivationSnapshot {
  workspaceId: string;

  websiteId: string;

  currentState: ActivationState;

  nextState: ActivationState | null;

  progress: number;

  completed: boolean;

  installationMethod?: InstallationMethod;
}
