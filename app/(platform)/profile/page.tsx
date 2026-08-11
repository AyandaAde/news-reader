import type { Metadata } from "next";
import { PlatformProfileScreen } from "@/components/platform/profile-screen";

export const metadata: Metadata = {
  title: "Profile | EILO",
  description: "Your profile, shows, and listening statistics.",
};

export default function ProfilePage() {
  return <PlatformProfileScreen />;
}
