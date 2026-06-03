import { copyToClipboardForFormat } from "../element-copy/clipboard.js";
import { fetchPickedFormatText } from "./fetch-picked-format.js";

async function copyPickedFormatFromPanel(formatId) {
  const text = await fetchPickedFormatText(formatId);
  if (text === void 0) return false;
  return copyToClipboardForFormat(formatId, text);
}

export { copyPickedFormatFromPanel };
