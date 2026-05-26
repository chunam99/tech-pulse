import { EmptyState } from "@/components/ui/EmptyState";
import { JobCard } from "./JobCard";
import { createTranslator, type Messages } from "@/i18n/config";
import type { Job } from "@/types";

type JobListProps = {
  jobs: Job[];
  messages: Messages;
};

export function JobList({ jobs, messages }: JobListProps) {
  const t = createTranslator(messages);

  if (jobs.length === 0) {
    return (
      <EmptyState
        title={t("jobs.emptyTitle")}
        description={t("jobs.emptyDescription")}
      />
    );
  }

  return (
    <ul className="grid gap-4">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard job={job} />
        </li>
      ))}
    </ul>
  );
}
