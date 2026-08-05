import type { Metadata } from "next";
import { PlatformDiscoverScreen } from "@/components/platform/discover-screen";

export const metadata: Metadata = {
  title: "Discover | EILO",
  description: "Curated soundscapes and deep-dive narratives for focused listening.",
};

export default function DiscoverPage() {
  return <PlatformDiscoverScreen />;
}
