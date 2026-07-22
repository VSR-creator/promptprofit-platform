/**
 * PromptProfit Activation Commands
 *
 * Commands describe what the customer
 * is trying to accomplish.
 *
 * Commands are NOT state.
 * Commands are NOT events.
 */

export enum ActivationCommand {
  SELECT_INSTALLATION_METHOD = "SELECT_INSTALLATION_METHOD",

  ASSIGN_INSTALLER = "ASSIGN_INSTALLER",

  INSTALL_SDK = "INSTALL_SDK",

  VERIFY_INSTALLATION = "VERIFY_INSTALLATION",

  RECEIVE_FIRST_EVENT = "RECEIVE_FIRST_EVENT",

  CONFIGURE_FLOW = "CONFIGURE_FLOW",

  ENABLE_NOTIFICATIONS = "ENABLE_NOTIFICATIONS",
}
