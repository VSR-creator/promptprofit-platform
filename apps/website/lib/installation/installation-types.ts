/**
 * PromptProfit Installation Domain
 *
 * Defines how a customer chooses to install PromptProfit.
 */

/**
 * Supported installation methods.
 *
 * New methods can be added without changing the
 * Activation State Machine.
 */
export enum InstallationMethod {
  SELF = "self",
  AGENCY = "agency",
}

/**
 * Installation selection made by the customer.
 */
export interface InstallationSelection {
  workspaceId: string;
  websiteId: string;
  method: InstallationMethod;
}

/**
 * Installation status.
 */
export interface InstallationStatus {
  websiteId: string;
  method: InstallationMethod | null;

  selected: boolean;

  installed: boolean;

  verified: boolean;
}
