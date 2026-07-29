"use client";

import Image from "next/image";
import { useI18n } from "@/components/i18n-provider";

export function IntegrationSection() {
  const { t } = useI18n();

  const cards = [
    {
      id: "listen-email-inbox",
      title: t("listen.emailInbox.title"),
      description: t("listen.emailInbox.description"),
      image: "/images/email-inbox.png",
      featured: true,
    },
    {
      id: "listen-web-news",
      title: t("listen.webNews.title"),
      description: t("listen.webNews.description"),
      image: "/images/web-and-news.png",
      featured: false,
    },
    {
      id: "listen-routine",
      title: t("listen.routine.title"),
      description: t("listen.routine.description"),
      image: "/images/your-routine.png",
      featured: false,
    },
  ];

  return (
    <section
      id="listen"
      className="scroll-mt-28 pt-section-padding-md"
      data-purpose="integration"
    >
      <div className="mx-auto max-w-container-max px-6">
        <div className="mb-16 md:mb-24">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-4 block text-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                {t("listen.eyebrow")}
              </span>
              <h2 className="text-4xl font-bold text-on-surface md:text-5xl">
                {t("listen.title")}
                <br />
                <span className="text-on-surface-variant">
                  {t("listen.titleAccent")}
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-on-surface-variant">
              {t("listen.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-card-gap md:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                id={card.id}
                className={
                  card.featured
                    ? "glass-card scroll-mt-28 overflow-hidden rounded-2xl border-t-2 border-white/10"
                    : "glass-card scroll-mt-28 overflow-hidden rounded-2xl"
                }
              >
                <div className="relative min-h-[180px] w-full bg-surface-bright md:min-h-[220px]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-8">
                  <h3 className="mb-4 text-xl font-bold text-on-surface">
                    {card.title}
                  </h3>
                  <p className="text-on-surface-variant">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
