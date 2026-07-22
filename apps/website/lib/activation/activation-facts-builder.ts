import { ActivationFacts } from "./activation-facts";

export interface ActivationFactsInput {
  workspaceExists: boolean;

  websiteExists: boolean;

  installationSelected: boolean;

  installerAssigned: boolean;

  sdkInstalled: boolean;

  firstEventReceived: boolean;

  flowConfigured: boolean;

  notificationsConfigured: boolean;
}

export function buildActivationFacts(
  input: ActivationFactsInput,
): ActivationFacts {
  return {
    workspaceExists: input.workspaceExists,
    websiteRegistered: input.websiteExists,
    installationSelected: input.installationSelected,
    installerAssigned: input.installerAssigned,
    sdkInstalled: input.sdkInstalled,
    firstEventReceived: input.firstEventReceived,
    flowConfigured: input.flowConfigured,
    notificationsConfigured: input.notificationsConfigured,
  };
}
