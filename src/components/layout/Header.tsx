"use client";

import Link from "next/link";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useTranslations } from "@/providers/I18nProvider";

export function Header() {
  const { t } = useTranslations();

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/jobs", label: t("nav.jobs") },
    { href: "/trending", label: t("nav.trending") },
    { href: "/hosting", label: t("nav.hosting") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
            TP
          </span>
          <span className="hidden sm:inline">Tech Pulse</span>
        </Link>
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
