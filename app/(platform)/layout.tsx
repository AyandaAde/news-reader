import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProvisionSync } from "@/components/auth/user-provision-sync";
import { LoginLocationSync } from "@/components/auth/login-location-sync";
import { PlatformShell } from "@/components/platform/platform-shell";
import { googleSans } from "@/lib/fonts/google-sans";
import { cn } from "@/lib/utils";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth({ treatPendingAsSignedOut: false });

  if (!userId) redirect("/sign-in");

  return (
    <div
      className={cn(
        "platform-shell min-h-svh overflow-x-hidden bg-neutral-50 text-neutral-900 antialiased dark:bg-black dark:text-[#e2e2e2]",
        googleSans.variable,
        googleSans.className,
      )}
    >
      <UserProvisionSync />
      <LoginLocationSync />
      <PlatformShell>{children}</PlatformShell>
    </div>
  );
}
