import { ext } from "../api";
import {
  COPY_FORMATS,
  DEFAULT_CLIPBOARD_FORMAT_ID,
  isCopyFormatId,
  type CopyFormatId,
} from "../formats/definitions";
import {
  CLIPBOARD_DEFAULT_FORMAT_KEY,
  ENABLED_FORMATS_KEY,
} from "../messages";

export type EnabledFormatsMap = Record<CopyFormatId, boolean>;

export function defaultEnabledFormats(): EnabledFormatsMap {
  return Object.fromEntries(
    COPY_FORMATS.map((format) => [format.id, true]),
  ) as EnabledFormatsMap;
}

export async function getEnabledFormats(): Promise<EnabledFormatsMap> {
  const data = await ext.storage.local.get(ENABLED_FORMATS_KEY);
  const raw = data[ENABLED_FORMATS_KEY];
  const defaults = defaultEnabledFormats();

  if (typeof raw !== "object" || raw === null) {
    return defaults;
  }

  const stored = raw as Partial<Record<CopyFormatId, unknown>>;
  for (const format of COPY_FORMATS) {
    if (typeof stored[format.id] === "boolean") {
      defaults[format.id] = stored[format.id]!;
    }
  }

  return defaults;
}

export async function setFormatEnabled(
  formatId: CopyFormatId,
  enabled: boolean,
): Promise<void> {
  const current = await getEnabledFormats();
  current[formatId] = enabled;
  await ext.storage.local.set({ [ENABLED_FORMATS_KEY]: current });
}

export async function getClipboardDefaultFormat(): Promise<CopyFormatId> {
  const data = await ext.storage.local.get(CLIPBOARD_DEFAULT_FORMAT_KEY);
  const raw = data[CLIPBOARD_DEFAULT_FORMAT_KEY];
  return isCopyFormatId(raw) ? raw : DEFAULT_CLIPBOARD_FORMAT_ID;
}

export async function setClipboardDefaultFormat(formatId: CopyFormatId): Promise<void> {
  await ext.storage.local.set({ [CLIPBOARD_DEFAULT_FORMAT_KEY]: formatId });
}
