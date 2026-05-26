import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath =
  process.env.DATABASE_URL?.replace("file:", "") ??
  path.join(process.cwd(), "data", "tech-pulse.db");

function ensureDataDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

function getSqlite() {
  if (!globalForDb.sqlite) {
    ensureDataDir(dbPath);
    globalForDb.sqlite = new Database(dbPath);
    globalForDb.sqlite.pragma("journal_mode = WAL");
  }
  return globalForDb.sqlite;
}

export const db = globalForDb.db ?? drizzle(getSqlite(), { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

export function initDb() {
  const sqlite = getSqlite();
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      remote INTEGER NOT NULL DEFAULT 0,
      tags TEXT NOT NULL,
      salary TEXT,
      url TEXT NOT NULL,
      source TEXT NOT NULL,
      posted_at TEXT,
      synced_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS trending_repos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      full_name TEXT NOT NULL,
      description TEXT,
      language TEXT,
      stars INTEGER NOT NULL DEFAULT 0,
      forks INTEGER NOT NULL DEFAULT 0,
      url TEXT NOT NULL,
      owner_avatar TEXT,
      period TEXT NOT NULL,
      language_filter TEXT NOT NULL DEFAULT '',
      synced_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS hosting_plans (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      ram_gb REAL NOT NULL,
      cpu_cores INTEGER NOT NULL,
      storage_gb INTEGER NOT NULL,
      bandwidth_tb REAL,
      price_monthly_usd REAL NOT NULL,
      region TEXT NOT NULL,
      affiliate_url TEXT,
      features TEXT NOT NULL,
      synced_at TEXT NOT NULL
    );
  `);
}
