"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { navigateAfterAuth } from "@/lib/clerk-nav";

export function SSOCallbackClient() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || hasRun.current || !signIn || !signUp) {
        return;
      }

      hasRun.current = true;

      const oauthMode =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("eilo-oauth-mode")
          : null;

      const clearOAuthMode = () => {
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem("eilo-oauth-mode");
        }
      };

      const returnToAuthPage = () => {
        clearOAuthMode();
        router.replace(oauthMode === "sign-up" ? "/sign-up" : "/sign-in");
      };

      const oauthError = searchParams.get("error");
      if (
        oauthError === "access_denied" ||
        oauthError === "user_cancelled" ||
        oauthError === "cancelled"
      ) {
        returnToAuthPage();
        return;
      }

      const redirectToSignIn = () => {
        clearOAuthMode();
        router.replace("/sign-in");
      };

      const redirectToSignUp = () => {
        clearOAuthMode();
        router.replace("/sign-up");
      };

      const finalizeSignIn = async () => {
        clearOAuthMode();
        await signIn.finalize({
          navigate: async (args) => navigateAfterAuth(router, args),
        });
      };

      const finalizeSignUp = async () => {
        clearOAuthMode();
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
        redirectToSignIn();
        return;
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every(
          (factor) => factor.strategy === "enterprise_sso",
        )
      ) {
        redirectToSignIn();
        return;
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        redirectToSignUp();
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
        redirectToSignIn();
        return;
      }

      const sessionId =
        signIn.existingSession?.sessionId || signUp.existingSession?.sessionId;

      if (sessionId) {
        clearOAuthMode();
        await clerk.setActive({
          session: sessionId,
          navigate: async (args) => navigateAfterAuth(router, args),
        });
        return;
      }

      if (signIn.id && oauthMode === "sign-in") {
        redirectToSignIn();
        return;
      }

      if (signUp.id && oauthMode === "sign-up") {
        redirectToSignUp();
        return;
      }

      if (signIn.id) {
        redirectToSignIn();
        return;
      }

      if (signUp.id) {
        redirectToSignUp();
        return;
      }

      redirectToSignIn();
    })();
  }, [clerk, router, searchParams, signIn, signUp]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
      <div id="clerk-captcha" />
      <p className="text-sm">Completing sign in…</p>
    </div>
  );
}
