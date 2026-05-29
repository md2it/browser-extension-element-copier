import { ext } from "../api";
import type { CopyFormatId } from "../formats/definitions";
import {
  CLIPBOARD_DEFAULT_FORMAT_KEY,
  ENABLED_FORMATS_KEY,
} from "../messages";
import {
  defaultEnabledFormats,
  getClipboardDefaultFormat,
  getEnabledFormats,
  isActiveCopyDefault,
  type EnabledFormatsMap,
} from "./format-settings";

let cachedEnabledFormats: EnabledFormatsMap = defaultEnabledFormats();
let cachedDefaultFormat: CopyFormatId | null = null;
let bound = false;

export function getCachedEnabledFormats(): EnabledFormatsMap {
  return cachedEnabledFormats;
}

export function getCachedClipboardDefaultFormat(): CopyFormatId | null {
  return cachedDefaultFormat;
}

export async function refreshFormatSettingsCache(): Promise<void> {
  cachedEnabledFormats = await getEnabledFormats();
  const stored = await getClipboardDefaultFormat();
  cachedDefaultFormat = isActiveCopyDefault(stored) ? stored : null;
}

export function bindFormatSettingsCache(): void {
  if (bound) return;
  bound = true;
  void refreshFormatSettingsCache();
  ext.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes[ENABLED_FORMATS_KEY] || changes[CLIPBOARD_DEFAULT_FORMAT_KEY]) {
      void refreshFormatSettingsCache();
    }
  });
}
