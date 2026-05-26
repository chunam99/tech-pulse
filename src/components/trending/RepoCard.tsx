import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import type { TrendingRepo } from "@/types";

type RepoCardProps = {
  repo: TrendingRepo;
  rank?: number;
};

export function RepoCard({ repo, rank }: RepoCardProps) {
  return (
    <Card hover className="flex gap-4">
      {rank !== undefined && (
        <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          {repo.ownerAvatar && (
            <Image
              src={repo.ownerAvatar}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="min-w-0 flex-1">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate"
            >
              <CardTitle className="hover:text-violet-600 dark:hover:text-violet-300">
                {repo.fullName}
              </CardTitle>
            </a>
            {repo.description && (
              <CardDescription className="line-clamp-2">
                {repo.description}
              </CardDescription>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>★ {formatNumber(repo.stars)}</span>
          <span>⑂ {formatNumber(repo.forks)}</span>
          {repo.language && <Badge variant="muted">{repo.language}</Badge>}
        </div>
      </div>
    </Card>
  );
}
