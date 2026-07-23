"use server";

import { installationService } from "@/lib/installation/installation-service";
import { InstallationMethod } from "@/lib/installation/installation-types";

export async function selectInstallationMethod(
  workspaceId: string,
  websiteId: string,
  method: InstallationMethod,
) {
  return installationService.selectMethod(workspaceId, websiteId, method);
}
