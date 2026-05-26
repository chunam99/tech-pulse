"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/providers/I18nProvider";

export function HeroSection() {
  const { t } = useTranslations();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] px-6 py-12 sm:px-10 sm:py-16">
      <div className="relative z-10 max-w-2xl">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          {t("home.hero.tagline")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("home.hero.title")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("home.hero.description")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/jobs">{t("home.hero.ctaJobs")}</Button>
          <Button href="/trending" variant="secondary">
            {t("home.hero.ctaTrending")}
          </Button>
          <Button href="/hosting" variant="ghost">
            {t("home.hero.ctaHosting")}
          </Button>
        </div>
      </div>
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl"
        aria-hidden
      />
    </section>
  );
}
