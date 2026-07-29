"use client";

import { useAuth, useSignUp, useUser } from "@clerk/nextjs";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  Coffee,
  Cpu,
  Film,
  FlaskConical,
  Gamepad2,
  Globe2,
  Heart,
  Laptop,
  Leaf,
  Loader2,
  Mail,
  Music,
  Send,
  Star,
  Sun,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  BRIEF_ITEMS,
  defaultOnboardingData,
  isOnboardingComplete,
  nextStep,
  readOnboardingData,
  splitDisplayName,
  stepIndex,
  TOPIC_OPTIONS,
  writeOnboardingData,
  type OnboardingData,
  type OnboardingStep,
} from "@/lib/onboarding";
import { cn } from "@/lib/utils";

const TOPIC_ICONS: Record<string, ReactNode> = {
  "World News": <Globe2 className="size-3.5" />,
  Business: <Briefcase className="size-3.5" />,
  Science: <FlaskConical className="size-3.5" />,
  Sports: <Trophy className="size-3.5" />,
  Entertainment: <Film className="size-3.5" />,
  Technology: <Laptop className="size-3.5" />,
  Health: <Heart className="size-3.5" />,
  Finance: <TrendingUp className="size-3.5" />,
  Music: <Music className="size-3.5" />,
  Food: <Coffee className="size-3.5" />,
  AI: <Cpu className="size-3.5" />,
  Travel: <Send className="size-3.5" />,
  Books: <BookOpen className="size-3.5" />,
  Gaming: <Gamepad2 className="size-3.5" />,
  Climate: <Leaf className="size-3.5" />,
};

const BRIEF_ICONS: Record<string, ReactNode> = {
  headlines: <Globe2 className="size-5" />,
  email: <Mail className="size-5" />,
  calendar: <CalendarDays className="size-5" />,
  weather: <Sun className="size-5" />,
  "custom-topics": <Star className="size-5" />,
};

function StepLabel({ step }: { step: OnboardingStep }) {
  return (
    <div className="mb-1 text-[13px] text-[#898989]">
      Step {stepIndex(step)} of 6
    </div>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center rounded-[14px] bg-[#fafafa] text-base font-semibold text-black transition-colors hover:bg-[#e0e0e0] disabled:opacity-70"
    >
      {children}
    </button>
  );
}

function SkipButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-transparent text-center text-sm text-[#898989] transition-colors hover:text-[#bbb]"
    >
      {children}
    </button>
  );
}

