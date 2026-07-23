import { ActivationSnapshot } from "@/lib/activation";
import StepChooseMethod from "./steps/StepChooseMethod";

type Props = {
  snapshot: ActivationSnapshot;
};

export default function InstallationWizard({ snapshot }: Props) {
  switch (snapshot.currentState) {
    default:
      return <StepChooseMethod snapshot={snapshot} />;
  }
}
