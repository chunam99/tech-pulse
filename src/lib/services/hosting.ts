import { getDb, isSqliteEnabled } from "@/lib/db";
import { hostingPlans } from "@/lib/db/schema";
import { HOSTING_SEED_PLANS } from "@/lib/services/hosting-data";
import type { HostingPlan } from "@/types";
import { asc } from "drizzle-orm";

function rowToPlan(row: typeof hostingPlans.$inferSelect): HostingPlan {
  return {
    id: row.id,
    provider: row.provider,
    providerSlug: row.providerSlug,
    name: row.name,
    ramGb: row.ramGb,
    cpuCores: row.cpuCores,
    storageGb: row.storageGb,
    bandwidthTb: row.bandwidthTb,
    priceMonthlyUsd: row.priceMonthlyUsd,
    region: row.region,
    affiliateUrl: row.affiliateUrl,
    features: JSON.parse(row.features) as string[],
  };
}

function filterPlans(
  plans: HostingPlan[],
  options?: { minRam?: number; maxPrice?: number; provider?: string },
): HostingPlan[] {
  let result = [...plans].sort((a, b) => a.priceMonthlyUsd - b.priceMonthlyUsd);

  if (options?.minRam) {
    result = result.filter((p) => p.ramGb >= options.minRam!);
  }
  if (options?.maxPrice) {
    result = result.filter((p) => p.priceMonthlyUsd <= options.maxPrice!);
  }
  if (options?.provider) {
    result = result.filter((p) => p.providerSlug === options.provider);
  }

  return result;
}

export async function syncHosting(): Promise<number> {
  if (!isSqliteEnabled) {
    return HOSTING_SEED_PLANS.length;
  }

  const db = await getDb();
  if (!db) return HOSTING_SEED_PLANS.length;

  const now = new Date().toISOString();

  for (const plan of HOSTING_SEED_PLANS) {
    await db
      .insert(hostingPlans)
      .values({
        id: plan.id,
        provider: plan.provider,
        providerSlug: plan.providerSlug,
        name: plan.name,
        ramGb: plan.ramGb,
        cpuCores: plan.cpuCores,
        storageGb: plan.storageGb,
        bandwidthTb: plan.bandwidthTb,
        priceMonthlyUsd: plan.priceMonthlyUsd,
        region: plan.region,
        affiliateUrl: plan.affiliateUrl,
        features: JSON.stringify(plan.features),
        syncedAt: now,
      })
      .onConflictDoUpdate({
        target: hostingPlans.id,
        set: {
          priceMonthlyUsd: plan.priceMonthlyUsd,
          features: JSON.stringify(plan.features),
          syncedAt: now,
        },
      });
  }

  return HOSTING_SEED_PLANS.length;
}

export async function getHostingPlans(options?: {
  minRam?: number;
  maxPrice?: number;
  provider?: string;
}): Promise<HostingPlan[]> {
  if (!isSqliteEnabled) {
    return filterPlans(HOSTING_SEED_PLANS, options);
  }

  const db = await getDb();
  if (!db) {
    return filterPlans(HOSTING_SEED_PLANS, options);
  }

  const rows = await db
    .select()
    .from(hostingPlans)
    .orderBy(asc(hostingPlans.priceMonthlyUsd));

  if (rows.length === 0) {
    await syncHosting();
    return getHostingPlans(options);
  }

  return filterPlans(rows.map(rowToPlan), options);
}

export async function getHostingProviders(): Promise<
  { slug: string; name: string; count: number }[]
> {
  const plans = await getHostingPlans();
  const map = new Map<string, { name: string; count: number }>();

  for (const p of plans) {
    const existing = map.get(p.providerSlug);
    if (existing) existing.count++;
    else map.set(p.providerSlug, { name: p.provider, count: 1 });
  }

  return [...map.entries()].map(([slug, { name, count }]) => ({
    slug,
    name,
    count,
  }));
}
