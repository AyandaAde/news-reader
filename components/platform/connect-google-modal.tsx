"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleGIcon } from "@/components/icons/google-g-icon";
import { cn } from "@/lib/utils";

type ConnectGoogleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void | Promise<void>;
  isConnecting?: boolean;
  error?: string | null;
};

export function ConnectGoogleModal({
  open,
  onOpenChange,
  onConnect,
  isConnecting = false,
  error = null,
}: ConnectGoogleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#262626] bg-[#141414] text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Connect Google to create briefs</DialogTitle>
          <DialogDescription className="text-[#888888]">
            Link your Google account so Eilo can pull email, calendar, and other
            sources into your daily brief.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-[14px] border border-[#262626] bg-[#1a1a1a] p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
              <GoogleGIcon className="size-5" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-white">Google account</p>
              <p className="mt-1 text-sm leading-6 text-[#888888]">
                Required to generate personalized briefs from your inbox and Google
                services.
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <p className="rounded-[10px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
            {error}
          </p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isConnecting}
            className="flex-1 rounded-[10px] border border-[#2a2a2a] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={() => void onConnect()}
            disabled={isConnecting}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <GoogleGIcon className="size-5" />
            {isConnecting ? "Connecting..." : "Connect Google"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
