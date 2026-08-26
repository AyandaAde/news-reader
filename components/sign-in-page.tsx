"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useSignUp, useAuth } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2, Mail, User } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Header } from "@/components/header";
import { useI18n } from "@/components/i18n-provider";
import { saveVerificationLocale } from "@/lib/auth/save-verification-locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigateAfterAuth } from "@/lib/clerk-nav";
import { splitDisplayName } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";
const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;
const OTP_SLOT_CLASSNAME = "size-12 text-lg sm:size-14 sm:text-xl";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.365 1.43c0 1.14-.42 2.2-1.18 3-.79.84-2.1 1.49-3.2 1.4-.14-1.1.42-2.26 1.17-3.05.8-.86 2.2-1.48 3.21-1.35ZM19.8 17.2c-.57 1.32-.84 1.9-1.57 3.06-1.02 1.6-2.46 3.59-4.25 3.61-1.58.02-1.99-1.03-4.15-1.02-2.16.01-2.61 1.05-4.2 1.03-1.78-.02-3.14-1.82-4.16-3.42C-.1 17.5-.9 12.1.98 8.84c.94-1.63 2.43-2.66 4.12-2.69 1.53-.03 2.97 1.03 4.14 1.03 1.17 0 2.99-1.27 5.04-1.08.86.04 3.27.35 4.82 2.61-4.23 2.32-3.55 8.35.7 8.49Z"
      />
    </svg>
  );
}

function DecorativeCard({
  image,
  title,
  alt,
  description,
  rotate,
}: {
  image: string;
  title: string;
  alt: string;
  description: string;
  rotate: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "auth-glass-panel relative fixed top-1/2 hidden h-[520px] w-[360px] -translate-y-1/2 overflow-hidden rounded-xl transition-transform duration-700 hover:rotate-0 xl:block",
        rotate === "left"
          ? "left-[max(1rem,calc(50%-640px))] -rotate-3"
          : "right-[max(1rem,calc(50%-640px))] rotate-3",
      )}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="relative h-full w-full">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          sizes="360px"
        />
      </div>

      <div className="absolute inset-x-6 bottom-6 z-20">
        <h3 className="mb-1 text-2xl font-semibold text-white">{title}</h3>
        <p className="text-base text-white/70">{description}</p>
      </div>
    </div>
  );
}

function createAuthFormSchema(t: (key: string) => string, mode: AuthMode) {
  const email = z
    .email(t("auth.emailInvalid"))
    .min(1, t("auth.emailRequired"));

  return z.object({
    email,
    name:
      mode === "sign-up"
        ? z.string().trim().min(1, t("auth.displayNameRequired"))
        : z.string(),
    acceptedTerms:
      mode === "sign-up"
        ? z.literal(true, { message: t("auth.termsRequired") })
        : z.boolean(),
  });
}

function createCodeSchema(t: (key: string) => string) {
  return z.object({
    code: z
      .string()
      .min(1, t("auth.codeRequired"))
      .length(OTP_LENGTH, t("auth.codeInvalid")),
  });
}

type AuthFormValues = {
  email: string;
  name: string;
  acceptedTerms: boolean;
};
type CodeValues = z.infer<ReturnType<typeof createCodeSchema>>;

function getSignUpProfileFields(rawName: string) {
  const { firstName, lastName } = splitDisplayName(rawName.trim());
  const resolvedFirstName = firstName || "Friend";

  return {
    firstName: resolvedFirstName,
    lastName: lastName || resolvedFirstName,
  };
}

function buildSignUpCompletionParams(rawName: string) {
  return {
    ...getSignUpProfileFields(rawName),
    legalAccepted: true,
  };
}

function isSignUpReadyToFinalize(signUp: {
  status: string;
  createdSessionId?: string | null;
}) {
  return signUp.status === "complete" || Boolean(signUp.createdSessionId);
}

