import type { useRouter } from "next/navigation";

type AppRouter = ReturnType<typeof useRouter>;

type NavigateArgs = {
  session?: { currentTask?: { key?: string } | null } | null;
  decorateUrl: (url: string) => string;
};

export async function navigateAfterAuth(
  router: AppRouter,
  { decorateUrl }: NavigateArgs,
  fallbackPath = "/home",
) {
  const url = decorateUrl(fallbackPath);
  if (url.startsWith("http")) {
    window.location.href = url;
    return;
  }

  router.push(url);
}
