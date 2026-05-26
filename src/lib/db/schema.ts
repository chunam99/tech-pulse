import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  remote: integer("remote", { mode: "boolean" }).notNull().default(false),
  tags: text("tags").notNull(), // JSON array
  salary: text("salary"),
  url: text("url").notNull(),
  source: text("source").notNull(),
  postedAt: text("posted_at"),
  syncedAt: text("synced_at").notNull(),
});

export const trendingRepos = sqliteTable("trending_repos", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  description: text("description"),
  language: text("language"),
  stars: integer("stars").notNull().default(0),
  forks: integer("forks").notNull().default(0),
  url: text("url").notNull(),
  ownerAvatar: text("owner_avatar"),
  period: text("period").notNull(), // daily | weekly
  languageFilter: text("language_filter").notNull().default(""),
  syncedAt: text("synced_at").notNull(),
});

export const hostingPlans = sqliteTable("hosting_plans", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  providerSlug: text("provider_slug").notNull(),
  name: text("name").notNull(),
  ramGb: real("ram_gb").notNull(),
  cpuCores: integer("cpu_cores").notNull(),
  storageGb: integer("storage_gb").notNull(),
  bandwidthTb: real("bandwidth_tb"),
  priceMonthlyUsd: real("price_monthly_usd").notNull(),
  region: text("region").notNull(),
  affiliateUrl: text("affiliate_url"),
  features: text("features").notNull(), // JSON array
  syncedAt: text("synced_at").notNull(),
});
