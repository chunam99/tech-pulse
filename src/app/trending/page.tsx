import { PageHeader } from "@/components/layout/PageHeader";
import { LanguageTabs } from "@/components/trending/LanguageTabs";
import { TrendingList } from "@/components/trending/TrendingList";
import { initDb } from "@/lib/db";
import { getTrendingRepos } from "@/lib/services/github";
import { getServerTranslations } from "@/i18n/server";

export const revalidate = 3600;

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: t("trending.metaTitle"),
    description: t("trending.metaDescription"),
  };
}

export default async function TrendingPage({ searchParams }: PageProps) {
  initDb();
  const { lang = "" } = await searchParams;
  const { messages, t } = await getServerTranslations();
  const repos = await getTrendingRepos({ language: lang, limit: 30 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader
        title={t("trending.title")}
        description={t("trending.description")}
      />
      <LanguageTabs activeLanguage={lang} />
      <TrendingList repos={repos} messages={messages} />
    </div>
  );
}
