import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { HomePreview } from "@/components/home/HomePreview";
import { getJobs } from "@/lib/services/jobs";
import { getTrendingRepos } from "@/lib/services/github";
import { getHostingPlans } from "@/lib/services/hosting";

export const revalidate = 3600;

export default async function HomePage() {
  const [jobs, repos, plans] = await Promise.all([
    getJobs({ limit: 5 }),
    getTrendingRepos({ limit: 5 }),
    getHostingPlans(),
  ]);

  const cheapPlans = [...plans]
    .sort((a, b) => a.priceMonthlyUsd - b.priceMonthlyUsd)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <HeroSection />
      <div className="mt-12">
        <FeatureCards />
      </div>
      <div className="mt-16">
        <HomePreview jobs={jobs} repos={repos} plans={cheapPlans} />
      </div>
    </div>
  );
}
