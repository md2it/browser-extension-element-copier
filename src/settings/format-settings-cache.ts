import { ext } from "../api";
import { DEFAULT_CLIPBOARD_FORMAT_ID, type CopyFormatId } from "../formats/definitions";
import {
  CLIPBOARD_DEFAULT_FORMAT_KEY,
  ENABLED_FORMATS_KEY,
} from "../messages";
import {
  defaultEnabledFormats,
  getClipboardDefaultFormat,
  getEnabledFormats,
  type EnabledFormatsMap,
} from "./format-settings";

let cachedEnabledFormats: EnabledFormatsMap = defaultEnabledFormats();
let cachedDefaultFormat: CopyFormatId = DEFAULT_CLIPBOARD_FORMAT_ID;
let bound = false;

export function getCachedEnabledFormats(): EnabledFormatsMap {
  return cachedEnabledFormats;
}

export function getCachedClipboardDefaultFormat(): CopyFormatId {
  return cachedDefaultFormat;
}

export async function refreshFormatSettingsCache(): Promise<void> {
  cachedEnabledFormats = await getEnabledFormats();
  cachedDefaultFormat = await getClipboardDefaultFormat();
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
