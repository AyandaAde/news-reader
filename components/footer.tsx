"use client";

import Image from "next/image";
import Link from "next/link";
import { FooterLanguageSelect } from "@/components/footer-language-select";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/components/i18n-provider";

const footerLinkClassName =
  "text-sm text-[#6b6570] transition-colors hover:text-[#1a1a1c] dark:text-[#968da1] dark:hover:text-[#e4e2e4]";

const footerHeadingClassName =
  "mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a1a1c] dark:text-[#e4e2e4]";

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h5 className={footerHeadingClassName}>{title}</h5>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link className={footerLinkClassName} href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full pt-8" data-purpose="site-footer">
      <div className="w-full overflow-hidden rounded-t-[2rem] bg-[#dcdce0] px-6 py-12 text-[#1a1a1c] md:rounded-t-[3rem] md:px-12 md:py-14 dark:bg-[#131315] dark:text-[#e4e2e4]">
        <div className="mx-auto max-w-container-max">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
            <div>
              <Link href="/" className="mb-5 inline-flex" aria-label="Eilo home">
                <Image
                  src="/images/logo-2.png"
                  alt="Eilo"
                  width={120}
                  height={40}
                  className="h-6 w-auto object-contain sm:h-7"
                />
              </Link>
              <p className="mb-8 max-w-xs text-sm leading-6 text-[#6b6570] dark:text-[#968da1]">
                {t("footer.description")}
              </p>
            </div>

            <FooterLinkColumn
              title={t("footer.product")}
              links={[
                { label: t("nav.features"), href: "#features" },
                { label: t("nav.listen"), href: "#listen" },
                { label: t("nav.getStarted"), href: "#get-started" },
              ]}
            />

            <FooterLinkColumn
              title={t("footer.company")}
              links={[{ label: t("footer.about"), href: "#" }]}
            />

            <FooterLinkColumn
              title={t("footer.legal")}
              links={[{ label: t("footer.privacy"), href: "#" }]}
            />
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#c4c4ca] pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-[#353437]">
            <p className="text-xs text-[#6b6570] dark:text-[#968da1]">
              © {year} Eilo. {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <FooterLanguageSelect />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
