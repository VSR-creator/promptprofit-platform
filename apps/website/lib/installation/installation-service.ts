import {
  InstallationMethod,
  InstallationSelection,
} from "./installation-types";

import { installationEngine } from "./installation-engine";

/**
 * PromptProfit Installation Service
 *
 * Coordinates installation operations.
 */
export class InstallationService {
  /**
   * Creates an installation selection.
   *
   * Persistence will be added later.
   */
  selectMethod(
    workspaceId: string,
    websiteId: string,
    method: InstallationMethod,
  ): InstallationSelection {
    return installationEngine.selectMethod(workspaceId, websiteId, method);
  }
}

/**
 * Shared singleton.
 */
export const installationService = new InstallationService();
