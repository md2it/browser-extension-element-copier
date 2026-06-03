import { COPY, FILES, FILE_DOWN, HEART, HISTORY, IMAGES, SHIELD_CHECK } from "../lib/icons/index.js";
import { files_default } from "../lib/icons/lucide/files.js";

var INACTIVE_BG = "#012292";

var TOOLBAR_VIEWBOX = 24;

var TOOLBAR_RADIUS_RATIO = 0.18;

var TOOLBAR_PAD_RATIO = 0.1;

function stripComment3(svg) {
  return svg.replace(/<!--[\s\S]*?-->\s*/g, "").trim();
}

function innerSvgMarkup(svg) {
  const match = svg.match(/<svg[\s\S]*?>([\s\S]*)<\/svg>/i);
  return match ? match[1].trim() : svg;
}

var filesInner = innerSvgMarkup(stripComment3(files_default));

var ABOUT_BULLET_ICONS = [
  COPY,
  FILE_DOWN,
  HISTORY,
  FILES,
  IMAGES,
  FILES,
  FILES,
  SHIELD_CHECK,
  SHIELD_CHECK,
  HEART
];

function toolbarWelcomeIconSvg(bg = INACTIVE_BG, size = 16) {
  const r = TOOLBAR_VIEWBOX * TOOLBAR_RADIUS_RATIO;
  const pad = TOOLBAR_VIEWBOX * TOOLBAR_PAD_RATIO;
  const scale = (TOOLBAR_VIEWBOX - pad * 2) / TOOLBAR_VIEWBOX;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${TOOLBAR_VIEWBOX} ${TOOLBAR_VIEWBOX}" aria-hidden="true"><rect width="${TOOLBAR_VIEWBOX}" height="${TOOLBAR_VIEWBOX}" rx="${r}" fill="${bg}"/><g fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(${pad} ${pad}) scale(${scale})">${filesInner}</g></svg>`;
}

export { ABOUT_BULLET_ICONS, INACTIVE_BG, TOOLBAR_PAD_RATIO, TOOLBAR_RADIUS_RATIO, TOOLBAR_VIEWBOX, filesInner, innerSvgMarkup, stripComment3, toolbarWelcomeIconSvg };
