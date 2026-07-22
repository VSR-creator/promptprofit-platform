import {
  InstallationMethod,
  InstallationSelection,
  InstallationStatus,
} from "./installation-types";

/**
 * PromptProfit Installation Engine
 *
 * Pure domain logic for installation.
 */
export class InstallationEngine {
  /**
   * Creates a new installation selection.
   */
  selectMethod(
    workspaceId: string,
    websiteId: string,
    method: InstallationMethod,
  ): InstallationSelection {
    return {
      workspaceId,
      websiteId,
      method,
    };
  }

  /**
   * Creates the current installation status.
   */
  getStatus(params: {
    websiteId: string;
    method: InstallationMethod | null;
    installed: boolean;
    verified: boolean;
  }): InstallationStatus {
    return {
      websiteId: params.websiteId,

      method: params.method,

      selected: params.method !== null,

      installed: params.installed,

      verified: params.verified,
    };
  }

  /**
   * Returns true once the customer
   * has selected an installation method.
   */
  hasSelectedMethod(method: InstallationMethod | null): boolean {
    return method !== null;
  }

  /**
   * Returns true once PromptProfit
   * has been verified on the website.
   */
  isComplete(status: InstallationStatus): boolean {
    return status.verified;
  }
}

/**
 * Shared singleton.
 */
export const installationEngine = new InstallationEngine();
