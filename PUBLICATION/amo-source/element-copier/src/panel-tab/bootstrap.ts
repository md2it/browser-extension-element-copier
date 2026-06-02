import {
  isPanelPopupPage,
  resolvePanelPageInitialTab,
} from "../panel-popup/page";
import { isPanelTabMode } from "./mode";
import { mountPanelTab } from "./mount";

export async function bootstrapPanelTabPageIfNeeded(): Promise<void> {
  if (!isPanelPopupPage(location.href)) return;
  if (!isPanelTabMode()) return;

  const tab = await resolvePanelPageInitialTab();
  await mountPanelTab(tab);
}
