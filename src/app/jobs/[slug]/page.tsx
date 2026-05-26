import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { initDb } from "@/lib/db";
import { getJobBySlug } from "@/lib/services/jobs";
import { timeAgo } from "@/lib/utils";
import { getServerTranslations } from "@/i18n/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { t } = await getServerTranslations();

  initDb();
  const job = await getJobBySlug(slug);
  if (!job) return { title: t("jobs.notFound") };
  return {
    title: `${job.title} @ ${job.company}`,
    description: t("jobs.detailDescription", {
      title: job.title,
      company: job.company,
      tags: job.tags.join(", "),
    }),
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  initDb();
  const job = await getJobBySlug(slug);
  const { messages, t } = await getServerTranslations();

  if (!job) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/jobs" className="text-sm text-muted hover:text-foreground">
        {t("jobs.backToList")}
      </Link>
      <Card className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
            <p className="mt-2 text-lg text-muted">{job.company}</p>
          </div>
          {job.remote && (
            <Badge variant="success">{t("jobs.remote")}</Badge>
          )}
        </div>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          {job.salary && (
            <div>
              <dt className="text-muted">{t("jobs.salary")}</dt>
              <dd className="text-foreground">{job.salary}</dd>
            </div>
          )}
          {job.location && (
            <div>
              <dt className="text-muted">{t("jobs.location")}</dt>
              <dd className="text-foreground">{job.location}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted">{t("jobs.posted")}</dt>
            <dd className="text-foreground">
              {timeAgo(job.postedAt, messages)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">{t("jobs.source")}</dt>
            <dd className="text-foreground">{job.source}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-8">
          <Button href={job.url}>{t("jobs.apply")}</Button>
        </div>
      </Card>
    </div>
  );
}
