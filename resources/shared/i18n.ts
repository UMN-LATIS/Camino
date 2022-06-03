import { Locale, type LocalizedText, type Maybe } from "@/types";

/**
 * Given a localized text object and a locale, gets
 * the correct text string.
 */

export const getLocalizedText = (
  localizedTextObj: Maybe<LocalizedText>,
  locale: Locale,
  defaultValue = ""
): string => {
  const text: Maybe<string> = localizedTextObj?.[locale] ?? null;
  return text !== null ? text : defaultValue;
};

export const translate = getLocalizedText;

export const setLocalizedText = (
  locale: Locale,
  text: string,
  localizedTextObj: Maybe<LocalizedText> = {}
): LocalizedText => ({
  ...localizedTextObj,
  [locale]: text,
});

export function createEmptyLocalizedText(locales: Locale[] = [Locale.en]) {
  return locales.reduce(
    (acc, locale) => ({
      ...acc,
      [locale]: "",
    }),
    {}
  );
}
