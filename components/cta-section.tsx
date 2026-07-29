"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export function CtaSection() {
  const { t } = useI18n();

  return (
    <section
      id="get-started"
      className="pb-16 pt-8 md:pb-20"
      data-purpose="cta-block"
    >
      <div className="mx-auto max-w-container-max px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary p-8 text-primary-foreground md:flex-row md:p-12">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tighter md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="text-base text-primary-foreground/70 md:text-lg">
              {t("cta.description")}
            </p>
          </div>
          <Link
            href="/sign-in"
            className="inline-flex h-auto shrink-0 items-center justify-center rounded-lg bg-background px-5 py-2 text-sm font-bold text-primary transition-colors hover:bg-[#1a1a1c]"
          >
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
