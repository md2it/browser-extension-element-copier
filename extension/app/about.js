import { ABOUT_BULLET_ICONS } from "./icons.js";

function buildAboutListItems(copy) {
  return copy.aboutBullets.map((text, index) => ({
    iconKind: "bool",
    iconHtml: ABOUT_BULLET_ICONS[index] ?? ABOUT_BULLET_ICONS[0],
    text
  }));
}

export { buildAboutListItems };
