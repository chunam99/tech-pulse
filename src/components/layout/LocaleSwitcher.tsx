"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "@/providers/I18nProvider";
import { locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const { locale, t } = useTranslations();
  const router = useRouter();

  function setLocale(next: Locale) {
    document.cookie = `locale=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  return (
    <div
      className="flex rounded-lg border border-border bg-surface p-0.5 text-xs font-medium"
      role="group"
      aria-label={t("locale.label")}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          className={`rounded-md px-2.5 py-1.5 transition-colors ${
            locale === loc
              ? "bg-violet-600 text-white"
              : "text-muted hover:text-foreground"
          }`}
          aria-pressed={locale === loc}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
