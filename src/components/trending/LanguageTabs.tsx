import Link from "next/link";
import { TRENDING_LANGUAGES } from "@/lib/services/github";

type LanguageTabsProps = {
  activeLanguage: string;
};

export function LanguageTabs({ activeLanguage }: LanguageTabsProps) {
  const tabBase = "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors";
  const activeTab = "bg-violet-600 text-white";
  const inactiveTab =
    "bg-surface-hover text-muted hover:bg-border hover:text-foreground";

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {TRENDING_LANGUAGES.map((lang) => {
        const href = lang.value
          ? `/trending?lang=${lang.value}`
          : "/trending";
        const active = activeLanguage === lang.value;
        return (
          <Link
            key={lang.value || "all"}
            href={href}
            className={`${tabBase} ${active ? activeTab : inactiveTab}`}
          >
            {lang.label}
          </Link>
        );
      })}
    </div>
  );
}
