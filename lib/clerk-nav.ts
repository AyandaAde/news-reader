import type { useRouter } from "next/navigation";

type AppRouter = ReturnType<typeof useRouter>;

type NavigateArgs = {
  session?: { currentTask?: unknown } | null;
  decorateUrl: (url: string) => string;
};

export async function navigateAfterAuth(
  router: AppRouter,
  { session, decorateUrl }: NavigateArgs,
  fallbackPath = "/sign-in/continue",
) {
  if (session?.currentTask) {
    return;
  }

  const url = decorateUrl(fallbackPath);
  if (url.startsWith("http")) {
    window.location.href = url;
    return;
  }

  router.push(url);
}
