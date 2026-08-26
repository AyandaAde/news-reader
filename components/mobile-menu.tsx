"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/components/i18n-provider";

interface MobileMenuProps {
  className?: string;
}

export const MobileMenu = ({ className }: MobileMenuProps) => {
  const { t } = useI18n();
  const { isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = useMemo(
    () =>
      isSignedIn
        ? [
            { name: t("nav.features"), href: "/#features" },
            { name: t("nav.listen"), href: "/#listen" },
            { name: t("nav.platform"), href: "/home" },
            { name: t("nav.download"), href: "/#download" },
          ]
        : [
            { name: t("nav.features"), href: "/#features" },
            { name: t("nav.listen"), href: "/#listen" },
            { name: t("nav.download"), href: "/#download" },
            { name: t("nav.getStarted"), href: "/#get-started" },
          ],
    [isSignedIn, t],
  );

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Dialog.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "group relative z-50 flex size-10 items-center justify-center text-[#131313] lg:hidden dark:text-white",
            className
          )}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <div
          data-overlay="true"
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md lg:hidden"
        />

        <Dialog.Content
          onInteractOutside={(e) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.dataset.overlay !== "true"
            ) {
              e.preventDefault();
            }
          }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 flex flex-col outline-none lg:hidden"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="h-[4.5rem] shrink-0" />

          <nav
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 flex-col px-6 pt-16 pb-10"
          >
            <div className="flex flex-col gap-7">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="font-mono text-2xl uppercase tracking-[0.12em] text-white/55 transition-colors duration-150 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Link
              href={isSignedIn ? "/home" : "/sign-in"}
              onClick={handleLinkClick}
              className="mt-10 font-mono text-2xl uppercase tracking-[0.12em] text-[#e8c547] transition-colors duration-150 hover:text-[#f0d35c]"
            >
              {isSignedIn ? t("nav.platform") : t("nav.signIn")}
            </Link>

            <div className="mt-8">
              <ThemeToggle variant="onDark" className="my-0" />
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const MenuIcon = () => (
  <svg
    width="22"
    height="14"
    viewBox="0 0 22 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M0 1h22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M0 7h22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M0 13h22" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M3 3h14" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 5.5l9 9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.5 5.5l-9 9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
