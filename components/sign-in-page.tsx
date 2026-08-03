"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Header } from "@/components/header";
import { useI18n } from "@/components/i18n-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigateAfterAuth } from "@/lib/clerk-nav";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";

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

function createEmailSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .email(t("auth.emailInvalid"))
      .min(1, t("auth.emailRequired"))
  });
}

function createCodeSchema(t: (key: string) => string) {
  return z.object({
    code: z
      .string()
      .min(1, t("auth.codeRequired"))
      .min(6, t("auth.codeInvalid")),
  });
}

type EmailValues = z.infer<ReturnType<typeof createEmailSchema>>;
type CodeValues = z.infer<ReturnType<typeof createCodeSchema>>;

function AuthForm({
  mode,
  email,
  onEmailChange,
  onSwitchMode,
  switchHint,
  onClearSwitchHint,
}: {
  mode: AuthMode;
  email: string;
  onEmailChange: (email: string) => void;
  onSwitchMode: (mode: AuthMode, hint?: string) => void;
  switchHint: string | null;
  onClearSwitchHint: () => void;
}) {
  const { t } = useI18n();
  const router = useRouter();

  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

  const [verifying, setVerifying] = useState(false);
  const [oauthLoading, setOauthLoading] =
    useState<OAuthStrategy | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const emailSchema = useMemo(() => createEmailSchema(t), [t]);
  const codeSchema = useMemo(() => createCodeSchema(t), [t]);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email,
    },
    values: {
      email,
    },
  });

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (!switchHint) return;

    setFormError(switchHint);
    onClearSwitchHint();
  }, [switchHint, onClearSwitchHint]);

  const isBusy =
    emailForm.formState.isSubmitting ||
    codeForm.formState.isSubmitting ||
    signInFetchStatus === "fetching" ||
    signUpFetchStatus === "fetching" ||
    oauthLoading !== null;

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

  const resetVerification = async () => {
    if (mode === "sign-in") {
      await signIn.reset();
    } else {
      await signUp.reset();
    }

    setVerifying(false);
    setFormError(null);
    codeForm.reset();
  };

  const onEmailSubmit = async (values: EmailValues) => {
    setFormError(null);
    onEmailChange(values.email);

    if (mode === "sign-in") {
      const { error: createError } = await signIn.create({
        identifier: values.email,
      });

      if (createError) {
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
        setFormError(
          sendError.longMessage || sendError.message,
        );
        return;
      }

      setVerifying(true);
      return;
    }

    const { error: createError } = await signUp.create({
      emailAddress: values.email,
    });

    if (createError) {
      if (
        createError.code === "form_identifier_exists" ||
        createError.code === "identifier_already_signed_in"
      ) {
        onSwitchMode("sign-in", t("auth.accountExists"));
        return;
      }

      setFormError(
        createError.longMessage || createError.message,
      );
      return;
    }

    const { error: sendError } =
      await signUp.verifications.sendEmailCode();

    if (sendError) {
      setFormError(
        sendError.longMessage || sendError.message,
      );
      return;
    }

    setVerifying(true);
  };

  const onCodeSubmit = async (values: CodeValues) => {
    setFormError(null);

    if (mode === "sign-in") {
      const { error } =
        await signIn.emailCode.verifyCode({
          code: values.code,
        });

      if (error) {
        setFormError(
          error.longMessage || error.message,
        );
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
          setFormError(t("auth.codeSentAgain"));
          return;
        }
      }

      setFormError(t("auth.genericError"));
      return;
    }

    const { error } =
      await signUp.verifications.verifyEmailCode({
        code: values.code,
      });

    if (error) {
      setFormError(
        error.longMessage || error.message,
      );
      return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
      return;
    }

    if (signUp.status === "missing_requirements") {
      router.push("/sign-in/continue");
      return;
    }

    setFormError(t("auth.genericError"));
  };

  const continueWithOAuth = async (
    strategy: OAuthStrategy,
  ) => {
    setFormError(null);
    setOauthLoading(strategy);

    const { error } =
      mode === "sign-in"
        ? await signIn.sso({
          strategy,
          redirectUrl: "/",
          redirectCallbackUrl: "/sso-callback",
        })
        : await signUp.sso({
          strategy,
          redirectUrl: "/",
          redirectCallbackUrl: "/sso-callback",
        });

    if (error) {
      setFormError(
        error.longMessage || error.message,
      );
      setOauthLoading(null);
    }
  };

  const resendCode = async () => {
    if (mode === "sign-in") {
      await signIn.emailCode.sendCode();
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  if (verifying) {
    return (
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
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="px-1 font-mono text-xs font-medium uppercase tracking-[0.05em] text-[#6b6570] dark:text-[#888888]">
                  {t("auth.code")}
                </FormLabel>

                <FormControl>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    className="auth-input-glow h-10 rounded-lg border border-black/10 bg-white/80 px-3 text-sm text-[#131313] placeholder:text-[#6b6570]/50 dark:border-[#262626] dark:bg-[#1b1b1b]/50 dark:text-white dark:placeholder:text-[#888888]/50"
                    {...field}
                  />
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
            disabled={isBusy}
            className="mt-2 flex h-10 w-full items-center justify-center rounded-lg bg-[#131313] text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2a2a2c] active:scale-[0.98] disabled:opacity-70 dark:bg-white dark:text-[#0e0e0e] dark:hover:bg-[#e2e2e2]"
          >
            {isBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              t("auth.verify")
            )}
          </button>

          <div className="flex items-center justify-between gap-3 text-xs text-[#6b6570] dark:text-[#888888]">
            <button
              type="button"
              className="hover:text-[#131313] dark:hover:text-white"
              disabled={isBusy}
              onClick={() => void resendCode()}
            >
              {t("auth.resendCode")}
            </button>

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
    );
  }

  return (
    <div className="space-y-6">
      <Form {...emailForm}>
        <form
          className="space-y-6"
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          noValidate
        >
          <FormField
            control={emailForm.control}
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

          {formError ? (
            <p className="px-1 text-xs text-destructive">
              {formError}
            </p>
          ) : null}

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

          <div id="clerk-captcha" />
        </form>
      </Form>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-black/10 dark:border-[#262626]" />

        <span className="mx-4 shrink-0 font-mono text-xs uppercase tracking-[0.05em] text-[#6b6570] dark:text-[#888888]">
          {t("auth.orContinue")}
        </span>

        <div className="flex-grow border-t border-black/10 dark:border-[#262626]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isBusy}
          onClick={() =>
            void continueWithOAuth("oauth_google")
          }
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
          onClick={() =>
            void continueWithOAuth("oauth_apple")
          }
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
    </div>
  );
}

export function AuthPage() {
  const { t, language } = useI18n();
  const searchParams = useSearchParams();

  /*
   * If the URL is:
   *
   * /sign-in?create-account=true
   *
   * start on the Create Account tab.
   *
   * Otherwise default to Sign In.
   */
  const [mode, setMode] = useState<AuthMode>(() =>
    searchParams.get("create-account") === "true"
      ? "sign-up"
      : "sign-in",
  );

  const [email, setEmail] = useState("");
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

  return (
    <div className="auth-premium-gradient relative flex min-h-svh flex-col items-center overflow-x-hidden bg-[#f5f5f7] text-[#131313] dark:bg-black dark:text-[#e2e2e2]">
      <Header />

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
                onEmailChange={setEmail}
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
