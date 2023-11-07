export const fallbackLng = "en";
export const languages = [fallbackLng, "ru"];
export const cookieName = "i18next";
export const defaultNS = "index";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
