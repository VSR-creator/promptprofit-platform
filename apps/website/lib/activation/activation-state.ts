/**
 * PromptProfit Activation Engine
 *
 * Canonical activation lifecycle.
 *
 * Every customer onboarding workflow,
 * API route, dashboard component,
 * and AI worker must use these states.
 */

export enum ActivationState {
  PILOT_PURCHASED = "pilot_purchased",

  WORKSPACE_CREATED = "workspace_created",

  WEBSITE_REGISTERED = "website_registered",

  INSTALLATION_SELECTED = "installation_selected",

  INSTALLER_ASSIGNED = "installer_assigned",

  SDK_INSTALLED = "sdk_installed",

  FIRST_EVENT_RECEIVED = "first_event_received",

  WEBSITE_ACTIVATED = "website_activated",

  FLOW_CONFIGURED = "flow_configured",

  NOTIFICATIONS_CONFIGURED = "notifications_configured",

  LIVE = "live",
}
