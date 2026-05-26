/** SQLite chỉ dùng local — Vercel serverless không hỗ trợ ghi file DB */
export const isSqliteEnabled =
  !process.env.VERCEL && process.env.FORCE_SQLITE !== "0";
