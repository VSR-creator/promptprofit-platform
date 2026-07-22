import { ActivationFacts } from "./activation-facts";
import { getNextActivationState } from "./activation-machine";
import { getActivationProgress } from "./activation-progress";
import { ActivationState } from "./activation-state";
import { ActivationUI } from "./activation-ui";
import { ActivationSnapshot, InstallationMethod } from "./activation-types";

/**
 * PromptProfit Activation Engine
 *
 * The single source of truth for customer activation.
 */
export class ActivationEngine {
  /**
   * Detect the customer's activation state from observable facts.
   */
  detectState(facts: ActivationFacts): ActivationState {
    if (!facts.workspaceExists) {
      throw new Error("Workspace must exist before activation can begin.");
    }

    if (!facts.websiteRegistered) {
      return ActivationState.WORKSPACE_CREATED;
    }

    if (!facts.installationSelected) {
      return ActivationState.WEBSITE_REGISTERED;
    }

    if (!facts.installerAssigned) {
      return ActivationState.INSTALLATION_SELECTED;
    }

    if (!facts.sdkInstalled) {
      return ActivationState.INSTALLER_ASSIGNED;
    }

    if (!facts.firstEventReceived) {
      return ActivationState.SDK_INSTALLED;
    }

    if (!facts.flowConfigured) {
      return ActivationState.WEBSITE_ACTIVATED;
    }

    if (!facts.notificationsConfigured) {
      return ActivationState.FLOW_CONFIGURED;
    }

    return ActivationState.LIVE;
  }

  /**
   * Creates a complete activation snapshot.
   */
  getSnapshot(params: {
    workspaceId: string;
    websiteId: string;
    facts: ActivationFacts;
    installationMethod?: InstallationMethod;
  }): ActivationSnapshot {
    const currentState = this.detectState(params.facts);

    return {
      workspaceId: params.workspaceId,
      websiteId: params.websiteId,

      currentState,

      nextState: getNextActivationState(currentState),

      progress: getActivationProgress(currentState),

      completed: currentState === ActivationState.LIVE,

      installationMethod: params.installationMethod,
    };
  }

  /**
   * Returns true when activation is complete.
   */
  isComplete(facts: ActivationFacts): boolean {
    return this.detectState(facts) === ActivationState.LIVE;
  }

  /**
   * Returns the next activation state.
   */
  getNextState(facts: ActivationFacts): ActivationState | null {
    return getNextActivationState(this.detectState(facts));
  }

  /**
   * Returns activation progress.
   */
  getProgress(facts: ActivationFacts): number {
    return getActivationProgress(this.detectState(facts));
  }

  /**
   * Returns UI configuration for the current activation state.
   */
  getUI(facts: ActivationFacts): ActivationUI {
    switch (this.detectState(facts)) {
      case ActivationState.WORKSPACE_CREATED:
        return {
          title: "Register your website",
          description: "Add your first website to begin onboarding.",
          action: "Add Website",
          href: "/dashboard/websites",
          colour: "border-violet-200 bg-violet-50",
        };

      case ActivationState.WEBSITE_REGISTERED:
        return {
          title: "Choose installation method",
          description: "Choose how PromptProfit will be installed.",
          action: "Continue Setup",
          href: "/dashboard/websites",
          colour: "border-violet-200 bg-violet-50",
        };

      case ActivationState.INSTALLATION_SELECTED:
        return {
          title: "Install PromptProfit",
          description:
            "Install the PromptProfit snippet to begin tracking visitors.",
          action: "Install SDK",
          href: "/dashboard/websites",
          colour: "border-violet-200 bg-violet-50",
        };

      case ActivationState.SDK_INSTALLED:
        return {
          title: "Waiting for first visitor",
          description:
            "PromptProfit will activate automatically after the first visitor arrives.",
          action: "View Website",
          href: "/dashboard/websites",
          colour: "border-amber-200 bg-amber-50",
        };

      case ActivationState.WEBSITE_ACTIVATED:
        return {
          title: "Configure your first flow",
          description: "Create your first PromptProfit conversion flow.",
          action: "Configure Flow",
          href: "/dashboard",
          colour: "border-emerald-200 bg-emerald-50",
        };

      case ActivationState.FLOW_CONFIGURED:
        return {
          title: "Enable notifications",
          description: "Choose where PromptProfit should send new leads.",
          action: "Configure Notifications",
          href: "/dashboard/settings",
          colour: "border-emerald-200 bg-emerald-50",
        };

      case ActivationState.LIVE:
        return {
          title: "",
          description: "",
          action: "",
          href: "",
          colour: "",
        };

      default:
        return {
          title: "Getting Started",
          description: "Complete setup to activate PromptProfit.",
          action: "Continue",
          href: "/dashboard/websites",
          colour: "border-slate-200 bg-white",
        };
    }
  }
}

/**
 * Shared singleton.
 */
export const activationEngine = new ActivationEngine();
