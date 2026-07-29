import type { Metadata } from "next";
import { OnboardingContinue } from "@/components/onboarding-continue";

export const metadata: Metadata = {
  title: "Eilo — Continue setup",
  description: "Finish setting up your Eilo account and daily brief.",
};

export default function SignInContinuePage() {
  return <OnboardingContinue />;
}
