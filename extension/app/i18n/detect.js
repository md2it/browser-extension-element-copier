import { detectLocale } from "../../lib/our/i18n/detect.js";

function mapLanguageTag(tag) {
  const base = tag.trim().toLowerCase().replace(/_/g, "-").split("-")[0];
  if (base === "en") return "en";
  return null;
}

function detectLocale2() {
  return detectLocale(mapLanguageTag, "en");
}

export { detectLocale2, mapLanguageTag };
