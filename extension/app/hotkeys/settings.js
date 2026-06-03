import { ESC_HOTKEY_ENABLED_KEY, START_HOTKEY_ENABLED_KEY } from "../messages.js";
import { ext } from "../../lib/our/api.js";
import { readBooleanSetting } from "../../lib/our/hotkeys/settings.js";

async function getStartHotkeyEnabled() {
  const data = await ext.storage.local.get(START_HOTKEY_ENABLED_KEY);
  return readBooleanSetting(data, START_HOTKEY_ENABLED_KEY);
}

async function getEscHotkeyEnabled() {
  const data = await ext.storage.local.get(ESC_HOTKEY_ENABLED_KEY);
  return readBooleanSetting(data, ESC_HOTKEY_ENABLED_KEY);
}

export { getEscHotkeyEnabled, getStartHotkeyEnabled };
