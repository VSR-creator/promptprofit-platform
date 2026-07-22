import { ActivationCommand } from "./activation-command";
import { ActivationFacts } from "./activation-facts";
import { activationEngine } from "./activation-engine";
import { InstallationMethod } from "../installation";

/**
 * Payload for activation commands.
 */
export interface ActivationCommandRequest {
  command: ActivationCommand;
  workspaceId: string;
  websiteId: string;
  facts: ActivationFacts;
  installationMethod?: InstallationMethod;
}

/**
 * Coordinates activation workflow.
 *
 * Business decisions remain inside
 * the Activation Engine.
 */
export class ActivationHandler {
  execute(request: ActivationCommandRequest) {
    switch (request.command) {
      case ActivationCommand.SELECT_INSTALLATION_METHOD:
      case ActivationCommand.VERIFY_INSTALLATION:
      case ActivationCommand.RECEIVE_FIRST_EVENT:
      case ActivationCommand.CONFIGURE_FLOW:
      case ActivationCommand.ENABLE_NOTIFICATIONS:
        return activationEngine.getSnapshot({
          workspaceId: request.workspaceId,
          websiteId: request.websiteId,
          facts: request.facts,
          installationMethod: request.installationMethod,
        });

      default:
        throw new Error("Unsupported activation command.");
    }
  }
}

/**
 * Shared singleton.
 */
export const activationHandler = new ActivationHandler();
