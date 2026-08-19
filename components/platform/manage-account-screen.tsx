"use client";

import { useRouter } from "next/navigation";
import { ManageAccountPanel } from "@/components/platform/manage-account-panel";

function MaterialIcon({ name, className }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className ?? ""}`}>{name}</span>;
}

export function PlatformManageAccountScreen() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-95"
          aria-label="Go back"
        >
          <MaterialIcon name="arrow_back" className="text-[22px]" />
        </button>
        <h1 className="text-[1.65rem] font-bold tracking-tight text-white">
          Manage Account
        </h1>
      </header>

      <ManageAccountPanel />
    </div>
  );
}
