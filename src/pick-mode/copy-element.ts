import { copyElementFormatToClipboard } from "../element-copy";
import type { CopyFormatId } from "../formats/definitions";

export async function copyElementWithFormat(
  element: Element,
  formatId: CopyFormatId,
): Promise<boolean> {
  return copyElementFormatToClipboard(element, formatId);
}
