"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { EiloLogo } from "@/components/eilo-logo";
import {
  Menu,
  MenuItem,
  HoveredLink,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export const Header = ({ className }: { className?: string }) => {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 pt-5 px-4 sm:px-6 md:px-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link
          href="/"
          className="relative z-50 flex shrink-0 items-center"
          aria-label="Eilo home"
        >
          <EiloLogo priority />
        </Link>

        <div className="hidden flex-1 justify-center lg:flex">
          <Menu setActive={setActive}>
            <MenuItem
              setActive={setActive}
              active={active}
              item={t("nav.features")}
              href="/#features"
            >
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/#feature-daily-brief">
                  {t("core.dailyBrief.title")}
                </HoveredLink>
                <HoveredLink href="/#feature-conversation-recall">
                  {t("core.conversationRecall.title")}
                </HoveredLink>
                <HoveredLink href="/#feature-email-briefings">
                  {t("core.emailBriefings.title")}
                </HoveredLink>
                <HoveredLink href="/#feature-listen-anywhere">
                  {t("core.listenAnywhere.title")}
                </HoveredLink>
                <HoveredLink href="/#feature-live-stations">
                  {t("core.liveStations.title")}
                </HoveredLink>
              </div>
            </MenuItem>

            <MenuItem
              setActive={setActive}
              active={active}
              item={t("nav.listen")}
              href="/#listen"
            >
              <div className="grid grid-cols-1 gap-4 p-2 text-sm sm:grid-cols-3 sm:gap-6">
                <ProductItem
                  title={t("listen.emailInbox.title")}
                  description={t("listen.emailInbox.description")}
                  href="/#listen-email-inbox"
                  src="/images/email-inbox.png"
                />
                <ProductItem
                  title={t("listen.webNews.title")}
                  description={t("listen.webNews.description")}
                  href="/#listen-web-news"
                  src="/images/web-and-news.png"
                />
                <ProductItem
                  title={t("listen.routine.title")}
                  description={t("listen.routine.description")}
                  href="/#listen-routine"
                  src="/images/your-routine.png"
                />
              </div>
            </MenuItem>

            <MenuItem
              setActive={setActive}
              active={active}
              item={t("nav.getStarted")}
            >
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/#download">{t("nav.download")}</HoveredLink>
                <HoveredLink href="/sign-up">{t("cta.button")}</HoveredLink>
                <HoveredLink href="/sign-in">{t("nav.signIn")}</HoveredLink>
              </div>
            </MenuItem>

            <ThemeToggle className="my-0 border-white/20 bg-white/10 text-neutral-300 hover:bg-white/15 hover:text-white dark:border-white/20 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/15 dark:hover:text-white" />
          </Menu>
        </div>

        <div className="relative z-50 flex shrink-0 items-center gap-3 sm:gap-4">
          <ThemeToggle className="my-0 lg:hidden" />
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="hidden text-sm font-medium text-[#131313] transition-colors hover:text-[#131313]/80 lg:inline-block dark:text-white dark:hover:text-white/80"
            >
              {t("nav.signIn")}
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8",
                },
              }}
            />
          </Show>
          <MobileMenu />
        </div>
      </div>
    </div>
  );
};
