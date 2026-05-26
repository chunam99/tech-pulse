"use client";

import { I18nProvider } from "./I18nProvider";
import { ThemeProvider } from "./ThemeProvider";
import type { Locale, Messages } from "@/i18n/config";

type AppProvidersProps = {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
};

export function AppProviders({ locale, messages, children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider locale={locale} messages={messages}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
