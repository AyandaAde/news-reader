import { Suspense } from "react";
import { SSOCallbackClient } from "./sso-callback-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-black text-[#888888]">
          <p className="text-sm">Completing sign in…</p>
        </div>
      }
    >
      <SSOCallbackClient />
    </Suspense>
  );
}
