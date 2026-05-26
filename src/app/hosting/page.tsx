import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HostingFilters } from "@/components/hosting/HostingFilters";
import { HostingPlanGrid } from "@/components/hosting/HostingPlanGrid";
import { HostingCompareTable } from "@/components/hosting/HostingCompareTable";
import { initDb } from "@/lib/db";
import {
  getHostingPlans,
  getHostingProviders,
} from "@/lib/services/hosting";
import { getServerTranslations } from "@/i18n/server";

export const revalidate = 86400;

type PageProps = {
  searchParams: Promise<{
    provider?: string;
    minRam?: string;
    maxPrice?: string;
  }>;
};

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: t("hosting.metaTitle"),
    description: t("hosting.metaDescription"),
  };
}

export default async function HostingPage({ searchParams }: PageProps) {
  initDb();
  const params = await searchParams;
  const { messages, t } = await getServerTranslations();

  const minRam = params.minRam ? Number(params.minRam) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const [plans, providers] = await Promise.all([
    getHostingPlans({
      provider: params.provider,
      minRam,
      maxPrice,
    }),
    getHostingProviders(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader
        title={t("hosting.title")}
        description={t("hosting.description")}
      />
      <Suspense
        fallback={
          <div className="h-16 animate-pulse rounded-lg bg-surface-hover" />
        }
      >
        <HostingFilters providers={providers} />
      </Suspense>
      <HostingPlanGrid plans={plans} messages={messages} />
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {t("hosting.compareTitle")}
        </h2>
        <HostingCompareTable plans={plans} messages={messages} />
      </section>
      <p className="mt-6 text-xs text-muted-foreground">
        {t("hosting.disclaimer")}
      </p>
    </div>
  );
}
