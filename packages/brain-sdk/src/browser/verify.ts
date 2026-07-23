import { sendToBrain } from "./transport";

export interface VerifyInstallationRequest {
  publicKey: string;
  sdkVersion: string;
  url: string;
  userAgent: string;
}

/**
 * Verifies that the PromptProfit SDK
 * has been successfully installed.
 */
export async function verifyInstallation(request: VerifyInstallationRequest) {
  return sendToBrain({
    endpoint: "/api/brain/verify",
    payload: request,
  });
}
