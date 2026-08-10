import type { Metadata } from "next";
import { PlatformLiveScreen } from "@/components/platform/live-screen";

export const metadata: Metadata = {
  title: "Live | EILO",
  description: "Experience real-time news, market insights, and live audio curations.",
};

export default function LivePage() {
  return <PlatformLiveScreen />;
}
