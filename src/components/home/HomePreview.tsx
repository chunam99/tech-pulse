"use client";

import Link from "next/link";
import { JobCard } from "@/components/jobs/JobCard";
import { RepoCard } from "@/components/trending/RepoCard";
import { HostingPlanCard } from "@/components/hosting/HostingPlanCard";
import { useTranslations } from "@/providers/I18nProvider";
import type { Job, TrendingRepo, HostingPlan } from "@/types";

type HomePreviewProps = {
  jobs: Job[];
  repos: TrendingRepo[];
  plans: HostingPlan[];
};

export function HomePreview({ jobs, repos, plans }: HomePreviewProps) {
  const { t } = useTranslations();

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {t("home.preview.jobsTitle")}
          </h2>
          <Link
            href="/jobs"
            className="text-sm text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {t("home.preview.viewAll")}
          </Link>
        </div>
        <div className="space-y-3">
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {t("home.preview.trendingTitle")}
          </h2>
          <Link
            href="/trending"
            className="text-sm text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {t("home.preview.viewAll")}
          </Link>
        </div>
        <div className="space-y-3">
          {repos.slice(0, 3).map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} rank={i + 1} />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {t("home.preview.hostingTitle")}
          </h2>
          <Link
            href="/hosting"
            className="text-sm text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {t("home.preview.compare")}
          </Link>
        </div>
        <div className="space-y-3">
          {plans.slice(0, 3).map((plan) => (
            <HostingPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>
    </div>
  );
}
