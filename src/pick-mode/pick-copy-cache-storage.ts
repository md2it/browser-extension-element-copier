import { ext } from "../api";
import type { CopyFormatId } from "../formats/definitions";

export const PICK_COPY_CACHE_STORAGE_KEY = "pickCopyCache";

export type PickCopyCacheRecord = Partial<Record<CopyFormatId, string>>;

export async function readPickCopyCacheFromStorage(): Promise<PickCopyCacheRecord | undefined> {
  const data = await ext.storage.local.get(PICK_COPY_CACHE_STORAGE_KEY);
  const record = data[PICK_COPY_CACHE_STORAGE_KEY];
  if (!record || typeof record !== "object") return undefined;
  return record as PickCopyCacheRecord;
}

export async function writePickCopyCacheToStorage(
  entries: readonly { key: CopyFormatId; value: string }[],
): Promise<void> {
  const record: PickCopyCacheRecord = {};
  for (const { key, value } of entries) {
    record[key] = value;
  }
  await ext.storage.local.set({ [PICK_COPY_CACHE_STORAGE_KEY]: record });
}

export async function clearPickCopyCacheStorage(): Promise<void> {
  await ext.storage.local.remove(PICK_COPY_CACHE_STORAGE_KEY);
}

export async function getPickCopyTextFromStorage(
  formatId: CopyFormatId,
): Promise<string | undefined> {
  const record = await readPickCopyCacheFromStorage();
  if (!record) return undefined;
  if (formatId === "markdownFile") {
    return record.markdown;
  }
  return record[formatId];
}
