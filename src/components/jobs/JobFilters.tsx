"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "@/providers/I18nProvider";

type JobFiltersProps = {
  tags: string[];
};

export function JobFilters({ tags }: JobFiltersProps) {
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";
  const search = searchParams.get("q") ?? "";

  return (
    <div className="mb-6 space-y-4">
      <form method="get" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder={t("jobs.searchPlaceholder")}
          className="flex-1 rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        {activeTag && <input type="hidden" name="tag" value={activeTag} />}
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          {t("jobs.search")}
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        <Link href="/jobs">
          <Badge variant={!activeTag ? "default" : "muted"}>
            {t("jobs.all")}
          </Badge>
        </Link>
        {tags.map((tag) => (
          <Link key={tag} href={`/jobs?tag=${encodeURIComponent(tag)}`}>
            <Badge variant={activeTag === tag ? "default" : "muted"}>
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
