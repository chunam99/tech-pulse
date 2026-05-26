import { getDb, initDb, isSqliteEnabled } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import type { Job } from "@/types";
import { unstable_cache } from "next/cache";
import { desc, eq } from "drizzle-orm";

type RemoteOkItem = {
  id?: string;
  slug?: string;
  position?: string;
  company?: string;
  location?: string;
  tags?: string[];
  salary_min?: number;
  salary_max?: number;
  url?: string;
  date?: string;
  epoch?: number;
};

function rowToJob(row: typeof jobs.$inferSelect): Job {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    company: row.company,
    location: row.location,
    remote: row.remote,
    tags: JSON.parse(row.tags) as string[],
    salary: row.salary,
    url: row.url,
    source: row.source,
    postedAt: row.postedAt,
  };
}

function filterJobs(
  list: Job[],
  options?: { tag?: string; search?: string; limit?: number },
): Job[] {
  let result = list;

  if (options?.tag) {
    const tag = options.tag.toLowerCase();
    result = result.filter((j) =>
      j.tags.some((t) => t.toLowerCase().includes(tag)),
    );
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    result = result.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return result.slice(0, options?.limit ?? 50);
}

export async function fetchRemoteOkJobs(): Promise<Job[]> {
  const res = await fetch("https://remoteok.com/api", {
    headers: {
      Accept: "application/json",
      "User-Agent": "TechPulse/1.0 (job aggregator)",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`RemoteOK API error: ${res.status}`);
  }

  const data = (await res.json()) as RemoteOkItem[];
  const items = data.filter((item) => item.id && item.position);

  return items.map((item) => {
    const title = item.position!;
    const company = item.company ?? "Unknown";
    const slug = slugify(`${title}-${company}-${item.id}`);
    const salary =
      item.salary_min || item.salary_max
        ? `$${item.salary_min ?? "?"} – $${item.salary_max ?? "?"}`
        : null;
    const postedAt = item.epoch
      ? new Date(item.epoch * 1000).toISOString()
      : (item.date ?? null);

    return {
      id: `remoteok-${item.id}`,
      slug,
      title,
      company,
      location: item.location ?? null,
      remote: true,
      tags: (item.tags ?? []).filter((t) => typeof t === "string"),
      salary,
      url: item.url ?? `https://remoteok.com/remote-jobs/${item.id}`,
      source: "remoteok",
      postedAt,
    };
  });
}

const getCachedRemoteOkJobs = unstable_cache(
  fetchRemoteOkJobs,
  ["remoteok-jobs"],
  { revalidate: 3600 },
);

async function loadJobsLive(): Promise<Job[]> {
  try {
    return await getCachedRemoteOkJobs();
  } catch (error) {
    console.error("RemoteOK fetch failed:", error);
    return [];
  }
}

export async function syncJobs(): Promise<number> {
  const fetched = await fetchRemoteOkJobs();

  if (!isSqliteEnabled) {
    return fetched.length;
  }

  const db = await getDb();
  if (!db) return fetched.length;

  const now = new Date().toISOString();

  for (const job of fetched) {
    await db
      .insert(jobs)
      .values({
        id: job.id,
        slug: job.slug,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        tags: JSON.stringify(job.tags),
        salary: job.salary,
        url: job.url,
        source: job.source,
        postedAt: job.postedAt,
        syncedAt: now,
      })
      .onConflictDoUpdate({
        target: jobs.id,
        set: {
          title: job.title,
          tags: JSON.stringify(job.tags),
          salary: job.salary,
          syncedAt: now,
        },
      });
  }

  return fetched.length;
}

export async function getJobs(options?: {
  tag?: string;
  search?: string;
  limit?: number;
}): Promise<Job[]> {
  if (!isSqliteEnabled) {
    const live = await loadJobsLive();
    return filterJobs(live, options);
  }

  await initDb();
  const db = await getDb();
  if (!db) {
    const live = await loadJobsLive();
    return filterJobs(live, options);
  }

  const limit = options?.limit ?? 50;
  const rows = await db
    .select()
    .from(jobs)
    .orderBy(desc(jobs.postedAt))
    .limit(limit);

  if (rows.length === 0) {
    const live = await loadJobsLive();
    return filterJobs(live, options);
  }

  return filterJobs(rows.map(rowToJob), options);
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  if (!isSqliteEnabled) {
    const live = await loadJobsLive();
    return live.find((j) => j.slug === slug) ?? null;
  }

  await initDb();
  const db = await getDb();
  if (!db) {
    const live = await loadJobsLive();
    return live.find((j) => j.slug === slug) ?? null;
  }

  const rows = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  if (rows[0]) return rowToJob(rows[0]);

  const live = await loadJobsLive();
  return live.find((j) => j.slug === slug) ?? null;
}

export async function getJobTags(limit = 20): Promise<string[]> {
  const all = await getJobs({ limit: 200 });
  const counts = new Map<string, number>();

  for (const job of all) {
    for (const tag of job.tags) {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}
