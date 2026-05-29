import { extractElementCopyText } from "../copy";
import { createStringCache } from "../element-copy";
import { COPY_FORMATS, type CopyFormatId } from "../formats/definitions";
import type { EnabledFormatsMap } from "../settings/format-settings";

const cache = createStringCache<CopyFormatId>();

/** Sync snapshot of enabled formats; call only after pick-mode deactivate. */
export function snapshotPickCopyCache(
  element: Element,
  enabledFormats: EnabledFormatsMap,
): void {
  const formatIds = COPY_FORMATS.filter((format) => enabledFormats[format.id]).map(
    (format) => format.id,
  );
  cache.snapshot(
    formatIds.map((formatId) => ({
      key: formatId,
      value: extractElementCopyText(element, formatId),
    })),
  );
}

export function getCachedCopyText(formatId: CopyFormatId): string | undefined {
  return cache.get(formatId);
}

export function clearPickCopyCache(): void {
  cache.clear();
}