function buildSignUpUpdateParams(
  rawName: string,
  missingFields: readonly string[],
) {
  const missing = new Set(missingFields);
  const params: {
    firstName?: string;
    lastName?: string;
    legalAccepted?: boolean;
  } = {};

  if (missing.has("first_name") || missing.has("last_name")) Object.assign(params, getSignUpProfileFields(rawName));

  if (missing.has("legal_accepted")) params.legalAccepted = true;


  return Object.keys(params).length > 0 ? params : null;
}

function isExistingAccountError(
  code?: string | null,
  message?: string | null,
) {
  const normalizedCode = code?.toLowerCase() ?? "";
  if (
    normalizedCode === "form_identifier_exists" ||
    normalizedCode === "identification_exists" ||
    normalizedCode.includes("identifier_exists")
  ) {
    return true;
  }

  const normalizedMessage = message?.toLowerCase() ?? "";
  return (
    normalizedMessage.includes("already") &&
    (normalizedMessage.includes("account") ||
      normalizedMessage.includes("exists") ||
      normalizedMessage.includes("taken"))
  );
}

function isAlreadySignedInError(
  code?: string | null,
  message?: string | null,
) {
  const normalizedCode = code?.toLowerCase() ?? "";
  if (
    normalizedCode === "identifier_already_signed_in" ||
    normalizedCode === "session_exists" ||
    normalizedCode.includes("already_signed_in")
  ) {
    return true;
  }

  const normalizedMessage = message?.toLowerCase() ?? "";
  return normalizedMessage.includes("already signed in");
}

function isClerkEmptyResponseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Unexpected end of JSON input") ||
    message.includes("Failed to execute 'json' on 'Response'")
  );
}

