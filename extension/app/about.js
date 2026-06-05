import { ABOUT_BULLET_ICONS } from "./icons.js";

function buildAboutListItems(copy) {
  return copy.aboutBullets.map((text, index) => ({
    iconKind: "bool",
    iconHtml: ABOUT_BULLET_ICONS[index] ?? ABOUT_BULLET_ICONS[0],
    text,
    href: index === copy.aboutBullets.length - 2
      ? "https://github.com/md2it/browser-extension-element-copier"
      : undefined
  }));
}

export { buildAboutListItems };
