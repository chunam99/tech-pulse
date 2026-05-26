import { Suspense } from "react";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobList } from "@/components/jobs/JobList";
import { PageHeader } from "@/components/layout/PageHeader";
import { getJobs, getJobTags } from "@/lib/services/jobs";
import { getServerTranslations } from "@/i18n/server";

export const revalidate = 3600;

type PageProps = {
  searchParams: Promise<{ tag?: string; q?: string }>;
};

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: t("jobs.metaTitle"),
    description: t("jobs.metaDescription"),
  };
}

export default async function JobsPage({ searchParams }: PageProps) {
  const { tag, q } = await searchParams;
  const { messages, t } = await getServerTranslations();

  const [jobs, tags] = await Promise.all([
    getJobs({ tag, search: q, limit: 50 }),
    getJobTags(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader
        title={t("jobs.title")}
        description={t("jobs.description")}
      />
      <Suspense
        fallback={
          <div className="h-20 animate-pulse rounded-lg bg-surface-hover" />
        }
      >
        <JobFilters tags={tags} />
      </Suspense>
      <JobList jobs={jobs} messages={messages} />
    </div>
  );
}