function AuthForm({
  mode,
  email,
  name,
  acceptedTerms,
  onEmailChange,
  onNameChange,
  onAcceptedTermsChange,
  onSwitchMode,
  switchHint,
  onClearSwitchHint,
}: {
  mode: AuthMode;
  email: string;
  name: string;
  acceptedTerms: boolean;
  onEmailChange: (email: string) => void;
  onNameChange: (name: string) => void;
  onAcceptedTermsChange: (accepted: boolean) => void;
  onSwitchMode: (mode: AuthMode, hint?: string) => void;
  switchHint: string | null;
  onClearSwitchHint: () => void;
}) {
  const { t, language } = useI18n();
  const router = useRouter();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth({
    treatPendingAsSignedOut: false,
  });

  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

  const [verifying, setVerifying] = useState(false);
  const [oauthLoading, setOauthLoading] =
    useState<OAuthStrategy | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const verifyingRef = useRef(false);

  const authFormSchema = useMemo(
    () => createAuthFormSchema(t, mode),
    [mode, t],
  );
  const codeSchema = useMemo(() => createCodeSchema(t), [t]);

  const authForm = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email,
      name,
      acceptedTerms,
    },
    values: {
      email,
      name,
      acceptedTerms,
    },
  });

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });
  const code = useWatch({ control: codeForm.control, name: "code" });

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isAuthLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!switchHint) return;

    setFormError(switchHint);
    onClearSwitchHint();
  }, [switchHint, onClearSwitchHint]);

  useEffect(() => {
    if (!verifying || resendSecondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setResendSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [verifying, resendSecondsLeft]);

  const isBusy =
    authForm.formState.isSubmitting ||
    codeForm.formState.isSubmitting ||
    signInFetchStatus === "fetching" ||
    signUpFetchStatus === "fetching" ||
    oauthLoading !== null;

  const redirectToHome = () => {
    router.replace("/home");
  };

  const showSignUpError = (message: string) => {
    toast.error("Error", { description: message });
    setFormError(message);
  };

  const redirectToSignInForExistingAccount = async () => {
    try {
      await signUp.reset();
    } catch {
    }

    setVerifying(false);
    setResendSecondsLeft(0);
    codeForm.reset();
    onSwitchMode("sign-in", t("auth.accountExists"));
  };

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: async (args) => navigateAfterAuth(router, args),
    });
  };

  const finalizeSignUp = async (
    options?: { silent?: boolean },
  ): Promise<boolean> => {
    try {
      const { error } = await signUp.finalize({
        navigate: async (args) => navigateAfterAuth(router, args),
      });

      if (error) {
        if (!options?.silent) {
          showSignUpError(error.longMessage || error.message);
        }
        return false;
      }

      return true;
    } catch (error) {
      if (isClerkEmptyResponseError(error)) {
        router.replace("/home");
        return true;
      }

      if (!options?.silent) {
        showSignUpError(
          error instanceof Error ? error.message : t("auth.genericError"),
        );
      }
      return false;
    }
  };

  const ensureSignUpProfileBeforeVerification = async (
    signUpName: string,
  ): Promise<boolean> => {
    if (signUp.missingFields.length === 0) {
      return true;
    }

    const updateParams =
      buildSignUpUpdateParams(signUpName, signUp.missingFields) ??
      buildSignUpCompletionParams(signUpName);

    try {
      const { error: updateError } = await signUp.update(updateParams);

      if (updateError) {
        showSignUpError(updateError.longMessage || updateError.message);
        return false;
      }
    } catch (error) {
      if (!isClerkEmptyResponseError(error)) {
        showSignUpError(
          error instanceof Error ? error.message : t("auth.genericError"),
        );
        return false;
      }
    }

    return true;
  };

  const sendSignUpVerificationCode = async (
    targetEmail: string,
    signUpName: string,
  ): Promise<boolean> => {
    if (!(await ensureSignUpProfileBeforeVerification(signUpName))) {
      return false;
    }

    const { error: sendError } =
      await signUp.verifications.sendEmailCode();

    if (sendError) {
      if (isExistingAccountError(sendError.code, sendError.message)) {
        await redirectToSignInForExistingAccount();
        return false;
      }

      showSignUpError(sendError.longMessage || sendError.message);
      return false;
    }

    startVerificationStep();
    void saveVerificationLocale(targetEmail, language);
    return true;
  };

  const finishSignUpAfterVerification = async () => {
    const ready = isSignUpReadyToFinalize(signUp);

    if (await finalizeSignUp({ silent: !ready })) {
      return;
    }

    if (signUp.missingFields.length > 0) {
      showSignUpError(t("auth.signUpIncomplete"));
      return;
    }

    if (!ready) {
      showSignUpError(t("auth.genericError"));
    }
  };

  const resetVerification = async () => {
    if (mode === "sign-in") await signIn.reset();
    else await signUp.reset();

    setVerifying(false);
    setFormError(null);
    setResendSecondsLeft(0);
    codeForm.reset();
  };

  const startVerificationStep = () => {
    setVerifying(true);
    setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
  };

  const onAuthSubmit = async (values: AuthFormValues) => {
    setFormError(null);
    onEmailChange(values.email);

    if (mode === "sign-in") {
      if (isSignedIn) {
        redirectToHome();
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      const { error: createError } = await signIn.create({
        identifier: values.email,
      });

      if (createError) {
        if (isAlreadySignedInError(createError.code, createError.message)) {
          redirectToHome();
          return;
        }

        if (createError.code === "form_identifier_not_found") {
          onSwitchMode("sign-up", t("auth.accountNotFound"));
          return;
        }

        setFormError(
          createError.longMessage || createError.message,
        );
        return;
      }

      const { error: sendError } =
        await signIn.emailCode.sendCode();

      if (sendError) {
        if (isAlreadySignedInError(sendError.code, sendError.message)) {
          redirectToHome();
          return;
        }

        setFormError(
          sendError.longMessage || sendError.message,
        );
        return;
      }

      startVerificationStep();
      void saveVerificationLocale(values.email, language);
      return;
    }

    const signUpName = values.name.trim();
    onNameChange(signUpName);

    try {
      const normalizedEmail = values.email.trim().toLowerCase();
      const existingEmail = signUp.emailAddress?.trim().toLowerCase() ?? "";
      const canResumeVerification =
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        (!existingEmail || existingEmail === normalizedEmail);

      if (canResumeVerification) {
        await sendSignUpVerificationCode(values.email, signUpName);
        return;
      }

      if (isSignUpReadyToFinalize(signUp)) {
        await finalizeSignUp();
        return;
      }

      if (signUp.id || signUp.status === "missing_requirements") {
        try {
          await signUp.reset();
        } catch {
        }
      }

      const { error: createError } = await signUp.create({
        emailAddress: values.email,
        ...getSignUpProfileFields(signUpName),
        legalAccepted: true,
        locale: language,
      });

      if (createError) {
        if (createError.code === "identifier_already_signed_in") {
          redirectToHome();
          return;
        }

        if (isExistingAccountError(createError.code, createError.message)) {
          await redirectToSignInForExistingAccount();
          return;
        }

        showSignUpError(
          createError.longMessage || createError.message,
        );
        return;
      }

      if (signUp.isTransferable) {
        await redirectToSignInForExistingAccount();
        return;
      }

      await sendSignUpVerificationCode(values.email, signUpName);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (isExistingAccountError(null, message)) {
        await redirectToSignInForExistingAccount();
        return;
      }

      if (isClerkEmptyResponseError(error)) {
        if (signUp.unverifiedFields.includes("email_address")) {
          await sendSignUpVerificationCode(values.email, signUpName);
          return;
        }

        if (isSignUpReadyToFinalize(signUp)) {
          await finalizeSignUp();
          return;
        }
      }

      showSignUpError(message || t("auth.genericError"));
    }
  };

  const onCodeSubmit = async (values: CodeValues) => {
    if (
      values.code.length !== OTP_LENGTH ||
      verifyingRef.current ||
      isBusy
    ) return;

    verifyingRef.current = true;
    setFormError(null);

    try {
      if (mode === "sign-in") {
        const { error } =
          await signIn.emailCode.verifyCode({
            code: values.code,
          });

        if (error) {
          if (isAlreadySignedInError(error.code, error.message)) {
            redirectToHome();
            return;
          }

          setFormError(
            error.longMessage || error.message,
          );
          codeForm.setValue("code", "");
          return;
        }

        if (signIn.status === "complete") {
          await finalizeSignIn();
          return;
        }

        if (signIn.status === "needs_client_trust") {
          const emailCodeFactor =
            signIn.supportedSecondFactors?.find(
              (factor) => factor.strategy === "email_code",
            );

          if (emailCodeFactor) {
            await signIn.mfa.sendEmailCode();
            toast.success(t("auth.codeSentAgain"));
            codeForm.setValue("code", "");
            return;
          }
        }

        setFormError(t("auth.genericError"));
        codeForm.setValue("code", "");
        return;
      }

      try {
        const { error } =
          await signUp.verifications.verifyEmailCode({
            code: values.code,
          });

        if (error) {
          if (isExistingAccountError(error.code, error.message)) {
            await redirectToSignInForExistingAccount();
            return;
          }

          showSignUpError(
            error.longMessage || error.message,
          );
          codeForm.setValue("code", "");
          return;
        }

        if (signUp.isTransferable) {
          await redirectToSignInForExistingAccount();
          return;
        }

        await finishSignUpAfterVerification();
      } catch (error) {
        if (isClerkEmptyResponseError(error)) {
          await finishSignUpAfterVerification();
          return;
        }

        showSignUpError(
          error instanceof Error ? error.message : t("auth.genericError"),
        );
        codeForm.setValue("code", "");
      }

      return;
    } finally {
      verifyingRef.current = false;
    }
  };

  const continueWithOAuth = async (
    strategy: OAuthStrategy,
  ) => {
    setFormError(null);

    if (mode === "sign-in" && isSignedIn) {
      redirectToHome();
      return;
    }

    if (mode === "sign-in" && signIn.status === "complete") {
      await finalizeSignIn();
      return;
    }

    if (mode === "sign-up" && !acceptedTerms) {
      authForm.setError("acceptedTerms", {
        message: t("auth.termsRequired"),
      });
      return;
    }

    setOauthLoading(strategy);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("eilo-oauth-mode", mode);
    }

    const oauthName = authForm.getValues("name").trim() || name.trim();
    const oauthProfile = oauthName
      ? getSignUpProfileFields(oauthName)
      : null;

    const { error } =
      mode === "sign-in"
        ? await signIn.sso({
          strategy,
          redirectUrl: "/sign-in",
          redirectCallbackUrl: "/sso-callback",
        })
        : await signUp.sso({
          strategy,
          redirectUrl: "/sign-up",
          redirectCallbackUrl: "/sso-callback",
          legalAccepted: true,
          ...(oauthProfile ?? {}),
        });

    if (error) {
      if (typeof window !== "undefined") window.sessionStorage.removeItem("eilo-oauth-mode");
      const message = error.longMessage || error.message;
      if (isAlreadySignedInError(error.code, message)) {
        redirectToHome();
        setOauthLoading(null);
        return;
      }
      if (mode === "sign-up") showSignUpError(message);
      else setFormError(message);
      setOauthLoading(null);
    }
  };

  const canResend =
    resendSecondsLeft === 0 && !isResending && !isBusy;

  const oauthDivider = (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-t border-black/10 dark:border-[#262626]" />

      <span className="mx-4 shrink-0 font-mono text-xs uppercase tracking-[0.05em] text-[#6b6570] dark:text-[#888888]">
        {t("auth.orContinue")}
      </span>

      <div className="flex-grow border-t border-black/10 dark:border-[#262626]" />
    </div>
  );

  const oauthButtons = (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={isBusy}
        onClick={() => void continueWithOAuth("oauth_google")}
        className="flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white/60 text-sm text-[#131313] transition-colors duration-300 hover:bg-white disabled:opacity-70 dark:border-[#262626] dark:bg-transparent dark:text-[#e2e2e2] dark:hover:bg-[#1f1f1f]"
      >
        {oauthLoading === "oauth_google" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <GoogleIcon className="mr-2 size-4 text-[#131313] dark:text-white" />
            <span>{t("auth.google")}</span>
          </>
        )}
      </button>

      <button
        type="button"
        disabled={isBusy}
        onClick={() => void continueWithOAuth("oauth_apple")}
        className="flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white/60 text-sm text-[#131313] transition-colors duration-300 hover:bg-white disabled:opacity-70 dark:border-[#262626] dark:bg-transparent dark:text-[#e2e2e2] dark:hover:bg-[#1f1f1f]"
      >
        {oauthLoading === "oauth_apple" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <AppleIcon className="mr-2 size-4 text-[#131313] dark:text-white" />
            <span>{t("auth.apple")}</span>
          </>
        )}
      </button>
    </div>
  );

  const oauthOptionsBelow = (
    <>
      {oauthDivider}
      {oauthButtons}
    </>
  );

  const resendCode = async () => {
    if (!canResend) return;

    setIsResending(true);
    setFormError(null);

    try {
      if (mode === "sign-in") {
        const { error } = await signIn.emailCode.sendCode();
        if (error) {
          if (isAlreadySignedInError(error.code, error.message)) {
            redirectToHome();
            return;
          }
          setFormError(error.longMessage || error.message);
          return;
        }
      } else {
        const { error } = await signUp.verifications.sendEmailCode();
        if (error) {
          showSignUpError(error.longMessage || error.message);
          return;
        }
      }

      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
      codeForm.setValue("code", "");
      toast.success(t("auth.codeSentAgain"));
    } finally {
      setIsResending(false);
    }
  };

  if (verifying) return (
    <div className="space-y-6">
      <Form {...codeForm}>
        <form
          className="space-y-6"
          onSubmit={codeForm.handleSubmit(onCodeSubmit)}
          noValidate
        >
          <div className="space-y-1 px-1">
            <p className="text-sm text-[#6b6570] dark:text-[#888888]">
              {t("auth.codeSubtitle")}
            </p>

            <p className="text-sm text-[#131313] dark:text-white">
              {email}
            </p>
          </div>

          <FormField
            control={codeForm.control}
            name="code"
            render={({ field, fieldState }) => (
              <FormItem className="w-full space-y-2">
                <FormLabel className="px-1 font-mono text-xs font-medium uppercase tracking-[0.05em] text-[#6b6570] dark:text-[#888888]">
                  {t("auth.code")}
                </FormLabel>

                <FormControl>
                  <InputOTP
                    maxLength={OTP_LENGTH}
                    pattern={REGEXP_ONLY_DIGITS}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isBusy}
                    onComplete={(value) => {
                      field.onChange(value);
                      void codeForm.handleSubmit(onCodeSubmit)();
                    }}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup>
                      {[0, 1, 2].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          aria-invalid={!!fieldState.error}
                          className={cn(
                            OTP_SLOT_CLASSNAME,
                            index === 2 && "rounded-r-lg border-r",
                          )}
                        />
                      ))}
                      <InputOTPSeparator className="mx-1 [&_svg:not([class*='size-'])]:size-5" />
                      {[3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          aria-invalid={!!fieldState.error}
                          className={cn(
                            OTP_SLOT_CLASSNAME,
                            index === 3 && "rounded-l-lg border-l",
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <FormMessage className="px-1 text-xs" />
              </FormItem>
            )}
          />

          {formError ? (
            <p className="px-1 text-xs text-destructive">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isBusy || (code ?? "").length !== OTP_LENGTH}
            className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-[#131313] text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2a2a2c] active:scale-[0.98] disabled:opacity-70 dark:bg-white dark:text-[#0e0e0e] dark:hover:bg-[#e2e2e2]"
          >
            {isBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              t("auth.verify")
            )}
          </button>

          <div className="flex items-center justify-between gap-3 text-xs text-[#6b6570] dark:text-[#888888]">
            {canResend ? (
              <button
                type="button"
                className="hover:text-[#131313] dark:hover:text-white"
                disabled={isResending}
                onClick={() => void resendCode()}
              >
                {isResending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  t("auth.resendCode")
                )}
              </button>
            ) : (
              <span>
                {t("auth.resendCooldown").replace(
                  "{{seconds}}",
                  String(resendSecondsLeft),
                )}
              </span>
            )}

            <button
              type="button"
              className="hover:text-[#131313] dark:hover:text-white"
              disabled={isBusy}
              onClick={() => void resetVerification()}
            >
              {t("auth.startOver")}
            </button>
          </div>

          <div id="clerk-captcha" />
        </form>
      </Form>

      {oauthOptionsBelow}
    </div>
  );

  return (
    <div className="space-y-6">
      <Form {...authForm}>
        <form
          className="space-y-6"
          onSubmit={authForm.handleSubmit(onAuthSubmit)}
          noValidate
        >
          {mode === "sign-up" ? (
            <FormField
              control={authForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="px-1 font-mono text-xs font-medium uppercase tracking-[0.05em] text-[#6b6570] dark:text-[#888888]">
                    {t("auth.displayName")}
                  </FormLabel>

                  <div className="auth-input-glow flex h-10 items-center rounded-lg border border-black/10 bg-white/80 px-3 transition-all duration-300 has-[[aria-invalid=true]]:border-destructive dark:border-[#262626] dark:bg-[#1b1b1b]/50">
                    <User
                      className="mr-2.5 size-4 shrink-0 text-[#6b6570] dark:text-[#888888]"
                      strokeWidth={1.5}
                    />

                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="name"
                        placeholder={t("auth.displayNamePlaceholder")}
                        className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-sm text-[#131313] shadow-none placeholder:text-[#6b6570]/50 focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent dark:text-white dark:placeholder:text-[#888888]/50"
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          onNameChange(event.target.value);
                        }}
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="px-1 text-xs" />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={authForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="px-1 font-mono text-xs font-medium uppercase tracking-[0.05em] text-[#6b6570] dark:text-[#888888]">
                  {t("auth.email")}
                </FormLabel>

                <div className="auth-input-glow flex h-10 items-center rounded-lg border border-black/10 bg-white/80 px-3 transition-all duration-300 has-[[aria-invalid=true]]:border-destructive dark:border-[#262626] dark:bg-[#1b1b1b]/50">
                  <Mail
                    className="mr-2.5 size-4 shrink-0 text-[#6b6570] dark:text-[#888888]"
                    strokeWidth={1.5}
                  />

                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={t("auth.emailPlaceholder")}
                      className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-sm text-[#131313] shadow-none placeholder:text-[#6b6570]/50 focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent dark:text-white dark:placeholder:text-[#888888]/50"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        onEmailChange(event.target.value);
                      }}
                    />
                  </FormControl>
                </div>

                <FormMessage className="px-1 text-xs" />
              </FormItem>
            )}
          />

          {mode === "sign-up" ? (
            <FormField
              control={authForm.control}
              name="acceptedTerms"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-start gap-3 px-1">
                    <FormControl>
                      <input
                        id="accepted-terms"
                        type="checkbox"
                        checked={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.checked);
                          onAcceptedTermsChange(event.target.checked);
                        }}
                        onBlur={field.onBlur}
                        disabled={isBusy}
                        aria-invalid={!!fieldState.error}
                        className="mt-0.5 size-4 shrink-0 rounded border border-black/20 accent-[#131313] dark:border-[#444] dark:accent-white"
                      />
                    </FormControl>

                    <FormLabel
                      htmlFor="accepted-terms"
                      className="cursor-pointer text-sm leading-5 font-normal text-[#6b6570] dark:text-[#888888]"
                    >
                      {t("auth.termsAgreementPrefix")}{" "}
                      <Link
                        href="/terms"
                        className="text-[#131313] underline underline-offset-2 hover:text-[#2a2a2c] dark:text-white dark:hover:text-[#e2e2e2]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("auth.termsOfService")}
                      </Link>{" "}
                      {t("auth.termsAgreementJoin")}{" "}
                      <Link
                        href="/privacy"
                        className="text-[#131313] underline underline-offset-2 hover:text-[#2a2a2c] dark:text-white dark:hover:text-[#e2e2e2]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("footer.privacy")}
                      </Link>
                      .
                    </FormLabel>
                  </div>

                  <FormMessage className="px-1 text-xs" />
                </FormItem>
              )}
            />
          ) : null}

          {formError ? (
            <p className="px-1 text-xs text-destructive">
              {formError}
            </p>
          ) : null}

          {mode === "sign-up" ? <div id="clerk-captcha" /> : null}

          <button
            type="submit"
            disabled={isBusy}
            className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-[#131313] text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2a2a2c] active:scale-[0.98] disabled:opacity-70 dark:bg-white dark:text-[#0e0e0e] dark:hover:bg-[#e2e2e2]"
          >
            {isBusy && !oauthLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "sign-in" ? (
              t("auth.submit")
            ) : (
              t("auth.createAccountSubmit")
            )}
          </button>
        </form>
      </Form>

      {oauthOptionsBelow}
    </div>
  );
}

