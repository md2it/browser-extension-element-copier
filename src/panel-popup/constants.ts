import type { PanelPageConfig } from "../../../lib/src/panel-popup";

/** Extension page loaded under the toolbar action popup (not a content-script overlay). */
export const PANEL_POPUP_PAGE = "panel-popup-page.html";

export const PANEL_POPUP_ROOT_ID = "element-copier-root";
export const PANEL_POPUP_HOST_ATTR = "data-element-copier-ui";

export const PANEL_POPUP_SESSION_TAB_KEY = "panelPopupTab";

export const PANEL_POPUP_DISMISS_DELAY_MS = 1000;
export const PANEL_POPUP_PROBE_WIDTH = "20rem";

export type PanelPopupTab = "start" | "copied";

export const PANEL_POPUP_TABS: readonly PanelPopupTab[] = ["start", "copied"];

export const PANEL_PAGE_CONFIG: PanelPageConfig = {
  pageHtml: PANEL_POPUP_PAGE,
  sessionTabKey: PANEL_POPUP_SESSION_TAB_KEY,
  logLabel: "Element Copier",
};
