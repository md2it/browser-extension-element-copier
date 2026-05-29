import { ext } from "../api";
import {
  COPY_FORMATS,
  DEFAULT_CLIPBOARD_FORMAT_ID,
  type CopyFormatId,
} from "../formats/definitions";

export const LAST_COPIED_FORMAT_KEY = "lastCopiedFormat";

function isCopyFormatId(value: unknown): value is CopyFormatId {
  return COPY_FORMATS.some((format) => format.id === value);
}

export async function getLastCopiedFormat(): Promise<CopyFormatId> {
  const data = await ext.storage.session.get(LAST_COPIED_FORMAT_KEY);
  const raw = data[LAST_COPIED_FORMAT_KEY];
  return isCopyFormatId(raw) ? raw : DEFAULT_CLIPBOARD_FORMAT_ID;
}

export async function setLastCopiedFormat(formatId: CopyFormatId): Promise<void> {
  await ext.storage.session.set({ [LAST_COPIED_FORMAT_KEY]: formatId });
}
