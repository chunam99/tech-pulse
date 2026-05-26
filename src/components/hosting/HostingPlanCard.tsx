"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { formatUsd, getPricePerGbRam } from "@/lib/utils";
import { useTranslations } from "@/providers/I18nProvider";
import type { HostingPlan } from "@/types";

type HostingPlanCardProps = {
  plan: HostingPlan;
  highlight?: boolean;
};

export function HostingPlanCard({ plan, highlight }: HostingPlanCardProps) {
  const { t } = useTranslations();
  const pricePerGb = getPricePerGbRam(plan);

  return (
    <Card
      hover
      className={
        highlight ? "border-violet-500/50 ring-1 ring-violet-500/30" : ""
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {plan.provider}
          </p>
          <CardTitle className="mt-1">{plan.name}</CardTitle>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-violet-600 dark:text-violet-300">
            {formatUsd(plan.priceMonthlyUsd)}
          </p>
          <p className="text-xs text-muted">{t("hosting.perMonth")}</p>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted">
        <li>{plan.ramGb} GB RAM</li>
        <li>{plan.cpuCores} vCPU</li>
        <li>{plan.storageGb} GB SSD</li>
        <li>
          {plan.bandwidthTb != null ? `${plan.bandwidthTb} TB` : "—"}{" "}
          {t("hosting.bandwidth")}
        </li>
      </ul>
      <p className="mt-2 text-xs text-muted">
        ~{formatUsd(pricePerGb)}/GB RAM · {plan.region}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {plan.features.map((f) => (
          <Badge key={f} variant="muted">
            {f}
          </Badge>
        ))}
      </div>
      {plan.affiliateUrl && (
        <a
          href={plan.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-4 inline-block text-sm text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          {t("hosting.viewOfficial")}
        </a>
      )}
    </Card>
  );
}
