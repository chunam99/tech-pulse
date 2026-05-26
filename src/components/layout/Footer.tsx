"use client";

import { useTranslations } from "@/providers/I18nProvider";

export function Footer() {
  const { t } = useTranslations();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-center text-sm text-muted">{t("footer.text")}</p>
      </div>
    </footer>
  );
}
