import { PlatformShell } from "@/components/platform/platform-shell";
import { googleSans } from "@/lib/fonts/google-sans";
import { cn } from "@/lib/utils";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "platform-shell min-h-svh overflow-x-hidden bg-black text-[#e2e2e2] antialiased",
        googleSans.variable,
        googleSans.className,
      )}
    >
      <PlatformShell>{children}</PlatformShell>
    </div>
  );
}
