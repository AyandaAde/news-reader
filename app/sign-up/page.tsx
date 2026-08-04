import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPage } from "@/components/sign-in-page";

export const metadata: Metadata = {
  title: "Eilo — Create account",
  description:
    "Create an account to start your AI-powered audio briefings with Eilo.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <AuthPage initialMode="sign-up" />
    </Suspense>
  );
}
