/**
 * Observable facts about a customer's onboarding.
 *
 * These are facts only.
 * The ActivationEngine infers the activation state from them.
 */
export interface ActivationFacts {
  workspaceExists: boolean;

  websiteRegistered: boolean;

  installationSelected: boolean;

  installerAssigned: boolean;

  sdkInstalled: boolean;

  firstEventReceived: boolean;

  flowConfigured: boolean;

  notificationsConfigured: boolean;
}
