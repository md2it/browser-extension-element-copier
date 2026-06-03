import { PANEL_TAB_HOST_STYLE } from "./constants.js";
import { applyPanelTabPageLayout2 } from "./layout.js";
import { mountPanelSurface } from "../panel-popup/mount-panel-surface.js";

async function mountPanelTab(initialTab) {
  applyPanelTabPageLayout2();
  await mountPanelSurface(initialTab, { hostStyle: PANEL_TAB_HOST_STYLE });
}

export { mountPanelTab };
