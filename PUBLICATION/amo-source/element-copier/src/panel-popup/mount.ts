import { panelPopupHostStyle, type PanelPopupTab } from "./constants";
import { getActionPopupWidthPx } from "./panel-heights";
import { applyActionPopupDocumentWidth } from "./fit-popup-height";
import { mountPanelSurface } from "./mount-panel-surface";
import { getLocale } from "../storage";

export async function mountPanelPopup(initialTab: PanelPopupTab): Promise<void> {
  const locale = await getLocale();
  const widthPx = await getActionPopupWidthPx(locale);
  applyActionPopupDocumentWidth(widthPx);

  await mountPanelSurface(initialTab, {
    hostStyle: panelPopupHostStyle(widthPx),
    surface: "popup",
  });
}
