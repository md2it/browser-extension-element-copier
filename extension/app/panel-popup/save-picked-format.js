import { downloadTextAsFile } from "../element-copy/download.js";
import { fetchPickedFormatText } from "./fetch-picked-format.js";
import { readPickCopyMetaFromStorage } from "../pick-mode/pick-copy-cache-storage.js";

async function savePickedFormatFromPanel(formatId) {
  const [text, meta] = await Promise.all([
    fetchPickedFormatText(formatId),
    readPickCopyMetaFromStorage()
  ]);
  if (text === void 0) return false;
  return downloadTextAsFile(formatId, text, meta);
}

export { savePickedFormatFromPanel };
