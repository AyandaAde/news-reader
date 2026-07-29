"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useI18n } from "@/components/i18n-provider";
import { isLanguage, languages, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function getLanguageLabel(value: Language) {
  return languages.find((lang) => lang.value === value)?.label ?? value;
}

export function FooterLanguageSelect() {
  const { language, setLanguage, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerClassName = cn(
    "my-2 h-7 w-[9.5rem] shrink-0 justify-start gap-2 rounded-lg border border-[#9a9aa0] bg-[#ececef] px-3 text-xs text-[#3a3a40] shadow-none hover:bg-[#f5f5f7] hover:text-[#1a1a1c] focus-visible:border-[#7a7a80] focus-visible:ring-0 dark:border-[#353437] dark:bg-[#1f1f21] dark:text-[#cdc2d8] dark:hover:bg-[#2a2a2c] dark:hover:text-[#e4e2e4] dark:focus-visible:border-[#4b4455] [&>svg:last-child]:ml-auto [&>svg:last-child]:size-3.5 [&>svg:last-child]:text-[#6b6570] dark:[&>svg:last-child]:text-[#968da1]",
  );

  if (!mounted) {
    return (
      <div className={cn(triggerClassName, "animate-pulse rounded-lg")} aria-hidden />
    );
  }

  return (
    <Select
      value={language}
      onValueChange={(value) => {
        if (typeof value === "string" && isLanguage(value)) {
          setLanguage(value);
        }
      }}
    >
      <SelectTrigger size="sm" aria-label={t("footer.language")} className={triggerClassName}>
        <Languages className="size-3.5 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-left">
          {getLanguageLabel(language)}
        </span>
      </SelectTrigger>
      <SelectContent
        align="end"
        side="top"
        sideOffset={8}
        className="min-w-[9.5rem] border-[#9a9aa0] bg-[#ececef] text-[#1a1a1c] dark:border-[#353437] dark:bg-[#1f1f21] dark:text-[#e4e2e4]"
      >
        {languages.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="rounded-lg text-[#3a3a40] focus:bg-[#d8d8dc] focus:text-[#1a1a1c] dark:text-[#cdc2d8] dark:focus:bg-[#353437] dark:focus:text-[#e4e2e4]"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
