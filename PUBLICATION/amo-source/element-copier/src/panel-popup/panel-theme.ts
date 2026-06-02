import { ext } from "../api";
import { DARK_THEME_ENABLED_KEY } from "../messages";
import { getDarkThemeEnabled } from "../settings/theme-settings";
import { PANEL_POPUP_ROOT_ID } from "./constants";

const HOST_DARK_CLASS = "ec-panel-popup--dark";
const PANEL_DARK_CLASS = "ec-panel--dark";

let themeSyncBound = false;

export function applyPanelTheme(enabled: boolean): void {
  const host = document.getElementById(PANEL_POPUP_ROOT_ID);
  host?.classList.toggle(HOST_DARK_CLASS, enabled);
  host?.shadowRoot
    ?.querySelectorAll<HTMLElement>(".ec-panel")
    .forEach((panel) => panel.classList.toggle(PANEL_DARK_CLASS, enabled));
}

export async function syncPanelThemeFromStorage(): Promise<void> {
  applyPanelTheme(await getDarkThemeEnabled());
}

export function bindPanelThemeSync(): void {
  if (themeSyncBound) return;
  themeSyncBound = true;
  ext.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[DARK_THEME_ENABLED_KEY]) return;
    applyPanelTheme(changes[DARK_THEME_ENABLED_KEY].newValue === true);
  });
}
