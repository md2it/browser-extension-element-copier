import { ext } from "../api";
import { readBooleanSetting } from "../../../lib/src/hotkeys";
import { START_HOTKEY_ENABLED_KEY } from "../messages";

export async function getStartHotkeyEnabled(): Promise<boolean> {
  const data = await ext.storage.local.get(START_HOTKEY_ENABLED_KEY);
  return readBooleanSetting(data, START_HOTKEY_ENABLED_KEY);
}

export async function setStartHotkeyEnabled(value: boolean): Promise<void> {
  await ext.storage.local.set({ [START_HOTKEY_ENABLED_KEY]: value });
}
