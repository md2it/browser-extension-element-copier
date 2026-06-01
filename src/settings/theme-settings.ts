import { ext } from "../api";
import { DARK_THEME_ENABLED_KEY } from "../messages";

export async function getDarkThemeEnabled(): Promise<boolean> {
  const data = await ext.storage.local.get(DARK_THEME_ENABLED_KEY);
  return data[DARK_THEME_ENABLED_KEY] === true;
}

export async function setDarkThemeEnabled(enabled: boolean): Promise<void> {
  await ext.storage.local.set({ [DARK_THEME_ENABLED_KEY]: enabled });
}
