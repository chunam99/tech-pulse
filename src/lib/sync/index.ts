import { syncJobs } from "@/lib/services/jobs";
import { syncTrending } from "@/lib/services/github";
import { syncHosting } from "@/lib/services/hosting";
import type { SyncResult } from "@/types";

export async function syncAll(): Promise<SyncResult> {
  const [jobs, trending, hosting] = await Promise.all([
    syncJobs().catch((e) => {
      console.error("syncJobs failed:", e);
      return 0;
    }),
    syncTrending().catch((e) => {
      console.error("syncTrending failed:", e);
      return 0;
    }),
    syncHosting().catch((e) => {
      console.error("syncHosting failed:", e);
      return 0;
    }),
  ]);

  return { jobs, trending, hosting };
}
