import { copyElementFormatToClipboard } from "../element-copy";
import type { CopyFormatId } from "../formats/definitions";
import { getClipboardDefaultFormat } from "../settings/format-settings";

export async function copyElementWithFormat(
  element: Element,
  formatId: CopyFormatId,
): Promise<boolean> {
  return copyElementFormatToClipboard(element, formatId);
}

export async function copyElementToClipboard(element: Element): Promise<boolean> {
  const formatId = await getClipboardDefaultFormat();
  return copyElementWithFormat(element, formatId);
}

export { copyElementFormatToClipboard } from "../element-copy";
