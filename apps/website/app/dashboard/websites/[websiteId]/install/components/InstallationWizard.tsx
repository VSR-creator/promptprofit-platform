import { ActivationSnapshot } from "@/lib/activation";
import StepChooseMethod from "./steps/StepChooseMethod";

type Props = {
  workspaceId: string;
  websiteId: string;
  snapshot: ActivationSnapshot;
};
export default function InstallationWizard({
  workspaceId,
  websiteId,
  snapshot,
}: Props) {
  switch (snapshot.currentState) {
    default:
      return (
        <StepChooseMethod
          workspaceId={workspaceId}
          websiteId={websiteId}
          snapshot={snapshot}
        />
      );
  }
}
