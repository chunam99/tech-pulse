import { en } from "./locales/en";
import { vi, type Messages } from "./locales/vi";

export type { Messages };

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

const dictionaries: Record<Locale, Messages> = { vi, en };

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale];
}

export function createTranslator(messages: Messages) {
  return function t(
    path: string,
    params?: Record<string, string | number>,
  ): string {
    const keys = path.split(".");
    let value: unknown = messages;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }
    if (typeof value !== "string") return path;
    if (!params) return value;
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      value,
    );
  };
}
