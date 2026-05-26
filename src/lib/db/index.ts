import { isSqliteEnabled } from "./config";

export { isSqliteEnabled } from "./config";

export async function getDb() {
  if (!isSqliteEnabled) return null;
  const { getSqliteDb, initSqliteTables } = await import("./sqlite");
  initSqliteTables();
  return getSqliteDb();
}

/** No-op trên Vercel */
export async function initDb() {
  if (!isSqliteEnabled) return;
  const { initSqliteTables } = await import("./sqlite");
  initSqliteTables();
}
