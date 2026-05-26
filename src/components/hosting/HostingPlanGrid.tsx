import { EmptyState } from "@/components/ui/EmptyState";
import { HostingPlanCard } from "./HostingPlanCard";
import { createTranslator, type Messages } from "@/i18n/config";
import { getPricePerGbRam } from "@/lib/utils";
import type { HostingPlan } from "@/types";

type HostingPlanGridProps = {
  plans: HostingPlan[];
  messages: Messages;
};

export function HostingPlanGrid({ plans, messages }: HostingPlanGridProps) {
  const t = createTranslator(messages);

  if (plans.length === 0) {
    return (
      <EmptyState
        title={t("hosting.emptyTitle")}
        description={t("hosting.emptyDescription")}
      />
    );
  }

  const cheapestId = [...plans].sort(
    (a, b) => getPricePerGbRam(a) - getPricePerGbRam(b),
  )[0]?.id;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <HostingPlanCard
          key={plan.id}
          plan={plan}
          highlight={plan.id === cheapestId}
        />
      ))}
    </div>
  );
}
