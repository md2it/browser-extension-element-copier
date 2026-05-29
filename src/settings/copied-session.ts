import { ext } from "../api";
import { normalizeCopyFormatId, type CopyFormatId } from "../formats/definitions";

export const LAST_COPIED_FORMAT_KEY = "lastCopiedFormat";

export async function getLastCopiedFormat(): Promise<CopyFormatId | null> {
  const data = await ext.storage.session.get(LAST_COPIED_FORMAT_KEY);
  const raw = data[LAST_COPIED_FORMAT_KEY];
  return normalizeCopyFormatId(raw) ?? null;
}

export async function setLastCopiedFormat(formatId: CopyFormatId | null): Promise<void> {
  if (formatId === null) {
    await ext.storage.session.remove(LAST_COPIED_FORMAT_KEY);
    return;
  }
  await ext.storage.session.set({ [LAST_COPIED_FORMAT_KEY]: formatId });
}