export function AuthPage({
  initialMode = "sign-in",
}: {
  initialMode?: AuthMode;
}) {
  const { t, language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isLoaded, isSignedIn, router]);

  const [mode, setMode] = useState<AuthMode>(() => {
    if (searchParams.get("create-account") === "true") return "sign-up";
    return initialMode;
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [switchHint, setSwitchHint] = useState<string | null>(null);

  const handleSwitchMode = useCallback(
    (nextMode: AuthMode, hint?: string) => {
      setSwitchHint(hint ?? null);
      setMode(nextMode);
    },
    [],
  );

  const clearSwitchHint = useCallback(() => {
    setSwitchHint(null);
  }, []);

  if (isLoaded && isSignedIn) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="auth-premium-gradient relative flex min-h-svh flex-col items-center overflow-x-hidden bg-[#f5f5f7] text-[#131313] dark:bg-black dark:text-[#e2e2e2]">
      <Header logoClassName="h-5 w-auto max-w-[3.75rem] object-contain sm:max-w-[4.25rem]" />

      <main className="mt-24 flex w-full flex-grow items-center justify-center px-4 py-12 md:px-10">
        <div className="flex w-full max-w-[440px] flex-col space-y-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3 duration-700">
            <h1 className="text-4xl font-bold tracking-tighter text-[#131313] md:text-5xl md:leading-[56px] dark:text-white">
              {t("auth.screenTitle")}
            </h1>

            <p className="text-base leading-6 text-[#6b6570] dark:text-[#888888]">
              {mode === "sign-in"
                ? t("auth.signInSubtitle")
                : t("auth.signUpSubtitle")}
            </p>
          </div>

          <div className="auth-glass-panel animate-in fade-in slide-in-from-bottom-6 space-y-6 rounded-xl p-6 duration-1000">
            <Tabs
              value={mode}
              onValueChange={(value) => {
                if (
                  value === "sign-in" ||
                  value === "sign-up"
                ) {
                  setSwitchHint(null);
                  setMode(value);
                }
              }}
              className="w-full gap-6"
            >
              <TabsList className="grid h-10 w-full grid-cols-2 rounded-sm border border-black/10 bg-[#ececef]/90 p-1 dark:border-[#262626] dark:bg-[#1b1b1b]/80">
                <TabsTrigger
                  value="sign-in"
                  className="rounded-sm! text-xs uppercase tracking-[0.08em] text-[#6b6570] hover:text-gray-400! data-active:bg-[#131313] data-active:text-white data-active:hover:text-gray-300! dark:text-[#888888] dark:hover:text-gray-400! dark:data-active:bg-white dark:data-active:text-[#0e0e0e] dark:data-active:hover:text-gray-400!"
                >
                  {t("auth.tabSignIn")}
                </TabsTrigger>

                <TabsTrigger
                  value="sign-up"
                  className="rounded-sm! text-xs uppercase tracking-[0.08em] text-[#6b6570] hover:text-gray-400! data-active:bg-[#131313] data-active:text-white data-active:hover:text-gray-300! dark:text-[#888888] dark:hover:text-gray-400! dark:data-active:bg-white dark:data-active:text-[#0e0e0e] dark:data-active:hover:text-gray-400!"
                >
                  {t("auth.tabCreateAccount")}
                </TabsTrigger>
              </TabsList>

              <AuthForm
                key={`${language}-${mode}`}
                mode={mode}
                email={email}
                name={name}
                acceptedTerms={acceptedTerms}
                onEmailChange={setEmail}
                onNameChange={setName}
                onAcceptedTermsChange={setAcceptedTerms}
                onSwitchMode={handleSwitchMode}
                switchHint={switchHint}
                onClearSwitchHint={clearSwitchHint}
              />
            </Tabs>
          </div>
        </div>
      </main>

      <DecorativeCard
        image="/images/soundboard.png"
        title={t("auth.card1Title")}
        alt="soundboard"
        description={t("auth.card1Description")}
        rotate="left"
      />

      <DecorativeCard
        image="/images/headphones.png"
        title={t("auth.card2Title")}
        alt="headphones"
        description={t("auth.card2Description")}
        rotate="right"
      />
    </div>
  );
}
