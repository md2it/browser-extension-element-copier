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
  const entries: { key: CopyFormatId; value: string }[] = [];
  let markdownText: string | undefined;

  for (const formatId of formatIds) {
    if (formatId === "markdown" || formatId === "markdownFile") {
      if (markdownText === undefined) {
        markdownText = extractElementCopyText(element, "markdown");
        entries.push({ key: "markdown", value: markdownText });
      }
      continue;
    }
    entries.push({ key: formatId, value: extractElementCopyText(element, formatId) });
  }

  cache.snapshot(entries);
}

export function getCachedCopyText(formatId: CopyFormatId): string | undefined {
  if (formatId === "markdownFile") {
    return cache.get("markdown");
  }
  return cache.get(formatId);
}

export function clearPickCopyCache(): void {
  cache.clear();
}
