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
          className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-95"
          aria-label="Go back"
        >
          <MaterialIcon name="arrow_back" className="text-[22px]" />
        </button>

        <Link
          href="/home"
          className="absolute left-1/2 -translate-x-1/2 text-[22px] font-bold tracking-[0.18em] text-white"
        >
          EILO
        </Link>

        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-[#262626] bg-[#2a2a2a]">
          <UserButton appearance={{ elements: { avatarBox: "size-10" } }} />
        </div>
      </header>

      <SubscriptionCheckoutPanel onPurchaseComplete={() => router.replace("/home")} />
    </div>
  );
}
