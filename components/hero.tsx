"use client";

import Link from "next/link";
import { GL } from "./gl";
import { Button } from "./ui/button";
import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";

export function Hero() {
  const { t } = useI18n();
  const [hovering, setHovering] = useState(false);

  return (
    <div className="relative flex h-svh flex-col justify-between overflow-x-hidden bg-[#f5f5f7] text-[#131313] dark:bg-black dark:text-white">
      <div className="absolute inset-0 z-0">
        <GL hovering={hovering} />
      </div>

      <div className="relative z-10 mt-auto pb-16 text-center">
        <h1 className="font-sentient text-5xl sm:text-6xl md:text-7xl">
          {t("hero.titleLine1")}
          <br />
          <i className="font-light">{t("hero.titleLine2")}</i>
        </h1>
        <p className="mx-auto mt-8 max-w-[440px] text-balance font-mono text-sm text-black/55 sm:text-base dark:text-white/60">
          {t("hero.description")}
        </p>

        <Link className="contents max-sm:hidden" href="/#get-started">
          <Button
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {t("hero.cta")}
          </Button>
        </Link>
        <Link className="contents sm:hidden" href="/#get-started">
          <Button
            size="sm"
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {t("hero.cta")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
