// import "server-only";

export type SupportedLocale = "en" | "ja";

export const locales: Array<SupportedLocale> = ["en", "ja"];
export const defaultLocale: SupportedLocale = "en";

const dicts = {
  en: () => import("./en.json").then((module) => module.default),
  ja: () => import("./ja.json").then((module) => module.default),
};

export const getDict = async (locale: SupportedLocale) => dicts[locale]();
