import type { LocalizedText, Locale, Maybe } from "@/types";

/**
 * Given a localized text object and a locale, gets
 * the correct text string.
 */

export const getLocalizedText = (
  localizedTextObj: LocalizedText,
  locale: Locale,
  defaultValue = ""
): string => {
  const text: Maybe<string> = localizedTextObj[locale] ?? null;
  return text !== null ? text : defaultValue;
};

export const translate = getLocalizedText;

export const makeLocalizedText = (
  text: string,
  locale: Locale,
  localizedTextObj = {} as LocalizedText
): LocalizedText => ({
  ...localizedTextObj,
  [locale]: text,
});
