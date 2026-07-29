import { PlatformBottomNav } from "@/components/platform/platform-bottom-nav";
import { PlatformHeader } from "@/components/platform/platform-header";
import { PlatformMiniPlayer } from "@/components/platform/platform-mini-player";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh overflow-x-hidden bg-[#131313] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 z-0" />
      <PlatformHeader />
      <main className="relative z-10 mx-auto max-w-[1200px] px-4 pb-32 pt-24">
        {children}
      </main>
      <PlatformMiniPlayer />
      <PlatformBottomNav />
    </div>
  );
}
