import type { LocalizedText, Locale, Maybe } from "@/types";

/**
 * Given a localized text object and a locale, gets
 * the correct text string.
 */

export default function getTranslation(
  localizedTextObj: LocalizedText,
  locale: Locale,
  defaultValue?: string
): string {
  const text: Maybe<string> = localizedTextObj[locale] ?? null;

  if (text !== null) {
    return text;
  }

  // using typeof rather than !fallback in case
  // fallback is ""
  if (typeof defaultValue === "string") {
    return defaultValue;
  }

  throw new Error(
    `no localized text found for locale ${locale} in ${localizedTextObj}. Consider setting a fallback.`
  );
}
