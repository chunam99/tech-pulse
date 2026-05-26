import { EmptyState } from "@/components/ui/EmptyState";
import { RepoCard } from "./RepoCard";
import { createTranslator, type Messages } from "@/i18n/config";
import type { TrendingRepo } from "@/types";

type TrendingListProps = {
  repos: TrendingRepo[];
  messages: Messages;
};

export function TrendingList({ repos, messages }: TrendingListProps) {
  const t = createTranslator(messages);

  if (repos.length === 0) {
    return (
      <EmptyState
        title={t("trending.emptyTitle")}
        description={t("trending.emptyDescription")}
      />
    );
  }

  return (
    <ul className="grid gap-3">
      {repos.map((repo, i) => (
        <li key={repo.id}>
          <RepoCard repo={repo} rank={i + 1} />
        </li>
      ))}
    </ul>
  );
}
