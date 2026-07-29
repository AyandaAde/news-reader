import type { Metadata } from "next";
import { PlatformHomeScreen } from "@/components/platform/home-screen";

export const metadata: Metadata = {
  title: "EILO | Your AI Audio Companion",
  description: "Your personalized AI audio briefings and listening home.",
};

export default function PlatformHomePage() {
  return <PlatformHomeScreen />;
}
