import { ext } from "../api";
import type { CopyFormatId } from "../formats/definitions";
import { COMPUTE_IMAGES_ENABLED_KEY } from "../messages";

export type ComputeFormatsSettings = {
  computeImages: boolean;
};

const COMPUTE_IMAGES_FORMAT_IDS: readonly CopyFormatId[] = ["png", "jpeg"];

export function defaultComputeFormatsSettings(): ComputeFormatsSettings {
  return {
    computeImages: true,
  };
}

export function isComputeControlledFormat(formatId: CopyFormatId): boolean {
  return COMPUTE_IMAGES_FORMAT_IDS.includes(formatId);
}

export function isFormatEnabledByComputeSettings(
  formatId: CopyFormatId,
  settings: ComputeFormatsSettings,
): boolean {
  if (COMPUTE_IMAGES_FORMAT_IDS.includes(formatId)) return settings.computeImages;
  return true;
}

function readStoredBoolean(raw: unknown, fallback: boolean): boolean {
  return typeof raw === "boolean" ? raw : fallback;
}

export async function getComputeFormatsSettings(): Promise<ComputeFormatsSettings> {
  const defaults = defaultComputeFormatsSettings();
  const data = await ext.storage.local.get(COMPUTE_IMAGES_ENABLED_KEY);
  return {
    computeImages: readStoredBoolean(data[COMPUTE_IMAGES_ENABLED_KEY], defaults.computeImages),
  };
}

export async function setComputeImagesEnabled(enabled: boolean): Promise<void> {
  await ext.storage.local.set({ [COMPUTE_IMAGES_ENABLED_KEY]: enabled });
}
