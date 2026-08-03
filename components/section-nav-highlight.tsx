"use client";

import { useEffect } from "react";

const HIGHLIGHT_IDS = new Set([
  "features",
  "listen",
  "feature-daily-brief",
  "feature-conversation-recall",
  "feature-email-briefings",
  "feature-listen-anywhere",
  "feature-live-stations",
  "listen-email-inbox",
  "listen-web-news",
  "listen-routine",
]);
const HIGHLIGHT_MS = 1600;

function highlightSection(id: string) {
  if (!HIGHLIGHT_IDS.has(id)) return;

  const el = document.getElementById(id);
  if (!el) return;

  el.classList.remove("section-nav-highlight");
  // Restart animation if the class is already present
  void el.offsetWidth;
  el.classList.add("section-nav-highlight");

  window.setTimeout(() => {
    el.classList.remove("section-nav-highlight");
  }, HIGHLIGHT_MS);
}

function sectionIdFromHref(href: string | null) {
  if (!href) return null;
  if (href.startsWith("#")) return href.slice(1);
  try {
    const url = new URL(href, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) {
      return url.hash.slice(1);
    }
  } catch {
    return null;
  }
  return null;
}

export function SectionNavHighlight() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const id = sectionIdFromHref(link.getAttribute("href"));
      if (!id || !HIGHLIGHT_IDS.has(id)) return;
      window.requestAnimationFrame(() => {
        highlightSection(id);
      });
    };

    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      highlightSection(id);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);

    if (window.location.hash) {
      highlightSection(window.location.hash.slice(1));
    }

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
