import type { LocalizedText, Locale, Maybe } from "@/types";

export default function getTextForLocale(
  localizedTextObj: LocalizedText,
  locale: Locale,
  fallback?: string
): string {
  const text: Maybe<string> = localizedTextObj[locale] ?? null;

  if (text !== null) {
    return text;
  }

  // using typeof rather than !fallback in case
  // fallback is ""
  if (typeof fallback === "string") {
    return fallback;
  }

  throw new Error(
    `no localized text found for locale ${locale} in ${localizedTextObj}. Consider setting a fallback.`
  );
}