function ConnectionRow({
  name,
  status,
  connected,
  comingSoon,
  onToggle,
}: {
  name: string;
  status: string;
  connected?: boolean;
  comingSoon?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-[14px] bg-[#141414] p-4">
      <div className="flex size-11 items-center justify-center rounded-[10px] bg-[#1e1e1e] text-lg">
        {name === "Gmail" ? "G" : name === "Google Calendar" ? "C" : "O"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold text-white">{name}</div>
        <div
          className={cn(
            "text-xs",
            connected ? "text-emerald-400" : "text-[#898989]",
          )}
        >
          {status}
        </div>
      </div>
      <button
        type="button"
        disabled={comingSoon}
        onClick={onToggle}
        aria-label={`Toggle ${name}`}
        className={cn(
          "relative h-[26px] w-[46px] rounded-full transition-colors disabled:opacity-50",
          connected ? "bg-[#3d3d3d]" : "bg-[#2a2a2a]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-[22px] rounded-full transition-all",
            connected
              ? "right-0.5 bg-white"
              : "left-0.5 bg-[#898989]",
          )}
        />
      </button>
    </div>
  );
}

export function OnboardingContinue() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { signUp, fetchStatus } = useSignUp();

  const [step, setStep] = useState<OnboardingStep>("name");
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const needsClerkName =
    signUp.status === "missing_requirements" &&
    (signUp.missingFields.includes("first_name") ||
      signUp.missingFields.includes("last_name") ||
      signUp.missingFields.includes("legal_accepted"));

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn && !needsClerkName && signUp.status !== "missing_requirements") {
      router.replace("/sign-in");
      return;
    }

    const stored = readOnboardingData(userId);
    if (stored.completed || isOnboardingComplete(userId)) {
      router.replace("/home");
      return;
    }

    const existingName =
      stored.name ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.fullName ||
      "";

    setData({
      ...stored,
      name: existingName,
    });
    setHydrated(true);
  }, [
    isLoaded,
    isSignedIn,
    needsClerkName,
    router,
    signUp.status,
    user?.firstName,
    user?.fullName,
    user?.lastName,
    userId,
  ]);

  const persist = useCallback(
    (next: OnboardingData) => {
      setData(next);
      writeOnboardingData(next, userId);
    },
    [userId],
  );

  const goNext = useCallback(
    (from: OnboardingStep, patch?: Partial<OnboardingData>) => {
      const nextData = patch ? { ...data, ...patch } : data;
      persist(nextData);
      const upcoming = nextStep(from);
      if (upcoming) {
        setStep(upcoming);
        setError(null);
        return;
      }
      persist({ ...nextData, completed: true });
      router.push("/home");
    },
    [data, persist, router],
  );

  const finalizeClerkIfNeeded = async (displayName: string) => {
    if (!needsClerkName) {
      if (user && displayName.trim()) {
        const { firstName, lastName } = splitDisplayName(displayName);
        await user.update({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        });
      }
      return true;
    }

    const { firstName, lastName } = splitDisplayName(displayName);
    const { error: updateError } = await signUp.update({
      firstName: firstName || "Friend",
      lastName: lastName || undefined,
      legalAccepted: true,
    });

    if (updateError) {
      setError(updateError.longMessage || updateError.message);
      return false;
    }

    const status = signUp.status as typeof signUp.status | "complete";

    if (status === "complete") {
      await signUp.finalize({
        navigate: async () => {
          /* stay on continue for remaining steps */
        },
      });
      return true;
    }

    if (status === "missing_requirements") {
      setError(`Additional fields required: ${signUp.missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleNameContinue = async (skip = false) => {
    setBusy(true);
    setError(null);
    try {
      const name = skip ? data.name : data.name.trim();
      if (!skip && !name) {
        setError("Enter your name to continue, or skip for now.");
        return;
      }

      const ok = await finalizeClerkIfNeeded(name || "Friend");
      if (!ok) return;

      goNext("name", { name: name || data.name });
    } finally {
      setBusy(false);
    }
  };

  const handleAllowLocation = () => {
    setBusy(true);
    setError(null);

    if (!navigator.geolocation) {
      goNext("location");
      setBusy(false);
      return;
    }

    let done = false;
    const finish = (lat: number | null, lon: number | null) => {
      if (done) return;
      done = true;
      setBusy(false);
      goNext("location", { lat, lon });
    };

    const timeout = window.setTimeout(() => finish(null, null), 5000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(timeout);
        finish(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        window.clearTimeout(timeout);
        finish(null, null);
      },
      { timeout: 5000 },
    );
  };

  const handleNotifications = async (enable: boolean) => {
    setBusy(true);
    setError(null);
    try {
      let enabled = false;
      if (enable && "Notification" in window) {
        const permission = await Notification.requestPermission();
        enabled = permission === "granted";
      }
      goNext("notifications", { notificationsEnabled: enabled });
    } finally {
      setBusy(false);
    }
  };

  const handleFinish = () => {
    persist({ ...data, completed: true });
    router.push("/home");
  };

  if (!isLoaded || !hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="auth-premium-gradient flex min-h-svh justify-center bg-black text-[#fafafa]">
      <div className="flex w-full max-w-md flex-col px-5 py-10">
        {step === "name" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#1e1e1e] text-2xl font-bold">
              E
            </div>
            <StepLabel step="name" />
            <h2 className="text-[26px] font-bold leading-tight">
              What&apos;s your name?
            </h2>
            <p className="text-[15px] leading-relaxed text-[#d9d9d9]">
              We&apos;ll personalize your AI radio experience just for you.
            </p>
            <input
              value={data.name}
              onChange={(event) =>
                setData((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Enter your name"
              autoComplete="name"
              className="mt-2 h-14 w-full rounded-[14px] border border-[#313131] bg-[#1e1e1e] px-5 text-base text-white outline-none placeholder:text-[#898989]"
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
            <PrimaryButton
              disabled={busy || fetchStatus === "fetching"}
              onClick={() => void handleNameContinue(false)}
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
            </PrimaryButton>
            {!needsClerkName ? (
              <SkipButton onClick={() => void handleNameContinue(true)}>
                Skip for now
              </SkipButton>
            ) : null}
          </div>
        ) : null}

        {step === "integration" ? (
          <div className="flex flex-1 flex-col">
            <StepLabel step="integration" />
            <h2 className="mb-1.5 text-2xl font-bold">Connect your accounts</h2>
            <p className="mb-5 text-sm text-[#d9d9d9]">
              Link your email and calendar so Eilo can include them in your
              daily brief.
            </p>
            <div className="flex flex-col gap-3">
              <ConnectionRow
                name="Gmail"
                status={
                  data.gmailConnected ? "Connected (demo)" : "Not connected"
                }
                connected={data.gmailConnected}
                onToggle={() =>
                  setData((current) => ({
                    ...current,
                    gmailConnected: !current.gmailConnected,
                  }))
                }
              />
              <ConnectionRow
                name="Google Calendar"
                status="Coming soon"
                comingSoon
              />
              <ConnectionRow name="Outlook Mail" status="Coming soon" comingSoon />
            </div>
            <div className="mt-auto flex flex-col gap-3 pb-2 pt-8">
              <PrimaryButton onClick={() => goNext("integration")}>
                Continue
              </PrimaryButton>
              <SkipButton onClick={() => goNext("integration")}>
                Skip for now
              </SkipButton>
            </div>
          </div>
        ) : null}

        {step === "topics" ? (
          <div className="flex flex-1 flex-col">
            <StepLabel step="topics" />
            <h2 className="mb-1.5 text-2xl font-bold">Pick your topics</h2>
            <p className="mb-5 text-sm text-[#d9d9d9]">
              Choose what you&apos;re interested in. We&apos;ll curate your daily
              brief around these.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {TOPIC_OPTIONS.map((topic) => {
                const selected = data.topics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() =>
                      setData((current) => ({
                        ...current,
                        topics: selected
                          ? current.topics.filter((item) => item !== topic)
                          : [...current.topics, topic],
                      }))
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-[20px] border px-[18px] py-2.5 text-sm transition-colors",
                      selected
                        ? "border-[#fafafa] bg-[#fafafa] text-black"
                        : "border-[#313131] bg-[#1e1e1e] text-[#d9d9d9] hover:bg-[#2a2a2a]",
                    )}
                  >
                    {TOPIC_ICONS[topic]}
                    {topic}
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pb-2 pt-8">
              <PrimaryButton onClick={() => goNext("topics")}>
                Continue
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === "location" ? (
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 20%, #3a4a5a 0%, transparent 45%), radial-gradient(circle at 70% 80%, #2a3540 0%, transparent 40%)",
              }}
            />
            <div className="relative z-10 flex flex-1 flex-col">
              <StepLabel step="location" />
              <h2 className="mb-1.5 text-2xl font-bold">Enable local weather</h2>
              <p className="mb-5 text-sm text-[#d9d9d9]">
                Eilo uses your location to include today&apos;s local weather in
                your daily brief. Your location is never stored on our servers.
              </p>
              <div className="mt-auto flex flex-col gap-3 pb-2 pt-8">
                <PrimaryButton disabled={busy} onClick={handleAllowLocation}>
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Allow location access"
                  )}
                </PrimaryButton>
                <SkipButton onClick={() => goNext("location")}>
                  Not now
                </SkipButton>
              </div>
            </div>
          </div>
        ) : null}

        {step === "notifications" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#1e1e1e]">
              <Bell className="size-7" />
            </div>
            <StepLabel step="notifications" />
            <h2 className="text-[26px] font-bold leading-tight">
              Stay in the loop
            </h2>
            <p className="text-[15px] leading-relaxed text-[#d9d9d9]">
              Get notified when your daily brief is ready, or when a live station
              you follow goes on air.
            </p>
            <div className="flex w-full flex-col gap-3 pt-6">
              <PrimaryButton
                disabled={busy}
                onClick={() => void handleNotifications(true)}
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Turn on notifications"
                )}
              </PrimaryButton>
              <SkipButton onClick={() => void handleNotifications(false)}>
                Not now
              </SkipButton>
            </div>
          </div>
        ) : null}

        {step === "customize" ? (
          <div className="flex flex-1 flex-col">
            <StepLabel step="customize" />
            <h2 className="mb-1.5 text-2xl font-bold">
              Customize your daily brief
            </h2>
            <p className="mb-5 text-sm text-[#d9d9d9]">
              Choose what Eilo includes in your personalized daily brief each
              morning.
            </p>
            <div className="flex flex-col">
              {BRIEF_ITEMS.map((item) => {
                const checked = data.briefItems.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3.5 px-1 py-3.5 transition-colors hover:bg-[#1a1a1a]"
                  >
                    <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#1e1e1e] text-[#d9d9d9]">
                      {BRIEF_ICONS[item.id]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px]">{item.label}</div>
                      <div className="text-xs text-[#898989]">
                        {item.description}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setData((current) => ({
                          ...current,
                          briefItems: checked
                            ? current.briefItems.filter((id) => id !== item.id)
                            : [...current.briefItems, item.id],
                        }))
                      }
                      className="size-5 accent-[#7b5ea7]"
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-auto pb-2 pt-8">
              <PrimaryButton onClick={handleFinish}>Finish setup</PrimaryButton>
            </div>
          </div>
        ) : null}

        <div id="clerk-captcha" />
      </div>
    </div>
  );
}
