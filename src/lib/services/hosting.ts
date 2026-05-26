import { db, initDb } from "@/lib/db";
import { hostingPlans } from "@/lib/db/schema";
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

/** Seed data — cập nhật thủ công hoặc mở rộng scraper sau */
const SEED_PLANS: Omit<HostingPlan, "id">[] = [
  {
    provider: "DigitalOcean",
    providerSlug: "digitalocean",
    name: "Basic 1GB",
    ramGb: 1,
    cpuCores: 1,
    storageGb: 25,
    bandwidthTb: 1,
    priceMonthlyUsd: 6,
    region: "Global",
    affiliateUrl: "https://www.digitalocean.com/pricing/droplets",
    features: ["SSD", "Monitoring", "API"],
  },
  {
    provider: "DigitalOcean",
    providerSlug: "digitalocean",
    name: "Basic 2GB",
    ramGb: 2,
    cpuCores: 1,
    storageGb: 50,
    bandwidthTb: 2,
    priceMonthlyUsd: 12,
    region: "Global",
    affiliateUrl: "https://www.digitalocean.com/pricing/droplets",
    features: ["SSD", "Monitoring", "API"],
  },
  {
    provider: "Vultr",
    providerSlug: "vultr",
    name: "Cloud Compute 1GB",
    ramGb: 1,
    cpuCores: 1,
    storageGb: 25,
    bandwidthTb: 1,
    priceMonthlyUsd: 5,
    region: "Global",
    affiliateUrl: "https://www.vultr.com/pricing/",
    features: ["NVMe", "IPv6", "Snapshots"],
  },
  {
    provider: "Vultr",
    providerSlug: "vultr",
    name: "Cloud Compute 2GB",
    ramGb: 2,
    cpuCores: 1,
    storageGb: 55,
    bandwidthTb: 2,
    priceMonthlyUsd: 10,
    region: "Global",
    affiliateUrl: "https://www.vultr.com/pricing/",
    features: ["NVMe", "IPv6", "Snapshots"],
  },
  {
    provider: "Linode (Akamai)",
    providerSlug: "linode",
    name: "Nanode 1GB",
    ramGb: 1,
    cpuCores: 1,
    storageGb: 25,
    bandwidthTb: 1,
    priceMonthlyUsd: 5,
    region: "Global",
    affiliateUrl: "https://www.linode.com/pricing/",
    features: ["SSD", "Backups optional"],
  },
  {
    provider: "Linode (Akamai)",
    providerSlug: "linode",
    name: "Linode 2GB",
    ramGb: 2,
    cpuCores: 1,
    storageGb: 50,
    bandwidthTb: 2,
    priceMonthlyUsd: 12,
    region: "Global",
    affiliateUrl: "https://www.linode.com/pricing/",
    features: ["SSD", "Backups optional"],
  },
  {
    provider: "Hetzner",
    providerSlug: "hetzner",
    name: "CX22",
    ramGb: 4,
    cpuCores: 2,
    storageGb: 40,
    bandwidthTb: 20,
    priceMonthlyUsd: 4.5,
    region: "EU",
    affiliateUrl: "https://www.hetzner.com/cloud",
    features: ["NVMe", "IPv4+IPv6", "Giá EU"],
  },
  {
    provider: "Hetzner",
    providerSlug: "hetzner",
    name: "CX32",
    ramGb: 8,
    cpuCores: 4,
    storageGb: 80,
    bandwidthTb: 20,
    priceMonthlyUsd: 7.5,
    region: "EU",
    affiliateUrl: "https://www.hetzner.com/cloud",
    features: ["NVMe", "IPv4+IPv6", "Giá EU"],
  },
  {
    provider: "Contabo",
    providerSlug: "contabo",
    name: "Cloud VPS S",
    ramGb: 4,
    cpuCores: 4,
    storageGb: 50,
    bandwidthTb: 32,
    priceMonthlyUsd: 6.99,
    region: "EU/US",
    affiliateUrl: "https://contabo.com/en/vps/",
    features: ["Unlimited traffic*", "Giá rẻ"],
  },
  {
    provider: "Contabo",
    providerSlug: "contabo",
    name: "Cloud VPS M",
    ramGb: 8,
    cpuCores: 6,
    storageGb: 100,
    bandwidthTb: 32,
    priceMonthlyUsd: 10.99,
    region: "EU/US",
    affiliateUrl: "https://contabo.com/en/vps/",
    features: ["Unlimited traffic*", "Giá rẻ"],
  },
];

export async function syncHosting(): Promise<number> {
  initDb();
  const now = new Date().toISOString();

  for (const plan of SEED_PLANS) {
    const id = `${plan.providerSlug}-${slugifyPlan(plan.name)}`;
    await db
      .insert(hostingPlans)
      .values({
        id,
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

  return SEED_PLANS.length;
}

function slugifyPlan(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function getHostingPlans(options?: {
  minRam?: number;
  maxPrice?: number;
  provider?: string;
}): Promise<HostingPlan[]> {
  initDb();
  const rows = await db
    .select()
    .from(hostingPlans)
    .orderBy(asc(hostingPlans.priceMonthlyUsd));

  if (rows.length === 0) {
    await syncHosting();
    return getHostingPlans(options);
  }

  let plans = rows.map(rowToPlan);

  if (options?.minRam) {
    plans = plans.filter((p) => p.ramGb >= options.minRam!);
  }
  if (options?.maxPrice) {
    plans = plans.filter((p) => p.priceMonthlyUsd <= options.maxPrice!);
  }
  if (options?.provider) {
    plans = plans.filter((p) => p.providerSlug === options.provider);
  }

  return plans;
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

export { getPricePerGbRam } from "@/lib/utils";
