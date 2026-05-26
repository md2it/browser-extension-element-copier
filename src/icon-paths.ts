/** PNG paths for manifest default_icon and setIcon(path) fallback (SVG unsupported in CRX). */
const INACTIVE = {
  16: "icons/icon-16.png",
  32: "icons/icon-32.png",
  48: "icons/icon-48.png",
  128: "icons/icon-128.png",
} as const;

const ACTIVE = INACTIVE;

export const TOOLBAR_ICON_PATHS = {
  inactive: INACTIVE,
  active: ACTIVE,
} as const;
