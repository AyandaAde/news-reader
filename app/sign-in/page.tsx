import type { Metadata } from "next";
import { AuthPage } from "@/components/sign-in-page";

export const metadata: Metadata = {
  title: "Eilo — Auth",
  description: "Sign in or create an account to access your AI-powered audio briefings.",
};

export default function Page() {
  return <AuthPage />;
}
