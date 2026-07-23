import { installationEngine } from "./installation-engine";
import { installationRepository } from "./installation-repository";
import {
  InstallationMethod,
  InstallationSelection,
} from "./installation-types";

/**
 * PromptProfit Installation Service
 *
 * Coordinates installation operations.
 */
export class InstallationService {
  /**
   * Selects an installation method.
   */
  async selectMethod(
    workspaceId: string,
    websiteId: string,
    method: InstallationMethod,
  ): Promise<InstallationSelection> {
    const selection = installationEngine.selectMethod(
      workspaceId,
      websiteId,
      method,
    );

    await installationRepository.save({
      workspaceId,
      websiteId,
      installationMethod: method,
    });

    return selection;
  }
}

/**
 * Shared singleton.
 */
export const installationService = new InstallationService();
