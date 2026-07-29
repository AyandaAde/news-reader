"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { navigateAfterAuth } from "@/lib/clerk-nav";

export default function SSOCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || hasRun.current || !signIn || !signUp) {
        return;
      }

      hasRun.current = true;

      const finalizeSignIn = async () => {
        await signIn.finalize({
          navigate: async (args) => navigateAfterAuth(router, args),
        });
      };

      const finalizeSignUp = async () => {
        await signUp.finalize({
          navigate: async (args) => navigateAfterAuth(router, args),
        });
      };

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        const signInStatus = signIn.status as typeof signIn.status | "complete";
        if (signInStatus === "complete") {
          await finalizeSignIn();
          return;
        }
        router.push("/sign-in");
        return;
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every(
          (factor) => factor.strategy === "enterprise_sso",
        )
      ) {
        router.push("/sign-in");
        return;
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        router.push("/sign-in/continue");
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password"
      ) {
        router.push("/sign-in");
        return;
      }

      const sessionId =
        signIn.existingSession?.sessionId || signUp.existingSession?.sessionId;

      if (sessionId) {
        await clerk.setActive({
          session: sessionId,
          navigate: async (args) => navigateAfterAuth(router, args),
        });
      }
    })();
  }, [clerk, router, signIn, signUp]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
      <div id="clerk-captcha" />
      <p className="text-sm">Completing sign in…</p>
    </div>
  );
}
