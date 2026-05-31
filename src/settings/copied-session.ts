import { ext } from "../api";
import { normalizeCopyFormatId, type CopyFormatId } from "../formats/definitions";

export const LAST_COPIED_FORMAT_KEY = "lastCopiedFormat";
export const LAST_DOWNLOADED_FORMAT_KEY = "lastDownloadedFormat";
export const LAST_COPIED_PANEL_ACTION_KEY = "lastCopiedPanelAction";

export type CopiedPanelLastAction = "copied" | "saved";

export async function getLastCopiedFormat(): Promise<CopyFormatId | null> {
  const data = await ext.storage.session.get(LAST_COPIED_FORMAT_KEY);
  const raw = data[LAST_COPIED_FORMAT_KEY];
  return normalizeCopyFormatId(raw) ?? null;
}

export async function getLastDownloadedFormat(): Promise<CopyFormatId | null> {
  const data = await ext.storage.session.get(LAST_DOWNLOADED_FORMAT_KEY);
  const raw = data[LAST_DOWNLOADED_FORMAT_KEY];
  return normalizeCopyFormatId(raw) ?? null;
}

export async function getLastCopiedPanelAction(): Promise<CopiedPanelLastAction | null> {
  const data = await ext.storage.session.get(LAST_COPIED_PANEL_ACTION_KEY);
  const raw = data[LAST_COPIED_PANEL_ACTION_KEY];
  if (raw === "copied" || raw === "saved") return raw;
  return null;
}

export async function setLastCopiedFormat(formatId: CopyFormatId | null): Promise<void> {
  if (formatId === null) {
    await ext.storage.session.remove(LAST_COPIED_FORMAT_KEY);
    await ext.storage.session.remove(LAST_COPIED_PANEL_ACTION_KEY);
    return;
  }
  await ext.storage.session.set({
    [LAST_COPIED_FORMAT_KEY]: formatId,
    [LAST_COPIED_PANEL_ACTION_KEY]: "copied",
  });
}

export async function setLastDownloadedFormat(formatId: CopyFormatId): Promise<void> {
  await ext.storage.session.set({
    [LAST_DOWNLOADED_FORMAT_KEY]: formatId,
    [LAST_COPIED_PANEL_ACTION_KEY]: "saved",
  });
}
