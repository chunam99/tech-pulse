import { getDb, isSqliteEnabled } from "@/lib/db";
import { trendingRepos } from "@/lib/db/schema";
import type { TrendingRepo } from "@/types";
import { unstable_cache } from "next/cache";
import { and, desc, eq } from "drizzle-orm";

type GitHubSearchItem = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: { avatar_url: string };
};

const LANGUAGES = ["", "typescript", "javascript", "python", "go", "rust"];
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function rowToRepo(row: typeof trendingRepos.$inferSelect): TrendingRepo {
  return {
    id: row.id,
    name: row.name,
    fullName: row.fullName,
    description: row.description,
    language: row.language,
    stars: row.stars,
    forks: row.forks,
    url: row.url,
    ownerAvatar: row.ownerAvatar,
    period: row.period,
    syncedAt: row.syncedAt,
  };
}

function buildSearchQuery(language: string): string {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const dateStr = since.toISOString().split("T")[0];
  const langPart = language ? `language:${language}` : "";
  return `stars:>50 created:>${dateStr} ${langPart}`.trim();
}

export async function fetchGitHubTrending(
  language = "",
  period = "weekly",
): Promise<TrendingRepo[]> {
  const query = buildSearchQuery(language);
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q", query);
  url.searchParams.set("sort", "stars");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "30");

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { items: GitHubSearchItem[] };
  const now = new Date().toISOString();

  return data.items.map((item) => ({
    id: `gh-${item.id}`,
    name: item.name,
    fullName: item.full_name,
    description: item.description,
    language: item.language,
    stars: item.stargazers_count,
    forks: item.forks_count,
    url: item.html_url,
    ownerAvatar: item.owner.avatar_url,
    period,
    syncedAt: now,
  }));
}

function getCachedTrending(language: string) {
  return unstable_cache(
    () => fetchGitHubTrending(language, "weekly"),
    ["github-trending", language],
    { revalidate: 3600 },
  )();
}

export async function syncTrending(): Promise<number> {
  let total = 0;

  for (const language of LANGUAGES) {
    const repos = await fetchGitHubTrending(language, "weekly");
    total += repos.length;

    if (!isSqliteEnabled) continue;

    const db = await getDb();
    if (!db) continue;

    const now = new Date().toISOString();

    for (const repo of repos) {
      await db
        .insert(trendingRepos)
        .values({
          id: `${repo.id}-${language || "all"}`,
          name: repo.name,
          fullName: repo.fullName,
          description: repo.description,
          language: repo.language,
          stars: repo.stars,
          forks: repo.forks,
          url: repo.url,
          ownerAvatar: repo.ownerAvatar,
          period: repo.period,
          languageFilter: language,
          syncedAt: now,
        })
        .onConflictDoUpdate({
          target: trendingRepos.id,
          set: {
            stars: repo.stars,
            forks: repo.forks,
            syncedAt: now,
          },
        });
    }

    await new Promise((r) => setTimeout(r, GITHUB_TOKEN ? 500 : 1500));
  }

  return total;
}

export async function getTrendingRepos(options?: {
  language?: string;
  limit?: number;
}): Promise<TrendingRepo[]> {
  const language = options?.language ?? "";
  const limit = options?.limit ?? 30;

  if (!isSqliteEnabled) {
    try {
      const repos = await getCachedTrending(language);
      return repos.slice(0, limit);
    } catch (error) {
      console.error("GitHub trending fetch failed:", error);
      return [];
    }
  }

  const db = await getDb();
  if (db) {
    const rows = await db
      .select()
      .from(trendingRepos)
      .where(
        and(
          eq(trendingRepos.period, "weekly"),
          eq(trendingRepos.languageFilter, language),
        ),
      )
      .orderBy(desc(trendingRepos.stars))
      .limit(limit);

    if (rows.length > 0) return rows.map(rowToRepo);
  }

  try {
    const repos = await getCachedTrending(language);
    return repos.slice(0, limit);
  } catch {
    return [];
  }
}

export const TRENDING_LANGUAGES = [
  { value: "", label: "Tất cả" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];
