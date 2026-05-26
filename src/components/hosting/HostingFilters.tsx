"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/providers/I18nProvider";

type Provider = { slug: string; name: string; count: number };

type HostingFiltersProps = {
  providers: Provider[];
};

export function HostingFilters({ providers }: HostingFiltersProps) {
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") ?? "";
  const minRam = searchParams.get("minRam") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = {
      provider,
      minRam,
      maxPrice,
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const q = params.toString();
    return q ? `/hosting?${q}` : "/hosting";
  }

  const filterBtn =
    "rounded-lg px-3 py-1.5 text-sm transition-colors";
  const activeFilter = "bg-violet-600 text-white";
  const inactiveFilter =
    "bg-surface-hover text-muted hover:bg-border hover:text-foreground";

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ provider: "" })}
          className={`${filterBtn} ${!provider ? activeFilter : inactiveFilter}`}
        >
          {t("hosting.all")}
        </Link>
        {providers.map((p) => (
          <Link
            key={p.slug}
            href={buildHref({ provider: p.slug })}
            className={`${filterBtn} ${
              provider === p.slug ? activeFilter : inactiveFilter
            }`}
          >
            {p.name} ({p.count})
          </Link>
        ))}
      </div>
      <form method="get" className="flex flex-wrap gap-2">
        {provider && <input type="hidden" name="provider" value={provider} />}
        <select
          name="minRam"
          defaultValue={minRam}
          className="rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground"
        >
          <option value="">{t("hosting.minRam")}</option>
          <option value="1">≥ 1 GB</option>
          <option value="2">≥ 2 GB</option>
          <option value="4">≥ 4 GB</option>
          <option value="8">≥ 8 GB</option>
        </select>
        <select
          name="maxPrice"
          defaultValue={maxPrice}
          className="rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground"
        >
          <option value="">{t("hosting.maxPrice")}</option>
          <option value="6">≤ $6</option>
          <option value="10">≤ $10</option>
          <option value="15">≤ $15</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500"
        >
          {t("hosting.filter")}
        </button>
      </form>
    </div>
  );
}
