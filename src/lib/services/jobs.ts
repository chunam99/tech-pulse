import { db, initDb } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import type { Job } from "@/types";
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

export async function fetchRemoteOkJobs(): Promise<Job[]> {
  const res = await fetch("https://remoteok.com/api", {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
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
      : item.date ?? null;

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

export async function syncJobs(): Promise<number> {
  initDb();
  const fetched = await fetchRemoteOkJobs();
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
  initDb();
  const limit = options?.limit ?? 50;

  let query = db.select().from(jobs).orderBy(desc(jobs.postedAt)).limit(limit);

  const rows = await query;
  let result = rows.map(rowToJob);

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

  return result;
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  initDb();
  const rows = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  return rows[0] ? rowToJob(rows[0]) : null;
}

export async function getJobTags(limit = 20): Promise<string[]> {
  initDb();
  const rows = await db.select({ tags: jobs.tags }).from(jobs).limit(200);
  const counts = new Map<string, number>();

  for (const row of rows) {
    const tags = JSON.parse(row.tags) as string[];
    for (const tag of tags) {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}
