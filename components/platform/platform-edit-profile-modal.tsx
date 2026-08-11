"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useUser } from "@clerk/nextjs";
import { useEffect, useId, useState } from "react";
import { splitDisplayName } from "@/lib/onboarding";
import { saveStoredPlatformProfile } from "@/lib/platform-profile-storage";
import { cn } from "@/lib/utils";

type PlatformEditProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  initialEmail: string;
  onSaved: (profile: { name: string; email: string }) => void;
};

function MaterialIcon({ name, className }: { name: string; className?: string }) {
  return <span className={cn("material-symbols-outlined", className)}>{name}</span>;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function PlatformEditProfileModal({
  open,
  onOpenChange,
  initialName,
  initialEmail,
  onSaved,
}: PlatformEditProfileModalProps) {
  const nameId = useId();
  const emailId = useId();
  const { user } = useUser();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initialName);
    setEmail(initialEmail);
    setError(null);
    setSuccessMessage(null);
  }, [open, initialName, initialEmail]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Enter your name.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let emailVerificationMessage: string | null = null;

      if (user) {
        const { firstName, lastName } = splitDisplayName(trimmedName);
        await user.update({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        });

        const currentEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";

        if (trimmedEmail !== currentEmail) {
          const existing = user.emailAddresses.find(
            (address) => address.emailAddress.toLowerCase() === trimmedEmail,
          );

          if (existing) {
            if (existing.verification?.status === "verified") {
              await user.update({ primaryEmailAddressId: existing.id });
            } else {
              await existing.prepareVerification({ strategy: "email_code" });
              emailVerificationMessage =
                "We sent a verification code to that email. Verify it in your account settings to make it primary.";
            }
          } else {
            const created = await user.createEmailAddress({ email: trimmedEmail });
            await created.prepareVerification({ strategy: "email_code" });
            emailVerificationMessage =
              "We sent a verification code to your new email. Verify it to finish updating your address.";
          }
        }

        await user.reload();
      } else {
        saveStoredPlatformProfile({ name: trimmedName, email: trimmedEmail });
      }

      onSaved({ name: trimmedName, email: trimmedEmail });

      if (emailVerificationMessage) {
        setSuccessMessage(emailVerificationMessage);
      } else {
        onOpenChange(false);
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Something went wrong while saving your profile.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#262626] bg-[#131313] shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between gap-3 border-b border-[#262626] px-5 py-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-white">
                Edit Profile
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-[#888888]">
                Update your name and email address.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close edit profile"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#888888] transition-colors hover:bg-white/10 hover:text-white"
              >
                <MaterialIcon name="close" className="text-[20px]" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSave} className="space-y-4 px-5 py-5">
            <div className="space-y-2">
              <label htmlFor={nameId} className="font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                Name
              </label>
              <input
                id={nameId}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-xl border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#666666] focus:border-white/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={emailId} className="font-mono text-[11px] tracking-[0.08em] text-[#888888]">
                Email address
              </label>
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@eilo.app"
                autoComplete="email"
                className="w-full rounded-xl border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#666666] focus:border-white/20"
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-xl border border-[#34c759]/30 bg-[#34c759]/10 px-4 py-3 text-sm text-[#34c759]">
                {successMessage}
              </p>
            ) : null}

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-full border border-[#262626] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={saving}
                onClick={
                  successMessage
                    ? (event) => {
                        event.preventDefault();
                        onOpenChange(false);
                      }
                    : undefined
                }
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Saving..." : successMessage ? "Done" : "Save Changes"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
