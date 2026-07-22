import { InstallationMethod } from "./installation-types";

/**
 * Installation facts.
 *
 * Facts are observations.
 * They contain no business logic.
 */
export interface InstallationFacts {
  websiteId: string;

  method: InstallationMethod | null;

  installed: boolean;

  verified: boolean;
}
