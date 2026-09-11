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
    <div className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-4xl flex-col pb-8">
      <header className="relative mb-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 active:scale-95 dark:text-white dark:hover:bg-white/10"
          aria-label="Go back"
        >
          <MaterialIcon name="arrow_back" className="text-[22px]" />
        </button>

        <Link
          href="/home"
          className="absolute left-1/2 -translate-x-1/2 text-[22px] font-bold tracking-[0.18em] text-neutral-900 dark:text-white"
        >
          EILO
        </Link>

        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 dark:border-[#262626] dark:bg-[#2a2a2a]">
          <UserButton appearance={{ elements: { avatarBox: "size-10" } }} />
        </div>
      </header>

      <SubscriptionCheckoutPanel onPurchaseComplete={() => router.replace("/home")} />
    </div>
  );
}
