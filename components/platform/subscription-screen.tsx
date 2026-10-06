"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubscriptionCheckoutPanel } from "@/components/platform/subscription-checkout-panel";

function MaterialIcon({ name, className }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

export function PlatformSubscriptionScreen() {
  const router = useRouter();

  return (
    <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-4xl flex-col bg-white pb-9 dark:bg-black">
      <header className="relative z-10 mb-8 flex items-center justify-between sm:mb-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full text-[#171717] transition-colors hover:bg-[#f5f5f5] active:scale-[0.96] dark:text-white dark:hover:bg-white/10"
          aria-label="Go back"
        >
          <MaterialIcon name="arrow_back" className="text-[22px]" />
        </button>

        <Link
          href="/home"
          className="absolute left-1/2 -translate-x-1/2 text-[22px] font-bold tracking-[0.18em] text-[#171717] dark:text-white"
        >
          EILO
        </Link>

        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-[#e5e5e5] bg-[#f5f5f5] dark:border-[#262626] dark:bg-[#2a2a2a]">
          <UserButton appearance={{ elements: { avatarBox: "size-10" } }} />
        </div>
      </header>

      <div className="relative z-10">
        <SubscriptionCheckoutPanel onPurchaseComplete={() => router.replace("/home")} />
      </div>
    </div>
  );
}
