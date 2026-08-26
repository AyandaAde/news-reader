"use client";

import {
  TaskChooseOrganization,
  TaskResetPassword,
  TaskSetupMFA,
} from "@clerk/nextjs";
import { useSession } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type SessionTaskKey = "choose-organization" | "reset-password" | "setup-mfa";

const TASK_KEYS = new Set<string>([
  "choose-organization",
  "reset-password",
  "setup-mfa",
]);

function isSessionTaskKey(value: string | undefined): value is SessionTaskKey {
  return Boolean(value && TASK_KEYS.has(value));
}

function TasksLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
      <Loader2 className="size-5 animate-spin" />
    </div>
  );
}

export function AuthSessionTasksPage() {
  const router = useRouter();
  const params = useParams<{ rest?: string[] }>();
  const searchParams = useSearchParams();
  const { session, isLoaded } = useSession();

  const redirectUrl = searchParams.get("redirect_url") ?? "/home";
  const taskSegment = params.rest?.[0];
  const currentTaskKey = session?.currentTask?.key;

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!currentTaskKey) {
      router.replace(redirectUrl);
      return;
    }

    if (!isSessionTaskKey(taskSegment) || taskSegment !== currentTaskKey) {
      const nextUrl = `/sign-in/tasks/${currentTaskKey}?redirect_url=${encodeURIComponent(redirectUrl)}`;
      router.replace(nextUrl);
    }
  }, [currentTaskKey, isLoaded, redirectUrl, router, taskSegment]);

  if (!isLoaded || !isSessionTaskKey(taskSegment)) {
    return <TasksLoading />;
  }

  if (taskSegment !== currentTaskKey) {
    return <TasksLoading />;
  }

  switch (taskSegment) {
    case "choose-organization":
      return <TaskChooseOrganization redirectUrlComplete={redirectUrl} />;
    case "reset-password":
      return <TaskResetPassword redirectUrlComplete={redirectUrl} />;
    case "setup-mfa":
      return <TaskSetupMFA redirectUrlComplete={redirectUrl} />;
    default:
      return (
        <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
          <p className="text-sm">Unsupported session task.</p>
        </div>
      );
  }
}
