"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { timeAgo } from "@/lib/utils";
import { useTranslations } from "@/providers/I18nProvider";
import type { Job } from "@/types";

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const { messages, t } = useTranslations();

  return (
    <Card hover className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link
            href={`/jobs/${job.slug}`}
            className="text-lg font-semibold text-foreground hover:text-violet-600 dark:hover:text-violet-300"
          >
            {job.title}
          </Link>
          <p className="mt-0.5 text-sm text-muted">{job.company}</p>
        </div>
        {job.remote && (
          <Badge variant="success">{t("jobs.remote")}</Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        {job.salary && <span>{job.salary}</span>}
        {job.location && <span>· {job.location}</span>}
        <span>· {timeAgo(job.postedAt, messages)}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {job.tags.slice(0, 6).map((tag) => (
          <Badge key={tag} variant="muted">
            {tag}
          </Badge>
        ))}
      </div>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
      >
        {t("jobs.viewOriginal")}
      </a>
    </Card>
  );
}
