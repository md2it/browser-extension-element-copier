function domainWithDashes(hostname) {
  const normalized = hostname.trim() || "unknown";
  const dashed = normalized.replace(/\./g, "-");
  return `-${dashed}`.replace(/-www-/g, "-").slice(1);
}

function extensionForDownloadFormat(formatId) {
  switch (formatId) {
    case "markdownFile":
      return "md";
    case "htmlFile":
      return "html";
    case "png":
      return "png";
    case "jpeg":
      return "jpeg";
    default:
      return "txt";
  }
}

function buildDownloadFilename(formatId, context) {
  const ext2 = extensionForDownloadFormat(formatId);
  const tagName = context?.tagName?.trim().toLowerCase() || "element";
  const domain = domainWithDashes(context?.hostname ?? "unknown");
  return `copied-${domain}-${tagName}.${ext2}`;
}

function mimeTypeForFormat(formatId) {
  switch (formatId) {
    case "markdownFile":
      return "text/markdown;charset=utf-8";
    case "htmlFile":
      return "text/html;charset=utf-8";
    case "png":
      return "image/png";
    case "jpeg":
      return "image/jpeg";
    default:
      return "text/plain;charset=utf-8";
  }
}

function isDataUrl2(value) {
  return /^data:[^,]+,/i.test(value);
}

function dataUrlToBlob(dataUrl) {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/i.exec(dataUrl);
  if (!match) return void 0;
  const mimeType = match[1] || "application/octet-stream";
  const isBase64 = match[2] !== void 0;
  const data = match[3];
  const binary = isBase64 ? atob(data) : decodeURIComponent(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

function downloadTextAsFile(formatId, text, context) {
  if (!text) return false;
  try {
    const blob = isDataUrl2(text) ? dataUrlToBlob(text) : new Blob([text], { type: mimeTypeForFormat(formatId) });
    if (!blob) return false;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildDownloadFilename(formatId, context);
    anchor.style.display = "none";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

export { buildDownloadFilename, dataUrlToBlob, domainWithDashes, downloadTextAsFile, extensionForDownloadFormat, isDataUrl2, mimeTypeForFormat };
