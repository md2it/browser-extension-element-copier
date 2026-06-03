import { applyActionPopupDocumentWidth } from "./fit-popup-height.js";
import { getActionPopupWidthPx } from "./panel-heights.js";
import { getLocale } from "../storage.js";
import { mountPanelSurface } from "./mount-panel-surface.js";
import { panelPopupHostStyle } from "./constants.js";

async function mountPanelPopup(initialTab) {
  const locale = await getLocale();
  const widthPx = await getActionPopupWidthPx(locale);
  applyActionPopupDocumentWidth(widthPx);
  await mountPanelSurface(initialTab, {
    hostStyle: panelPopupHostStyle(widthPx),
    surface: "popup"
  });
}

export { mountPanelPopup };
