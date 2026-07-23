"use server";

import { ActivationCommand } from "@/lib/activation/activation-command";
import { activationHandler } from "@/lib/activation/activation-handler";
import { ActivationFacts } from "@/lib/activation/activation-facts";
import { InstallationMethod } from "@/lib/installation";

/**
 * Customer selects an installation method.
 */
export async function selectInstallationMethod(
  workspaceId: string,
  websiteId: string,
  method: InstallationMethod,
) {
  const facts: ActivationFacts = {
    workspaceExists: true,
    websiteRegistered: true,
    installationSelected: true,
    installerAssigned: false,
    sdkInstalled: false,
    firstEventReceived: false,
    flowConfigured: false,
    notificationsConfigured: false,
  };

  return activationHandler.execute({
    command: ActivationCommand.SELECT_INSTALLATION_METHOD,
    workspaceId,
    websiteId,
    facts,
    installationMethod: method,
  });
}
