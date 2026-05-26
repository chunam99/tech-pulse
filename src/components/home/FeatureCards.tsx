"use client";

import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { useTranslations } from "@/providers/I18nProvider";

export function FeatureCards() {
  const { t } = useTranslations();

  const features = [
    {
      href: "/jobs",
      title: t("home.features.jobs.title"),
      description: t("home.features.jobs.description"),
      emoji: "💼",
    },
    {
      href: "/trending",
      title: t("home.features.trending.title"),
      description: t("home.features.trending.description"),
      emoji: "⭐",
    },
    {
      href: "/hosting",
      title: t("home.features.hosting.title"),
      description: t("home.features.hosting.description"),
      emoji: "🖥️",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {features.map((f) => (
        <Link key={f.href} href={f.href}>
          <Card hover className="h-full">
            <span className="text-2xl">{f.emoji}</span>
            <CardTitle className="mt-3">{f.title}</CardTitle>
            <CardDescription>{f.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
}
