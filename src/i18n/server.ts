import "server-only";

import { cookies } from "next/headers";
import {
  createTranslator,
  defaultLocale,
  getDictionary,
  isLocale,
  type Locale,
} from "./config";

export { createTranslator, getDictionary, type Locale, type Messages } from "./config";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("locale")?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getServerTranslations() {
  const locale = await getLocale();
  const messages = getDictionary(locale);
  return { locale, messages, t: createTranslator(messages) };
}
