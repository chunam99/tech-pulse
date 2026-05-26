import { formatUsd, getPricePerGbRam } from "@/lib/utils";
import { createTranslator, type Messages } from "@/i18n/config";
import type { HostingPlan } from "@/types";

type HostingCompareTableProps = {
  plans: HostingPlan[];
  messages: Messages;
};

export function HostingCompareTable({
  plans,
  messages,
}: HostingCompareTableProps) {
  const t = createTranslator(messages);

  if (plans.length === 0) return null;

  const sorted = [...plans].sort(
    (a, b) => getPricePerGbRam(a) - getPricePerGbRam(b),
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-[var(--table-head)] text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">
              {t("hosting.table.provider")}
            </th>
            <th className="px-4 py-3 font-medium">{t("hosting.table.plan")}</th>
            <th className="px-4 py-3 font-medium">{t("hosting.table.ram")}</th>
            <th className="px-4 py-3 font-medium">
              {t("hosting.table.vcpu")}
            </th>
            <th className="px-4 py-3 font-medium">{t("hosting.table.ssd")}</th>
            <th className="px-4 py-3 font-medium">
              {t("hosting.table.price")}
            </th>
            <th className="px-4 py-3 font-medium">
              {t("hosting.table.perGb")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/80">
          {sorted.map((plan, i) => (
            <tr
              key={plan.id}
              className={
                i === 0 ? "bg-[var(--highlight)]" : "bg-surface/50"
              }
            >
              <td className="px-4 py-3 text-muted">{plan.provider}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                {plan.name}
              </td>
              <td className="px-4 py-3">{plan.ramGb} GB</td>
              <td className="px-4 py-3">{plan.cpuCores}</td>
              <td className="px-4 py-3">{plan.storageGb} GB</td>
              <td className="px-4 py-3 text-violet-600 dark:text-violet-300">
                {formatUsd(plan.priceMonthlyUsd)}
              </td>
              <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">
                {formatUsd(getPricePerGbRam(plan))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
